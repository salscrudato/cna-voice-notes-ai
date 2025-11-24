type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  data?: unknown
}

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

/**
 * Logger service with security-first approach
 * Ensures no sensitive data (API keys, tokens, etc.) is ever logged
 * Also handles structured response logging for API interactions
 */
class Logger {
  private isDevelopment = import.meta.env.DEV
  private logs: LogEntry[] = []
  private responseLogs: ResponseLogEntry[] = []
  private maxLogs = 100
  private maxResponseLogs = 1000

  /**
   * Sanitize data to remove sensitive information
   * @param data - Data to sanitize
   * @returns Sanitized data safe for logging
   */
  private sanitizeData(data: unknown): unknown {
    if (!data) return data

    // Don't log strings that might contain sensitive data
    if (typeof data === 'string') {
      // Check for common sensitive patterns
      if (
        data.includes('apiKey') ||
        data.includes('api_key') ||
        data.includes('token') ||
        data.includes('password') ||
        data.includes('secret') ||
        data.includes('VITE_')
      ) {
        return '[REDACTED]'
      }
      return data
    }

    // For objects, recursively sanitize
    if (typeof data === 'object' && data !== null) {
      if (Array.isArray(data)) {
        return data.map(item => this.sanitizeData(item))
      }

      const sanitized: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(data)) {
        // Skip sensitive keys
        if (
          key.toLowerCase().includes('key') ||
          key.toLowerCase().includes('token') ||
          key.toLowerCase().includes('password') ||
          key.toLowerCase().includes('secret')
        ) {
          sanitized[key] = '[REDACTED]'
        } else {
          sanitized[key] = this.sanitizeData(value)
        }
      }
      return sanitized
    }

    return data
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    const sanitizedData = this.sanitizeData(data)
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data: sanitizedData,
    }

    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    if (this.isDevelopment) {
      const style = this.getConsoleStyle(level)
      console.log(`%c[${level.toUpperCase()}]`, style, message, sanitizedData || '')
    }
  }

  private getConsoleStyle(level: LogLevel): string {
    const styles = {
      debug: 'color: #888; font-weight: normal;',
      info: 'color: #0066cc; font-weight: bold;',
      warn: 'color: #ff9900; font-weight: bold;',
      error: 'color: #cc0000; font-weight: bold;',
    }
    return styles[level]
  }

  debug(message: string, data?: unknown) {
    this.log('debug', message, data)
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data)
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data)
  }

  error(message: string, data?: unknown) {
    this.log('error', message, data)
  }

  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }

  /**
   * Log successful API response
   */
  logResponseSuccess(
    provider: string,
    duration: number,
    retryCount: number,
    contentLength: number,
    contentType?: string,
    tokensUsed?: { prompt: number; completion: number; total: number }
  ): void {
    const entry: ResponseLogEntry = {
      timestamp: new Date(),
      type: 'success',
      provider,
      duration,
      contentLength,
      contentType,
      tokensUsed,
      retryCount,
      message: 'Response received successfully',
    }
    this.addResponseLog(entry)
    this.info('API response successful', {
      provider,
      duration: `${duration}ms`,
      contentLength,
      contentType,
      tokensUsed,
      retryCount,
    })
  }

  /**
   * Log API response error
   */
  logResponseError(
    provider: string,
    duration: number,
    retryCount: number,
    errorCode?: string,
    errorCategory?: string,
    message?: string
  ): void {
    const entry: ResponseLogEntry = {
      timestamp: new Date(),
      type: 'error',
      provider,
      duration,
      errorCode,
      errorCategory,
      retryCount,
      message: message || 'API response error',
    }
    this.addResponseLog(entry)
    this.error('API response error', {
      provider,
      errorCode,
      errorCategory,
      duration: `${duration}ms`,
      retryCount,
    })
  }

  /**
   * Log API response timing
   */
  logResponseTiming(provider: string, duration: number, operation: string): void {
    this.debug(`${operation} completed`, {
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
   * Add response log entry
   */
  private addResponseLog(entry: ResponseLogEntry): void {
    this.responseLogs.push(entry)
    if (this.responseLogs.length > this.maxResponseLogs) {
      this.responseLogs = this.responseLogs.slice(-this.maxResponseLogs)
    }
  }

  /**
   * Get response logs
   */
  getResponseLogs(): ResponseLogEntry[] {
    return [...this.responseLogs]
  }

  /**
   * Get response logs by type
   */
  getResponseLogsByType(type: 'success' | 'error' | 'warning'): ResponseLogEntry[] {
    return this.responseLogs.filter((log) => log.type === type)
  }

  /**
   * Get response logs by provider
   */
  getResponseLogsByProvider(provider: string): ResponseLogEntry[] {
    return this.responseLogs.filter((log) => log.provider === provider)
  }

  /**
   * Get response log statistics
   */
  getResponseStatistics() {
    const stats = {
      totalLogs: this.responseLogs.length,
      successCount: 0,
      errorCount: 0,
      warningCount: 0,
      averageDuration: 0,
      totalDuration: 0,
      providers: new Set<string>(),
    }

    for (const log of this.responseLogs) {
      if (log.type === 'success') stats.successCount++
      if (log.type === 'error') stats.errorCount++
      if (log.type === 'warning') stats.warningCount++
      stats.totalDuration += log.duration
      stats.providers.add(log.provider)
    }

    stats.averageDuration = this.responseLogs.length > 0 ? stats.totalDuration / this.responseLogs.length : 0

    return {
      ...stats,
      providers: Array.from(stats.providers),
    }
  }

  /**
   * Clear response logs
   */
  clearResponseLogs(): void {
    this.responseLogs = []
  }
}

export const logger = new Logger()

