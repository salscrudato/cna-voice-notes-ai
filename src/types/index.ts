/**
 * Core type definitions for the CNA Voice Notes AI application
 * Centralized type definitions for better maintainability and AI comprehension
 */

/** Message role in a conversation */
export type MessageRole = 'user' | 'assistant'

/** A single message in a conversation */
export interface ChatMessage {
  id: string
  conversationId: string
  role: MessageRole
  content: string
  createdAt: Date
}

/** A conversation/chat session */
export interface Conversation {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messageCount: number
}

/** Input format for sending messages to the API */
export interface ChatMessageInput {
  role: MessageRole
  content: string
}

/** Extensible chat provider interface for supporting multiple AI providers */
export interface IChatProvider {
  sendMessage(messages: ChatMessageInput[]): Promise<string>
}

/** Configuration for API timeouts and retries */
export interface APIConfig {
  requestTimeout: number
  maxRetries: number
  retryDelay: number
}
