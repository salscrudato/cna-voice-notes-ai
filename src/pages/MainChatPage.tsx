import React, { useEffect, useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { chatService } from '../services/chatService'
import { logger } from '../services/logger'
import { getApiKeyErrorMessage } from '../services/config'
import { initializeTitleService, getTitleService } from '../services/titleGenerationService'
import { useChatState } from '../hooks/useChatState'
import { useChatOperations } from '../hooks/useChatOperations'
import { useToast } from '../hooks/useToast'
import { useMetadata } from '../hooks/useMetadata'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'
import { ChatSidebar } from '../components/ChatSidebar'
import { ChatHeader } from '../components/ChatHeader'
import { ChatMessages } from '../components/ChatMessages'
import { ChatInput } from '../components/ChatInput'
import { ApiErrorBanner } from '../components/ApiErrorBanner'
import { ConversationDetailsPanel } from '../components/ConversationDetailsPanel'
import { API } from '../constants'
import type { ChatMessage } from '../types'

const MainChatPage: React.FC = () => {
  const location = useLocation()
  const { showToast } = useToast()
  const { accentColor } = useTheme()
  const [showDetailsPanel, setShowDetailsPanel] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [streamingStage, setStreamingStage] = useState<'thinking' | 'generating' | 'finalizing'>('thinking')

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

  const currentConversation = conversations.find(c => c.id === currentConversationId)
  const {
    metadata,
    isUpdating: isUpdatingMetadata,
    updateMetadata,
  } = useMetadata({
    conversationId: currentConversationId,
    initialMetadata: currentConversation?.metadata,
  })

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

  // Handle new conversation creation - direct without dialog
  const handleNewConversation = useCallback(async () => {
    try {
      const title = `New Conversation`
      logger.info('Creating new conversation')
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



  // Initialize title service on mount
  useEffect(() => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (apiKey) {
      try {
        initializeTitleService(apiKey)
        logger.debug('Title generation service initialized')
      } catch (error) {
        logger.warn('Failed to initialize title service', error)
      }
    }
  }, [])

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
        // Use temporary title initially
        const tempTitle = 'New Chat'
        logger.info('Creating new conversation', { title: tempTitle })
        convId = await chatService.createConversation(tempTitle)
        logger.info('Conversation created', { id: convId })
        setCurrentConversationId(convId)
        await loadConversations()

        // Generate AI title asynchronously in the background
        try {
          const titleService = getTitleService()
          if (titleService) {
            logger.debug('Generating AI title for conversation', { conversationId: convId })
            const aiTitle = await titleService.generateTitle(userMessage)
            if (aiTitle && aiTitle.trim().length > 0) {
              logger.info('Generated AI title', { title: aiTitle, conversationId: convId })
              await chatService.updateConversationTitle(convId, aiTitle)
              await loadConversations()
              logger.debug('Conversation title updated successfully', { conversationId: convId, title: aiTitle })
            } else {
              logger.warn('Generated title is empty, keeping default', { conversationId: convId })
            }
          } else {
            logger.warn('Title service not initialized', { conversationId: convId })
          }
        } catch (titleError) {
          logger.warn('Failed to generate AI title, keeping default', { conversationId: convId, error: titleError })
          // Continue with default title, don't fail the whole operation
        }
      } catch (error) {
        logger.error('Failed to create conversation', error)
        const errorMsg = error instanceof Error ? error.message : 'Failed to create conversation'
        setApiError(`Failed to create conversation: ${errorMsg}`)
        return
      }
    }

    setIsLoading(true)
    setStreamingContent('')
    setStreamingStage('thinking')
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
      setStreamingContent('')
      logger.warn('Request timed out', { timeoutMs: API.REQUEST_TIMEOUT_MS })
      setApiError('Request timed out. Please check your connection and try again.')
    }, API.REQUEST_TIMEOUT_MS)

    try {
      logger.info('Sending message to API with streaming')

      // Use streaming for better UX
      const assistantResponse = await chatService.sendMessageStream(
        convId,
        userMessage,
        (chunk: string) => {
          setStreamingContent(prev => {
            const newContent = prev + chunk
            // Update stage based on content length
            if (newContent.length < 50) {
              setStreamingStage('generating')
            } else if (newContent.length > 500) {
              setStreamingStage('finalizing')
            }
            return newContent
          })
        }
      )
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
      setStreamingContent('')
      setStreamingStage('thinking')
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
    <div className="flex h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <ChatSidebar
        isOpen={sidebarOpen}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
      />

	      <div id="main-content" className="flex-1 flex flex-col bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 transition-colors duration-300 relative overflow-hidden" tabIndex={-1}>
        {/* Subtle animated accent gradient background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5 dark:opacity-3 animate-blob"
          style={{
            background: `radial-gradient(circle at 20% 50%, ${getAccentColor(accentColor, '400')}, transparent 50%)`,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-5 dark:opacity-3 animate-blob"
          style={{
            background: `radial-gradient(circle at 80% 80%, ${getAccentColor(accentColor, '300')}, transparent 50%)`,
            animationDelay: '2s'
          }}
        />
        <div className="relative z-10">
          <ChatHeader
            sidebarOpen={sidebarOpen}
            onToggleSidebar={toggleSidebar}
            currentConversationTitle={currentConversation?.title}
            onNewConversation={handleNewConversation}
          />
          <ApiErrorBanner error={apiError} onDismiss={clearError} />
        </div>

        {/* Chat container */}
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            streamingContent={streamingContent}
            streamingStage={streamingStage}
            onFollowUpClick={setInputValue}
            onEditMetadata={() => setShowDetailsPanel(true)}
          />
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Backdrop overlay for right pane */}
      {showDetailsPanel && (
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/50 z-30 transition-opacity duration-300"
          onClick={() => setShowDetailsPanel(false)}
          aria-hidden="true"
        />
      )}

      {/* Conversation Details Panel */}
      <ConversationDetailsPanel
        isOpen={showDetailsPanel}
        onClose={() => setShowDetailsPanel(false)}
        metadata={metadata}
        onUpdate={updateMetadata}
        isUpdating={isUpdatingMetadata}
      />
    </div>
  )
}

export { MainChatPage }

