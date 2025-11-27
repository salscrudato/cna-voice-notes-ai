import { useState, useCallback } from 'react'
import type { ConversationMetadata } from '../types'
import { chatService } from '../services/chatService'
import { logger } from '../services/logger'

interface UseMetadataProps {
  conversationId: string | null
  initialMetadata?: ConversationMetadata
}

/**
 * Custom hook to manage conversation metadata
 * Handles metadata state, updates, and persistence
 */
export const useMetadata = ({ conversationId, initialMetadata }: UseMetadataProps) => {
  const [metadata, setMetadata] = useState<ConversationMetadata>(initialMetadata || {})
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)

  const updateMetadata = useCallback(
    async (updates: Partial<ConversationMetadata>) => {
      if (!conversationId) {
        logger.warn('updateMetadata called without conversationId')
        return
      }

      setIsUpdating(true)
      setUpdateError(null)

      try {
        const newMetadata = { ...metadata, ...updates }
        setMetadata(newMetadata)

        // Persist to Firestore
        await chatService.updateConversationMetadata(conversationId, newMetadata)
        logger.info('Metadata updated successfully', { conversationId })
      } catch (error) {
        logger.error('Failed to update metadata', error)
        const errorMsg = error instanceof Error ? error.message : 'Failed to update metadata'
        setUpdateError(errorMsg)
        // Revert on error
        setMetadata(metadata)
      } finally {
        setIsUpdating(false)
      }
    },
    [conversationId, metadata]
  )

  const updateField = useCallback(
    async (field: keyof ConversationMetadata, value: string | string[] | undefined) => {
      await updateMetadata({ [field]: value })
    },
    [updateMetadata]
  )

  const addTag = useCallback(
    async (tag: string) => {
      const currentTags = metadata.tags || []
      if (!currentTags.includes(tag)) {
        await updateMetadata({ tags: [...currentTags, tag] })
      }
    },
    [metadata, updateMetadata]
  )

  const removeTag = useCallback(
    async (tag: string) => {
      const currentTags = metadata.tags || []
      await updateMetadata({ tags: currentTags.filter(t => t !== tag) })
    },
    [metadata, updateMetadata]
  )

  const clearMetadata = useCallback(() => {
    setMetadata({})
    setUpdateError(null)
  }, [])

  return {
    metadata,
    isUpdating,
    updateError,
    updateMetadata,
    updateField,
    addTag,
    removeTag,
    clearMetadata,
  }
}

