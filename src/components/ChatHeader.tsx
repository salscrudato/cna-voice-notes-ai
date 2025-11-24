import React, { memo } from 'react'
import { FiMenu, FiX, FiMessageCircle } from 'react-icons/fi'

interface ChatHeaderProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

const ChatHeaderComponent: React.FC<ChatHeaderProps> = ({ sidebarOpen, onToggleSidebar }) => {
  return (
    <div className="border-b border-slate-200/50 px-6 py-4 flex items-center justify-between bg-gradient-to-r from-white via-white to-slate-50/50 backdrop-blur-md shadow-sm">
      <button
        onClick={onToggleSidebar}
        className="p-2.5 hover:bg-slate-100 rounded-lg transition-all duration-200 text-slate-700 hover:text-slate-900 hover:scale-110 active:scale-95 font-medium"
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        aria-expanded={sidebarOpen}
        aria-controls="chat-sidebar"
      >
        {sidebarOpen ? <FiX size={20} aria-hidden="true" /> : <FiMenu size={20} aria-hidden="true" />}
      </button>
      <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
        <FiMessageCircle size={24} className="text-blue-600" />
        Chat
      </h1>
      <div className="w-10" />
    </div>
  )
}

export const ChatHeader = memo(ChatHeaderComponent)

