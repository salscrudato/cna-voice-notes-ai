import type { ErrorDetails } from '../types'

/**
 * Categorize an error based on its message
 * Analyzes error messages to determine error type (timeout, network, client, validation, server, unknown)
 * @param error - The error to categorize (Error object or any value)
 * @returns Error category string
 * @internal
 */
function categorizeError(error: unknown): ErrorDetails['category'] {
  const message = error instanceof Error ? error.message : String(error)
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) return 'timeout'
  if (lowerMessage.includes('network') || lowerMessage.includes('fetch') || lowerMessage.includes('econnrefused') || lowerMessage.includes('enotfound')) return 'network'
  if (lowerMessage.includes('429') || lowerMessage.includes('rate')) return 'client'
  if (lowerMessage.includes('401') || lowerMessage.includes('unauthorized')) return 'client'
  if (lowerMessage.includes('403') || lowerMessage.includes('forbidden')) return 'client'
  if (lowerMessage.includes('400') || lowerMessage.includes('bad request')) return 'validation'
  if (lowerMessage.includes('500') || lowerMessage.includes('502') || lowerMessage.includes('503') || lowerMessage.includes('504') || lowerMessage.includes('server')) return 'server'
  if (lowerMessage.includes('malformed') || lowerMessage.includes('invalid')) return 'validation'
  return 'unknown'
}

/**
 * Determine if an error is retryable
 * Non-retryable errors: 401 (Unauthorized), 403 (Forbidden), 400 (Bad Request)
 * Retryable errors: timeouts, network errors, 5xx errors, rate limits
 * @param error - The error to check (Error object or any value)
 * @returns true if the error should be retried, false if it should fail immediately
 * @example
 * if (isErrorRetryable(error)) {
 *   // Retry the operation
 * } else {
 *   // Fail immediately
 * }
 */
export function isErrorRetryable(error: unknown): boolean {
  const category = categorizeError(error)
  const message = error instanceof Error ? error.message : String(error)
  const lowerMessage = message.toLowerCase()

  // Non-retryable errors: authentication and validation failures
  if (category === 'client' && (lowerMessage.includes('401') || lowerMessage.includes('403') || lowerMessage.includes('400'))) {
    return false
  }

  // All other errors are retryable (timeouts, network, server errors, rate limits)
  return true
}



