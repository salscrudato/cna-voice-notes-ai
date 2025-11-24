import React, { memo } from 'react'
import { FiMenu, FiX, FiMessageCircle } from 'react-icons/fi'

interface ChatHeaderProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
  currentConversationTitle?: string
}

const ChatHeaderComponent: React.FC<ChatHeaderProps> = ({ sidebarOpen, onToggleSidebar, currentConversationTitle }) => {
  return (
    <div className="border-b border-slate-200/30 px-3 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
      <button
        onClick={onToggleSidebar}
        className="p-2 hover:bg-slate-100/80 rounded-lg transition-all duration-200 text-slate-600 hover:text-slate-900 hover:scale-110 active:scale-95 font-medium touch-target"
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        aria-expanded={sidebarOpen}
        aria-controls="chat-sidebar"
        type="button"
      >
        {sidebarOpen ? <FiX size={20} aria-hidden="true" /> : <FiMenu size={20} aria-hidden="true" />}
      </button>

      {/* Breadcrumb Navigation */}
      <div className="flex-1 flex items-center gap-2 px-4">
        <div className="flex items-center gap-2.5">
          <FiMessageCircle size={22} className="text-blue-600 flex-shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline text-base font-semibold text-slate-900">Chat</span>
        </div>
        {currentConversationTitle && (
          <>
            <span className="text-slate-400 hidden sm:inline">/</span>
            <span className="text-sm sm:text-base font-medium text-slate-600 truncate hidden sm:inline">
              {currentConversationTitle}
            </span>
          </>
        )}
      </div>

      <div className="w-10" />
    </div>
  )
}

export const ChatHeader = memo(ChatHeaderComponent)

