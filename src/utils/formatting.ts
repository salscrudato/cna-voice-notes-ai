/**
 * Text and content formatting utilities
 * Provides consistent formatting across the application
 */

/**
 * Normalize date input to Date object
 * Handles both Date objects and numeric timestamps
 * @param date - Date to normalize (Date object or millisecond timestamp)
 * @returns Normalized Date object
 * @internal
 */
function normalizeDate(date: Date | number): Date {
  return typeof date === 'number' ? new Date(date) : date
}

/**
 * Format a date to a readable time string
 * Uses locale-specific formatting (e.g., "2:30 PM" in en-US)
 * @param date - Date to format (Date object or millisecond timestamp)
 * @returns Formatted time string (e.g., "2:30 PM")
 * @example
 * formatTime(new Date()) // "2:30 PM"
 * formatTime(1700000000000) // "2:30 PM"
 */
export function formatTime(date: Date | number): string {
  const dateObj = normalizeDate(date)
  return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/**
 * Format a date to a readable date and time string
 * Uses locale-specific formatting (e.g., "Nov 24, 2025 2:30 PM" in en-US)
 * @param date - Date to format (Date object or millisecond timestamp)
 * @returns Formatted date and time string (e.g., "Nov 24, 2025 2:30 PM")
 * @example
 * formatDateAndTime(new Date()) // "Nov 24, 2025 2:30 PM"
 * formatDateAndTime(1700000000000) // "Nov 24, 2025 2:30 PM"
 */
export function formatDateAndTime(date: Date | number): string {
  const dateObj = normalizeDate(date)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

