import { logger } from '../services/logger'

interface RetryOptions {
  maxAttempts?: number
  delayMs?: number
  backoffMultiplier?: number
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
}

/**
 * Retry a function with exponential backoff
 * @param fn - The async function to retry
 * @param options - Retry configuration options
 * @returns The result of the function
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options }
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Don't retry on client errors (4xx) except 429 (rate limit)
      if (error instanceof Error) {
        const message = error.message.toLowerCase()
        if (message.includes('401') || message.includes('403')) {
          throw error
        }
      }

      if (attempt < config.maxAttempts) {
        const delay = config.delayMs * Math.pow(config.backoffMultiplier, attempt - 1)
        logger.debug(`Retry attempt ${attempt}/${config.maxAttempts} after ${delay}ms`, { error: lastError.message })
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  logger.error(`Failed after ${config.maxAttempts} attempts`, lastError)
  throw lastError
}

