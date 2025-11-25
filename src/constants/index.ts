/**
 * Application-wide constants
 * Centralized configuration for easy maintenance and AI agent comprehension
 */

// ============================================================================
// UI CONSTANTS
// ============================================================================

export const UI = {
  // Chat input
  MAX_MESSAGE_LENGTH: 4000,
  MESSAGE_INPUT_MAX_HEIGHT: 120,
  MESSAGE_INPUT_ROWS: 1,

  // Chat messages
  MAX_MESSAGES_TO_SEND_TO_API: 20,
  MESSAGE_SCROLL_BEHAVIOR: 'smooth' as const,

  // Timeouts
  COPY_FEEDBACK_DURATION: 2000,
} as const

// ============================================================================
// API CONSTANTS
// ============================================================================

export const API = {
  // OpenAI / Chat Provider
  MODEL: 'gpt-4o-mini',
  TEMPERATURE: 0.7,
  MAX_TOKENS: 1000,
  REQUEST_TIMEOUT_MS: 30000,
} as const





