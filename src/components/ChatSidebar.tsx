import React, { useMemo, memo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Conversation } from '../types'
import { FiPlus, FiClock, FiUploadCloud, FiHome, FiSearch, FiX } from 'react-icons/fi'
import { ConversationItem } from './ConversationItem'
import { getDateGroupLabel } from '../utils/dates'

interface ChatSidebarProps {
  isOpen: boolean
  conversations: Conversation[]
  currentConversationId: string | null
  onNewConversation: () => void
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
  onRenameConversation: (id: string, newTitle: string) => void
}

const ChatSidebarComponent: React.FC<ChatSidebarProps> = ({
  isOpen,
  conversations,
  currentConversationId,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
}) => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  // Group conversations by date
  const groupedConversations = useMemo(() => {
    const filtered = conversations.filter(conv =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const groups: Record<string, Conversation[]> = {}

    filtered.forEach(conv => {
      const groupKey = getDateGroupLabel(conv.createdAt)

      if (!groups[groupKey]) groups[groupKey] = []
      groups[groupKey].push(conv)
    })

    return groups
  }, [conversations, searchQuery])

  const conversationsList = useMemo(
    () =>
      Object.entries(groupedConversations).map(([groupName, convs]) => (
        <div key={groupName}>
          <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {groupName}
          </div>
          <div className="space-y-1">
            {convs.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={currentConversationId === conv.id}
                onSelect={onSelectConversation}
                onDelete={onDeleteConversation}
                onRename={onRenameConversation}
              />
            ))}
          </div>
        </div>
      )),
    [groupedConversations, currentConversationId, onSelectConversation, onDeleteConversation, onRenameConversation]
  )

  return (
    <nav
      id="chat-sidebar"
      className={`${
        isOpen ? 'w-64' : 'w-0'
      } bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white transition-all duration-300 flex flex-col overflow-hidden shadow-2xl border-r border-slate-700/50 fixed sm:relative h-screen sm:h-auto z-40 sm:z-auto`}
      aria-label="Chat history sidebar"
    >
      {/* Logo & Branding */}
      <div className="p-4 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4 group cursor-pointer hover:scale-105 transition-transform duration-300">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="font-semibold text-sm group-hover:text-blue-300 transition-colors">Voice Notes</span>
        </div>
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
          aria-label="Start a new chat conversation"
        >
          <FiPlus size={18} aria-hidden="true" />
          New Chat
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-2 sm:px-3 py-2 border-b border-slate-700/50">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 sm:py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            aria-label="Search conversations"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-700/50 rounded transition-colors text-slate-400 hover:text-slate-200"
              aria-label="Clear search"
              type="button"
            >
              <FiX size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {conversations.length === 0 ? (
          <p className="text-slate-500 text-xs p-3 text-center">No conversations yet</p>
        ) : Object.keys(groupedConversations).length === 0 ? (
          <p className="text-slate-500 text-xs p-3 text-center">No conversations found</p>
        ) : (
          conversationsList
        )}
      </div>

      {/* Navigation */}
      <div className="border-t border-slate-700/50 p-3 space-y-2 bg-slate-900/30 backdrop-blur-sm">
        <button
          onClick={() => navigate('/history')}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 rounded-lg transition-all duration-200 text-sm group hover:scale-105 active:scale-95"
          aria-label="View conversation history"
        >
          <FiClock size={16} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
          History
        </button>
        <button
          onClick={() => navigate('/upload')}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 rounded-lg transition-all duration-200 text-sm group hover:scale-105 active:scale-95"
          aria-label="Upload audio files"
        >
          <FiUploadCloud size={16} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
          Upload
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 rounded-lg transition-all duration-200 text-sm group hover:scale-105 active:scale-95"
          aria-label="Go to home page"
        >
          <FiHome size={16} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
          Home
        </button>
      </div>
    </nav>
  )
}

export const ChatSidebar = memo(ChatSidebarComponent)

