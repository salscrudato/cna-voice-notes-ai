import OpenAI from 'openai'
import { db } from '../firebase'
import { collection, addDoc, query, where, orderBy, getDocs, Timestamp, limit, deleteDoc, doc, updateDoc, increment } from 'firebase/firestore'
import { logger } from './logger'
import { retryWithBackoff } from '../utils/retry'
import { getOpenAIApiKey, getAPIConfig, getApiKeyErrorMessage } from './config'
import {
  formatChatResponse,
  validateResponse,
  createMetadata,
  parseError,
} from '../utils/responseFormatter'
import { responseLogger } from '../utils/responseLogger'
import type { ChatMessage, Conversation, ChatMessageInput, IChatProvider } from '../types'

/**
 * OpenAI chat provider implementation
 * Handles communication with OpenAI API with retry logic and error handling
 *
 * Note: Currently uses dangerouslyAllowBrowser for frontend-only deployment.
 * In production, this should be replaced with a secure backend proxy that:
 * - Keeps the API key server-side only
 * - Validates requests before forwarding to OpenAI
 * - Implements rate limiting and authentication
 */
class OpenAIChatProvider implements IChatProvider {
  private client: OpenAI
  private apiConfig = getAPIConfig()

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // TODO: Replace with backend proxy in production
    })
  }

  async sendMessage(messages: ChatMessageInput[]): Promise<string> {
    const startTime = Date.now()
    let retryCount = 0

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

      const response = await retryWithBackoff(
        () =>
          this.client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: messagesToSend as OpenAI.Chat.ChatCompletionMessageParam[],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        {
          maxAttempts: this.apiConfig.maxRetries,
          delayMs: this.apiConfig.retryDelay,
          backoffMultiplier: this.apiConfig.backoffMultiplier,
        }
      )

      // Extract and validate response content
      const rawContent = response.choices[0]?.message?.content
      if (!rawContent) {
        throw new Error('No response content from OpenAI API')
      }

      // Validate response
      const validation = validateResponse(rawContent)
      if (!validation.isValid) {
        logger.error('Response validation failed', { errors: validation.errors })
        throw new Error(`Invalid response: ${validation.errors.join(', ')}`)
      }

      // Format and sanitize response
      const duration = Date.now() - startTime
      const metadata = createMetadata('openai', duration, retryCount, 'gpt-4o-mini', {
        prompt: response.usage?.prompt_tokens || 0,
        completion: response.usage?.completion_tokens || 0,
        total: response.usage?.total_tokens || 0,
      })

      const formattedResponse = formatChatResponse(rawContent, metadata, {
        sanitize: true,
        validateSchema: true,
        includeMetadata: true,
      })

      // Log successful response
      responseLogger.logSuccess(metadata, formattedResponse, 'OpenAI response formatted successfully')
      responseLogger.logTiming('openai', duration, 'OpenAI API call')

      return formattedResponse.content
    } catch (error) {
      logger.error('Error in OpenAIChatProvider.sendMessage', error)
      return this.handleError(error)
    }
  }

  private handleError(error: unknown): never {
    const errorDetails = parseError(error)
    const duration = Date.now() - (this as any).startTime || 0
    const metadata = createMetadata('openai', duration, 0)

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
    responseLogger.logError(metadata, errorDetails, 'OpenAI API error')

    // Throw user-friendly error
    throw new Error(userMessage)
  }
}

// Firestore conversation manager
class FirestoreChatManager {
  private conversationsCollection = 'conversations'
  private messagesCollection = 'messages'

  async createConversation(title: string): Promise<string> {
    try {
      logger.info('Creating conversation', { title })

      const docRef = await addDoc(collection(db, this.conversationsCollection), {
        title,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        messageCount: 0,
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
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        conversationId: doc.data().conversationId,
        role: doc.data().role,
        content: doc.data().content,
        createdAt: doc.data().createdAt.toDate(),
      }))
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
        return {
          id: doc.id,
          title: data.title || 'Untitled Conversation',
          createdAt: data.createdAt?.toDate() || new Date(0),
          updatedAt: data.updatedAt?.toDate() || data.createdAt?.toDate() || new Date(0),
          messageCount: typeof data.messageCount === 'number' ? data.messageCount : 0,
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
}

// Main chat service
export class ChatService {
  private provider: IChatProvider
  private firestoreManager: FirestoreChatManager

  constructor(provider: IChatProvider) {
    this.provider = provider
    this.firestoreManager = new FirestoreChatManager()
  }

  async sendMessage(conversationId: string, userMessage: string): Promise<string> {
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

      // Get response from provider
      const assistantResponse = await this.provider.sendMessage(apiMessages)

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

  async createConversation(title: string): Promise<string> {
    return this.firestoreManager.createConversation(title)
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

  setProvider(provider: IChatProvider): void {
    this.provider = provider
  }
}

// Initialize with OpenAI
const apiKey = getOpenAIApiKey()
if (!apiKey) {
  logger.warn('OpenAI API key not configured. Chat functionality will not work until configured.')
}
const provider = new OpenAIChatProvider(apiKey || '')

logger.info('Chat provider initialized', { provider: 'OpenAI', configured: !!apiKey })

export const chatService = new ChatService(provider)

