import { logger } from '../services/logger'
import type { StreamingOptions, ErrorDetails } from '../types'
import { createStreamingChunk } from './responseFormatter'

/**
 * Streaming Response Handler
 * Handles Server-Sent Events (SSE) and chunked streaming responses
 */

/**
 * Handle Server-Sent Events (SSE) streaming
 */
export async function handleSSEStream(
  response: Response,
  options: StreamingOptions = {}
): Promise<string> {
  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('Response body is not readable')
  }

  const decoder = new TextDecoder()
  let fullContent = ''
  let chunkCount = 0
  const maxChunks = options.maxChunks || 1000
  const timeout = options.timeout || 30000
  const startTime = Date.now()

  try {
    while (true) {
      if (Date.now() - startTime > timeout) {
        throw new Error('Streaming response timeout')
      }

      if (chunkCount >= maxChunks) {
        logger.warn('Max chunks reached', { maxChunks })
        break
      }

      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      fullContent += chunk
      chunkCount++

      // Parse SSE format (data: ...)
      const lines = chunk.split('\n')
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') {
            const streamChunk = createStreamingChunk(
              `chunk-${chunkCount}`,
              fullContent,
              true
            )
            options.onChunk?.(streamChunk)
            options.onComplete?.(fullContent)
            return fullContent
          }

          const streamChunk = createStreamingChunk(
            `chunk-${chunkCount}`,
            data,
            false
          )
          options.onChunk?.(streamChunk)
        }
      }
    }

    options.onComplete?.(fullContent)
    return fullContent
  } catch (error) {
    const errorDetails: ErrorDetails = {
      code: 'STREAMING_ERROR',
      message: error instanceof Error ? error.message : 'Unknown streaming error',
      category: 'network',
      retryable: true,
      originalError: error,
    }
    options.onError?.(errorDetails)
    throw error
  } finally {
    reader.cancel()
  }
}

/**
 * Handle chunked transfer encoding
 */
export async function handleChunkedResponse(
  response: Response,
  options: StreamingOptions = {}
): Promise<string> {
  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('Response body is not readable')
  }

  const decoder = new TextDecoder()
  let fullContent = ''
  let chunkCount = 0
  const maxChunks = options.maxChunks || 1000
  const timeout = options.timeout || 30000
  const startTime = Date.now()

  try {
    while (true) {
      if (Date.now() - startTime > timeout) {
        throw new Error('Chunked response timeout')
      }

      if (chunkCount >= maxChunks) {
        logger.warn('Max chunks reached', { maxChunks })
        break
      }

      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      fullContent += chunk
      chunkCount++

      const streamChunk = createStreamingChunk(
        `chunk-${chunkCount}`,
        chunk,
        false
      )
      options.onChunk?.(streamChunk)
    }

    const finalChunk = createStreamingChunk(
      `chunk-${chunkCount}`,
      fullContent,
      true
    )
    options.onChunk?.(finalChunk)
    options.onComplete?.(fullContent)
    return fullContent
  } catch (error) {
    const errorDetails: ErrorDetails = {
      code: 'CHUNKED_RESPONSE_ERROR',
      message: error instanceof Error ? error.message : 'Unknown chunked response error',
      category: 'network',
      retryable: true,
      originalError: error,
    }
    options.onError?.(errorDetails)
    throw error
  } finally {
    reader.cancel()
  }
}

/**
 * Detect streaming response type
 */
export function detectStreamingType(response: Response): 'sse' | 'chunked' | 'none' {
  const contentType = response.headers.get('content-type') || ''
  const transferEncoding = response.headers.get('transfer-encoding') || ''

  if (contentType.includes('text/event-stream')) {
    return 'sse'
  }

  if (transferEncoding.includes('chunked')) {
    return 'chunked'
  }

  return 'none'
}

