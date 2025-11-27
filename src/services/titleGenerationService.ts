import OpenAI from 'openai'
import { logger } from './logger'

/**
 * Lightweight title generation service
 * Uses a fast, cost-effective API call to generate 3-word chat titles
 */
class TitleGenerationService {
  private client: OpenAI

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    })
  }

  /**
   * Generate a 3-word title for a conversation based on the first user message
   * Uses a lightweight prompt to minimize tokens and cost
   */
  async generateTitle(userMessage: string): Promise<string> {
    try {
      if (!userMessage || userMessage.trim().length === 0) {
        logger.warn('Empty user message provided for title generation')
        return 'New Conversation'
      }

      if (!this.client.apiKey) {
        logger.warn('API key not available for title generation')
        return this.generateFallbackTitle(userMessage)
      }

      // Truncate message to first 200 chars to minimize tokens
      const truncatedMessage = userMessage.substring(0, 200).trim()

      logger.debug('Generating title from message', { messageLength: truncatedMessage.length })

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo', // Use faster, cheaper model for title generation
        messages: [
          {
            role: 'system',
            content: 'Generate exactly 3 words as a concise title for a chat conversation. Only output the 3 words, nothing else. No punctuation.',
          },
          {
            role: 'user',
            content: truncatedMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 20, // Very small token limit for titles
      })

      const title = response.choices[0]?.message?.content?.trim()

      if (!title || title.length === 0) {
        logger.warn('Empty title response from API, using fallback')
        return this.generateFallbackTitle(userMessage)
      }

      logger.debug('Generated chat title successfully', { title, messageLength: userMessage.length })
      return title
    } catch (error) {
      logger.error('Error generating title from API', error)
      const fallbackTitle = this.generateFallbackTitle(userMessage)
      logger.debug('Using fallback title', { fallbackTitle })
      return fallbackTitle
    }
  }

  /**
   * Generate a fallback title from the user message if API call fails
   */
  private generateFallbackTitle(userMessage: string): string {
    // Extract first 3 words from the message
    const words = userMessage
      .split(/\s+/)
      .filter(word => word.length > 0)
      .slice(0, 3)
      .map(word => word.replace(/[^a-zA-Z0-9]/g, ''))
      .filter(word => word.length > 0)

    if (words.length === 0) {
      return 'New Conversation'
    }

    if (words.length < 3) {
      return words.join(' ')
    }

    return words.join(' ')
  }
}

// Initialize with API key from config
let titleService: TitleGenerationService | null = null

export function initializeTitleService(apiKey: string): TitleGenerationService {
  if (!titleService) {
    titleService = new TitleGenerationService(apiKey)
  }
  return titleService
}

export function getTitleService(): TitleGenerationService | null {
  return titleService
}

