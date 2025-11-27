/**
 * useUploadedFiles Hook
 * Manages uploaded files state and operations
 */

import { useState, useCallback } from 'react'
import { uploadService } from '../services/uploadService'
import type { UploadedFile, UploadProgress } from '../types'
import { logger } from '../services/logger'

interface UseUploadedFilesReturn {
  files: UploadedFile[]
  isLoading: boolean
  error: string | null
  uploadProgress: UploadProgress | null
  loadFiles: (userId: string) => Promise<void>
  uploadFile: (file: File, userId: string, fileType: 'audio' | 'document', tags: string[]) => Promise<UploadedFile | null>
  updateFileTags: (fileId: string, tags: string[]) => Promise<void>
  deleteFile: (fileId: string, storagePath: string) => Promise<void>
  clearError: () => void
}

export const useUploadedFiles = (): UseUploadedFilesReturn => {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)

  const loadFiles = useCallback(async (userId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const userFiles = await uploadService.getUserFiles(userId)
      setFiles(userFiles)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load files'
      setError(errorMessage)
      logger.error('Error loading files', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const uploadFile = useCallback(
    async (file: File, userId: string, fileType: 'audio' | 'document', tags: string[]) => {
      try {
        setError(null)
        const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        setUploadProgress({
          fileId,
          filename: file.name,
          progress: 0,
          status: 'uploading',
        })

        const uploadedFile = await uploadService.uploadFile(file, userId, fileType, tags)

        setUploadProgress({
          fileId,
          filename: file.name,
          progress: 100,
          status: 'completed',
        })

        setFiles((prev) => [uploadedFile, ...prev])
        setTimeout(() => setUploadProgress(null), 2000)

        return uploadedFile
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Upload failed'
        setError(errorMessage)
        setUploadProgress((prev) =>
          prev ? { ...prev, status: 'error', error: errorMessage } : null
        )
        logger.error('Error uploading file', err)
        return null
      }
    },
    []
  )

  const updateFileTags = useCallback(async (fileId: string, tags: string[]) => {
    try {
      setError(null)
      await uploadService.updateFileTags(fileId, tags)
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, tags } : f))
      )
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update tags'
      setError(errorMessage)
      logger.error('Error updating tags', err)
    }
  }, [])

  const deleteFile = useCallback(async (fileId: string, storagePath: string) => {
    try {
      setError(null)
      await uploadService.deleteFile(fileId, storagePath)
      setFiles((prev) => prev.filter((f) => f.id !== fileId))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete file'
      setError(errorMessage)
      logger.error('Error deleting file', err)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    files,
    isLoading,
    error,
    uploadProgress,
    loadFiles,
    uploadFile,
    updateFileTags,
    deleteFile,
    clearError,
  }
}

