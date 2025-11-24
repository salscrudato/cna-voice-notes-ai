import { logger } from '../services/logger'
import type { CircuitBreakerConfig, CircuitBreakerState, CircuitBreakerStatus } from '../types'

/**
 * Circuit Breaker Pattern Implementation
 * Prevents cascading failures and manages service degradation
 */

export class CircuitBreaker {
  private state: CircuitBreakerState = 'closed'
  private failureCount = 0
  private successCount = 0
  private lastFailureTime?: Date
  private nextAttemptTime?: Date
  private config: CircuitBreakerConfig

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = {
      failureThreshold: config.failureThreshold || 5,
      successThreshold: config.successThreshold || 2,
      timeout: config.timeout || 60000,
      monitoringWindow: config.monitoringWindow || 120000,
    }
  }

  /**
   * Execute function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (this.shouldAttemptReset()) {
        this.state = 'half-open'
        logger.info('Circuit breaker transitioning to half-open state')
      } else {
        throw new Error('Circuit breaker is open. Service is unavailable.')
      }
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  /**
   * Handle successful execution
   */
  private onSuccess(): void {
    this.failureCount = 0

    if (this.state === 'half-open') {
      this.successCount++
      if (this.successCount >= this.config.successThreshold) {
        this.state = 'closed'
        this.successCount = 0
        logger.info('Circuit breaker closed - service recovered')
      }
    }
  }

  /**
   * Handle failed execution
   */
  private onFailure(): void {
    this.lastFailureTime = new Date()
    this.failureCount++

    if (this.state === 'half-open') {
      this.state = 'open'
      this.nextAttemptTime = new Date(Date.now() + this.config.timeout)
      logger.warn('Circuit breaker opened - service degraded')
    } else if (this.state === 'closed' && this.failureCount >= this.config.failureThreshold) {
      this.state = 'open'
      this.nextAttemptTime = new Date(Date.now() + this.config.timeout)
      logger.error('Circuit breaker opened - threshold exceeded', {
        failureCount: this.failureCount,
        threshold: this.config.failureThreshold,
      })
    }
  }

  /**
   * Check if should attempt reset
   */
  private shouldAttemptReset(): boolean {
    if (!this.nextAttemptTime) return true
    return Date.now() >= this.nextAttemptTime.getTime()
  }

  /**
   * Get current status
   */
  getStatus(): CircuitBreakerStatus {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
      nextAttemptTime: this.nextAttemptTime,
    }
  }

  /**
   * Reset circuit breaker
   */
  reset(): void {
    this.state = 'closed'
    this.failureCount = 0
    this.successCount = 0
    this.lastFailureTime = undefined
    this.nextAttemptTime = undefined
    logger.info('Circuit breaker reset')
  }

  /**
   * Check if circuit is open
   */
  isOpen(): boolean {
    return this.state === 'open'
  }

  /**
   * Check if circuit is closed
   */
  isClosed(): boolean {
    return this.state === 'closed'
  }

  /**
   * Check if circuit is half-open
   */
  isHalfOpen(): boolean {
    return this.state === 'half-open'
  }
}

/**
 * Create a circuit breaker for API calls
 */
export function createApiCircuitBreaker(): CircuitBreaker {
  return new CircuitBreaker({
    failureThreshold: 5,
    successThreshold: 2,
    timeout: 60000,
    monitoringWindow: 120000,
  })
}

