/**
 * Utility functions for generating conversation titles
 */

/**
 * Generate a concise title from the first user message
 * Uses the first sentence or first ~60 characters
 * @param message - The first user message
 * @returns A concise title
 */
export function generateTitleFromMessage(message: string): string {
  if (!message || message.trim().length === 0) {
    return `Chat ${new Date().toLocaleDateString()}`
  }

  // Remove extra whitespace
  const cleaned = message.trim()

  // Try to find the first sentence (ends with . ! or ?)
  const sentenceMatch = cleaned.match(/^[^.!?]*[.!?]/)
  if (sentenceMatch) {
    const sentence = sentenceMatch[0].trim()
    if (sentence.length <= 100) {
      return sentence
    }
  }

  // Fall back to first ~60 characters
  const truncated = cleaned.substring(0, 60).trim()
  if (truncated.length < cleaned.length) {
    return truncated + '...'
  }

  return truncated
}

/**
 * Generate a default title with current date
 * @returns A default title
 */
export function generateDefaultTitle(): string {
  return `Chat ${new Date().toLocaleDateString()}`
}

