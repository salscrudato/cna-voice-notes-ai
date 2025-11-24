import { useState, useCallback, useMemo } from 'react'
import type { Conversation, ConversationMetadata } from '../types'

/**
 * Hook for managing underwriting filters and applying them to conversations
 */
export function useUnderwritingFilters() {
  const [filters, setFilters] = useState<Partial<ConversationMetadata>>({})

  const updateFilters = useCallback((newFilters: Partial<ConversationMetadata>) => {
    setFilters(newFilters)
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])

  const applyFilters = useCallback((conversations: Conversation[]): Conversation[] => {
    if (Object.keys(filters).length === 0) {
      return conversations
    }

    return conversations.filter(conv => {
      const metadata = conv.metadata || {}

      // Check each active filter
      for (const [key, filterValue] of Object.entries(filters)) {
        const metadataValue = metadata[key as keyof ConversationMetadata]

        if (!metadataValue) {
          return false
        }

        // Handle string comparison
        if (typeof filterValue === 'string' && typeof metadataValue === 'string') {
          if (metadataValue.toLowerCase() !== filterValue.toLowerCase()) {
            return false
          }
        }
        // Handle array comparison
        else if (Array.isArray(filterValue) && Array.isArray(metadataValue)) {
          if (!filterValue.some(v => metadataValue.includes(v))) {
            return false
          }
        }
        // Handle other types
        else if (metadataValue !== filterValue) {
          return false
        }
      }

      return true
    })
  }, [filters])

  const filteredConversations = useCallback((conversations: Conversation[]): Conversation[] => {
    return applyFilters(conversations)
  }, [applyFilters])

  const hasActiveFilters = useMemo(() => Object.keys(filters).length > 0, [filters])

  return {
    filters,
    updateFilters,
    clearFilters,
    applyFilters: filteredConversations,
    hasActiveFilters,
  }
}

