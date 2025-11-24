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
    onSend()
  }

  return (
    <div className="border-t border-slate-200/50 p-6 bg-gradient-to-t from-white via-white/95 to-white/80 backdrop-blur-md shadow-2xl">
      <div className="flex gap-3 max-w-4xl mx-auto items-end">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Ask me anything..."
          rows={1}
          className="flex-1 px-5 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm placeholder-slate-400 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg hover:border-slate-300 font-medium"
          style={{ maxHeight: '120px' }}
          aria-label="Message input"
          aria-describedby="send-button"
        />
        <button
          id="send-button"
          onClick={handleClick}
          disabled={isLoading || !value.trim()}
          className="w-11 h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-300 rounded-lg flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg hover:scale-110 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed flex-shrink-0 active:scale-95"
          aria-label={isLoading ? 'Sending message' : 'Send message'}
        >
          <FiArrowUp size={20} className="text-white" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export const ChatInput = memo(ChatInputComponent)

