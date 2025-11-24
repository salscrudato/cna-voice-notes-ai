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

