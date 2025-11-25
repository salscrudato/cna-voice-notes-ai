import React, { useRef, useEffect, memo, useState, useCallback } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'
import { MessageRenderer } from './MessageRenderer'
import { EmptyState } from './EmptyState'
import { UI } from '../constants'
import { formatTime } from '../utils/formatting'
import type { ChatMessage } from '../types'

interface ChatMessagesProps {
  messages: ChatMessage[]
  isLoading: boolean
}

interface MessageItemProps {
  message: ChatMessage
  isCopied: boolean
  onCopy: (messageId: string, content: string) => void
}

// Memoized message item component for performance optimization
const MessageItem = memo<MessageItemProps>(({ message: msg, isCopied, onCopy }) => (
  <div
    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in-${msg.role === 'user' ? 'right' : 'left'} group`}
    role="article"
    aria-label={`${msg.role === 'user' ? 'Your message' : 'Assistant message'}`}
  >
    <div className="flex flex-col gap-2 max-w-2xl">
      <div className="flex items-end gap-2">
        <div
          className={`px-5 py-3.5 rounded-2xl transition-all duration-200 ${
            msg.role === 'user'
              ? 'bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 text-white rounded-br-none shadow-md hover:shadow-lg hover:shadow-blue-500/50 hover:-translate-y-1 border border-blue-500/40 hover:border-blue-400/60 hover:scale-[1.01]'
              : 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 text-slate-900 dark:text-slate-50 rounded-bl-none shadow-sm hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:-translate-y-0.5 hover:scale-[1.01]'
          }`}
        >
          {msg.role === 'user' ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words font-medium">{msg.content}</p>
          ) : (
            <MessageRenderer content={msg.content} />
          )}
        </div>
        {msg.role === 'assistant' && (
          <button
            onClick={() => onCopy(msg.id, msg.content)}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex-shrink-0 hover:scale-110 active:scale-95 shadow-sm hover:shadow-md dark:hover:shadow-lg"
            title="Copy message"
            aria-label="Copy message"
            type="button"
          >
            {isCopied ? (
              <FiCheck size={18} className="text-green-600 dark:text-green-400" />
            ) : (
              <FiCopy size={18} />
            )}
          </button>
        )}
      </div>
      {/* Message Timestamp - always visible with improved styling */}
      <div className={`text-xs font-medium transition-opacity duration-200 ${
        msg.role === 'user' ? 'text-right pr-1' : 'text-left pl-1'
      } ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
        {msg.createdAt ? formatTime(msg.createdAt) : ''}
      </div>
    </div>
  </div>
))

const ChatMessagesComponent: React.FC<ChatMessagesProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: UI.MESSAGE_SCROLL_BEHAVIOR })
  }, [messages, isLoading])

  const handleCopyMessage = useCallback((messageId: string, content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedId(messageId)
      setTimeout(() => setCopiedId(null), UI.COPY_FEEDBACK_DURATION)
    }).catch((error) => {
      console.error('Failed to copy message:', error)
    })
  }, [])

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8 bg-gradient-to-b from-white via-slate-50/30 to-white dark:from-slate-950 dark:via-slate-900/30 dark:to-slate-950 transition-colors duration-300" role="main" aria-label="Chat messages">
      {messages.length === 0 && !isLoading && (
        <EmptyState
          icon={
            <svg className="w-16 h-16 text-blue-600 hover:text-blue-700 transition-colors duration-300 hover:scale-105 animate-pulse-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          }
          title="Welcome to Marlamade"
          description="Chat with AI about your underwriting calls"
        />
      )}

      {messages.map((msg) => (
        <MessageItem
          key={msg.id}
          message={msg}
          isCopied={copiedId === msg.id}
          onCopy={handleCopyMessage}
        />
      ))}

      {isLoading && (
        <div className="flex justify-start animate-slide-in-left" role="status" aria-live="polite" aria-label="AI is thinking">
          <div className="bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 text-slate-900 dark:text-slate-50 px-5 py-3.5 rounded-2xl rounded-bl-none shadow-md dark:shadow-lg dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md dark:hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5 items-center h-5">
                <div className="w-2.5 h-2.5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full shadow-md animate-wave-dot" style={{ animationDelay: '0s' }} aria-hidden="true" />
                <div className="w-2.5 h-2.5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full shadow-md animate-wave-dot" style={{ animationDelay: '0.15s' }} aria-hidden="true" />
                <div className="w-2.5 h-2.5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full shadow-md animate-wave-dot" style={{ animationDelay: '0.3s' }} aria-hidden="true" />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
                Thinking<span className="inline-block animate-thinking-dots w-3 text-left">.</span>
              </span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </main>
  )
}

export const ChatMessages = memo(ChatMessagesComponent)

