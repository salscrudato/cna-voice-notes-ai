import { logger } from '../services/logger'
import type { CacheEntry } from '../types'

/**
 * Response Cache Manager
 * Caches API responses to reduce redundant requests
 */

export class ResponseCache<T = unknown> {
  private cache: Map<string, CacheEntry<T>> = new Map()
  private defaultTTL: number = 300000 // 5 minutes

  constructor(defaultTTL?: number) {
    if (defaultTTL) {
      this.defaultTTL = defaultTTL
    }
  }

  /**
   * Set cache entry
   */
  set(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: new Date(),
      ttl,
      hits: 0,
    })
    logger.debug('Cache entry set', { key, ttl })
  }

  /**
   * Get cache entry if valid
   */
  get(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    // Check if entry has expired
    const age = Date.now() - entry.timestamp.getTime()
    if (age > entry.ttl) {
      this.cache.delete(key)
      logger.debug('Cache entry expired', { key, age })
      return null
    }

    entry.hits++
    logger.debug('Cache hit', { key, hits: entry.hits })
    return entry.data
  }

  /**
   * Check if key exists and is valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    const age = Date.now() - entry.timestamp.getTime()
    if (age > entry.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  /**
   * Delete cache entry
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear()
    logger.info('Cache cleared')
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number
    entries: Array<{ key: string; hits: number; age: number; ttl: number }>
  } {
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      hits: entry.hits,
      age: Date.now() - entry.timestamp.getTime(),
      ttl: entry.ttl,
    }))

    return {
      size: this.cache.size,
      entries,
    }
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    let removed = 0
    const now = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      const age = now - entry.timestamp.getTime()
      if (age > entry.ttl) {
        this.cache.delete(key)
        removed++
      }
    }

    if (removed > 0) {
      logger.debug('Cache cleanup completed', { removed })
    }

    return removed
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size
  }
}

/**
 * Create a cache for chat responses
 */
export function createChatResponseCache(): ResponseCache<string> {
  return new ResponseCache<string>(600000) // 10 minutes
}

/**
 * Create a cache for API responses
 */
export function createApiResponseCache<T = unknown>(): ResponseCache<T> {
  return new ResponseCache<T>(300000) // 5 minutes
}

