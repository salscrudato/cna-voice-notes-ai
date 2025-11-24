import React, { memo } from 'react'
import { FiMenu, FiX, FiMessageCircle } from 'react-icons/fi'

interface ChatHeaderProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
  currentConversationTitle?: string
}

const ChatHeaderComponent: React.FC<ChatHeaderProps> = ({ sidebarOpen, onToggleSidebar, currentConversationTitle }) => {
  return (
    <div className="border-b border-slate-200 px-3 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
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

      {/* Breadcrumb Navigation */}
      <div className="flex-1 flex items-center gap-2 px-4">
        <div className="flex items-center gap-2">
          <FiMessageCircle size={20} className="text-blue-600 flex-shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline text-sm font-semibold text-slate-900">Chat</span>
        </div>
        {currentConversationTitle && (
          <>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="text-xs sm:text-sm font-medium text-slate-600 truncate hidden sm:inline">
              {currentConversationTitle}
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export const ChatHeader = memo(ChatHeaderComponent)

