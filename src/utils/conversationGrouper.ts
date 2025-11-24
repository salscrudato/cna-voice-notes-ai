/**
 * Conversation grouping utilities
 * Provides consistent date-based grouping for conversations across the app
 */

import type { Conversation } from '../types'

export type ConversationGroup = 'Today' | 'Yesterday' | 'This Week' | 'This Month' | 'Older'

export type GroupedConversations = Partial<Record<ConversationGroup, Conversation[]>>

/**
 * Determine which group a conversation belongs to based on its updatedAt date
 * @param date - The date to categorize
 * @returns The group name
 */
export function getConversationGroup(date: Date): ConversationGroup {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)
  const monthAgo = new Date(today)
  monthAgo.setMonth(monthAgo.getMonth() - 1)

  const conversationDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (conversationDate.getTime() === today.getTime()) {
    return 'Today'
  }
  if (conversationDate.getTime() === yesterday.getTime()) {
    return 'Yesterday'
  }
  if (conversationDate.getTime() > weekAgo.getTime()) {
    return 'This Week'
  }
  if (conversationDate.getTime() > monthAgo.getTime()) {
    return 'This Month'
  }
  return 'Older'
}

/**
 * Group conversations by date
 * @param conversations - Array of conversations to group
 * @returns Object with conversations grouped by date
 */
export function groupConversationsByDate(conversations: Conversation[]): GroupedConversations {
  const grouped: GroupedConversations = {}

  for (const conversation of conversations) {
    const group = getConversationGroup(conversation.updatedAt)
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

/**
 * Get grouped conversations in display order
 * @param conversations - Array of conversations to group
 * @returns Array of [groupName, conversations] tuples in display order
 */
export function getOrderedGroupedConversations(
  conversations: Conversation[]
): Array<[ConversationGroup, Conversation[]]> {
  const grouped = groupConversationsByDate(conversations)
  const order = getGroupOrder()

  return order
    .filter(group => grouped[group] && grouped[group]!.length > 0)
    .map(group => [group, grouped[group]!])
}

