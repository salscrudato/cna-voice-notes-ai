import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { chatService } from '../services/chatService'
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
        console.error('Failed to load conversations:', error)
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
    if (confirm('Are you sure you want to delete this conversation?')) {
      try {
        // TODO: Implement delete in chatService
        setConversations(conversations.filter(c => c.id !== id))
      } catch (error) {
        console.error('Failed to delete conversation:', error)
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
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-slate-200/50 px-6 py-5 bg-gradient-to-r from-white via-white to-slate-50/50 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-4 mb-5">
          <button
            onClick={() => navigate('/chat')}
            className="p-2.5 hover:bg-slate-100 rounded-lg transition-all duration-200 text-slate-700 hover:text-slate-900 hover:scale-110 active:scale-95 font-medium"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FiBook size={28} className="text-blue-600" />
            Chat History
          </h1>
        </div>
        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200 hover:shadow-sm hover:border-slate-300 focus:shadow-md font-medium"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center animate-fade-in">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">Loading conversations...</p>
              </div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center animate-fade-in">
                <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <FiMessageSquare size={32} className="text-slate-400" />
                </div>
                <p className="text-slate-600 text-lg font-semibold">{searchQuery ? 'No conversations found' : 'No conversations yet'}</p>
                <p className="text-slate-500 text-sm mt-2">{searchQuery ? 'Try a different search' : 'Start a new chat to begin'}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className="bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-200 cursor-pointer group animate-fade-in hover:scale-105 active:scale-95 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors text-base flex items-center gap-2">
                        <FiMessageSquare size={18} className="text-blue-600 flex-shrink-0" />
                        <span className="truncate">{conv.title}</span>
                      </h3>
                      <div className="flex items-center gap-2 mt-2.5 text-sm text-slate-500 group-hover:text-slate-600 transition-colors font-medium">
                        <FiClock size={14} className="flex-shrink-0" />
                        <span>{formatDate(conv.createdAt)}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteConversation(conv.id, e)}
                      className="p-2.5 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 flex-shrink-0"
                      aria-label="Delete conversation"
                    >
                      <FiTrash2 size={18} className="text-red-500 transition-transform" />
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

