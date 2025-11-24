import React, { useMemo, memo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { Conversation } from '../types'
import { FiPlus, FiClock, FiUploadCloud, FiHome, FiSearch, FiX, FiMic } from 'react-icons/fi'
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
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')

  const isOnPage = (path: string) => location.pathname === path

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
      } bg-white text-slate-900 transition-all duration-300 flex flex-col overflow-hidden shadow-lg border-r border-slate-200 fixed sm:relative h-screen sm:h-auto z-40 sm:z-auto`}
      aria-label="Chat history sidebar"
    >
      {/* Logo & Branding */}
      <div className="p-4 border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="flex items-center gap-2 mb-5 group cursor-pointer hover:scale-105 transition-transform duration-300">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
            <span className="text-white font-bold text-xs">CNA</span>
          </div>
          <span className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">Marlamade</span>
        </div>
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl transition-all duration-200 font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus-visible-ring"
          aria-label="Start a new chat conversation"
        >
          <FiPlus size={18} aria-hidden="true" />
          New Chat
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-3 py-4 border-b border-slate-200">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-400"
            aria-label="Search conversations"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded transition-colors text-slate-500 hover:text-slate-700"
              aria-label="Clear search"
              type="button"
            >
              <FiX size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 ? (
          <p className="text-slate-500 text-xs p-3 text-center">No conversations yet</p>
        ) : Object.keys(groupedConversations).length === 0 ? (
          <p className="text-slate-500 text-xs p-3 text-center">No conversations found</p>
        ) : (
          conversationsList
        )}
      </div>

      {/* Navigation with improved visual indicators */}
      <div className="border-t border-slate-200 p-3 space-y-2 bg-gradient-to-b from-white to-slate-50">
        <button
          onClick={() => navigate('/history')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm group hover:scale-105 active:scale-95 focus-visible-ring ${
            isOnPage('/history')
              ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-semibold shadow-md border border-blue-300'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          aria-label="View conversation history"
          aria-current={isOnPage('/history') ? 'page' : undefined}
        >
          <FiClock size={16} className="group-hover:scale-110 transition-transform flex-shrink-0" aria-hidden="true" />
          <span>History</span>
          {isOnPage('/history') && (
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" aria-hidden="true" />
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" aria-hidden="true" />
            </div>
          )}
        </button>
        <button
          onClick={() => navigate('/upload')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm group hover:scale-105 active:scale-95 focus-visible-ring ${
            isOnPage('/upload')
              ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-semibold shadow-md border border-blue-300'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          aria-label="Upload audio files"
          aria-current={isOnPage('/upload') ? 'page' : undefined}
        >
          <FiUploadCloud size={16} className="group-hover:scale-110 transition-transform flex-shrink-0" aria-hidden="true" />
          <span>Upload</span>
          {isOnPage('/upload') && (
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" aria-hidden="true" />
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" aria-hidden="true" />
            </div>
          )}
        </button>
        <button
          onClick={() => navigate('/voice-notes')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm group hover:scale-105 active:scale-95 focus-visible-ring ${
            isOnPage('/voice-notes')
              ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-semibold shadow-md border border-blue-300'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          aria-label="View voice notes"
          aria-current={isOnPage('/voice-notes') ? 'page' : undefined}
        >
          <FiMic size={16} className="group-hover:scale-110 transition-transform flex-shrink-0" aria-hidden="true" />
          <span>Voice Notes</span>
          {isOnPage('/voice-notes') && (
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" aria-hidden="true" />
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" aria-hidden="true" />
            </div>
          )}
        </button>
        <button
          onClick={() => navigate('/')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm group hover:scale-105 active:scale-95 focus-visible-ring ${
            isOnPage('/')
              ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-semibold shadow-md border border-blue-300'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          aria-label="Go to home page"
          aria-current={isOnPage('/') ? 'page' : undefined}
        >
          <FiHome size={16} className="group-hover:scale-110 transition-transform flex-shrink-0" aria-hidden="true" />
          <span>Home</span>
          {isOnPage('/') && (
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" aria-hidden="true" />
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" aria-hidden="true" />
            </div>
          )}
        </button>
      </div>
    </nav>
  )
}

export const ChatSidebar = memo(ChatSidebarComponent)

