import { logger } from './logger'

/**
 * Service for generating concise 3-word titles from chat responses
 * Uses heuristic-based title generation for fast, reliable, and secure title creation
 * No external API calls or dangerouslyAllowBrowser usage
 *
 * SECURITY: This service no longer uses OpenAI directly. All title generation is client-side heuristic-based.
 */
class TitleGenerationService {
  /**
   * Generate a 3-word title from a user message and AI response
   * Uses heuristic-based extraction for speed and reliability
   * @param userMessage - The user's question/message
   * @param aiResponse - The AI's response
   * @returns A 3-word title or fallback title
   */
  async generateTitle(userMessage: string, aiResponse: string): Promise<string> {
    try {
      logger.debug('Generating title from user message and AI response')

      // Try to extract meaningful title from the exchange
      const title = this.extractTitleFromExchange(userMessage, aiResponse)

      if (title && title.length > 0) {
        logger.info('Title generated successfully', { title })
        return title
      }

      // Fallback to user message-based title
      logger.debug('Using fallback title from user message')
      return this.generateFallbackTitle(userMessage)
    } catch (error) {
      logger.error('Error generating title', error)
      return this.generateFallbackTitle(userMessage)
    }
  }

  /**
   * Extract a meaningful title from the user message and AI response
   * Uses heuristic-based extraction of key phrases
   */
  private extractTitleFromExchange(userMessage: string, aiResponse: string): string {
    // Prefer extracting from user message (more direct intent)
    const userTitle = this.extractKeyPhrasesFromText(userMessage)
    if (userTitle && userTitle.length > 0) {
      return userTitle
    }

    // Fallback to AI response
    const aiTitle = this.extractKeyPhrasesFromText(aiResponse)
    if (aiTitle && aiTitle.length > 0) {
      return aiTitle
    }

    return ''
  }

  /**
   * Extract key phrases from text to form a title
   * Prioritizes first sentence and important keywords
   */
  private extractKeyPhrasesFromText(text: string): string {
    if (!text || text.length === 0) {
      return ''
    }

    // Get first sentence (up to first period, question mark, or exclamation)
    const firstSentenceMatch = text.match(/^[^.!?]*[.!?]?/)
    const firstSentence = firstSentenceMatch ? firstSentenceMatch[0].trim() : text

    // Extract words, filtering out common stop words
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'can', 'could', 'will', 'would', 'should', 'may', 'might', 'must', 'shall', 'this', 'that',
      'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'when',
      'where', 'why', 'how', 'as', 'if', 'from', 'up', 'about', 'out', 'into', 'through', 'during',
    ])

    const words = firstSentence
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .slice(0, 3) // Take first 3 meaningful words

    if (words.length === 0) {
      return ''
    }

    // Capitalize each word
    const title = words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    // Ensure we have exactly 3 words
    return this.ensureThreeWords(title)
  }

  /**
   * Ensure title has exactly 3 words
   * Pads with generic words if needed
   */
  private ensureThreeWords(title: string): string {
    const words = title.split(/\s+/).filter(w => w.length > 0)

    if (words.length >= 3) {
      return words.slice(0, 3).join(' ')
    }

    // Pad with generic words if less than 3
    const genericWords = ['Chat', 'Discussion', 'Query']
    while (words.length < 3) {
      words.push(genericWords[words.length % genericWords.length])
    }

    return words.slice(0, 3).join(' ')
  }

  /**
   * Generate a fallback title from the user message
   * Used when extraction fails
   */
  private generateFallbackTitle(userMessage: string): string {
    if (!userMessage || userMessage.length === 0) {
      return 'Chat Discussion Query'
    }

    const cleaned = userMessage.trim()

    // Extract first 3 words, removing punctuation
    const words = cleaned
      .replace(/[^a-z0-9\s]/gi, '')
      .split(/\s+/)
      .filter(w => w.length > 0)
      .slice(0, 3)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())

    if (words.length >= 3) {
      return words.join(' ')
    }

    // Pad with generic words if needed
    const genericWords = ['Chat', 'Discussion', 'Query']
    while (words.length < 3) {
      words.push(genericWords[words.length % genericWords.length])
    }

    return words.slice(0, 3).join(' ')
  }
}

export const titleGenerationService = new TitleGenerationService()

