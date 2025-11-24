/**
 * Hook for managing voice notes with real-time updates
 * Provides filtering and search capabilities
 */

import { useState, useEffect, useCallback } from 'react'
import { voiceNoteService } from '../services/voiceNoteService'
import { logger } from '../services/logger'
import type { VoiceNote, VoiceNoteStatus } from '../types'

export interface UseVoiceNotesOptions {
  statusFilter?: VoiceNoteStatus | 'all'
  searchTerm?: string
}

export interface UseVoiceNotesResult {
  voiceNotes: VoiceNote[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Hook to fetch and manage voice notes
 * @param options - Optional filtering and search options
 * @returns Voice notes data, loading state, error, and refetch function
 */
export function useVoiceNotes(options?: UseVoiceNotesOptions): UseVoiceNotesResult {
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchVoiceNotes = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const notes = await voiceNoteService.getAllVoiceNotes()

      // Apply filters
      let filtered = notes

      if (options?.statusFilter && options.statusFilter !== 'all') {
        filtered = filtered.filter(note => note.status === options.statusFilter)
      }

      if (options?.searchTerm) {
        const term = options.searchTerm.toLowerCase()
        filtered = filtered.filter(note =>
          note.fileName.toLowerCase().includes(term) ||
          note.transcriptSummary?.toLowerCase().includes(term)
        )
      }

      // Sort by updatedAt descending
      filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

      setVoiceNotes(filtered)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      logger.error('Error fetching voice notes', error)
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }, [options?.statusFilter, options?.searchTerm])

  useEffect(() => {
    fetchVoiceNotes()
  }, [fetchVoiceNotes])

  return {
    voiceNotes,
    isLoading,
    error,
    refetch: fetchVoiceNotes,
  }
}

