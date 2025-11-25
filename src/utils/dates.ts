/**
 * Date and time utilities
 * Provides consistent date operations across the application
 */

import type { Conversation } from '../types'

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



// ============================================================================
// CONVERSATION GROUPING UTILITIES
// ============================================================================

export type ConversationGroup = 'Today' | 'Yesterday' | 'This Week' | 'This Month' | 'Older'
export type GroupedConversations = Partial<Record<ConversationGroup, Conversation[]>>

/**
 * Group conversations by date
 * @param conversations - Array of conversations to group
 * @returns Object with conversations grouped by date
 */
export function groupConversationsByDate(conversations: Conversation[]): GroupedConversations {
  const grouped: GroupedConversations = {}

  for (const conversation of conversations) {
    const group = getDateGroupLabel(conversation.updatedAt) as ConversationGroup
    if (!grouped[group]) {
      grouped[group] = []
    }
    grouped[group]!.push(conversation)
  }

  return grouped
}

/**
 * Get the order of groups for consistent display
 * @returns Array of group names in display order
 */
export function getGroupOrder(): ConversationGroup[] {
  return ['Today', 'Yesterday', 'This Week', 'This Month', 'Older']
}



