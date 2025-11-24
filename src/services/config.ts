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

export type ChatProvider = 'openai-direct' | 'proxied'

export interface ChatProviderConfig {
  provider: ChatProvider
  openaiApiKey?: string
  proxyUrl?: string
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
 * @deprecated Use isChatProviderConfigured() instead
 */
export function isOpenAIConfigured(): boolean {
  return !!import.meta.env.VITE_OPENAI_API_KEY
}

/**
 * Check if the chat provider is properly configured
 * Distinguishes between proxied and direct provider requirements
 * @returns true if the configured provider has all required settings
 */
export function isChatProviderConfigured(): boolean {
  const config = getChatProviderConfig()

  if (config.provider === 'proxied') {
    return !!config.proxyUrl
  }

  // openai-direct provider
  return !!config.openaiApiKey
}

/**
 * Get the chat provider configuration
 * @returns Chat provider configuration based on environment variables
 */
export function getChatProviderConfig(): ChatProviderConfig {
  const provider = (import.meta.env.VITE_CHAT_PROVIDER || 'openai-direct') as ChatProvider
  const proxyUrl = import.meta.env.VITE_CHAT_PROXY_URL
  const openaiApiKey = getOpenAIApiKey()

  // Validate configuration
  if (provider === 'proxied' && !proxyUrl) {
    logger.error('Proxied chat provider selected but VITE_CHAT_PROXY_URL is not configured')
  }

  if (provider === 'openai-direct' && !openaiApiKey) {
    logger.warn('OpenAI direct provider selected but VITE_OPENAI_API_KEY is not configured')
  }

  logger.info('Chat provider configured', { provider, hasProxyUrl: !!proxyUrl, hasApiKey: !!openaiApiKey })

  return {
    provider,
    proxyUrl,
    openaiApiKey,
  }
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
 * Get a user-friendly error message for API key/configuration issues
 * Returns different messages based on the configured provider
 * @returns Error message to display to user
 */
export function getApiKeyErrorMessage(): string {
  const config = getChatProviderConfig()

  if (config.provider === 'proxied') {
    return '⚠️ Chat proxy not configured. Please set VITE_CHAT_PROXY_URL in .env.local and restart.'
  }

  // openai-direct provider
  return '⚠️ OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in .env.local and restart.'
}

