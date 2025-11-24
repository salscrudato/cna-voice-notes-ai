import OpenAI from 'openai'
import { db } from '../firebase'
import { collection, addDoc, query, where, orderBy, getDocs, Timestamp, limit, deleteDoc, doc } from 'firebase/firestore'
import { logger } from './logger'
import { retryWithBackoff } from '../utils/retry'
import type { ChatMessage, Conversation, ChatMessageInput, IChatProvider } from '../types'

// OpenAI implementation
class OpenAIChatProvider implements IChatProvider {
  private client: OpenAI

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    })
  }

  async sendMessage(messages: ChatMessageInput[]): Promise<string> {
    try {
      if (!this.client.apiKey) {
        throw new Error('OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY environment variable.')
      }

      const response = await retryWithBackoff(
        () =>
          this.client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        { maxAttempts: 3, delayMs: 1000 }
      )

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response content from OpenAI API')
      }

      return content
    } catch (error) {
      logger.error('Error in OpenAIChatProvider.sendMessage', error)
      return this.handleError(error)
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof Error) {
      const message = error.message.toLowerCase()

      if (message.includes('401') || message.includes('unauthorized')) {
        throw new Error('Invalid OpenAI API key. Please check your credentials.')
      }
      if (message.includes('429') || message.includes('rate')) {
        throw new Error('Rate limited by OpenAI. Please try again later.')
      }
      if (message.includes('500') || message.includes('server')) {
        throw new Error('OpenAI service error. Please try again later.')
      }
      if (message.includes('network') || message.includes('fetch')) {
        throw new Error('Network error. Please check your connection.')
      }
    }

    throw error
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
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
        messageCount: doc.data().messageCount,
      }))
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

  setProvider(provider: IChatProvider): void {
    this.provider = provider
  }
}

// Initialize with OpenAI
const apiKey = import.meta.env.VITE_OPENAI_API_KEY
if (!apiKey) {
  logger.warn('VITE_OPENAI_API_KEY environment variable is not set. Chat functionality will not work.')
}
const provider = new OpenAIChatProvider(apiKey || '')

logger.info('Chat provider initialized', { provider: 'OpenAI' })

export const chatService = new ChatService(provider)

