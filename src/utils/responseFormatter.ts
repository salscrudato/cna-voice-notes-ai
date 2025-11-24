import { logger } from '../services/logger'
import type {
  ApiResponse,
  ErrorDetails,
  FormattedChatResponse,
  ValidationResult,
  ResponseMetadata,
  ResponseFormattingOptions,
} from '../types'

/**
 * Response Formatter Utility
 * Handles formatting, validation, and normalization of API responses
 */

const DEFAULT_FORMATTING_OPTIONS: ResponseFormattingOptions = {
  sanitize: true,
  validateSchema: true,
  includeMetadata: true,
  formatMarkdown: true,
  maxLength: 10000,
  timeout: 30000,
}

/**
 * Sanitize response content by removing potentially harmful content
 */
export function sanitizeContent(content: string): string {
  if (!content || typeof content !== 'string') {
    return ''
  }

  // Remove null bytes and control characters
  // eslint-disable-next-line no-control-regex
  let sanitized = content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

  // Trim excessive whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim()

  return sanitized
}

/**
 * Validate response content
 */
export function validateResponse(content: unknown): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  let sanitized = false

  if (!content) {
    errors.push('Response content is empty or null')
    return { isValid: false, errors, warnings, sanitized }
  }

  if (typeof content !== 'string') {
    errors.push(`Expected string content, got ${typeof content}`)
    return { isValid: false, errors, warnings, sanitized }
  }

  if (content.trim().length === 0) {
    errors.push('Response content is empty after trimming')
    return { isValid: false, errors, warnings, sanitized }
  }

  if (content.length > DEFAULT_FORMATTING_OPTIONS.maxLength!) {
    warnings.push(`Content exceeds max length of ${DEFAULT_FORMATTING_OPTIONS.maxLength}`)
  }

  // Check for suspicious patterns
  if (content.includes('\x00')) {
    warnings.push('Content contains null bytes')
    sanitized = true
  }

  return { isValid: true, errors, warnings, sanitized }
}

/**
 * Detect content type
 */
export function detectContentType(content: string): 'text' | 'markdown' | 'json' | 'mixed' {
  if (content.startsWith('{') || content.startsWith('[')) {
    try {
      JSON.parse(content)
      return 'json'
    } catch {
      // Not valid JSON
    }
  }

  if (content.includes('```') || content.includes('**') || content.includes('##')) {
    return 'markdown'
  }

  return 'text'
}

/**
 * Create response metadata
 */
export function createMetadata(
  provider: string,
  duration: number,
  retryCount: number = 0,
  model?: string,
  tokensUsed?: { prompt: number; completion: number; total: number }
): ResponseMetadata {
  return {
    timestamp: new Date(),
    duration,
    retryCount,
    provider,
    model,
    tokensUsed,
  }
}

/**
 * Format chat response with validation and sanitization
 */
export function formatChatResponse(
  content: string,
  metadata: Partial<ResponseMetadata>,
  options: Partial<ResponseFormattingOptions> = {}
): FormattedChatResponse {
  const opts = { ...DEFAULT_FORMATTING_OPTIONS, ...options }

  // Validate
  const validation = validateResponse(content)
  if (!validation.isValid) {
    logger.warn('Response validation failed', { errors: validation.errors })
  }

  // Sanitize
  const sanitized = opts.sanitize ? sanitizeContent(content) : content
  const contentType = detectContentType(sanitized)

  return {
    content: sanitized,
    contentType,
    length: sanitized.length,
    hasFormatting: contentType !== 'text',
    sanitized: opts.sanitize && validation.sanitized,
    metadata: {
      model: metadata.model || 'unknown',
      temperature: 0.7,
      maxTokens: 1000,
      finishReason: 'stop',
    },
  }
}

/**
 * Create success response envelope
 */
export function createSuccessResponse<T>(
  data: T,
  metadata: ResponseMetadata
): ApiResponse<T> {
  return {
    success: true,
    data,
    metadata,
  }
}

/**
 * Create error response envelope
 */
export function createErrorResponse(
  error: unknown,
  metadata: ResponseMetadata
): ApiResponse<null> {
  const errorDetails = parseError(error)
  return {
    success: false,
    error: errorDetails,
    metadata,
  }
}

/**
 * Parse and categorize errors
 */
export function parseError(error: unknown): ErrorDetails {
  const message = error instanceof Error ? error.message : String(error)
  const lowerMessage = message.toLowerCase()

  let category: ErrorDetails['category'] = 'unknown'
  let statusCode: number | undefined
  let retryable = true

  if (lowerMessage.includes('401') || lowerMessage.includes('unauthorized')) {
    category = 'client'
    statusCode = 401
    retryable = false
  } else if (lowerMessage.includes('403') || lowerMessage.includes('forbidden')) {
    category = 'client'
    statusCode = 403
    retryable = false
  } else if (lowerMessage.includes('400') || lowerMessage.includes('bad request')) {
    category = 'validation'
    statusCode = 400
    retryable = false
  } else if (lowerMessage.includes('429') || lowerMessage.includes('rate')) {
    category = 'client'
    statusCode = 429
    retryable = true
  } else if (lowerMessage.includes('500') || lowerMessage.includes('server')) {
    category = 'server'
    statusCode = 500
    retryable = true
  } else if (lowerMessage.includes('timeout')) {
    category = 'timeout'
    retryable = true
  } else if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
    category = 'network'
    retryable = true
  }

  return {
    code: `${category.toUpperCase()}_ERROR`,
    message,
    category,
    statusCode,
    retryable,
    originalError: error,
  }
}

