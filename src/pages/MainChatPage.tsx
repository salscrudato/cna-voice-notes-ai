import React, { useEffect, useCallback } from 'react'
import { chatService } from '../services/chatService'
import { logger } from '../services/logger'
import { useChatState } from '../hooks/useChatState'
import { useChatOperations } from '../hooks/useChatOperations'
import { ChatSidebar } from '../components/ChatSidebar'
import { ChatHeader } from '../components/ChatHeader'
import { ChatMessages } from '../components/ChatMessages'
import { ChatInput } from '../components/ChatInput'
import { ApiErrorBanner } from '../components/ApiErrorBanner'

const MainChatPage: React.FC = () => {
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
    handleNewConversation,
    handleSelectConversation,
    initializeChat,
  } = useChatOperations({
    setConversations,
    setCurrentConversationId,
    setMessages,
    setIsApiKeyMissing,
    setApiError,
  })

  // Load conversations on mount
  useEffect(() => {
    initializeChat()
  }, [initializeChat])

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId)
    }
  }, [currentConversationId, loadMessages])

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) {
      return
    }

    // Check if API key is configured
    if (isApiKeyMissing) {
      alert('❌ OpenAI API key is not configured.\n\n1. Copy .env.example to .env.local\n2. Add your API key from https://platform.openai.com/api-keys\n3. Restart the dev server')
      return
    }

    const userMessage = inputValue
    logger.info('Sending message', { length: userMessage.length })
    resetInput()

    // Create conversation if it doesn't exist
    let convId = currentConversationId
    if (!convId) {
      try {
        const title = `Chat ${new Date().toLocaleDateString()}`
        logger.info('Creating new conversation', { title })
        convId = await chatService.createConversation(title)
        logger.info('Conversation created', { id: convId })
        setCurrentConversationId(convId)
        await loadConversations()
      } catch (error) {
        logger.error('Failed to create conversation', error)
        alert('Failed to create conversation')
        return
      }
    }

    setIsLoading(true)

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setIsLoading(false)
      logger.warn('Request timed out after 30 seconds')
      alert('Request timed out. Please check your API key and try again.')
    }, 30000) // 30 second timeout

    try {
      logger.info('Sending message to API')
      const assistantResponse = await chatService.sendMessage(convId, userMessage)
      clearTimeout(timeoutId)
      logger.info('API response received', { length: assistantResponse.length })
      clearError()

      // Reload messages from Firestore to get the persisted versions
      logger.debug('Reloading messages from Firestore')
      await loadMessages(convId)
      logger.info('Messages reloaded successfully')
    } catch (error) {
      clearTimeout(timeoutId)
      logger.error('Failed to send message', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to send message'
      setApiError(errorMsg)

      // Show detailed error info
      if (errorMsg.includes('API key')) {
        alert('API Key Error: ' + errorMsg + '\n\nPlease check your VITE_OPENAI_API_KEY environment variable.')
      } else if (errorMsg.includes('401')) {
        alert('Authentication Error: Invalid API key')
      } else if (errorMsg.includes('429')) {
        alert('Rate Limited: Too many requests. Please wait a moment and try again.')
      } else {
        alert(`Error: ${errorMsg}`)
      }
    } finally {
      setIsLoading(false)
    }
  }, [inputValue, currentConversationId, loadConversations, loadMessages, isApiKeyMissing, resetInput, clearError, setCurrentConversationId, setIsLoading, setApiError])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  return (
    <div className="flex h-screen bg-white">
      <ChatSidebar
        isOpen={sidebarOpen}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
      />

      <div className="flex-1 flex flex-col">
        <ChatHeader sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
        <ApiErrorBanner error={apiError} />
        <ChatMessages messages={messages} isLoading={isLoading} />
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onKeyPress={handleKeyPress}
          onSend={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export { MainChatPage }

