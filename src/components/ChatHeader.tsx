import React, { memo } from 'react'
import { FiMenu, FiX, FiMessageCircle, FiMic } from 'react-icons/fi'

interface ChatHeaderProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
  currentConversationTitle?: string
  linkedVoiceNoteName?: string
}

const ChatHeaderComponent: React.FC<ChatHeaderProps> = ({
  sidebarOpen,
  onToggleSidebar,
  currentConversationTitle,
  linkedVoiceNoteName,
}) => {
  return (
    <div className="border-b border-slate-200/60 dark:border-slate-700/60 px-3 sm:px-6 py-3.5 sm:py-4 flex flex-col gap-2 bg-gradient-to-r from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-900/50 dark:to-slate-900 shadow-sm dark:shadow-lg dark:shadow-slate-900/50 hover:shadow-md dark:hover:shadow-lg transition-all duration-300">
      {/* Header row with menu and title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            className="btn-icon hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-sm dark:hover:shadow-md dark:hover:shadow-slate-900/50 transition-all duration-300 hover:scale-110 active:scale-95 hover:-translate-y-0.5"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            aria-expanded={sidebarOpen}
            aria-controls="chat-sidebar"
            type="button"
          >
            {sidebarOpen ? <FiX size={20} aria-hidden="true" /> : <FiMenu size={20} aria-hidden="true" />}
          </button>
        </div>

        {/* Breadcrumb Navigation with improved visual hierarchy */}
        <div className="flex-1 flex items-center gap-2 px-4">
          <div className="flex items-center gap-2 group">
            <FiMessageCircle size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
            <span className="hidden sm:inline text-sm font-bold text-slate-900 dark:text-slate-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">Chat</span>
          </div>
          {currentConversationTitle && (
            <>
              <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">/</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 truncate hidden sm:inline max-w-xs hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5" title={currentConversationTitle}>
                {currentConversationTitle}
              </span>
            </>
          )}
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg shadow-green-500/50 dark:shadow-green-500/30" aria-hidden="true" />
        </div>
      </div>

      {/* Voice note context banner */}
      {linkedVoiceNoteName && (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-50 via-blue-50 to-cyan-50 dark:from-blue-900/30 dark:via-blue-900/30 dark:to-cyan-900/30 border border-blue-200/60 dark:border-blue-700/60 rounded-lg shadow-md dark:shadow-lg dark:shadow-blue-900/50 hover:shadow-lg dark:hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5">
          <FiMic size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0 hover:scale-110 transition-transform duration-300" aria-hidden="true" />
          <span className="text-xs text-blue-700 dark:text-blue-300 font-medium truncate">
            Voice note: <span className="font-semibold">{linkedVoiceNoteName}</span>
          </span>
        </div>
      )}
    </div>
  )
}

export const ChatHeader = memo(ChatHeaderComponent)

