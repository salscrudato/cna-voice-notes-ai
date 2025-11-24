import OpenAI from 'openai'
import { logger } from './logger'
import { getChatProviderConfig } from './config'

/**
 * Service for generating concise 3-word titles from chat responses
 * Uses gpt-3.5-turbo for fast, cheap, high-quality title generation
 */
class TitleGenerationService {
  private client: OpenAI | null = null

  constructor() {
    const config = getChatProviderConfig()
    if (config.openaiApiKey) {
      this.client = new OpenAI({
        apiKey: config.openaiApiKey,
        dangerouslyAllowBrowser: true,
      })
    }
  }

  /**
   * Generate a 3-word title from a user message and AI response
   * Uses gpt-3.5-turbo for speed and cost efficiency
   * @param userMessage - The user's question/message
   * @param aiResponse - The AI's response
   * @returns A 3-word title or fallback title
   */
  async generateTitle(userMessage: string, aiResponse: string): Promise<string> {
    try {
      if (!this.client) {
        logger.warn('OpenAI client not initialized, using fallback title')
        return this.generateFallbackTitle(userMessage)
      }

      const prompt = `Generate a concise 3-word title for a chat conversation based on this exchange:

User: ${userMessage.substring(0, 200)}
AI: ${aiResponse.substring(0, 200)}

Requirements:
- Exactly 3 words
- Capitalized
- No punctuation
- Descriptive of the conversation topic
- Professional tone

Example: "Policy Coverage Analysis" or "Claims Processing Question"

Title:`

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 20,
      })

      const title = response.choices[0]?.message?.content?.trim()

      if (!title || title.length === 0) {
        logger.warn('Empty title response from API, using fallback')
        return this.generateFallbackTitle(userMessage)
      }

      // Validate and clean the title
      const cleanedTitle = this.validateAndCleanTitle(title)
      logger.info('Title generated successfully', { title: cleanedTitle })
      return cleanedTitle
    } catch (error) {
      logger.error('Error generating title with AI', error)
      return this.generateFallbackTitle(userMessage)
    }
  }

  /**
   * Validate and clean the generated title
   * Ensures it's exactly 3 words and properly formatted
   */
  private validateAndCleanTitle(title: string): string {
    // Remove extra whitespace and punctuation
    const cleaned = title.trim().replace(/[.,!?;:]/g, '')

    // Split into words
    const words = cleaned.split(/\s+/).filter(w => w.length > 0)

    // Take first 3 words
    const threeWords = words.slice(0, 3)

    // If less than 3 words, pad with generic words
    if (threeWords.length < 3) {
      threeWords.push('Chat', 'Discussion', 'Query')
      return threeWords.slice(0, 3).join(' ')
    }

    return threeWords.join(' ')
  }

  /**
   * Generate a fallback title from the user message
   * Used when AI title generation fails
   */
  private generateFallbackTitle(userMessage: string): string {
    const cleaned = userMessage.trim()

    // Extract first 3 words
    const words = cleaned.split(/\s+/).filter(w => w.length > 0)
    const threeWords = words.slice(0, 3)

    if (threeWords.length >= 3) {
      return threeWords.join(' ')
    }

    // If message is too short, add generic words
    while (threeWords.length < 3) {
      threeWords.push('Chat')
    }

    return threeWords.slice(0, 3).join(' ')
  }
}

export const titleGenerationService = new TitleGenerationService()

