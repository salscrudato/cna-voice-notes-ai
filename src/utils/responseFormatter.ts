import { logger } from '../services/logger'
import { API } from '../constants'
import type {
  ApiResponse,
  ErrorDetails,
  FormattedChatResponse,
  ValidationResult,
  ResponseMetadata,
  ResponseFormattingOptions,
  StreamingChunk,
  EnhancedApiResponse,
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
  timeout: API.REQUEST_TIMEOUT_MS,
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
 * Parse and categorize errors with comprehensive error detection
 */
export function parseError(error: unknown): ErrorDetails {
  const message = error instanceof Error ? error.message : String(error)
  const lowerMessage = message.toLowerCase()

  let category: ErrorDetails['category'] = 'unknown'
  let statusCode: number | undefined
  let retryable = true

  // Authentication errors (401)
  if (lowerMessage.includes('401') || lowerMessage.includes('unauthorized') || lowerMessage.includes('unauthenticated')) {
    category = 'client'
    statusCode = 401
    retryable = false
  }
  // Authorization errors (403)
  else if (lowerMessage.includes('403') || lowerMessage.includes('forbidden') || lowerMessage.includes('permission denied')) {
    category = 'client'
    statusCode = 403
    retryable = false
  }
  // Bad request errors (400)
  else if (lowerMessage.includes('400') || lowerMessage.includes('bad request') || lowerMessage.includes('invalid request')) {
    category = 'validation'
    statusCode = 400
    retryable = false
  }
  // Rate limit errors (429)
  else if (lowerMessage.includes('429') || lowerMessage.includes('rate') || lowerMessage.includes('too many requests')) {
    category = 'client'
    statusCode = 429
    retryable = true
  }
  // Server errors (5xx)
  else if (
    lowerMessage.includes('500') ||
    lowerMessage.includes('502') ||
    lowerMessage.includes('503') ||
    lowerMessage.includes('504') ||
    lowerMessage.includes('server error') ||
    lowerMessage.includes('internal error')
  ) {
    category = 'server'
    statusCode = 500
    retryable = true
  }
  // Timeout errors
  else if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out') || lowerMessage.includes('deadline exceeded')) {
    category = 'timeout'
    statusCode = 408
    retryable = true
  }
  // Network errors
  else if (
    lowerMessage.includes('network') ||
    lowerMessage.includes('fetch') ||
    lowerMessage.includes('econnrefused') ||
    lowerMessage.includes('enotfound') ||
    lowerMessage.includes('econnreset') ||
    lowerMessage.includes('connection refused')
  ) {
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

/**
 * Handle null, undefined, and empty responses
 */
export function handleNullOrUndefinedResponse(value: unknown): string {
  if (value === null) {
    logger.warn('Response is null')
    return ''
  }
  if (value === undefined) {
    logger.warn('Response is undefined')
    return ''
  }
  if (typeof value === 'string') {
    return value
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch (error) {
      logger.error('Failed to stringify object response', error)
      return String(value)
    }
  }
  return String(value)
}

/**
 * Handle partial or incomplete responses
 */
export function handlePartialResponse(content: string, isComplete: boolean): { content: string; isPartial: boolean } {
  if (!isComplete && content.trim().length > 0) {
    logger.warn('Received partial response', { contentLength: content.length })
    return { content, isPartial: true }
  }
  return { content, isPartial: false }
}

/**
 * Validate and parse JSON responses safely
 */
export function safeJsonParse<T = unknown>(jsonString: string): { success: boolean; data?: T; error?: string } {
  try {
    const data = JSON.parse(jsonString) as T
    return { success: true, data }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown JSON parse error'
    logger.error('JSON parse error', { error: errorMessage, input: jsonString.substring(0, 100) })
    return { success: false, error: errorMessage }
  }
}

/**
 * Handle streaming responses
 */
export function createStreamingChunk(
  id: string,
  content: string,
  isComplete: boolean,
  error?: ErrorDetails
): StreamingChunk {
  return {
    id,
    timestamp: new Date(),
    content,
    isComplete,
    error,
  }
}

/**
 * Accumulate streaming chunks into complete response
 */
export function accumulateStreamingChunks(chunks: StreamingChunk[]): string {
  return chunks.map((chunk) => chunk.content).join('')
}

/**
 * Validate response structure against expected schema
 */
export function validateResponseStructure(
  response: unknown,
  expectedFields: string[]
): { isValid: boolean; missingFields: string[] } {
  if (typeof response !== 'object' || response === null) {
    return { isValid: false, missingFields: expectedFields }
  }

  const responseObj = response as Record<string, unknown>
  const missingFields = expectedFields.filter((field) => !(field in responseObj))

  return {
    isValid: missingFields.length === 0,
    missingFields,
  }
}

/**
 * Normalize response format across different API providers
 */
export function normalizeResponse(response: unknown): { content: string; metadata: Record<string, unknown> } {
  const metadata: Record<string, unknown> = {}

  // Handle string responses
  if (typeof response === 'string') {
    return { content: response, metadata }
  }

  // Handle object responses
  if (typeof response === 'object' && response !== null) {
    const obj = response as Record<string, unknown>

    // Try common content field names
    const contentField = ['content', 'text', 'message', 'data', 'result', 'output'].find((field) => field in obj)
    const content = contentField ? String(obj[contentField]) : JSON.stringify(obj)

    // Extract metadata
    Object.entries(obj).forEach(([key, value]) => {
      if (key !== contentField && typeof value !== 'function') {
        metadata[key] = value
      }
    })

    return { content, metadata }
  }

  // Fallback
  return { content: String(response), metadata }
}

/**
 * Create enhanced API response with additional context
 */
export function createEnhancedResponse<T>(
  data: T,
  metadata: ResponseMetadata,
  options?: {
    cached?: boolean
    streaming?: boolean
    partial?: boolean
    retryInfo?: { attempt: number; maxAttempts: number; nextRetryTime?: Date }
  }
): EnhancedApiResponse<T> {
  return {
    success: true,
    data,
    metadata,
    cached: options?.cached,
    streaming: options?.streaming,
    partial: options?.partial,
    retryInfo: options?.retryInfo,
  }
}

/**
 * Detect if response is HTML (error page) instead of expected format
 */
export function isHtmlResponse(content: string): boolean {
  const trimmed = content.trim()
  return trimmed.startsWith('<') && (trimmed.includes('<!DOCTYPE') || trimmed.includes('<html') || trimmed.includes('<body'))
}

/**
 * Extract error message from HTML error page
 */
export function extractErrorFromHtml(htmlContent: string): string {
  try {
    // Try to extract from common error page patterns
    const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i)
    if (titleMatch) {
      return titleMatch[1]
    }

    const h1Match = htmlContent.match(/<h1[^>]*>([^<]+)<\/h1>/i)
    if (h1Match) {
      return h1Match[1]
    }

    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    if (bodyMatch) {
      const text = bodyMatch[1].replace(/<[^>]+>/g, '').trim()
      return text.substring(0, 200)
    }

    return 'Received HTML error page from server'
  } catch (error) {
    logger.error('Error extracting error from HTML', error)
    return 'Unknown error from server'
  }
}

