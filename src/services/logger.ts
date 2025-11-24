type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  data?: unknown
}

/**
 * Logger service with security-first approach
 * Ensures no sensitive data (API keys, tokens, etc.) is ever logged
 */
class Logger {
  private isDevelopment = import.meta.env.DEV
  private logs: LogEntry[] = []
  private maxLogs = 100

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
}

export const logger = new Logger()

