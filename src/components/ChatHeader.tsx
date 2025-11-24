import React, { memo } from 'react'
import { FiMenu, FiX, FiMessageCircle, FiMic, FiFilter } from 'react-icons/fi'

interface ChatHeaderProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
  currentConversationTitle?: string
  linkedVoiceNoteName?: string
  onOpenFilters?: () => void
}

const ChatHeaderComponent: React.FC<ChatHeaderProps> = ({
  sidebarOpen,
  onToggleSidebar,
  currentConversationTitle,
  linkedVoiceNoteName,
  onOpenFilters,
}) => {
  return (
    <div className="border-b border-slate-200 px-3 sm:px-6 py-3.5 sm:py-4 flex flex-col gap-2 bg-gradient-to-r from-white to-slate-50 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header row with menu and title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200 text-slate-600 hover:text-slate-900 hover:scale-110 active:scale-95 focus-visible-ring"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            aria-expanded={sidebarOpen}
            aria-controls="chat-sidebar"
            type="button"
          >
            {sidebarOpen ? <FiX size={20} aria-hidden="true" /> : <FiMenu size={20} aria-hidden="true" />}
          </button>

          {/* Mobile filters button */}
          {onOpenFilters && (
            <button
              onClick={onOpenFilters}
              className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200 text-slate-600 hover:text-slate-900 hover:scale-110 active:scale-95 focus-visible-ring md:hidden"
              aria-label="Open filters"
              type="button"
            >
              <FiFilter size={20} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Breadcrumb Navigation with improved visual hierarchy */}
        <div className="flex-1 flex items-center gap-2 px-4">
          <div className="flex items-center gap-2">
            <FiMessageCircle size={20} className="text-blue-600 flex-shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline text-sm font-bold text-slate-900">Chat</span>
          </div>
          {currentConversationTitle && (
            <>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate hidden sm:inline max-w-xs" title={currentConversationTitle}>
                {currentConversationTitle}
              </span>
            </>
          )}
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true" />
          <span className="hidden sm:inline">Connected</span>
        </div>
      </div>

      {/* Voice note context banner */}
      {linkedVoiceNoteName && (
        <div className="flex items-center gap-2 px-2 py-1.5 bg-blue-50 border border-blue-200 rounded-md">
          <FiMic size={16} className="text-blue-600 flex-shrink-0" aria-hidden="true" />
          <span className="text-xs text-blue-700 font-medium truncate">
            Voice note: <span className="font-semibold">{linkedVoiceNoteName}</span>
          </span>
        </div>
      )}
    </div>
  )
}

export const ChatHeader = memo(ChatHeaderComponent)

