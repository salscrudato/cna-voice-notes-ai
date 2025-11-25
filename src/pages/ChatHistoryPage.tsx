import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { chatService } from '../services/chatService'
import { logger } from '../services/logger'
import { EmptyState } from '../components/EmptyState'
import { SkeletonLoader } from '../components/SkeletonLoader'
import { formatDateAndTime } from '../utils/formatting'
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



  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-white/80 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-950/80 backdrop-blur-sm">
      {/* Header with improved visual hierarchy */}
      <div className="border-b border-slate-200/50 dark:border-slate-700/50 px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-white/80 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-950/80 backdrop-blur-sm shadow-sm hover:shadow-md dark:shadow-md dark:hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
          <button
            onClick={() => navigate('/chat')}
            className="btn-icon hover:scale-110 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
            aria-label="Go back to chat"
          >
            <FiArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2 min-w-0">
              <FiBook size={24} className="text-blue-600 dark:text-blue-400 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">Chat History</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        {/* Enhanced Search Bar */}
        <div className="relative group">
          <FiSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 flex-shrink-0 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors duration-300" size={16} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2.5 bg-white/80 dark:bg-slate-800/80 border border-slate-300/50 dark:border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-300 hover:border-slate-400/70 dark:hover:border-slate-500/70 shadow-sm hover:shadow-md dark:shadow-md dark:hover:shadow-lg backdrop-blur-sm focus:shadow-lg focus:shadow-blue-500/20 dark:focus:shadow-blue-500/10"
            aria-label="Search conversations"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gradient-to-b from-white/80 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-950/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <SkeletonLoader variant="card" count={3} />
          ) : filteredConversations.length === 0 ? (
            <EmptyState
              icon={
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-full flex items-center justify-center shadow-md dark:shadow-lg">
                  <FiMessageSquare size={32} className="text-blue-600 dark:text-blue-400" />
                </div>
              }
              title={searchQuery ? 'No conversations found' : 'No conversations yet'}
              description={searchQuery ? 'Try a different search' : 'Start a new chat to begin'}
              action={!searchQuery ? {
                label: 'Start New Chat',
                onClick: () => navigate('/chat'),
              } : undefined}
              variant="compact"
            />
          ) : (
            <div className="space-y-3">
              {filteredConversations.map((conv, index) => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-4 sm:p-5 border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-500/70 dark:hover:border-blue-400/70 hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-lg dark:hover:shadow-blue-500/30 transition-all duration-300 cursor-pointer group animate-fade-in hover:-translate-y-2 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 backdrop-blur-sm active:scale-95"
                  style={{ animationDelay: `${index * 50}ms` }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleSelectConversation(conv.id)
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-slate-50 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 text-sm sm:text-base flex items-center gap-2 group-hover:scale-105">
                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform duration-300" aria-hidden="true" />
                        <span className="truncate">{conv.title}</span>
                      </h3>
                      <div className="flex items-center gap-3 mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-all duration-300 flex-wrap">
                        <div className="flex items-center gap-1">
                          <FiClock size={14} className="flex-shrink-0" aria-hidden="true" />
                          <span>{formatDateAndTime(conv.createdAt)}</span>
                        </div>
                        <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" aria-hidden="true" />
                        <div className="flex items-center gap-1">
                          <FiMessageSquare size={14} className="flex-shrink-0" aria-hidden="true" />
                          <span>{conv.messageCount} message{conv.messageCount !== 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      {/* Metadata tags */}
                      {(conv.metadata?.broker || conv.metadata?.lob || conv.metadata?.businessType || conv.metadata?.riskCategory || conv.metadata?.underwritingStatus) && (
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          {conv.metadata?.broker && (
                            <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium border border-blue-200/50 dark:border-blue-800/50 hover:shadow-md hover:shadow-blue-500/30 dark:hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 group-hover:border-blue-300/80 dark:group-hover:border-blue-700/80">
                              {conv.metadata.broker}
                            </span>
                          )}
                          {conv.metadata?.lob && (
                            <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-950/40 dark:to-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-medium border border-green-200/50 dark:border-green-800/50 hover:shadow-md hover:shadow-green-500/30 dark:hover:shadow-green-500/20 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 group-hover:border-green-300/80 dark:group-hover:border-green-700/80">
                              {conv.metadata.lob}
                            </span>
                          )}
                          {conv.metadata?.businessType && (
                            <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-950/40 dark:to-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-medium border border-purple-200/50 dark:border-purple-800/50 hover:shadow-md hover:shadow-purple-500/30 dark:hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 group-hover:border-purple-300/80 dark:group-hover:border-purple-700/80">
                              {conv.metadata.businessType}
                            </span>
                          )}
                          {conv.metadata?.riskCategory && (
                            <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-950/40 dark:to-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-xs font-medium border border-orange-200/50 dark:border-orange-800/50 hover:shadow-md hover:shadow-orange-500/30 dark:hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 group-hover:border-orange-300/80 dark:group-hover:border-orange-700/80">
                              {conv.metadata.riskCategory}
                            </span>
                          )}
                          {conv.metadata?.underwritingStatus && (
                            <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-950/40 dark:to-red-900/30 text-red-700 dark:text-red-300 rounded text-xs font-medium border border-red-200/50 dark:border-red-800/50 hover:shadow-md hover:shadow-red-500/30 dark:hover:shadow-red-500/20 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 group-hover:border-red-300/80 dark:group-hover:border-red-700/80">
                              {conv.metadata.underwritingStatus}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleDeleteConversation(conv.id, e)}
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-125 active:scale-95 flex-shrink-0 focus-visible:ring-2 focus-visible:ring-red-500 border border-red-300/50 dark:border-red-700/50 hover:border-red-400/80 dark:hover:border-red-600/80 hover:shadow-md hover:shadow-red-500/30 dark:hover:shadow-red-500/20 hover:-translate-y-0.5"
                      aria-label="Delete conversation"
                      type="button"
                    >
                      <FiTrash2 size={16} className="text-red-500 dark:text-red-400 transition-all duration-300 hover:scale-110" />
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

