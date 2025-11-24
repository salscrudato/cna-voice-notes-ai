import React, { memo } from 'react'
import { FiArrowUp } from 'react-icons/fi'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onKeyPress: (e: React.KeyboardEvent) => void
  onSend: () => void
  isLoading: boolean
}

const ChatInputComponent: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onKeyPress,
  onSend,
  isLoading,
}) => {
  const handleClick = () => {
    if (!isDisabled) {
      onSend()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + Enter to send
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      if (!isDisabled) {
        onSend()
      }
    }
  }

  const isDisabled = isLoading || !value.trim()
  const charCount = value.length
  const maxChars = 4000

  return (
    <div className="border-t border-slate-200/50 p-4 sm:p-6 bg-gradient-to-t from-white via-white/95 to-white/80 backdrop-blur-md shadow-2xl">
      <div className="flex gap-2 sm:gap-3 max-w-4xl mx-auto items-end">
        <textarea
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= maxChars) {
              onChange(e.target.value)
            }
          }}
          onKeyPress={onKeyPress}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything... (Ctrl+Enter to send)"
          rows={1}
          disabled={isLoading}
          maxLength={maxChars}
          className="flex-1 px-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg hover:border-slate-300 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ maxHeight: '120px' }}
          aria-label="Message input"
          aria-describedby="send-button char-count"
          aria-busy={isLoading}
        />
        <button
          id="send-button"
          onClick={handleClick}
          disabled={isDisabled}
          className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0 font-medium ${
            isDisabled
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg hover:scale-110 active:scale-95'
          }`}
          aria-label={isLoading ? 'Sending message' : 'Send message'}
          aria-busy={isLoading}
          type="button"
        >
          {isLoading ? (
            <div className="animate-spin">
              <FiArrowUp size={20} aria-hidden="true" />
            </div>
          ) : (
            <FiArrowUp size={20} aria-hidden="true" />
          )}
        </button>
      </div>
      {value.length > 0 && (
        <div className="text-xs mt-2 max-w-4xl mx-auto flex items-center justify-end gap-2">
          <div className="w-full max-w-xs bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${
                charCount > maxChars * 0.9
                  ? 'bg-red-500'
                  : charCount > maxChars * 0.75
                    ? 'bg-amber-500'
                    : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min((charCount / maxChars) * 100, 100)}%` }}
              aria-hidden="true"
            />
          </div>
          <div id="char-count" className={`font-semibold whitespace-nowrap ${
            charCount > maxChars * 0.9
              ? 'text-red-600'
              : charCount > maxChars * 0.75
                ? 'text-amber-600'
                : 'text-slate-500'
          }`}>
            {charCount} / {maxChars}
          </div>
        </div>
      )}
    </div>
  )
}

export const ChatInput = memo(ChatInputComponent)

