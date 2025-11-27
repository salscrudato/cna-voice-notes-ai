/**
 * useChatWithUploads Hook
 * Integrates uploaded files as context for chat messages
 */

import { useCallback, useMemo } from 'react'
import type { UploadedFile, ChatMessageInput } from '../types'
import { createUploadedFilesContext } from '../utils/fileExtraction'
import { logger } from '../services/logger'

interface UseChatWithUploadsReturn {
  enhanceMessageWithContext: (message: string, uploadedFiles: UploadedFile[]) => string
  createContextualMessages: (messages: ChatMessageInput[], uploadedFiles: UploadedFile[]) => ChatMessageInput[]
  getUploadedFilesContext: (uploadedFiles: UploadedFile[]) => string
}

export const useChatWithUploads = (): UseChatWithUploadsReturn => {
  /**
   * Enhance a user message with uploaded file context
   */
  const enhanceMessageWithContext = useCallback(
    (message: string, uploadedFiles: UploadedFile[]): string => {
      if (uploadedFiles.length === 0) {
        return message
      }

      const filesContext = createUploadedFilesContext(
        uploadedFiles.map((file) => ({
          originalName: file.originalName,
          fileType: file.fileType,
          extractedText: file.extractedText || file.transcription,
          tags: file.tags,
        }))
      )

      logger.debug('Enhanced message with uploaded files context', {
        fileCount: uploadedFiles.length,
        contextLength: filesContext.length,
      })

      return `${message}${filesContext}`
    },
    []
  )

  /**
   * Get context string from uploaded files
   */
  const getUploadedFilesContext = useCallback((uploadedFiles: UploadedFile[]): string => {
    if (uploadedFiles.length === 0) {
      return ''
    }

    return createUploadedFilesContext(
      uploadedFiles.map((file) => ({
        originalName: file.originalName,
        fileType: file.fileType,
        extractedText: file.extractedText || file.transcription,
        tags: file.tags,
      }))
    )
  }, [])

  /**
   * Create contextual messages by enhancing the last user message with file context
   */
  const createContextualMessages = useCallback(
    (messages: ChatMessageInput[], uploadedFiles: UploadedFile[]): ChatMessageInput[] => {
      if (uploadedFiles.length === 0 || messages.length === 0) {
        return messages
      }

      // Find the last user message
      const lastUserMessageIndex = messages.findIndex((msg, idx) => msg.role === 'user' && idx === messages.length - 1)

      if (lastUserMessageIndex === -1) {
        return messages
      }

      // Create a copy and enhance the last user message
      const enhancedMessages = [...messages]
      const lastMessage = enhancedMessages[lastUserMessageIndex]

      enhancedMessages[lastUserMessageIndex] = {
        ...lastMessage,
        content: enhanceMessageWithContext(lastMessage.content, uploadedFiles),
      }

      return enhancedMessages
    },
    [enhanceMessageWithContext]
  )

  return useMemo(
    () => ({
      enhanceMessageWithContext,
      createContextualMessages,
      getUploadedFilesContext,
    }),
    [enhanceMessageWithContext, createContextualMessages, getUploadedFilesContext]
  )
}

