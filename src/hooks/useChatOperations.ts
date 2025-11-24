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
      logger.debug('Conversations loaded successfully', { count: convs.length })
    } catch (error) {
      logger.error('Failed to load conversations', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to load conversations'
      setApiError(`Error loading conversations: ${errorMsg}`)
    }
  }, [setConversations, setApiError])

  const loadMessages = useCallback(async (conversationId: string) => {
    if (!conversationId) {
      logger.warn('loadMessages called with empty conversationId')
      return
    }

    try {
      logger.debug('Loading messages for conversation', { conversationId })
      const msgs = await chatService.getConversationMessages(conversationId)
      logger.debug('Messages loaded', { count: msgs.length })
      setMessages(msgs)
    } catch (error) {
      logger.error('Failed to load messages', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to load messages'
      setApiError(`Error loading messages: ${errorMsg}`)
    }
  }, [setMessages, setApiError])

  const handleNewConversation = useCallback(async () => {
    try {
      const title = `Chat ${new Date().toLocaleDateString()}`
      logger.info('Creating new conversation', { title })
      const conversationId = await chatService.createConversation(title)
      setCurrentConversationId(conversationId)
      setMessages([])
      await loadConversations()
      logger.info('New conversation created successfully', { conversationId })
    } catch (error) {
      logger.error('Failed to create conversation', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to create conversation'
      setApiError(`Error creating conversation: ${errorMsg}`)
    }
  }, [loadConversations, setCurrentConversationId, setMessages, setApiError])

  const handleSelectConversation = useCallback((conversationId: string) => {
    setCurrentConversationId(conversationId)
  }, [setCurrentConversationId])

  const initializeChat = useCallback(async () => {
    try {
      logger.info('Initializing chat')

      // Check if OpenAI API key is configured
      if (!isOpenAIConfigured()) {
        logger.warn('OpenAI API key is not configured')
        setIsApiKeyMissing(true)
        setApiError(getApiKeyErrorMessage())
        return
      }

      const convs = await chatService.getAllConversations()
      setConversations(convs)
      logger.debug('Chat initialized', { conversationCount: convs.length })

      // Create initial conversation if none exist
      if (convs.length === 0) {
        const title = `Chat ${new Date().toLocaleDateString()}`
        logger.info('Creating initial conversation', { title })
        const conversationId = await chatService.createConversation(title)
        setCurrentConversationId(conversationId)
        setMessages([])
        logger.info('Initial conversation created', { conversationId })
      }
    } catch (error) {
      logger.error('Failed to initialize chat', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to initialize chat'
      setApiError(`Error initializing chat: ${errorMsg}`)
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

