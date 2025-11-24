import { useCallback } from 'react'
import { chatService } from '../services/chatService'
import { logger } from '../services/logger'
import { isOpenAIConfigured, getApiKeyErrorMessage } from '../services/config'
import type { Conversation, ChatMessage } from '../types'

interface UseChatOperationsProps {
  setConversations: (convs: Conversation[]) => void
  setCurrentConversationId: (id: string | null) => void
  setMessages: (msgs: ChatMessage[]) => void
  setIsApiKeyMissing: (missing: boolean) => void
  setApiError: (error: string | undefined) => void
}

export const useChatOperations = ({
  setConversations,
  setCurrentConversationId,
  setMessages,
  setIsApiKeyMissing,
  setApiError,
}: UseChatOperationsProps) => {
  const loadConversations = useCallback(async () => {
    try {
      const convs = await chatService.getAllConversations()
      setConversations(convs)
    } catch (error) {
      logger.error('Failed to load conversations', error)
    }
  }, [setConversations])

  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      logger.debug('Loading messages for conversation', { conversationId })
      const msgs = await chatService.getConversationMessages(conversationId)
      logger.debug('Messages loaded', { count: msgs.length })
      setMessages(msgs)
    } catch (error) {
      logger.error('Failed to load messages', error)
    }
  }, [setMessages])

  const handleNewConversation = useCallback(async () => {
    try {
      const title = `Chat ${new Date().toLocaleDateString()}`
      const conversationId = await chatService.createConversation(title)
      setCurrentConversationId(conversationId)
      setMessages([])
      await loadConversations()
    } catch (error) {
      logger.error('Failed to create conversation', error)
    }
  }, [loadConversations, setCurrentConversationId, setMessages])

  const handleSelectConversation = useCallback((conversationId: string) => {
    setCurrentConversationId(conversationId)
  }, [setCurrentConversationId])

  const initializeChat = useCallback(async () => {
    try {
      // Check if OpenAI API key is configured
      if (!isOpenAIConfigured()) {
        logger.warn('OpenAI API key is not configured')
        setIsApiKeyMissing(true)
        setApiError(getApiKeyErrorMessage())
      }

      const convs = await chatService.getAllConversations()
      setConversations(convs)

      if (convs.length === 0) {
        const title = `Chat ${new Date().toLocaleDateString()}`
        const conversationId = await chatService.createConversation(title)
        setCurrentConversationId(conversationId)
        setMessages([])
      }
    } catch (error) {
      logger.error('Failed to initialize chat', error)
    }
  }, [setConversations, setCurrentConversationId, setMessages, setIsApiKeyMissing, setApiError])

  return {
    loadConversations,
    loadMessages,
    handleNewConversation,
    handleSelectConversation,
    initializeChat,
  }
}

