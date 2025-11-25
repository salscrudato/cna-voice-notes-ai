import React, { useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { chatService } from '../services/chatService'
import { logger } from '../services/logger'
import { getApiKeyErrorMessage } from '../services/config'
import { useChatState } from '../hooks/useChatState'
import { useChatOperations } from '../hooks/useChatOperations'
import { useToast } from '../hooks/useToast'
import { ChatSidebar } from '../components/ChatSidebar'
import { ChatHeader } from '../components/ChatHeader'
import { ChatMessages } from '../components/ChatMessages'
import { ChatInput } from '../components/ChatInput'
import { ApiErrorBanner } from '../components/ApiErrorBanner'
import { API } from '../constants'
import type { ChatMessage } from '../types'

const MainChatPage: React.FC = () => {
  const location = useLocation()
  const { showToast } = useToast()

  const {
    conversations,
    currentConversationId,
    messages,
    inputValue,
    isLoading,
    sidebarOpen,
    apiError,
    isApiKeyMissing,
    setConversations,
    setCurrentConversationId,
    setMessages,
    setInputValue,
    setIsLoading,
    setApiError,
    setIsApiKeyMissing,
    resetInput,
    clearError,
    toggleSidebar,
  } = useChatState()

  const {
    loadConversations,
    loadMessages,
    handleSelectConversation,
    initializeChat,
  } = useChatOperations({
    setConversations,
    setCurrentConversationId,
    setMessages,
    setIsApiKeyMissing,
    setApiError,
  })

  // Handle new conversation creation
  const handleNewConversation = useCallback(async () => {
    try {
      const title = `Chat ${new Date().toLocaleDateString()}`
      logger.info('Creating new conversation', { title })
      const conversationId = await chatService.createConversation(title)
      setCurrentConversationId(conversationId)
      setMessages([])
      await loadConversations()
      logger.info('New conversation created successfully', { conversationId })
      showToast('New conversation created', 'success', 2000)
    } catch (error) {
      logger.error('Failed to create conversation', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to create conversation'
      setApiError(`Error creating conversation: ${errorMsg}`)
      showToast(errorMsg, 'error', 4000)
    }
  }, [setCurrentConversationId, setMessages, loadConversations, setApiError, showToast])



  // Load conversations on mount and handle navigation state
  useEffect(() => {
    initializeChat()

    // Handle navigation state: conversationId
    const navigationState = location.state as { conversationId?: string } | null

    if (navigationState?.conversationId) {
      setCurrentConversationId(navigationState.conversationId)
      logger.debug('Loaded conversation from navigation state', { conversationId: navigationState.conversationId })
    }
  }, [initializeChat, location.state, setCurrentConversationId])

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId)
    }
  }, [currentConversationId, loadMessages])

  const handleSendMessage = useCallback(async () => {
    const trimmedMessage = inputValue.trim()

    // Validate input
    if (!trimmedMessage) {
      return
    }

    if (trimmedMessage.length > 4000) {
      setApiError('Message is too long. Maximum 4000 characters allowed.')
      return
    }

    // Check if API key is configured
    if (isApiKeyMissing) {
      setApiError(getApiKeyErrorMessage())
      return
    }

    const userMessage = trimmedMessage
    logger.info('Sending message', { length: userMessage.length })
    resetInput()

    // Create conversation if it doesn't exist
    let convId = currentConversationId
    if (!convId) {
      try {
        // Generate title from first message (first 50 chars or first sentence)
        const title = userMessage.split(/[.!?]/)[0].substring(0, 50).trim() || 'New Chat'
        logger.info('Creating new conversation', { title })
        convId = await chatService.createConversation(title)
        logger.info('Conversation created', { id: convId })
        setCurrentConversationId(convId)
        await loadConversations()
      } catch (error) {
        logger.error('Failed to create conversation', error)
        const errorMsg = error instanceof Error ? error.message : 'Failed to create conversation'
        setApiError(`Failed to create conversation: ${errorMsg}`)
        return
      }
    }

    setIsLoading(true)
    clearError()

    // Optimistically add user message to UI
    const optimisticUserMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      conversationId: convId,
      role: 'user',
      content: userMessage,
      createdAt: new Date(),
    }
    setMessages(prev => [...prev, optimisticUserMessage])

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setIsLoading(false)
      logger.warn('Request timed out', { timeoutMs: API.REQUEST_TIMEOUT_MS })
      setApiError('Request timed out. Please check your connection and try again.')
    }, API.REQUEST_TIMEOUT_MS)

    try {
      logger.info('Sending message to API')

      const assistantResponse = await chatService.sendMessage(convId, userMessage)
      clearTimeout(timeoutId)

      if (!assistantResponse || assistantResponse.trim().length === 0) {
        throw new Error('Received empty response from AI')
      }

      logger.info('API response received', { length: assistantResponse.length })
      clearError()
      showToast('Message sent successfully', 'success', 2000)

      // Reload messages from Firestore to get the persisted versions with real IDs
      logger.debug('Reloading messages from Firestore')
      await loadMessages(convId)
      logger.info('Messages reloaded successfully')
    } catch (error) {
      clearTimeout(timeoutId)
      logger.error('Failed to send message', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to send message'
      setApiError(`Error: ${errorMsg}`)
      showToast(errorMsg, 'error', 4000)
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticUserMessage.id))
    } finally {
      setIsLoading(false)
    }
  }, [inputValue, currentConversationId, loadConversations, loadMessages, isApiKeyMissing, resetInput, clearError, setCurrentConversationId, setIsLoading, setApiError, setMessages, showToast])

  const handleDeleteConversation = useCallback(async (conversationId: string) => {
    try {
      logger.info('Deleting conversation', { conversationId })
      await chatService.deleteConversation(conversationId)

      // If the deleted conversation was active, clear it
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null)
        setMessages([])
      }

      // Reload conversations
      await loadConversations()
      logger.info('Conversation deleted successfully')
      showToast('Conversation deleted', 'success', 2000)
    } catch (error) {
      logger.error('Failed to delete conversation', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete conversation'
      setApiError(`Failed to delete conversation: ${errorMsg}`)
      showToast(errorMsg, 'error', 4000)
    }
  }, [currentConversationId, setCurrentConversationId, setMessages, loadConversations, setApiError, showToast])

  const handleRenameConversation = useCallback(async (conversationId: string, newTitle: string) => {
    const trimmedTitle = newTitle.trim()

    if (!trimmedTitle || trimmedTitle.length === 0) {
      setApiError('Conversation title cannot be empty')
      return
    }

    if (trimmedTitle.length > 100) {
      setApiError('Conversation title must be 100 characters or less')
      return
    }

    try {
      logger.info('Renaming conversation', { conversationId, newTitle: trimmedTitle })
      await chatService.updateConversationTitle(conversationId, trimmedTitle)

      // Reload conversations to reflect the change
      await loadConversations()
      logger.info('Conversation renamed successfully')
      clearError()
    } catch (error) {
      logger.error('Failed to rename conversation', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to rename conversation'
      setApiError(`Failed to rename conversation: ${errorMsg}`)
    }
  }, [loadConversations, setApiError, clearError])

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950">
      <ChatSidebar
        isOpen={sidebarOpen}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
      />

      <div id="main-content" className="flex-1 flex flex-col bg-white dark:bg-slate-950" tabIndex={-1}>
        <ChatHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={toggleSidebar}
          currentConversationTitle={conversations.find(c => c.id === currentConversationId)?.title}
        />
        <ApiErrorBanner error={apiError} onDismiss={clearError} />

        {/* Chat container */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatMessages messages={messages} isLoading={isLoading} />
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}

export { MainChatPage }

