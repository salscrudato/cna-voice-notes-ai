/**
 * Text and content formatting utilities
 * Provides consistent formatting across the application
 */

/**
 * Format a date to a readable time string
 * @param date - Date to format
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export function formatTime(date: Date | number): string {
  const dateObj = typeof date === 'number' ? new Date(date) : date
  return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/**
 * Format a date to a readable date string
 * @param date - Date to format
 * @returns Formatted date string (e.g., "Nov 24, 2025")
 */
export function formatDate(date: Date | number): string {
  const dateObj = typeof date === 'number' ? new Date(date) : date
  return dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * Format a date to a readable date and time string
 * @param date - Date to format
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | number): string {
  return `${formatDate(date)} ${formatTime(date)}`
}

/**
 * Truncate text to a maximum length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/**
 * Capitalize the first letter of a string
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export function capitalize(text: string): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Convert text to title case
 * @param text - Text to convert
 * @returns Title case text
 */
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}

/**
 * Sanitize text for display (remove extra whitespace)
 * @param text - Text to sanitize
 * @returns Sanitized text
 */
export function sanitizeText(text: string): string {
  return text.trim().replace(/\s+/g, ' ')
}

/**
 * Format a number with thousand separators
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return num.toLocaleString()
}

/**
 * Format bytes to human-readable size
 * @param bytes - Number of bytes
 * @returns Formatted size string (e.g., "1.5 MB")
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Extract first line from text
 * @param text - Text to extract from
 * @returns First line
 */
export function getFirstLine(text: string): string {
  return text.split('\n')[0]
}

/**
 * Count words in text
 * @param text - Text to count
 * @returns Word count
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

