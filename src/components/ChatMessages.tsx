import React, { useRef, useEffect, useState, useCallback, memo } from 'react'
import { FiCopy, FiCheck } from '../utils/icons'
import { MessageRenderer } from './MessageRenderer'
import { EmptyState } from './EmptyState'
import { StreamingLoadingIndicator } from './StreamingLoadingIndicator'
import { UI } from '../constants'
import { formatTime } from '../utils/formatting'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'
import type { ChatMessage } from '../types'
import { logger } from '../services/logger'

interface ChatMessagesProps {
  messages: ChatMessage[]
  isLoading: boolean
  streamingContent?: string
  streamingStage?: 'thinking' | 'generating' | 'finalizing'
  onFollowUpClick?: (question: string) => void
  onEditMetadata?: () => void
}

interface MessageItemProps {
  message: ChatMessage
  isCopied: boolean
  onCopy: (messageId: string, content: string) => void
  onFollowUpClick?: (question: string) => void
}

// Memoized message item component for performance optimization
const MessageItem = memo<MessageItemProps>(({ message: msg, isCopied, onCopy, onFollowUpClick }) => {
  const { accentColor } = useTheme()

  return (
    <div
      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in-${msg.role === 'user' ? 'right' : 'left'} group px-2 sm:px-0 w-full`}
      role="article"
      aria-label={`${msg.role === 'user' ? 'Your message' : 'Assistant message'}`}
    >
      <div className="flex flex-col gap-2.5 max-w-3xl">
        <div className="flex items-end gap-3">
          <div
            className={`message-bubble ${
              msg.role === 'user'
                ? 'message-bubble-user'
                : 'message-bubble-assistant'
            }`}
            style={msg.role === 'user' ? {
              background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
              borderColor: getAccentColor(accentColor, '500'),
            } : undefined}
          >
            {msg.role === 'user' ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words font-medium text-white">{msg.content}</p>
            ) : (
              <MessageRenderer content={msg.content} onFollowUpClick={onFollowUpClick} />
            )}
          </div>
          {msg.role === 'assistant' && (
            <button
              onClick={() => onCopy(msg.id, msg.content)}
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-3 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex-shrink-0 hover:scale-125 hover:-translate-y-1 active:scale-95 active:translate-y-0 shadow-sm hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-slate-900/50 border border-slate-300/50 dark:border-slate-600/50 hover:border-slate-400/80 dark:hover:border-slate-500/80 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
              title="Copy message"
              aria-label="Copy message"
              type="button"
            >
              {isCopied ? (
                <FiCheck size={16} className="text-green-600 dark:text-green-400" />
              ) : (
                <FiCopy size={16} />
              )}
            </button>
          )}
        </div>
        {/* Message Timestamp - subtle styling */}
        <div
          className={`message-timestamp text-xs transition-opacity duration-200 ${
            msg.role === 'user' ? 'message-timestamp-user' : 'message-timestamp-assistant'
          }`}
        >
          {msg.createdAt ? formatTime(msg.createdAt) : ''}
        </div>
      </div>
    </div>
  )
})

MessageItem.displayName = 'MessageItem'

const ChatMessagesComponent: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  streamingContent = '',
  streamingStage = 'thinking',
  onFollowUpClick,
  onEditMetadata
}) => {
  const { accentColor } = useTheme()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: UI.MESSAGE_SCROLL_BEHAVIOR })
  }, [messages, isLoading, streamingContent])

  const handleCopyMessage = useCallback((messageId: string, content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedId(messageId)
      setTimeout(() => setCopiedId(null), UI.COPY_FEEDBACK_DURATION)
    }).catch((error) => {
      logger.error('Failed to copy message', error)
    })
  }, [])

  // Memoize the follow-up click handler
  const handleFollowUpClick = useCallback((question: string) => {
    onFollowUpClick?.(question)
  }, [onFollowUpClick])

  return (
    <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-5 sm:space-y-7 bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 transition-colors duration-300 flex flex-col items-center relative" role="main" aria-label="Chat messages">
      {/* Filter button - positioned on the right side, centered vertically */}
      {onEditMetadata && (
        <button
          onClick={onEditMetadata}
          className="fixed right-6 top-1/2 transform -translate-y-1/2 z-20 px-4 py-6 rounded-full text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-125 hover:-translate-x-1 active:scale-95 flex items-center justify-center group"
          style={{
            background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
            width: '48px',
            height: '72px',
          }}
          aria-label="Open filters"
          title="Open filters"
          type="button"
        >
          <span className="text-xs font-medium leading-none transform -rotate-90 whitespace-nowrap group-hover:scale-110 transition-transform duration-300">FILTER</span>
        </button>
      )}

      <div className="w-full max-w-4xl space-y-5 sm:space-y-7">
        {messages.length === 0 && !isLoading && (
          <EmptyState
            icon={
              <svg className="w-16 h-16 transition-colors duration-300 hover:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: getAccentColor(accentColor, '600') }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            title="Welcome to Marmalade"
            description="Your AI-powered underwriting assistant. Upload voice notes from broker calls and ask me anything about the discussion."
            suggestions={[
              "What were the key coverage requests from this call?",
              "Summarize the risk exposures discussed",
              "What follow-up items did the broker mention?",
              "Are there any coverage gaps I should address?"
            ]}
            onSuggestionClick={onFollowUpClick}
          />
        )}

        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            isCopied={copiedId === msg.id}
            onCopy={handleCopyMessage}
            onFollowUpClick={handleFollowUpClick}
          />
        ))}

        {isLoading && (
          <>
            {streamingContent && (
              <div className="flex justify-start animate-fade-in-up" role="article" aria-label="Streaming response">
                <div className="message-bubble message-bubble-assistant animate-fade-in-up">
                  <MessageRenderer content={streamingContent} onFollowUpClick={onFollowUpClick} />
                </div>
              </div>
            )}
            <StreamingLoadingIndicator stage={streamingStage} isStreaming={true} />
          </>
        )}

        <div ref={messagesEndRef} />
      </div>
    </main>
  )
};


export const ChatMessages = ChatMessagesComponent


