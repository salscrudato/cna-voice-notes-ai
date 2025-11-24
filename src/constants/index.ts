/**
 * Application-wide constants
 * Centralized configuration for easy maintenance and AI agent comprehension
 */

// ============================================================================
// UI CONSTANTS
// ============================================================================

export const UI = {
  // Animation delays (ms)
  ANIMATION_DELAY_FAST: 150,
  ANIMATION_DELAY_MEDIUM: 300,
  ANIMATION_DELAY_SLOW: 600,

  // Sidebar
  SIDEBAR_WIDTH: 280,
  SIDEBAR_ANIMATION_DURATION: 300,

  // Chat input
  MAX_MESSAGE_LENGTH: 4000,
  MESSAGE_INPUT_MAX_HEIGHT: 120,
  MESSAGE_INPUT_ROWS: 1,

  // Chat messages
  MAX_MESSAGES_TO_SEND_TO_API: 20,
  MESSAGE_SCROLL_BEHAVIOR: 'smooth' as const,

  // Timeouts
  COPY_FEEDBACK_DURATION: 2000,
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
} as const

// ============================================================================
// API CONSTANTS
// ============================================================================

export const API = {
  // OpenAI / Chat Provider
  MODEL: 'gpt-4o-mini',
  TEMPERATURE: 0.7,
  MAX_TOKENS: 1000,

  // Retry logic
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
  BACKOFF_MULTIPLIER: 2,
  REQUEST_TIMEOUT_MS: 30000,

  // Rate limiting
  MIN_REQUEST_INTERVAL_MS: 500,
} as const

// ============================================================================
// FIRESTORE CONSTANTS
// ============================================================================

export const FIRESTORE = {
  COLLECTIONS: {
    CONVERSATIONS: 'conversations',
    MESSAGES: 'messages',
    VOICE_NOTES: 'voiceNotes',
  },
  BATCH_SIZE: 50,
  QUERY_LIMIT: 100,
} as const

// ============================================================================
// ROUTES
// ============================================================================

export const ROUTES = {
  HOME: '/',
  CHAT: '/chat',
  HISTORY: '/history',
  UPLOAD: '/upload',
} as const

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  API_KEY_MISSING: '⚠️ OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in .env.local and restart.',
  NO_RESPONSE_CONTENT: 'No response content from OpenAI API',
  EMPTY_RESPONSE: 'Empty response from AI provider',
  FAILED_TO_CREATE_CONVERSATION: 'Failed to create conversation',
  FAILED_TO_LOAD_CONVERSATIONS: 'Failed to load conversations',
  FAILED_TO_LOAD_MESSAGES: 'Failed to load messages',
  FAILED_TO_SEND_MESSAGE: 'Failed to send message',
  INVALID_RESPONSE: 'Invalid response from API',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
} as const

// ============================================================================
// DATE GROUPING
// ============================================================================

export const DATE_GROUPS = {
  TODAY: 'Today',
  YESTERDAY: 'Yesterday',
  THIS_WEEK: 'This Week',
  THIS_MONTH: 'This Month',
  OLDER: 'Older',
} as const

// ============================================================================
// CONVERSATION DEFAULTS
// ============================================================================

export const CONVERSATION = {
  DEFAULT_TITLE_PREFIX: 'Chat',
  EMPTY_STATE_MESSAGE: 'Start a new conversation to begin',
} as const

