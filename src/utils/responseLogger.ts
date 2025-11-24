import { logger } from '../services/logger'
import type { ResponseMetadata, FormattedChatResponse, ErrorDetails } from '../types'

/**
 * Response Logger Utility
 * Structured logging for API responses with metadata tracking
 */

export interface ResponseLogEntry {
  timestamp: Date
  type: 'success' | 'error' | 'warning'
  provider: string
  duration: number
  contentLength?: number
  contentType?: string
  tokensUsed?: {
    prompt: number
    completion: number
    total: number
  }
  errorCode?: string
  errorCategory?: string
  retryCount: number
  message: string
}

class ResponseLogger {
  private logs: ResponseLogEntry[] = []
  private maxLogs = 1000

  /**
   * Log successful response
   */
  logSuccess(
    metadata: ResponseMetadata,
    response: FormattedChatResponse,
    message: string = 'Response received successfully'
  ): void {
    const entry: ResponseLogEntry = {
      timestamp: metadata.timestamp,
      type: 'success',
      provider: metadata.provider,
      duration: metadata.duration,
      contentLength: response.length,
      contentType: response.contentType,
      tokensUsed: metadata.tokensUsed,
      retryCount: metadata.retryCount,
      message,
    }

    this.addLog(entry)
    logger.info(message, {
      provider: metadata.provider,
      duration: `${metadata.duration}ms`,
      contentLength: response.length,
      contentType: response.contentType,
      tokensUsed: metadata.tokensUsed,
      retryCount: metadata.retryCount,
    })
  }

  /**
   * Log error response
   */
  logError(
    metadata: ResponseMetadata,
    error: ErrorDetails,
    message: string = 'Response error occurred'
  ): void {
    const entry: ResponseLogEntry = {
      timestamp: metadata.timestamp,
      type: 'error',
      provider: metadata.provider,
      duration: metadata.duration,
      errorCode: error.code,
      errorCategory: error.category,
      retryCount: metadata.retryCount,
      message: error.message,
    }

    this.addLog(entry)
    logger.error(message, {
      provider: metadata.provider,
      errorCode: error.code,
      errorCategory: error.category,
      statusCode: error.statusCode,
      retryable: error.retryable,
      duration: `${metadata.duration}ms`,
      retryCount: metadata.retryCount,
    })
  }

  /**
   * Log warning
   */
  logWarning(
    metadata: ResponseMetadata,
    warnings: string[],
    message: string = 'Response warning'
  ): void {
    const entry: ResponseLogEntry = {
      timestamp: metadata.timestamp,
      type: 'warning',
      provider: metadata.provider,
      duration: metadata.duration,
      retryCount: metadata.retryCount,
      message: `${message}: ${warnings.join(', ')}`,
    }

    this.addLog(entry)
    logger.warn(message, {
      provider: metadata.provider,
      warnings,
      duration: `${metadata.duration}ms`,
    })
  }

  /**
   * Log response timing
   */
  logTiming(provider: string, duration: number, operation: string): void {
    logger.debug(`${operation} completed`, {
      provider,
      duration: `${duration}ms`,
      performanceCategory: this.categorizePerformance(duration),
    })
  }

  /**
   * Categorize performance based on duration
   */
  private categorizePerformance(duration: number): string {
    if (duration < 500) return 'excellent'
    if (duration < 1000) return 'good'
    if (duration < 2000) return 'acceptable'
    if (duration < 5000) return 'slow'
    return 'very_slow'
  }

  /**
   * Add log entry
   */
  private addLog(entry: ResponseLogEntry): void {
    this.logs.push(entry)

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }
  }

  /**
   * Get all logs
   */
  getLogs(): ResponseLogEntry[] {
    return [...this.logs]
  }

  /**
   * Get logs by type
   */
  getLogsByType(type: 'success' | 'error' | 'warning'): ResponseLogEntry[] {
    return this.logs.filter((log) => log.type === type)
  }

  /**
   * Get logs by provider
   */
  getLogsByProvider(provider: string): ResponseLogEntry[] {
    return this.logs.filter((log) => log.provider === provider)
  }

  /**
   * Get statistics
   */
  getStatistics() {
    const stats = {
      totalLogs: this.logs.length,
      successCount: 0,
      errorCount: 0,
      warningCount: 0,
      averageDuration: 0,
      totalDuration: 0,
      providers: new Set<string>(),
    }

    for (const log of this.logs) {
      if (log.type === 'success') stats.successCount++
      if (log.type === 'error') stats.errorCount++
      if (log.type === 'warning') stats.warningCount++
      stats.totalDuration += log.duration
      stats.providers.add(log.provider)
    }

    stats.averageDuration = this.logs.length > 0 ? stats.totalDuration / this.logs.length : 0

    return {
      ...stats,
      providers: Array.from(stats.providers),
    }
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = []
  }
}

export const responseLogger = new ResponseLogger()

