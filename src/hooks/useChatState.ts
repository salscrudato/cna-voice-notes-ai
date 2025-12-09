import { useState, useCallback } from 'react'
import type { ChatMessage, Conversation } from '../types'

/**
 * Custom hook to manage chat state
 * Reduces complexity in MainChatPage by encapsulating related state
 */
export const useChatState = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [apiError, setApiError] = useState<string>()
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false)

  const resetInput = useCallback(() => {
    setInputValue('')
  }, [])

  const clearError = useCallback(() => {
    setApiError(undefined)
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  return {
    // State
    conversations,
    currentConversationId,
    messages,
    inputValue,
    isLoading,
    sidebarOpen,
    apiError,
    isApiKeyMissing,
    // Setters
    setConversations,
    setCurrentConversationId,
    setMessages,
    setInputValue,
    setIsLoading,
    setApiError,
    setIsApiKeyMissing,
    // Helpers
    resetInput,
    clearError,
    toggleSidebar,
  }
}

