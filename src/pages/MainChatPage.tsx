import React, { useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { chatService } from '../services/chatService'
import { voiceNoteService } from '../services/voiceNoteService'
import { titleGenerationService } from '../services/titleGenerationService'
import { logger } from '../services/logger'
import { getApiKeyErrorMessage } from '../services/config'
import { generateTitleFromMessage } from '../utils/titleGenerator'
import { useChatState } from '../hooks/useChatState'
import { useChatOperations } from '../hooks/useChatOperations'
import { useUnderwritingFilters } from '../hooks/useUnderwritingFilters'
import { ChatSidebar } from '../components/ChatSidebar'
import { ChatHeader } from '../components/ChatHeader'
import { ChatMessages } from '../components/ChatMessages'
import { ChatInput } from '../components/ChatInput'
import { UnderwritingFilters } from '../components/UnderwritingFilters'
import { MetadataInputModal } from '../components/MetadataInputModal'
import { ApiErrorBanner } from '../components/ApiErrorBanner'
import { API } from '../constants'
import type { ChatMessage, ConversationMetadata } from '../types'

const MainChatPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [linkedVoiceNoteName, setLinkedVoiceNoteName] = React.useState<string | undefined>()
  const [filtersOpen, setFiltersOpen] = React.useState(false)
  const [metadataModalOpen, setMetadataModalOpen] = React.useState(false)

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
    filters,
    updateFilters,
    applyFilters,
  } = useUnderwritingFilters()

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

  // Handle voice note navigation: create conversation and link voice note
  const handleVoiceNoteNavigation = useCallback(async (voiceNoteId: string) => {
    try {
      logger.info('Processing voice note navigation', { voiceNoteId })

      // Fetch voice note details
      const voiceNote = await voiceNoteService.getVoiceNoteById(voiceNoteId)
      if (!voiceNote) {
        logger.error('Voice note not found', { voiceNoteId })
        setApiError('Voice note not found. Please try uploading again.')
        return
      }

      // Create a new conversation for this voice note
      const title = `Voice Note – ${voiceNote.fileName.split('.')[0]}`
      logger.info('Creating conversation for voice note', { title, voiceNoteId })
      const conversationId = await chatService.createConversation(title, {
        tags: ['voice_note'],
      })

      // Link voice note to conversation
      await voiceNoteService.linkVoiceNoteToConversation(voiceNoteId, conversationId)
      logger.info('Voice note linked to conversation', { voiceNoteId, conversationId })

      // Set as current conversation and display voice note name
      setCurrentConversationId(conversationId)
      setLinkedVoiceNoteName(voiceNote.fileName)
      await loadConversations()

      // Clear navigation state to prevent reprocessing on refresh
      navigate('/chat', { replace: true })

      logger.info('Voice note navigation completed successfully', { conversationId })
    } catch (error) {
      logger.error('Error processing voice note navigation', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to process voice note'
      setApiError(`Error: ${errorMsg}`)
    }
  }, [setCurrentConversationId, loadConversations, navigate, setApiError, setLinkedVoiceNoteName])

  // Load conversations on mount and handle navigation state
  useEffect(() => {
    initializeChat()

    // Handle navigation state: conversationId or voiceNoteId
    const navigationState = location.state as { conversationId?: string; voiceNoteId?: string } | null

    if (navigationState?.conversationId) {
      setCurrentConversationId(navigationState.conversationId)
      logger.debug('Loaded conversation from navigation state', { conversationId: navigationState.conversationId })
    } else if (navigationState?.voiceNoteId) {
      // Handle voice note upload: create new conversation and link voice note
      handleVoiceNoteNavigation(navigationState.voiceNoteId)
    }
  }, [initializeChat, location.state, setCurrentConversationId, handleVoiceNoteNavigation])

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
        // Use better title generation from first message
        const title = generateTitleFromMessage(userMessage)
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

      // Generate AI-powered 3-word title from the exchange
      try {
        const aiTitle = await titleGenerationService.generateTitle(userMessage, assistantResponse)
        logger.info('Generated AI title', { title: aiTitle })
        await chatService.updateConversationTitle(convId, aiTitle)
        logger.info('Conversation title updated', { id: convId, title: aiTitle })
      } catch (titleError) {
        logger.warn('Failed to generate AI title', titleError)
        // Continue without title update - not critical
      }

      // Reload messages from Firestore to get the persisted versions with real IDs
      logger.debug('Reloading messages from Firestore')
      await loadMessages(convId)
      logger.info('Messages reloaded successfully')
    } catch (error) {
      clearTimeout(timeoutId)
      logger.error('Failed to send message', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to send message'
      setApiError(`Error: ${errorMsg}`)
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticUserMessage.id))
    } finally {
      setIsLoading(false)
    }
  }, [inputValue, currentConversationId, loadConversations, loadMessages, isApiKeyMissing, resetInput, clearError, setCurrentConversationId, setIsLoading, setApiError, setMessages])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  // Wrapper for new conversation that shows metadata modal
  const handleNewConversationWithMetadata = useCallback(() => {
    setMetadataModalOpen(true)
  }, [])

  // Handle metadata submission
  const handleMetadataSubmit = useCallback(async (metadata: Partial<ConversationMetadata>) => {
    try {
      const title = `Chat ${new Date().toLocaleDateString()}`
      logger.info('Creating new conversation with metadata', { title, hasMetadata: Object.keys(metadata).length > 0 })
      const conversationId = await chatService.createConversation(title, metadata)
      setCurrentConversationId(conversationId)
      setMessages([])
      await loadConversations()
      logger.info('New conversation created successfully', { conversationId })
    } catch (error) {
      logger.error('Failed to create conversation', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to create conversation'
      setApiError(`Error creating conversation: ${errorMsg}`)
    }
  }, [setCurrentConversationId, setMessages, loadConversations, setApiError])

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
    } catch (error) {
      logger.error('Failed to delete conversation', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete conversation'
      setApiError(`Failed to delete conversation: ${errorMsg}`)
    }
  }, [currentConversationId, setCurrentConversationId, setMessages, loadConversations, setApiError])

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

  // Apply filters to conversations
  const filteredConversations = React.useMemo(() => {
    return applyFilters(conversations)
  }, [conversations, applyFilters])

  return (
    <div className="flex h-screen bg-white">
      <ChatSidebar
        isOpen={sidebarOpen}
        conversations={filteredConversations}
        currentConversationId={currentConversationId}
        onNewConversation={handleNewConversationWithMetadata}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
      />

      {/* Underwriting Filters Panel */}
      <UnderwritingFilters
        onFilterChange={updateFilters}
        activeFilters={filters}
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      <div id="main-content" className="flex-1 flex flex-col" tabIndex={-1}>
        <ChatHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={toggleSidebar}
          currentConversationTitle={conversations.find(c => c.id === currentConversationId)?.title}
          linkedVoiceNoteName={linkedVoiceNoteName}
          onOpenFilters={() => setFiltersOpen(true)}
        />
        <ApiErrorBanner error={apiError} onDismiss={clearError} />

        {/* Chat container - clean, focused layout */}
        <div className="flex-1 flex flex-col overflow-hidden">
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

      {/* Metadata Input Modal */}
      <MetadataInputModal
        isOpen={metadataModalOpen}
        onClose={() => setMetadataModalOpen(false)}
        onSubmit={handleMetadataSubmit}
      />
    </div>
  )
}

export { MainChatPage }

