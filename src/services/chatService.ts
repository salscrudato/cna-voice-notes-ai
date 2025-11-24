import OpenAI from 'openai'
import { db } from '../firebase'
import { collection, addDoc, query, where, orderBy, getDocs, Timestamp, limit, deleteDoc, doc, updateDoc, increment } from 'firebase/firestore'
import { logger } from './logger'
import { retryWithBackoff } from '../utils/retry'
import { getAPIConfig, getApiKeyErrorMessage, getChatProviderConfig } from './config'
import { toDate } from '../utils/timestampConverter'
import {
  formatChatResponse,
  validateResponse,
  createMetadata,
  parseError,
  handleNullOrUndefinedResponse,
  isHtmlResponse,
  extractErrorFromHtml,
} from '../utils/responseFormatter'
import { createApiCircuitBreaker } from '../utils/circuitBreaker'
import type { ChatMessage, Conversation, ChatMessageInput, IChatProvider, ChatProviderMetadata, ConversationMetadata } from '../types'

/**
 * OpenAI chat provider implementation
 * Handles communication with OpenAI API with retry logic and error handling
 *
 * Note: Currently uses dangerouslyAllowBrowser for frontend-only deployment.
 * In production, this should be replaced with a secure backend proxy that:
 * - Keeps the API key server-side only
 * - Validates requests before forwarding to OpenAI
 * - Implements rate limiting and authentication
 *
 * SECURITY: This provider is development-only. Production deployments MUST use ProxiedChatProvider.
 */
class OpenAIChatProvider implements IChatProvider {
  private client: OpenAI
  private apiConfig = getAPIConfig()
  private circuitBreaker = createApiCircuitBreaker()

  constructor(apiKey: string) {
    // Production-mode warning: dangerouslyAllowBrowser is not ideal for production
    // but is acceptable when no backend proxy is available
    if (import.meta.env.MODE === 'production') {
      logger.warn('Using OpenAI direct provider with dangerouslyAllowBrowser in production. ' +
        'For better security, consider setting up a backend proxy and using VITE_CHAT_PROVIDER=proxied.', {
        mode: import.meta.env.MODE,
      })
    } else {
      logger.warn('Using OpenAI direct provider with dangerouslyAllowBrowser. This is development-only.', {
        mode: import.meta.env.MODE,
      })
    }

    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Allows browser usage; consider backend proxy for production
    })
  }

  async sendMessage(messages: ChatMessageInput[], providerMetadata?: ChatProviderMetadata): Promise<string> {
    const startTime = Date.now()

    try {
      if (!this.client.apiKey) {
        throw new Error(getApiKeyErrorMessage())
      }

      // Cap the number of messages sent to the provider to manage token usage
      // Keep recent N messages to maintain context while controlling costs
      const maxMessagesToSend = 20
      const messagesToSend = messages.slice(-maxMessagesToSend)

      if (messagesToSend.length < messages.length) {
        logger.debug('Truncating message history for API call', {
          total: messages.length,
          sent: messagesToSend.length,
        })
      }

      // If voice notes are provided, prepend a system message with context
      let finalMessages = messagesToSend
      if (providerMetadata?.voiceNoteIds && providerMetadata.voiceNoteIds.length > 0) {
        const systemMessage: ChatMessageInput = {
          role: 'user',
          content: `[Context: This conversation is linked to ${providerMetadata.voiceNoteIds.length} voice note(s). Please consider this context when responding.]`,
        }
        finalMessages = [systemMessage, ...messagesToSend]
      }

      // Execute with circuit breaker protection
      const response = await this.circuitBreaker.execute(() =>
        retryWithBackoff(
          () =>
            this.client.chat.completions.create({
              model: 'gpt-4o-mini',
              messages: finalMessages as OpenAI.Chat.ChatCompletionMessageParam[],
              temperature: 0.7,
              max_tokens: 1000,
            }),
          {
            maxAttempts: this.apiConfig.maxRetries,
            delayMs: this.apiConfig.retryDelay,
            backoffMultiplier: this.apiConfig.backoffMultiplier,
          }
        )
      )

      // Extract and validate response content
      let rawContent = response.choices[0]?.message?.content
      rawContent = handleNullOrUndefinedResponse(rawContent)

      if (!rawContent || rawContent.trim().length === 0) {
        throw new Error('No response content from OpenAI API')
      }

      // Check for HTML error responses
      if (isHtmlResponse(rawContent)) {
        const errorMessage = extractErrorFromHtml(rawContent)
        throw new Error(`Server returned error: ${errorMessage}`)
      }

      // Validate response
      const validation = validateResponse(rawContent)
      if (!validation.isValid) {
        logger.error('Response validation failed', { errors: validation.errors })
        throw new Error(`Invalid response: ${validation.errors.join(', ')}`)
      }

      // Format and sanitize response
      const duration = Date.now() - startTime
      const responseMetadata = createMetadata('openai', duration, 0, 'gpt-4o-mini', {
        prompt: response.usage?.prompt_tokens || 0,
        completion: response.usage?.completion_tokens || 0,
        total: response.usage?.total_tokens || 0,
      })

      const formattedResponse = formatChatResponse(rawContent, responseMetadata, {
        sanitize: true,
        validateSchema: true,
        includeMetadata: true,
      })

      // Log successful response
      logger.logResponseSuccess(
        'openai',
        duration,
        0,
        formattedResponse.length,
        formattedResponse.contentType,
        responseMetadata.tokensUsed
      )
      logger.logResponseTiming('openai', duration, 'OpenAI API call')

      return formattedResponse.content
    } catch (error) {
      logger.error('Error in OpenAIChatProvider.sendMessage', error)
      return this.handleError(error)
    }
  }

  private handleError(error: unknown): never {
    const errorDetails = parseError(error)
    const duration = Date.now() - ((this as unknown as { startTime: number }).startTime || 0)

    // Map error categories to user-friendly messages
    const errorMessages: Record<string, string> = {
      client: 'Invalid request. Please check your input and try again.',
      server: 'OpenAI service is temporarily unavailable. Please try again later.',
      network: 'Network connection error. Please check your internet connection.',
      timeout: 'Request timed out. Please try again.',
      validation: 'Invalid response format received. Please try again.',
      unknown: 'An unexpected error occurred. Please try again.',
    }

    const userMessage = errorMessages[errorDetails.category] || errorMessages.unknown

    // Log error with structured logging
    logger.logResponseError(
      'openai',
      duration,
      0,
      errorDetails.code,
      errorDetails.category,
      'OpenAI API error'
    )

    // Throw user-friendly error
    throw new Error(userMessage)
  }
}

/**
 * Proxied chat provider implementation
 * Sends requests to a backend proxy endpoint (e.g., Cloud Run, Cloud Functions)
 * This keeps the API key server-side only and provides better security
 */
class ProxiedChatProvider implements IChatProvider {
  private proxyUrl: string
  private apiConfig = getAPIConfig()
  private circuitBreaker = createApiCircuitBreaker()

  constructor(proxyUrl: string) {
    if (!proxyUrl) {
      throw new Error('Proxy URL is required for ProxiedChatProvider')
    }
    this.proxyUrl = proxyUrl
    logger.info('ProxiedChatProvider initialized', { proxyUrl: this.proxyUrl })
  }

  async sendMessage(messages: ChatMessageInput[], providerMetadata?: ChatProviderMetadata): Promise<string> {
    const startTime = Date.now()

    try {
      const requestBody = {
        messages,
        metadata: providerMetadata || {},
      }

      logger.debug('Sending request to proxy', { url: this.proxyUrl, messageCount: messages.length })

      // Execute with circuit breaker protection
      const response = await this.circuitBreaker.execute(() =>
        retryWithBackoff(
          () =>
            fetch(this.proxyUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
            }),
          {
            maxAttempts: this.apiConfig.maxRetries,
            delayMs: this.apiConfig.retryDelay,
            backoffMultiplier: this.apiConfig.backoffMultiplier,
          }
        )
      )

      if (!response.ok) {
        const errorText = await response.text()
        // Check if error response is HTML (common for 5xx errors)
        if (isHtmlResponse(errorText)) {
          const errorMessage = extractErrorFromHtml(errorText)
          logger.error('Proxy returned HTML error response', { status: response.status, errorMessage })
          throw new Error(`Proxy error (${response.status}): ${errorMessage}`)
        }

        // Try to parse as JSON error response
        try {
          const errorJson = JSON.parse(errorText)
          const errorMsg = errorJson.error?.message || errorJson.message || errorText
          logger.error('Proxy returned error response', { status: response.status, error: errorMsg })
          throw new Error(`Proxy error (${response.status}): ${errorMsg}`)
        } catch {
          // If JSON parsing fails, use raw text
          logger.error('Proxy returned error response', { status: response.status, errorText: errorText.substring(0, 200) })
          throw new Error(`Proxy returned ${response.status}: ${errorText.substring(0, 200)}`)
        }
      }

      // Parse response JSON with error handling
      let data
      try {
        data = await response.json()
      } catch (parseError) {
        logger.error('Failed to parse proxy response as JSON', { error: parseError })
        throw new Error('Proxy returned invalid JSON response')
      }

      // Validate response structure
      if (!data || typeof data !== 'object') {
        logger.error('Proxy response is not an object', { dataType: typeof data })
        throw new Error('Invalid response format from proxy: response must be an object')
      }

      if (!data.content || typeof data.content !== 'string') {
        logger.error('Proxy response missing content field', { hasContent: !!data.content, contentType: typeof data.content })
        throw new Error('Invalid response format from proxy: missing or invalid content field')
      }

      // Handle null/undefined content
      const content = handleNullOrUndefinedResponse(data.content)
      if (!content || content.trim().length === 0) {
        logger.error('Proxy returned empty content', { contentLength: content?.length || 0 })
        throw new Error('Proxy returned empty content')
      }

      // Validate response
      const validation = validateResponse(content)
      if (!validation.isValid) {
        logger.error('Response validation failed', { errors: validation.errors })
        throw new Error(`Invalid response: ${validation.errors.join(', ')}`)
      }

      // Format and sanitize response
      const duration = Date.now() - startTime
      const responseMetadata = createMetadata('proxied', duration, 0, data.model || 'unknown', {
        prompt: data.tokensUsed?.prompt || 0,
        completion: data.tokensUsed?.completion || 0,
        total: data.tokensUsed?.total || 0,
      })

      const formattedResponse = formatChatResponse(content, responseMetadata, {
        sanitize: true,
        validateSchema: true,
        includeMetadata: true,
      })

      // Log successful response
      logger.logResponseSuccess(
        'proxied',
        duration,
        0,
        formattedResponse.length,
        formattedResponse.contentType,
        responseMetadata.tokensUsed
      )
      logger.logResponseTiming('proxied', duration, 'Proxy API call')

      return formattedResponse.content
    } catch (error) {
      logger.error('Error in ProxiedChatProvider.sendMessage', error)
      return this.handleError(error)
    }
  }

  private handleError(error: unknown): never {
    const errorDetails = parseError(error)
    const duration = Date.now() - ((this as unknown as { startTime: number }).startTime || 0)

    // Map error categories to user-friendly messages
    const errorMessages: Record<string, string> = {
      client: 'Invalid request. Please check your input and try again.',
      server: 'Chat service is temporarily unavailable. Please try again later.',
      network: 'Network connection error. Please check your internet connection.',
      timeout: 'Request timed out. Please try again.',
      validation: 'Invalid response format received. Please try again.',
      unknown: 'An unexpected error occurred. Please try again.',
    }

    const userMessage = errorMessages[errorDetails.category] || errorMessages.unknown

    // Log error with structured logging
    logger.logResponseError(
      'proxied',
      duration,
      0,
      errorDetails.code,
      errorDetails.category,
      'Proxy API error'
    )

    // Throw user-friendly error
    throw new Error(userMessage)
  }
}

// Firestore conversation manager
class FirestoreChatManager {
  private conversationsCollection = 'conversations'
  private messagesCollection = 'messages'

  async createConversation(title: string, metadata?: ConversationMetadata): Promise<string> {
    try {
      logger.info('Creating conversation', { title, hasMetadata: !!metadata })

      const docRef = await addDoc(collection(db, this.conversationsCollection), {
        title,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        messageCount: 0,
        ...(metadata && { metadata }),
      })

      logger.info('Conversation created', { id: docRef.id })
      return docRef.id
    } catch (error) {
      logger.error('Error creating conversation', error)
      throw error
    }
  }

  async saveMessage(conversationId: string, role: string, content: string): Promise<string> {
    try {
      logger.debug('Saving message', { conversationId, role, contentLength: content.length })

      const docRef = await addDoc(collection(db, this.messagesCollection), {
        conversationId,
        role,
        content,
        createdAt: Timestamp.now(),
      })

      logger.debug('Message saved', { id: docRef.id })

      // Update conversation metadata: increment messageCount and update updatedAt
      // Use atomic increment to avoid race conditions
      try {
        await updateDoc(doc(db, this.conversationsCollection, conversationId), {
          messageCount: increment(1),
          updatedAt: Timestamp.now(),
        })
        logger.debug('Conversation metadata updated', { conversationId })
      } catch (updateError) {
        // Log but don't break chat flow if metadata update fails
        logger.warn('Failed to update conversation metadata', { conversationId, error: updateError })
      }

      return docRef.id
    } catch (error) {
      logger.error('Error saving message', error)
      throw error
    }
  }

  async getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
    try {
      logger.debug('Loading messages for conversation', { conversationId })
      const q = query(
        collection(db, this.messagesCollection),
        where('conversationId', '==', conversationId),
        orderBy('createdAt', 'asc')
      )
      const snapshot = await getDocs(q)
      logger.debug('Messages loaded', { count: snapshot.docs.length })
      return snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          conversationId: data.conversationId || conversationId,
          role: data.role || 'user',
          content: data.content || '',
          createdAt: toDate(data.createdAt, 'message.createdAt'),
        }
      })
    } catch (error) {
      logger.error('Error loading messages', error)
      throw error
    }
  }

  async getAllConversations(pageSize: number = 50): Promise<Conversation[]> {
    try {
      logger.debug('Loading conversations', { pageSize })
      // Limit to 50 conversations per page to avoid loading too many documents
      const q = query(
        collection(db, this.conversationsCollection),
        orderBy('updatedAt', 'desc'),
        limit(pageSize)
      )
      const snapshot = await getDocs(q)
      logger.debug('Conversations loaded', { count: snapshot.docs.length })

      return snapshot.docs.map((doc) => {
        const data = doc.data()
        // Safely handle missing or malformed fields with sensible defaults
        const createdAt = toDate(data.createdAt, 'conversation.createdAt')
        const updatedAt = toDate(data.updatedAt, 'conversation.updatedAt')

        return {
          id: doc.id,
          title: data.title || 'Untitled Conversation',
          createdAt,
          updatedAt,
          messageCount: typeof data.messageCount === 'number' ? data.messageCount : 0,
          metadata: data.metadata,
        }
      })
    } catch (error) {
      logger.error('Error loading conversations', error)
      throw error
    }
  }

  async deleteConversation(conversationId: string): Promise<void> {
    try {
      logger.info('Deleting conversation', { conversationId })

      // Delete all messages for this conversation
      const messagesQuery = query(
        collection(db, this.messagesCollection),
        where('conversationId', '==', conversationId)
      )
      const messagesSnapshot = await getDocs(messagesQuery)

      for (const messageDoc of messagesSnapshot.docs) {
        await deleteDoc(messageDoc.ref)
      }

      logger.debug('Messages deleted', { count: messagesSnapshot.docs.length })

      // Delete the conversation document
      await deleteDoc(doc(db, this.conversationsCollection, conversationId))

      logger.info('Conversation deleted successfully', { conversationId })
    } catch (error) {
      logger.error('Error deleting conversation', error)
      throw error
    }
  }

  async deleteEmptyConversations(): Promise<number> {
    try {
      logger.info('Starting cleanup of empty conversations')

      const allConversations = await this.getAllConversations(1000)
      let deletedCount = 0

      for (const conversation of allConversations) {
        if (conversation.messageCount === 0) {
          await this.deleteConversation(conversation.id)
          deletedCount++
        }
      }

      logger.info('Cleanup completed', { deletedCount })
      return deletedCount
    } catch (error) {
      logger.error('Error during cleanup', error)
      throw error
    }
  }

  async updateConversationTitle(conversationId: string, newTitle: string): Promise<void> {
    try {
      logger.info('Updating conversation title', { conversationId, newTitle })

      await updateDoc(doc(db, this.conversationsCollection, conversationId), {
        title: newTitle,
        updatedAt: Timestamp.now(),
      })

      logger.info('Conversation title updated', { conversationId })
    } catch (error) {
      logger.error('Error updating conversation title', error)
      throw error
    }
  }

  async updateConversationMetadata(conversationId: string, metadata: ConversationMetadata): Promise<void> {
    try {
      logger.info('Updating conversation metadata', { conversationId })

      await updateDoc(doc(db, this.conversationsCollection, conversationId), {
        metadata,
        updatedAt: Timestamp.now(),
      })

      logger.info('Conversation metadata updated', { conversationId })
    } catch (error) {
      logger.error('Error updating conversation metadata', error)
      throw error
    }
  }
}

// Main chat service
export class ChatService {
  private provider: IChatProvider
  private firestoreManager: FirestoreChatManager

  constructor(provider: IChatProvider) {
    this.provider = provider
    this.firestoreManager = new FirestoreChatManager()
  }

  async sendMessage(conversationId: string, userMessage: string, metadata?: ChatProviderMetadata): Promise<string> {
    try {
      logger.info('Sending message', { conversationId, messageLength: userMessage.length })

      // Save user message
      await this.firestoreManager.saveMessage(conversationId, 'user', userMessage)

      // Get conversation history
      const messages = await this.firestoreManager.getConversationMessages(conversationId)

      // Prepare messages for API
      const apiMessages: ChatMessageInput[] = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      // Get response from provider with optional metadata
      const assistantResponse = await this.provider.sendMessage(apiMessages, metadata)

      if (!assistantResponse) {
        throw new Error('Empty response from AI provider')
      }

      // Save assistant response
      await this.firestoreManager.saveMessage(conversationId, 'assistant', assistantResponse)

      logger.info('Message processed successfully', { conversationId })
      return assistantResponse
    } catch (error) {
      logger.error('Error in sendMessage', error)
      throw error
    }
  }

  async createConversation(title: string, metadata?: ConversationMetadata): Promise<string> {
    return this.firestoreManager.createConversation(title, metadata)
  }

  async getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
    return this.firestoreManager.getConversationMessages(conversationId)
  }

  async getAllConversations(): Promise<Conversation[]> {
    return this.firestoreManager.getAllConversations()
  }

  async deleteConversation(conversationId: string): Promise<void> {
    return this.firestoreManager.deleteConversation(conversationId)
  }

  async deleteEmptyConversations(): Promise<number> {
    return this.firestoreManager.deleteEmptyConversations()
  }

  async updateConversationTitle(conversationId: string, newTitle: string): Promise<void> {
    return this.firestoreManager.updateConversationTitle(conversationId, newTitle)
  }

  async updateConversationMetadata(conversationId: string, metadata: ConversationMetadata): Promise<void> {
    return this.firestoreManager.updateConversationMetadata(conversationId, metadata)
  }

  setProvider(provider: IChatProvider): void {
    this.provider = provider
  }
}

// Initialize chat provider based on configuration
function initializeChatProvider(): IChatProvider {
  const config = getChatProviderConfig()

  // Proxied provider: preferred for production
  if (config.provider === 'proxied') {
    if (!config.proxyUrl) {
      logger.error('Proxied provider selected but VITE_CHAT_PROXY_URL is not configured')
      throw new Error('Proxied chat provider requires VITE_CHAT_PROXY_URL to be configured')
    }
    logger.info('Initializing ProxiedChatProvider', { proxyUrl: config.proxyUrl })
    return new ProxiedChatProvider(config.proxyUrl)
  }

  // OpenAI direct provider: allowed in all modes (with warnings in production)
  if (!config.openaiApiKey) {
    logger.warn('OpenAI direct provider selected but VITE_OPENAI_API_KEY is not configured. Chat functionality will not work until configured.')
  }
  const mode = import.meta.env.MODE === 'production' ? 'production' : 'development'
  logger.info(`Initializing OpenAIChatProvider (${mode} mode)`, { configured: !!config.openaiApiKey })
  return new OpenAIChatProvider(config.openaiApiKey || '')
}

const provider = initializeChatProvider()
export const chatService = new ChatService(provider)

