/**
 * Core type definitions for the CNA Voice Notes AI application
 * Centralized type definitions for better maintainability and AI comprehension
 */

// ============================================================================
// CHAT & MESSAGING TYPES
// ============================================================================

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

/** Props for a message item component */
export interface MessageItemProps {
  message: ChatMessage
  isCopied: boolean
  onCopy: (messageId: string, content: string) => void
}

/** Metadata for filtering conversations */
export interface ConversationMetadata {
  // Broker Information
  broker?: string
  brokerCode?: string

  // Line of Business (LOB)
  lob?: string // e.g., "commercial_general_liability", "property", "workers_compensation"

  // Business Type
  businessType?: string // e.g., "new_business", "renewal", "modification", "cancellation"

  // Client/Account Information
  client?: string
  accountNumber?: string

  // Risk Categories
  riskCategory?: string // e.g., "manufacturing", "retail", "healthcare", "technology"
  industry?: string

  // Coverage Details
  coverageType?: string
  premium?: number

  // Underwriting Status
  underwritingStatus?: string // e.g., "pending", "approved", "declined", "referred"

  // Additional Tags
  tags?: string[]

  // Generic key-value storage
  [key: string]: string | string[] | number | boolean | undefined
}

/** A conversation/chat session */
export interface Conversation {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messageCount: number
  metadata?: ConversationMetadata
}

/** Input format for sending messages to the API */
export interface ChatMessageInput {
  role: MessageRole
  content: string
}

// ============================================================================
// CHAT PROVIDER TYPES
// ============================================================================

/** Chat provider interface */
export interface IChatProvider {
  sendMessage(messages: ChatMessageInput[]): Promise<string>
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


// ============================================================================
// CIRCUIT BREAKER TYPES
// ============================================================================

/** Circuit breaker state */
export type CircuitBreakerState = 'closed' | 'open' | 'half-open'

/** Circuit breaker configuration */
export interface CircuitBreakerConfig {
  failureThreshold: number // number of failures before opening
  successThreshold: number // number of successes to close from half-open
  timeout: number // milliseconds before attempting half-open
  monitoringWindow: number // milliseconds to track failures
}

/** Circuit breaker status */
export interface CircuitBreakerStatus {
  state: CircuitBreakerState
  failureCount: number
  successCount: number
  lastFailureTime?: Date
  nextAttemptTime?: Date
}


