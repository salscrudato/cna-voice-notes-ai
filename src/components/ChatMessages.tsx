import React, { useRef, useEffect, memo } from 'react'
import { FiLoader } from 'react-icons/fi'
import type { ChatMessage } from '../types'

interface ChatMessagesProps {
  messages: ChatMessage[]
  isLoading: boolean
}

const ChatMessagesComponent: React.FC<ChatMessagesProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white via-slate-50 to-slate-100" role="main" aria-label="Chat messages">
      {messages.length === 0 && !isLoading && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center animate-fade-in max-w-md">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse-soft">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-3">Welcome to Chat</h2>
            <p className="text-slate-600 mb-2 text-lg">Start a new conversation to begin</p>
            <p className="text-slate-500 text-sm">Ask questions, get insights, and explore ideas with AI</p>
          </div>
        </div>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in-${msg.role === 'user' ? 'right' : 'left'}`}
          role="article"
          aria-label={`${msg.role === 'user' ? 'Your message' : 'Assistant message'}`}
        >
          <div
            className={`max-w-2xl px-5 py-3.5 rounded-2xl transition-all duration-200 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
                : 'bg-white text-slate-900 rounded-bl-none shadow-sm border border-slate-200/80 hover:shadow-md hover:border-slate-300 hover:scale-105 active:scale-95'
            }`}
          >
            <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start animate-slide-in-left" aria-live="polite" aria-label="Assistant is thinking">
          <div className="bg-white text-slate-900 px-6 py-4 rounded-2xl rounded-bl-none shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" aria-hidden="true" />
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce delay-100" aria-hidden="true" />
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce delay-200" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                <FiLoader size={14} className="animate-spin" />
                Thinking...
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

