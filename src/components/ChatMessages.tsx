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
          <div className="text-center animate-fade-in max-w-md">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse-soft" aria-hidden="true">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Welcome to Marlamade</h2>
            <p className="text-slate-600 mb-3 text-base sm:text-lg font-medium">Start a conversation to begin</p>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">Ask questions about your underwriting conversations and voice notes to get AI-powered insights instantly</p>
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
                className={`px-4 py-3 rounded-2xl transition-all duration-200 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-md hover:shadow-lg hover:bg-blue-700'
                    : 'bg-slate-100 text-slate-900 rounded-bl-none shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300'
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

