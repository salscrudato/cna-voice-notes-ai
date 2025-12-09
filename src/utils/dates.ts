/**
 * Date and time utilities
 * Provides consistent date operations across the application
 */

/**
 * Get the date group label for a date
 * Categorizes dates into groups like "Today", "Yesterday", "This Week", etc.
 * @param date - Date to categorize (Date object or timestamp number)
 * @returns Date group label string (e.g., "Today", "Yesterday", "This Week")
 */
export function getDateGroupLabel(date: Date | number): string {
  const dateObj = typeof date === 'number' ? new Date(date) : date
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - dateObj.getTime())
  const daysDiff = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (daysDiff === 0) return 'Today'
  if (daysDiff === 1) return 'Yesterday'
  if (daysDiff < 7) return 'This Week'
  if (daysDiff < 30) return 'This Month'
  return 'Older'
}
