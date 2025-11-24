import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { chatService } from '../services/chatService'
import { logger } from '../services/logger'
import type { Conversation } from '../types'
import { FiArrowLeft, FiTrash2, FiMessageSquare, FiClock, FiSearch, FiBook } from 'react-icons/fi'

const ChatHistoryPage: React.FC = () => {
  const navigate = useNavigate()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const convs = await chatService.getAllConversations()
        setConversations(convs)
      } catch (error) {
        logger.error('Failed to load conversations', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadConversations()
  }, [])

  const handleSelectConversation = (id: string) => {
    navigate('/chat', { state: { conversationId: id } })
  }

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const conversation = conversations.find(c => c.id === id)
    const title = conversation?.title || 'this conversation'

    if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        await chatService.deleteConversation(id)
        setConversations(conversations.filter(c => c.id !== id))
        logger.info('Conversation deleted successfully', { id })
      } catch (error) {
        logger.error('Failed to delete conversation', error)
        const errorMsg = error instanceof Error ? error.message : 'Failed to delete conversation'
        alert(`Error: ${errorMsg}`)
      }
    }
  }

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-white to-slate-50">
      {/* Header with improved visual hierarchy */}
      <div className="border-b border-slate-200 px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-white to-slate-50 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
          <button
            onClick={() => navigate('/chat')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200 text-slate-700 hover:text-slate-900 hover:scale-110 active:scale-95 flex-shrink-0 focus-visible-ring"
            aria-label="Go back to chat"
          >
            <FiArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 min-w-0">
              <FiBook size={24} className="text-blue-600 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">Chat History</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">{filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        {/* Enhanced Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 flex-shrink-0" size={16} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-500 transition-all duration-200 hover:border-slate-400 shadow-sm hover:shadow-md"
            aria-label="Search conversations"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 animate-pulse"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="h-5 bg-slate-200 rounded-lg w-3/4" />
                      <div className="flex items-center gap-3">
                        <div className="h-4 bg-slate-200 rounded w-24" />
                        <div className="w-1 h-1 bg-slate-300 rounded-full" />
                        <div className="h-4 bg-slate-200 rounded w-32" />
                      </div>
                    </div>
                    <div className="h-8 w-8 bg-slate-200 rounded flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center animate-fade-in">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4 shadow-md">
                  <FiMessageSquare size={32} className="text-blue-600" />
                </div>
                <p className="text-slate-600 text-lg font-semibold">{searchQuery ? 'No conversations found' : 'No conversations yet'}</p>
                <p className="text-slate-500 text-sm mt-2">{searchQuery ? 'Try a different search' : 'Start a new chat to begin'}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredConversations.map((conv, index) => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/15 transition-all duration-200 cursor-pointer group animate-fade-in hover:-translate-y-1 focus-visible-ring"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors text-sm sm:text-base flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" aria-hidden="true" />
                        <span className="truncate">{conv.title}</span>
                      </h3>
                      <div className="flex items-center gap-3 mt-2 text-xs sm:text-sm text-slate-500 group-hover:text-slate-700 transition-colors flex-wrap">
                        <div className="flex items-center gap-1">
                          <FiClock size={14} className="flex-shrink-0" aria-hidden="true" />
                          <span>{formatDate(conv.createdAt)}</span>
                        </div>
                        <div className="w-1 h-1 bg-slate-300 rounded-full" aria-hidden="true" />
                        <div className="flex items-center gap-1">
                          <FiMessageSquare size={14} className="flex-shrink-0" aria-hidden="true" />
                          <span>{conv.messageCount} message{conv.messageCount !== 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      {/* Metadata tags */}
                      {(conv.metadata?.broker || conv.metadata?.lob || conv.metadata?.businessType || conv.metadata?.riskCategory || conv.metadata?.underwritingStatus) && (
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          {conv.metadata?.broker && (
                            <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                              {conv.metadata.broker}
                            </span>
                          )}
                          {conv.metadata?.lob && (
                            <span className="inline-block px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                              {conv.metadata.lob}
                            </span>
                          )}
                          {conv.metadata?.businessType && (
                            <span className="inline-block px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                              {conv.metadata.businessType}
                            </span>
                          )}
                          {conv.metadata?.riskCategory && (
                            <span className="inline-block px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-medium">
                              {conv.metadata.riskCategory}
                            </span>
                          )}
                          {conv.metadata?.underwritingStatus && (
                            <span className="inline-block px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium">
                              {conv.metadata.underwritingStatus}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleDeleteConversation(conv.id, e)}
                      className="p-1.5 hover:bg-red-50 rounded transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 flex-shrink-0 focus-visible-ring"
                      aria-label="Delete conversation"
                      type="button"
                    >
                      <FiTrash2 size={16} className="text-red-500 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { ChatHistoryPage }

