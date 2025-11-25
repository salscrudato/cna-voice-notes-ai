import React, { memo, useCallback } from 'react'
import { FiArrowUp } from 'react-icons/fi'
import { UI } from '../constants'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  isLoading: boolean
}

const ChatInputComponent: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  isLoading,
}) => {
  const isDisabled = isLoading || !value.trim()
  const charCount = value.length
  const maxChars = UI.MAX_MESSAGE_LENGTH

  const handleClick = useCallback(() => {
    if (!isDisabled) {
      onSend()
    }
  }, [isDisabled, onSend])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + Enter to send
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      if (!isDisabled) {
        onSend()
      }
    }
  }, [isDisabled, onSend])

  return (
    <div className="border-t border-slate-200/50 dark:border-slate-700/50 p-4 sm:p-6 bg-gradient-to-r from-white/95 via-slate-50/95 to-white/95 dark:from-slate-900/95 dark:via-slate-950/95 dark:to-slate-900/95 backdrop-blur-xl shadow-2xl dark:shadow-2xl dark:shadow-slate-900/50 transition-colors duration-300">
      <div className="flex gap-3 sm:gap-4 max-w-4xl mx-auto items-end">
        <div className="flex-1 relative">
          <textarea
            value={value}
            onChange={(e) => {
              if (e.target.value.length <= maxChars) {
                onChange(e.target.value)
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={UI.MESSAGE_INPUT_ROWS}
            disabled={isLoading}
            maxLength={maxChars}
            className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:shadow-lg focus:shadow-blue-500/50 resize-none text-sm text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-md dark:hover:shadow-lg hover:bg-white dark:hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:scale-[1.01] dark:hover:shadow-slate-900/50"
            style={{ maxHeight: `${UI.MESSAGE_INPUT_MAX_HEIGHT}px` }}
            aria-label="Message input"
            aria-describedby="send-button char-count"
            aria-busy={isLoading}
          />
        </div>
        <button
          id="send-button"
          onClick={handleClick}
          disabled={isDisabled}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 flex-shrink-0 font-medium touch-target border ${
            isDisabled
              ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-md dark:shadow-lg border-slate-300 dark:border-slate-600 dark:shadow-slate-900/50'
              : 'bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 hover:from-blue-500 hover:via-blue-500 hover:to-blue-600 text-white shadow-lg hover:shadow-2xl hover:shadow-blue-500/60 hover:-translate-y-1 hover:scale-110 active:scale-95 active:translate-y-0 border border-blue-500/40 hover:border-blue-400/60 transition-all duration-200'
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
        <div className="text-xs mt-4 max-w-4xl mx-auto flex items-center justify-end gap-3 animate-fade-in">
          <div className="w-full max-w-xs bg-slate-300 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden shadow-sm">
            <div
              className={`h-full transition-all duration-200 rounded-full ${
                charCount > maxChars * 0.9
                  ? 'bg-red-500 shadow-lg shadow-red-500/50'
                  : charCount > maxChars * 0.75
                    ? 'bg-amber-500 shadow-lg shadow-amber-500/50'
                    : 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/50'
              }`}
              style={{ width: `${Math.min((charCount / maxChars) * 100, 100)}%` }}
              aria-hidden="true"
            />
          </div>
          <div id="char-count" className={`font-semibold whitespace-nowrap text-xs px-3 py-1.5 rounded-lg transition-all duration-200 ${
            charCount > maxChars * 0.9
              ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30'
              : charCount > maxChars * 0.75
                ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30'
                : 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30'
          }`}>
            {charCount} / {maxChars}
          </div>
        </div>
      )}
    </div>
  )
}

export const ChatInput = memo(ChatInputComponent)

