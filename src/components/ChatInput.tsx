import React, { memo, useCallback } from 'react'
import { FiArrowUp } from 'react-icons/fi'
import { UI } from '../constants'

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
    <div className="border-t border-slate-200 p-4 sm:p-6 bg-gradient-to-b from-white to-slate-50">
      <div className="flex gap-3 sm:gap-4 max-w-4xl mx-auto items-end">
        <div className="flex-1 relative">
          <textarea
            value={value}
            onChange={(e) => {
              if (e.target.value.length <= maxChars) {
                onChange(e.target.value)
              }
            }}
            onKeyPress={onKeyPress}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={UI.MESSAGE_INPUT_ROWS}
            disabled={isLoading}
            maxLength={maxChars}
            className="w-full px-5 py-3.5 bg-white border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-slate-900 placeholder-slate-500 transition-all duration-200 hover:border-slate-400 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg focus:shadow-xl"
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
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 flex-shrink-0 font-medium touch-target ${
            isDisabled
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-110 active:scale-95'
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
        <div className="text-xs mt-3 max-w-4xl mx-auto flex items-center justify-end gap-3">
          <div className="w-full max-w-xs bg-slate-200 rounded-full h-2 overflow-hidden">
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
          <div id="char-count" className={`font-semibold whitespace-nowrap text-xs ${
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

