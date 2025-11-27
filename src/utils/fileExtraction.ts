/**
 * File Extraction Utilities
 * Handles extraction of text and metadata from uploaded files
 */

import { logger } from '../services/logger'

/**
 * Extract text from a Word document (.docx)
 * Note: This is a simplified implementation that reads the file as text
 * For production, consider using a library like mammoth.js
 */
export async function extractTextFromDocument(file: File): Promise<string> {
  try {
    // For now, return a placeholder
    // In production, you would use a library like mammoth.js to properly extract text from .docx files
    logger.debug('Document extraction requested', { filename: file.name })
    return `[Document: ${file.name}]\n\nNote: Full text extraction requires additional processing.`
  } catch (error) {
    logger.error('Error extracting text from document', error)
    throw error
  }
}

/**
 * Extract metadata from an audio file
 * Returns duration and other audio metadata
 */
export async function extractAudioMetadata(file: File): Promise<{ duration?: number }> {
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio()
      const url = URL.createObjectURL(file)

      audio.addEventListener('loadedmetadata', () => {
        URL.revokeObjectURL(url)
        resolve({ duration: audio.duration })
      })

      audio.addEventListener('error', () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load audio metadata'))
      })

      audio.src = url
    } catch (error) {
      logger.error('Error extracting audio metadata', error)
      reject(error)
    }
  })
}

/**
 * Format uploaded file content for chat context
 */
export function formatFileForContext(
  filename: string,
  fileType: 'audio' | 'document',
  content?: string,
  tags?: string[]
): string {
  const tagString = tags && tags.length > 0 ? `\nTags: ${tags.join(', ')}` : ''

  if (fileType === 'audio') {
    return `[Audio File: ${filename}]${tagString}\n${content || 'Audio content available for analysis.'}`
  } else {
    return `[Document: ${filename}]${tagString}\n${content || 'Document content available for analysis.'}`
  }
}

/**
 * Create a context string from multiple uploaded files
 */
export function createUploadedFilesContext(files: Array<{
  originalName: string
  fileType: 'audio' | 'document'
  extractedText?: string
  tags?: string[]
}>): string {
  if (files.length === 0) return ''

  const fileContexts = files.map((file) =>
    formatFileForContext(file.originalName, file.fileType, file.extractedText, file.tags)
  )

  return `\n\n--- Uploaded Files Context ---\n${fileContexts.join('\n\n')}\n--- End of Uploaded Files ---\n`
}

