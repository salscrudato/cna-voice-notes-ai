import React, { useCallback, memo } from 'react'
import { FiArrowUp } from '../utils/icons'
import { UI } from '../constants'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'

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
  const { accentColor } = useTheme()
  const isDisabled = isLoading || !value.trim()
  const maxChars = UI.MAX_MESSAGE_LENGTH

  const handleClick = useCallback(() => {
    if (!isDisabled) {
      onSend()
    }
  }, [isDisabled, onSend])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter to send, Shift+Enter for new line
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      if (!isDisabled) {
        onSend()
      }
    }
  }, [isDisabled, onSend])

	  return (
	    <div className="border-t border-slate-200/50 dark:border-slate-700/50 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 bg-gradient-to-t from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 transition-all duration-300 flex justify-center backdrop-blur-xs">
      <div className="flex gap-3 w-full max-w-4xl items-end">
        <div className="flex-1 relative group">
          <textarea
            value={value}
            onChange={(e) => {
              if (e.target.value.length <= maxChars) {
                onChange(e.target.value)
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything... (Enter to send, Shift+Enter for new line)"
            rows={UI.MESSAGE_INPUT_ROWS}
            disabled={isLoading}
            maxLength={maxChars}
            className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent resize-none text-sm text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-md dark:hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed shadow-sm dark:shadow-md group-hover:shadow-md dark:group-hover:shadow-lg focus:shadow-lg dark:focus:shadow-lg"
            style={{
              '--tw-ring-color': getAccentColor(accentColor, '500'),
              maxHeight: `${UI.MESSAGE_INPUT_MAX_HEIGHT}px`
            } as React.CSSProperties}
	            aria-label="Message input"
            aria-busy={isLoading}
            aria-describedby="char-count"
          />
        </div>
	        <button
	          id="send-button"
	          onClick={handleClick}
	          disabled={isDisabled}
	          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 font-medium touch-target ${
	            isDisabled
	              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
	              : 'text-white shadow-md hover:shadow-lg hover:-translate-y-1 hover:scale-110 active:scale-95 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950'
	          }`}
	          style={!isDisabled ? {
	            background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
	          } : undefined}
	          onMouseEnter={(e) => {
	            if (!isDisabled) {
	              (e.currentTarget as HTMLButtonElement).style.background = `linear-gradient(135deg, ${getAccentColor(accentColor, '700')}, ${getAccentColor(accentColor, '800')})`
	            }
	          }}
	          onMouseLeave={(e) => {
	            if (!isDisabled) {
	              (e.currentTarget as HTMLButtonElement).style.background = `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`
	            }
	          }}
	          onFocus={(e) => {
	            if (!isDisabled) {
	              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 0 3px rgba(255, 255, 255, 0.1), 0 0 0 5px ${getAccentColor(accentColor, '500')}`
	            }
	          }}
	          onBlur={(e) => {
	            (e.currentTarget as HTMLButtonElement).style.boxShadow = ''
	          }}
          aria-label={isLoading ? 'Sending message' : 'Send message'}
          aria-busy={isLoading}
          type="button"
        >
          {isLoading ? (
            <div className="animate-spin">
              <FiArrowUp size={18} aria-hidden="true" />
            </div>
          ) : (
            <FiArrowUp size={18} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  )
}

export const ChatInput = memo(ChatInputComponent)

