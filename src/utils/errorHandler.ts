import { logger } from '../services/logger'
import type { ErrorDetails } from '../types'

/**
 * Comprehensive Error Handler
 * Handles all response failure scenarios with categorization and recovery strategies
 */

export interface ErrorContext {
  operation: string
  provider: string
  duration?: number
  retryCount?: number
  originalError?: unknown
}

export interface ErrorRecoveryStrategy {
  shouldRetry: boolean
  retryDelay: number
  maxRetries: number
  userMessage: string
  logLevel: 'error' | 'warn' | 'info'
}

/**
 * Categorize and handle different error types
 */
export function handleResponseError(
  error: unknown
): { details: ErrorDetails; strategy: ErrorRecoveryStrategy } {
  const message = error instanceof Error ? error.message : String(error)
  const lowerMessage = message.toLowerCase()

  let category: ErrorDetails['category'] = 'unknown'
  let statusCode: number | undefined
  let retryable = true
  let strategy: ErrorRecoveryStrategy

  // Timeout errors
  if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
    category = 'timeout'
    statusCode = 408
    strategy = {
      shouldRetry: true,
      retryDelay: 2000,
      maxRetries: 3,
      userMessage: 'Request timed out. Please try again.',
      logLevel: 'warn',
    }
  }
  // Network errors
  else if (
    lowerMessage.includes('network') ||
    lowerMessage.includes('fetch') ||
    lowerMessage.includes('econnrefused') ||
    lowerMessage.includes('enotfound')
  ) {
    category = 'network'
    strategy = {
      shouldRetry: true,
      retryDelay: 3000,
      maxRetries: 3,
      userMessage: 'Network connection error. Please check your internet and try again.',
      logLevel: 'warn',
    }
  }
  // Rate limit errors
  else if (lowerMessage.includes('429') || lowerMessage.includes('rate')) {
    category = 'client'
    statusCode = 429
    strategy = {
      shouldRetry: true,
      retryDelay: 5000,
      maxRetries: 5,
      userMessage: 'Too many requests. Please wait a moment and try again.',
      logLevel: 'warn',
    }
  }
  // Authentication errors
  else if (lowerMessage.includes('401') || lowerMessage.includes('unauthorized')) {
    category = 'client'
    statusCode = 401
    retryable = false
    strategy = {
      shouldRetry: false,
      retryDelay: 0,
      maxRetries: 0,
      userMessage: 'Authentication failed. Please check your API key.',
      logLevel: 'error',
    }
  }
  // Authorization errors
  else if (lowerMessage.includes('403') || lowerMessage.includes('forbidden')) {
    category = 'client'
    statusCode = 403
    retryable = false
    strategy = {
      shouldRetry: false,
      retryDelay: 0,
      maxRetries: 0,
      userMessage: 'Access denied. You do not have permission to perform this action.',
      logLevel: 'error',
    }
  }
  // Bad request errors
  else if (lowerMessage.includes('400') || lowerMessage.includes('bad request')) {
    category = 'validation'
    statusCode = 400
    retryable = false
    strategy = {
      shouldRetry: false,
      retryDelay: 0,
      maxRetries: 0,
      userMessage: 'Invalid request. Please check your input and try again.',
      logLevel: 'error',
    }
  }
  // Server errors
  else if (
    lowerMessage.includes('500') ||
    lowerMessage.includes('502') ||
    lowerMessage.includes('503') ||
    lowerMessage.includes('504') ||
    lowerMessage.includes('server')
  ) {
    category = 'server'
    statusCode = 500
    strategy = {
      shouldRetry: true,
      retryDelay: 4000,
      maxRetries: 3,
      userMessage: 'Server error. Please try again later.',
      logLevel: 'error',
    }
  }
  // Malformed response
  else if (lowerMessage.includes('malformed') || lowerMessage.includes('invalid')) {
    category = 'validation'
    strategy = {
      shouldRetry: true,
      retryDelay: 1000,
      maxRetries: 2,
      userMessage: 'Invalid response received. Please try again.',
      logLevel: 'warn',
    }
  }
  // Default unknown error
  else {
    category = 'unknown'
    strategy = {
      shouldRetry: true,
      retryDelay: 2000,
      maxRetries: 2,
      userMessage: 'An unexpected error occurred. Please try again.',
      logLevel: 'error',
    }
  }

  const errorDetails: ErrorDetails = {
    code: `${category.toUpperCase()}_ERROR`,
    message,
    category,
    statusCode,
    retryable,
    originalError: error,
  }

  return { details: errorDetails, strategy }
}

/**
 * Log error with context
 */
export function logErrorWithContext(
  error: ErrorDetails,
  context: ErrorContext,
  strategy: ErrorRecoveryStrategy
): void {
  const logData = {
    operation: context.operation,
    provider: context.provider,
    errorCode: error.code,
    errorCategory: error.category,
    statusCode: error.statusCode,
    message: error.message,
    retryable: error.retryable,
    shouldRetry: strategy.shouldRetry,
    duration: context.duration,
    retryCount: context.retryCount,
  }

  if (strategy.logLevel === 'error') {
    logger.error(`${context.operation} failed`, logData)
  } else if (strategy.logLevel === 'warn') {
    logger.warn(`${context.operation} encountered an issue`, logData)
  } else {
    logger.info(`${context.operation} info`, logData)
  }
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  const { strategy } = handleResponseError(error)
  return strategy.userMessage
}

/**
 * Determine if error is retryable
 */
export function isErrorRetryable(error: unknown): boolean {
  const { details } = handleResponseError(error)
  return details.retryable
}

/**
 * Get retry strategy for error
 */
export function getRetryStrategy(error: unknown): ErrorRecoveryStrategy {
  const { strategy } = handleResponseError(error)
  return strategy
}

/**
 * Enhanced error categorization with more granular types
 */
export interface EnhancedErrorDetails {
  code: string
  message: string
  category: 'client' | 'server' | 'network' | 'timeout' | 'validation' | 'rate_limit' | 'auth' | 'unknown'
  statusCode?: number
  retryable: boolean
  severity: 'critical' | 'high' | 'medium' | 'low'
  suggestedAction: string
  originalError?: unknown
}

/**
 * Categorize error with enhanced details
 */
export function categorizeErrorEnhanced(error: unknown): EnhancedErrorDetails {
  const message = error instanceof Error ? error.message : String(error)
  const lowerMessage = message.toLowerCase()

  let category: EnhancedErrorDetails['category'] = 'unknown'
  let statusCode: number | undefined
  let severity: EnhancedErrorDetails['severity'] = 'medium'
  let suggestedAction = 'Please try again.'
  let retryable = true

  // Rate limit errors (429)
  if (lowerMessage.includes('429') || lowerMessage.includes('rate') || lowerMessage.includes('too many requests')) {
    category = 'rate_limit'
    statusCode = 429
    severity = 'high'
    retryable = true
    suggestedAction = 'Please wait a moment before trying again. The service is experiencing high demand.'
  }
  // Authentication errors (401)
  else if (lowerMessage.includes('401') || lowerMessage.includes('unauthorized') || lowerMessage.includes('unauthenticated')) {
    category = 'auth'
    statusCode = 401
    severity = 'critical'
    retryable = false
    suggestedAction = 'Please check your API key or credentials and try again.'
  }
  // Authorization errors (403)
  else if (lowerMessage.includes('403') || lowerMessage.includes('forbidden') || lowerMessage.includes('permission denied')) {
    category = 'auth'
    statusCode = 403
    severity = 'high'
    retryable = false
    suggestedAction = 'You do not have permission to perform this action.'
  }
  // Bad request errors (400)
  else if (lowerMessage.includes('400') || lowerMessage.includes('bad request') || lowerMessage.includes('invalid request')) {
    category = 'validation'
    statusCode = 400
    severity = 'high'
    retryable = false
    suggestedAction = 'Please check your input and try again.'
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
    severity = 'high'
    retryable = true
    suggestedAction = 'The server is experiencing issues. Please try again later.'
  }
  // Timeout errors
  else if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out') || lowerMessage.includes('deadline exceeded')) {
    category = 'timeout'
    statusCode = 408
    severity = 'medium'
    retryable = true
    suggestedAction = 'The request took too long. Please try again.'
  }
  // Network errors
  else if (
    lowerMessage.includes('network') ||
    lowerMessage.includes('fetch') ||
    lowerMessage.includes('econnrefused') ||
    lowerMessage.includes('enotfound') ||
    lowerMessage.includes('econnreset') ||
    lowerMessage.includes('connection refused') ||
    lowerMessage.includes('connection reset')
  ) {
    category = 'network'
    severity = 'high'
    retryable = true
    suggestedAction = 'Please check your internet connection and try again.'
  }
  // Default unknown error
  else {
    category = 'unknown'
    severity = 'medium'
    retryable = true
    suggestedAction = 'An unexpected error occurred. Please try again.'
  }

  return {
    code: `${category.toUpperCase()}_ERROR`,
    message,
    category,
    statusCode,
    retryable,
    severity,
    suggestedAction,
    originalError: error,
  }
}

/**
 * Get recovery strategy with enhanced details
 */
export function getEnhancedRecoveryStrategy(error: unknown): {
  details: EnhancedErrorDetails
  strategy: ErrorRecoveryStrategy
} {
  const details = categorizeErrorEnhanced(error)

  const strategy: ErrorRecoveryStrategy = {
    shouldRetry: details.retryable,
    retryDelay: calculateRetryDelay(details.category),
    maxRetries: calculateMaxRetries(details.category),
    userMessage: details.suggestedAction,
    logLevel: details.severity === 'critical' ? 'error' : details.severity === 'high' ? 'error' : 'warn',
  }

  return { details, strategy }
}

/**
 * Calculate retry delay based on error category
 */
function calculateRetryDelay(category: EnhancedErrorDetails['category']): number {
  const delays: Record<EnhancedErrorDetails['category'], number> = {
    rate_limit: 5000,
    timeout: 2000,
    network: 3000,
    server: 4000,
    client: 0,
    auth: 0,
    validation: 0,
    unknown: 2000,
  }
  return delays[category] || 2000
}

/**
 * Calculate max retries based on error category
 */
function calculateMaxRetries(category: EnhancedErrorDetails['category']): number {
  const retries: Record<EnhancedErrorDetails['category'], number> = {
    rate_limit: 5,
    timeout: 3,
    network: 3,
    server: 3,
    client: 0,
    auth: 0,
    validation: 0,
    unknown: 2,
  }
  return retries[category] || 2
}

