import React, { useMemo, useState, memo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { Conversation } from '../types'
import { FiHome, FiSearch, FiX, FiHelpCircle, FiUpload } from '../utils/icons'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'
import { ConversationItem } from './ConversationItem'
import { getDateGroupLabel } from '../utils/dates'

interface ChatSidebarProps {
  isOpen: boolean
  conversations: Conversation[]
  currentConversationId: string | null
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
  onRenameConversation: (id: string, newTitle: string) => void
}

const ChatSidebarComponent: React.FC<ChatSidebarProps> = ({
  isOpen,
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { accentColor } = useTheme()
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
        isOpen ? 'w-72' : 'w-0'
	      } bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 text-slate-900 dark:text-slate-50 transition-all duration-300 ease-in-out flex flex-col overflow-hidden border-r border-slate-200/50 dark:border-slate-800/50 fixed sm:relative h-screen sm:h-auto z-40 sm:z-auto`}
      aria-label="Chat history sidebar"
      aria-hidden={!isOpen}
    >
	      {/* Logo & Branding */}
	      <div className="p-5 border-b border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50">
	        <div className="flex items-center gap-3 group cursor-pointer transition-all duration-300">
	          <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 border"
              style={{
                background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
                borderColor: getAccentColor(accentColor, '500')
              }}
            >
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span
            className="font-bold text-base text-slate-900 dark:text-slate-50 transition-all duration-300 group-hover:scale-105"
            style={{
              color: getAccentColor(accentColor, '600')
            }}
          >Marmalade</span>
        </div>
      </div>

	      {/* Search Bar */}
	      <div className="px-4 py-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-b from-slate-50/50 to-white/50 dark:from-slate-900/50 dark:to-slate-950/50">
        <div className="relative group">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none transition-all duration-300" size={16} aria-hidden="true"
            style={{
              color: 'inherit'
            }}
            onFocus={(e) => {
              (e.currentTarget as SVGElement).style.color = getAccentColor(accentColor, '500')
            }}
          />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md dark:hover:shadow-lg focus:shadow-lg dark:focus:shadow-lg focus:bg-white dark:focus:bg-slate-800 hover:scale-[1.02] dark:hover:shadow-slate-900/50 dark:focus:shadow-slate-900/50 focus:scale-[1.02]"
            style={{
              '--tw-ring-color': getAccentColor(accentColor, '500')
            } as React.CSSProperties}
            aria-label="Search conversations"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-all duration-300 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:scale-125 hover:-translate-y-1 active:scale-95 animate-fade-in hover:shadow-md dark:hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
              style={{
                '--tw-ring-color': getAccentColor(accentColor, '500')
              } as React.CSSProperties}
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
	      <div className="border-t border-slate-200/50 dark:border-slate-800/50 p-4 space-y-2 bg-gradient-to-t from-slate-50/50 to-white/50 dark:from-slate-900/50 dark:to-slate-950/50">
        <button
          onClick={() => navigate('/')}
	          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm group focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 border hover:scale-[1.02] hover:-translate-y-0.5 ${
	            isOnPage('/')
	              ? 'bg-white dark:bg-slate-800 font-semibold shadow-md hover:shadow-lg'
	              : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border-slate-200/60 dark:border-slate-700/60 hover:shadow-md dark:hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600'
	          }`}
          style={isOnPage('/') ? {
            color: getAccentColor(accentColor, '700'),
            borderColor: getAccentColor(accentColor, '300'),
            '--tw-ring-color': getAccentColor(accentColor, '500')
          } as React.CSSProperties : {
            '--tw-ring-color': getAccentColor(accentColor, '500')
          } as React.CSSProperties}
          aria-label="Go to home page"
          aria-current={isOnPage('/') ? 'page' : undefined}
        >
          <FiHome size={18} className="group-hover:scale-125 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0" aria-hidden="true" />
          <span>Home</span>
          {isOnPage('/') && (
            <div className="ml-auto flex items-center gap-2 animate-fade-in">
              <div
                className="w-2 h-2 rounded-full animate-pulse shadow-lg"
                style={{
                  backgroundColor: getAccentColor(accentColor, '600'),
                  boxShadow: `0 0 8px ${getAccentColor(accentColor, '500')}80`
                }}
                aria-hidden="true"
              />
              <div
                className="w-1.5 h-1.5 rounded-full shadow-md"
                style={{
                  backgroundColor: getAccentColor(accentColor, '600'),
                  boxShadow: `0 0 6px ${getAccentColor(accentColor, '500')}60`
                }}
                aria-hidden="true"
              />
            </div>
          )}
        </button>

        <button
          onClick={() => navigate('/upload')}
		          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm group focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 border hover:scale-[1.02] hover:-translate-y-0.5 ${
		            isOnPage('/upload')
		              ? 'bg-white dark:bg-slate-800 font-semibold shadow-md hover:shadow-lg'
		              : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border-slate-200/60 dark:border-slate-700/60 hover:shadow-md dark:hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600'
		          }`}
          style={isOnPage('/upload') ? {
            color: getAccentColor(accentColor, '700'),
            borderColor: getAccentColor(accentColor, '300'),
            '--tw-ring-color': getAccentColor(accentColor, '500')
          } as React.CSSProperties : {
            '--tw-ring-color': getAccentColor(accentColor, '500')
          } as React.CSSProperties}
          aria-label="Go to upload page"
          aria-current={isOnPage('/upload') ? 'page' : undefined}
        >
          <FiUpload size={18} className="group-hover:scale-125 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0" aria-hidden="true" />
          <span>Upload</span>
          {isOnPage('/upload') && (
            <div className="ml-auto flex items-center gap-2 animate-fade-in">
              <div
                className="w-2 h-2 rounded-full animate-pulse shadow-lg"
                style={{
                  backgroundColor: getAccentColor(accentColor, '600'),
                  boxShadow: `0 0 8px ${getAccentColor(accentColor, '500')}80`
                }}
                aria-hidden="true"
              />
              <div
                className="w-1.5 h-1.5 rounded-full shadow-md"
                style={{
                  backgroundColor: getAccentColor(accentColor, '600'),
                  boxShadow: `0 0 6px ${getAccentColor(accentColor, '500')}60`
                }}
                aria-hidden="true"
              />
            </div>
          )}
        </button>

        <button
          onClick={() => navigate('/support')}
	          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm group focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 border hover:scale-[1.02] hover:-translate-y-0.5 ${
	            isOnPage('/support')
	              ? 'bg-white dark:bg-slate-800 font-semibold shadow-md hover:shadow-lg'
	              : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border-slate-200/60 dark:border-slate-700/60 hover:shadow-md dark:hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600'
	          }`}
          style={isOnPage('/support') ? {
            color: getAccentColor(accentColor, '700'),
            borderColor: getAccentColor(accentColor, '300'),
            '--tw-ring-color': getAccentColor(accentColor, '500')
          } as React.CSSProperties : {
            '--tw-ring-color': getAccentColor(accentColor, '500')
          } as React.CSSProperties}
          aria-label="Go to support page"
          aria-current={isOnPage('/support') ? 'page' : undefined}
        >
          <FiHelpCircle size={18} className="group-hover:scale-125 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0" aria-hidden="true" />
          <span>Get Support</span>
          {isOnPage('/support') && (
            <div className="ml-auto flex items-center gap-2 animate-fade-in">
              <div
                className="w-2 h-2 rounded-full animate-pulse shadow-lg"
                style={{
                  backgroundColor: getAccentColor(accentColor, '600'),
                  boxShadow: `0 0 8px ${getAccentColor(accentColor, '500')}80`
                }}
                aria-hidden="true"
              />
              <div
                className="w-1.5 h-1.5 rounded-full shadow-md"
                style={{
                  backgroundColor: getAccentColor(accentColor, '600'),
                  boxShadow: `0 0 6px ${getAccentColor(accentColor, '500')}60`
                }}
                aria-hidden="true"
              />
            </div>
          )}
        </button>
      </div>
    </nav>
  )
}

export const ChatSidebar = memo(ChatSidebarComponent)

