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

// ============================================================================
// RESPONSE FORMATTING TYPES
// ============================================================================

/** Response metadata for tracking and debugging */
export interface ResponseMetadata {
  timestamp: Date
  duration: number // milliseconds
  retryCount: number
  provider: string
  model?: string
  tokensUsed?: {
    prompt: number
    completion: number
    total: number
  }
}

/** Error details with categorization */
export interface ErrorDetails {
  code: string
  message: string
  category: 'client' | 'server' | 'network' | 'timeout' | 'validation' | 'unknown'
  statusCode?: number
  retryable: boolean
  originalError?: unknown
}

/** Standard response envelope for all API responses */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: ErrorDetails
  metadata: ResponseMetadata
}

/** Formatted chat response with content and metadata */
export interface FormattedChatResponse {
  content: string
  contentType: 'text' | 'markdown' | 'json' | 'mixed'
  length: number
  hasFormatting: boolean
  sanitized: boolean
  metadata: {
    model: string
    temperature: number
    maxTokens: number
    finishReason?: string
  }
}

/** Response validation result */
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  sanitized: boolean
}

/** Response formatting options */
export interface ResponseFormattingOptions {
  sanitize: boolean
  validateSchema: boolean
  includeMetadata: boolean
  formatMarkdown: boolean
  maxLength?: number
  timeout?: number
}

/** Voice note status */
export type VoiceNoteStatus = 'uploaded' | 'processing' | 'ready' | 'error'

/** A voice note record */
export interface VoiceNote {
  id: string
  fileName: string
  storagePath: string
  status: VoiceNoteStatus
  createdAt: Date
  updatedAt: Date
  transcriptId?: string
  transcriptSummary?: string
  conversationId?: string
}
