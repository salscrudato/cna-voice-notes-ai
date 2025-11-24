import React, { useRef, useEffect, memo, useState, useCallback } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'
import { MessageRenderer } from './MessageRenderer'
import { LoadingSpinner } from './LoadingSpinner'
import { UI } from '../constants'
import { formatTime } from '../utils/formatting'
import type { ChatMessage } from '../types'

interface ChatMessagesProps {
  messages: ChatMessage[]
  isLoading: boolean
}

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
    <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-5 sm:space-y-6 bg-gradient-to-b from-white to-slate-50" role="main" aria-label="Chat messages">
      {messages.length === 0 && !isLoading && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center animate-fade-in max-w-md px-4">
            <div className="mb-8">
              <div className="w-28 h-28 mx-auto bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl hover:shadow-2xl transition-all duration-300 hover:scale-110 animate-pulse-soft" aria-hidden="true">
                <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">Welcome to Marlamade</h2>
            <p className="text-slate-600 mb-4 text-lg sm:text-xl font-semibold">Start a conversation to begin</p>
            <p className="text-slate-500 text-base sm:text-lg leading-relaxed">Ask questions about your underwriting conversations and voice notes to get AI-powered insights instantly</p>
          </div>
        </div>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in-${msg.role === 'user' ? 'right' : 'left'} group`}
          role="article"
          aria-label={`${msg.role === 'user' ? 'Your message' : 'Assistant message'}`}
        >
          <div className="flex flex-col gap-1.5 max-w-2xl">
            <div className="flex items-end gap-2">
              <div
                className={`px-5 py-3.5 rounded-2xl transition-all duration-200 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-blue-600'
                    : 'bg-slate-100 text-slate-900 rounded-bl-none shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 hover:bg-slate-50'
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
                  onClick={() => handleCopyMessage(msg.id, msg.content)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-700 flex-shrink-0 hover:scale-110 active:scale-95"
                  title="Copy message"
                  aria-label="Copy message"
                  type="button"
                >
                  {copiedId === msg.id ? (
                    <FiCheck size={18} className="text-green-600" />
                  ) : (
                    <FiCopy size={18} />
                  )}
                </button>
              )}
            </div>
            {/* Message Timestamp */}
            <div className={`text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
              msg.role === 'user' ? 'text-right pr-1' : 'text-left pl-1'
            } ${msg.role === 'user' ? 'text-blue-200' : 'text-slate-500'}`}>
              {msg.createdAt ? formatTime(msg.createdAt) : ''}
            </div>
          </div>
        </div>
      ))}

      {isLoading && <LoadingSpinner />}

      <div ref={messagesEndRef} />
    </main>
  )
}

export const ChatMessages = memo(ChatMessagesComponent)

