/**
 * Centralized configuration service for API and application settings
 * Ensures consistent configuration across the application and prevents sensitive data leaks
 */

import { logger } from './logger'

export interface APIConfig {
  requestTimeout: number
  maxRetries: number
  retryDelay: number
  backoffMultiplier: number
}

// Default API configuration
const DEFAULT_API_CONFIG: APIConfig = {
  requestTimeout: 30000, // 30 seconds
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  backoffMultiplier: 2,
}

/**
 * Get the OpenAI API key from environment variables
 * @returns The API key or undefined if not configured
 * @throws Error if key is missing (when explicitly checked)
 */
export function getOpenAIApiKey(): string | undefined {
  const key = import.meta.env.VITE_OPENAI_API_KEY
  
  if (!key) {
    logger.warn('OpenAI API key is not configured')
    return undefined
  }
  
  // Ensure we never log the actual key
  logger.debug('OpenAI API key is configured')
  return key
}

/**
 * Check if OpenAI API key is configured
 * @returns true if key is available, false otherwise
 */
export function isOpenAIConfigured(): boolean {
  return !!import.meta.env.VITE_OPENAI_API_KEY
}

/**
 * Get API configuration with optional overrides
 * @param overrides - Partial configuration to override defaults
 * @returns Complete API configuration
 */
export function getAPIConfig(overrides?: Partial<APIConfig>): APIConfig {
  return {
    ...DEFAULT_API_CONFIG,
    ...overrides,
  }
}

/**
 * Get a user-friendly error message for API key issues
 * @returns Error message to display to user
 */
export function getApiKeyErrorMessage(): string {
  return '⚠️ OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in .env.local and restart.'
}

