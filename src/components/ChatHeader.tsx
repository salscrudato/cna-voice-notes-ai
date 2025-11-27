import React, { useCallback, memo } from 'react'
import { FiMenu, FiX, FiMessageCircle, FiMic, FiPlus } from '../utils/icons'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'
import { ThemeSelector } from './ThemeSelector'

interface ChatHeaderProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
  currentConversationTitle?: string
  linkedVoiceNoteName?: string
  onNewConversation?: () => void
}

const ChatHeaderComponent: React.FC<ChatHeaderProps> = ({
  sidebarOpen,
  onToggleSidebar,
  currentConversationTitle,
  linkedVoiceNoteName,
  onNewConversation,
}) => {
  const { accentColor } = useTheme()

  const handleNewChat = useCallback(() => {
    onNewConversation?.()
  }, [onNewConversation])
	  return (
	    <div className="border-b border-slate-200/50 dark:border-slate-700/50 px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col gap-2 bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 transition-all duration-300">
      {/* Header row with menu and title */}
      <div className="flex items-center justify-between">
	        <div className="flex items-center gap-2">
	          <button
	            onClick={onToggleSidebar}
	            className="btn-icon hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-md dark:hover:shadow-lg hover:scale-110 hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            aria-expanded={sidebarOpen}
            aria-controls="chat-sidebar"
            type="button"
          >
            {sidebarOpen ? <FiX size={20} aria-hidden="true" /> : <FiMenu size={20} aria-hidden="true" />}
          </button>
          {onNewConversation && (
            <button
              onClick={handleNewChat}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all duration-300 shadow-md hover:shadow-2xl active:scale-95 font-medium text-xs hover:-translate-y-1 hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
              style={{
                background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
                '--tw-ring-color': getAccentColor(accentColor, '500')
              } as React.CSSProperties}
              aria-label="Start a new chat"
              title="New Chat"
              type="button"
            >
              <FiPlus size={16} aria-hidden="true" className="group-hover:rotate-90 transition-transform duration-300" />
              <span>New Chat</span>
            </button>
          )}
        </div>

        {/* Breadcrumb Navigation with improved visual hierarchy */}
        <div className="flex-1 flex items-center gap-2 px-4">
          <div className="flex items-center gap-2 group">
            <FiMessageCircle size={20} className="text-accent-600 dark:text-accent-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
            <span className="hidden sm:inline text-sm font-semibold text-slate-900 dark:text-slate-50 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-300">Chat</span>
          </div>
          {currentConversationTitle && (
            <>
              <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">/</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 truncate hidden sm:inline max-w-xs hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1 cursor-pointer" title={currentConversationTitle}>
                {currentConversationTitle}
              </span>
            </>
          )}
        </div>

        {/* Theme toggle */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <ThemeSelector />
        </div>
      </div>





      {/* Voice note context banner */}
	      {linkedVoiceNoteName && (
	        <div className="flex items-center gap-2.5 px-4 py-3 bg-accent-50 dark:bg-accent-900/20 border border-accent-200/70 dark:border-accent-700/70 rounded-lg shadow-sm dark:shadow-md transition-colors duration-200 hover:shadow-md dark:hover:shadow-lg hover:bg-accent-100/50 dark:hover:bg-accent-900/30">
          <FiMic size={18} className="text-accent-600 dark:text-accent-400 flex-shrink-0 hover:scale-110 transition-transform duration-300" aria-hidden="true" />
          <span className="text-sm text-accent-700 dark:text-accent-300 font-medium truncate">
            Voice note: <span className="font-semibold">{linkedVoiceNoteName}</span>
          </span>
        </div>
      )}
    </div>
  )
}

export const ChatHeader = memo(ChatHeaderComponent)

