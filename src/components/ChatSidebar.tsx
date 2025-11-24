import React, { useMemo, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Conversation } from '../types'
import { FiPlus, FiClock, FiUploadCloud, FiHome } from 'react-icons/fi'

interface ChatSidebarProps {
  isOpen: boolean
  conversations: Conversation[]
  currentConversationId: string | null
  onNewConversation: () => void
  onSelectConversation: (id: string) => void
}

const ChatSidebarComponent: React.FC<ChatSidebarProps> = ({
  isOpen,
  conversations,
  currentConversationId,
  onNewConversation,
  onSelectConversation,
}) => {
  const navigate = useNavigate()

  const conversationsList = useMemo(
    () =>
      conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelectConversation(conv.id)}
          className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-200 truncate text-sm group font-medium ${
            currentConversationId === conv.id
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
              : 'text-slate-300 hover:bg-slate-700/60 hover:text-slate-100 hover:scale-105 active:scale-95'
          }`}
          title={conv.title}
          aria-label={`Load conversation: ${conv.title}`}
          aria-current={currentConversationId === conv.id ? 'page' : undefined}
        >
          <span className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full transition-all flex-shrink-0 ${currentConversationId === conv.id ? 'bg-white scale-125' : 'bg-slate-500 group-hover:bg-slate-300'}`} aria-hidden="true" />
            <span className="truncate">{conv.title}</span>
          </span>
        </button>
      )),
    [conversations, currentConversationId, onSelectConversation]
  )

  return (
    <nav
      id="chat-sidebar"
      className={`${
        isOpen ? 'w-64' : 'w-0'
      } bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white transition-all duration-300 flex flex-col overflow-hidden shadow-2xl border-r border-slate-700/50`}
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

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {conversations.length === 0 ? (
          <p className="text-slate-500 text-xs p-3 text-center">No conversations yet</p>
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

