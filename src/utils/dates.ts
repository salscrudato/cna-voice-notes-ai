/**
 * Date and time utilities
 * Provides consistent date operations across the application
 */

import { DATE_GROUPS } from '../constants'

/**
 * Get the number of days between two dates
 * @param date1 - First date
 * @param date2 - Second date (defaults to now)
 * @returns Number of days difference
 */
export function getDaysDifference(date1: Date | number, date2: Date | number = new Date()): number {
  const d1 = typeof date1 === 'number' ? new Date(date1) : date1
  const d2 = typeof date2 === 'number' ? new Date(date2) : date2
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Check if a date is today
 * @param date - Date to check
 * @returns true if date is today
 */
export function isToday(date: Date | number): boolean {
  return getDaysDifference(date) === 0
}

/**
 * Check if a date is yesterday
 * @param date - Date to check
 * @returns true if date is yesterday
 */
export function isYesterday(date: Date | number): boolean {
  return getDaysDifference(date) === 1
}

/**
 * Check if a date is in the current week
 * @param date - Date to check
 * @returns true if date is in current week
 */
export function isThisWeek(date: Date | number): boolean {
  const daysDiff = getDaysDifference(date)
  return daysDiff >= 0 && daysDiff < 7
}

/**
 * Check if a date is in the current month
 * @param date - Date to check
 * @returns true if date is in current month
 */
export function isThisMonth(date: Date | number): boolean {
  const daysDiff = getDaysDifference(date)
  return daysDiff >= 0 && daysDiff < 30
}

/**
 * Get the date group label for a date
 * @param date - Date to categorize
 * @returns Date group label
 */
export function getDateGroupLabel(date: Date | number): string {
  const daysDiff = getDaysDifference(date)

  if (daysDiff === 0) return DATE_GROUPS.TODAY
  if (daysDiff === 1) return DATE_GROUPS.YESTERDAY
  if (daysDiff < 7) return DATE_GROUPS.THIS_WEEK
  if (daysDiff < 30) return DATE_GROUPS.THIS_MONTH
  return DATE_GROUPS.OLDER
}

/**
 * Group dates by their label
 * @param dates - Array of dates to group
 * @returns Object with date group labels as keys and dates as values
 */
export function groupDatesByLabel(dates: (Date | number)[]): Record<string, (Date | number)[]> {
  const groups: Record<string, (Date | number)[]> = {}

  dates.forEach(date => {
    const label = getDateGroupLabel(date)
    if (!groups[label]) {
      groups[label] = []
    }
    groups[label].push(date)
  })

  return groups
}

/**
 * Get the start of the day for a date
 * @param date - Date to get start of day for
 * @returns Date at start of day (00:00:00)
 */
export function getStartOfDay(date: Date | number): Date {
  const d = typeof date === 'number' ? new Date(date) : new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Get the end of the day for a date
 * @param date - Date to get end of day for
 * @returns Date at end of day (23:59:59)
 */
export function getEndOfDay(date: Date | number): Date {
  const d = typeof date === 'number' ? new Date(date) : new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param date - Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString()
}

