import React, { useMemo, memo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { Conversation } from '../types'
import { FiPlus, FiHome, FiSearch, FiX } from 'react-icons/fi'
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
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
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
      } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 transition-all duration-300 ease-in-out flex flex-col overflow-hidden shadow-lg dark:shadow-2xl dark:shadow-slate-900/50 border-r border-slate-200 dark:border-slate-700 fixed sm:relative h-screen sm:h-auto z-40 sm:z-auto`}
      aria-label="Chat history sidebar"
      aria-hidden={!isOpen}
    >
      {/* Logo & Branding */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-900/50 dark:to-slate-900 shadow-md dark:shadow-lg dark:shadow-slate-900/50">
        <div className="flex items-center gap-2 mb-5 group cursor-pointer hover:scale-105 transition-all duration-300 hover:-translate-y-0.5">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/60 group-hover:scale-110 transition-all duration-300 border border-blue-500/40 group-hover:border-blue-400/60">
            <span className="text-white font-bold text-xs">CNA</span>
          </div>
          <span className="font-bold text-sm text-slate-900 dark:text-slate-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 group-hover:scale-105">Marlamade</span>
        </div>
        <button
          onClick={onNewConversation}
          className="btn-primary w-full justify-center touch-target shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 active:scale-95 dark:hover:shadow-blue-500/30 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 hover:scale-[1.01]"
          aria-label="Start a new chat conversation"
          type="button"
        >
          <FiPlus size={18} aria-hidden="true" />
          New Chat
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-3 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-900/50 dark:to-slate-900 shadow-md dark:shadow-lg dark:shadow-slate-900/50">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none transition-all duration-300" size={16} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-xs text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-md dark:hover:shadow-lg focus:shadow-lg dark:focus:shadow-lg dark:focus:shadow-blue-500/20 focus:bg-white dark:focus:bg-slate-800 hover:scale-[1.01] dark:hover:shadow-slate-900/50 dark:focus:shadow-slate-900/50 focus:scale-[1.01]"
            aria-label="Search conversations"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-all duration-300 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:scale-125 hover:-translate-y-0.5 active:scale-95 animate-fade-in hover:shadow-sm dark:hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
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
          <p className="text-slate-500 dark:text-slate-400 text-xs p-3 text-center">No conversations yet</p>
        ) : Object.keys(groupedConversations).length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-xs p-3 text-center">No conversations found</p>
        ) : (
          conversationsList
        )}
      </div>

      {/* Navigation with improved visual indicators */}
      <div className="border-t border-slate-200 dark:border-slate-700 p-3 space-y-2 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-900/50 dark:to-slate-900 shadow-md dark:shadow-lg dark:shadow-slate-900/50">
        <button
          onClick={() => navigate('/')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm group hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 border ${
            isOnPage('/')
              ? 'bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/40 dark:to-transparent text-blue-700 dark:text-blue-300 font-semibold shadow-lg dark:shadow-lg dark:shadow-blue-500/20 hover:shadow-xl dark:hover:shadow-xl border border-blue-300/60 dark:border-blue-700/60 hover:scale-[1.01] dark:hover:shadow-blue-500/30 hover:-translate-y-1'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 hover:shadow-md dark:hover:shadow-lg border-slate-200/30 dark:border-slate-700/30 hover:border-slate-200/50 dark:hover:border-slate-700/50 hover:scale-[1.01] dark:hover:shadow-slate-900/50'
          }`}
          aria-label="Go to home page"
          aria-current={isOnPage('/') ? 'page' : undefined}
        >
          <FiHome size={16} className="group-hover:scale-125 transition-all duration-300 flex-shrink-0" aria-hidden="true" />
          <span>Home</span>
          {isOnPage('/') && (
            <div className="ml-auto flex items-center gap-2 animate-fade-in">
              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-500/50" aria-hidden="true" />
              <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full shadow-md shadow-blue-500/30" aria-hidden="true" />
            </div>
          )}
        </button>
      </div>
    </nav>
  )
}

export const ChatSidebar = memo(ChatSidebarComponent)

