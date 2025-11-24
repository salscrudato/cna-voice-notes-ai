import React, { memo } from 'react'

const LoadingSpinnerComponent: React.FC = () => {
  return (
    <div className="flex justify-start animate-slide-in-left" aria-live="polite" aria-label="Assistant is thinking">
      <div className="bg-white text-slate-900 px-4 py-3 rounded-lg rounded-bl-none shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-2">
          {/* Sleek Animated Dots with Wave Effect */}
          <div className="flex gap-1 items-center h-4">
            <div
              className="w-2 h-2 bg-blue-600 rounded-full shadow-sm animate-wave-dot"
              style={{ animationDelay: '0s' }}
              aria-hidden="true"
            />
            <div
              className="w-2 h-2 bg-blue-600 rounded-full shadow-sm animate-wave-dot"
              style={{ animationDelay: '0.15s' }}
              aria-hidden="true"
            />
            <div
              className="w-2 h-2 bg-blue-600 rounded-full shadow-sm animate-wave-dot"
              style={{ animationDelay: '0.3s' }}
              aria-hidden="true"
            />
          </div>

          {/* Thinking Text with Smooth Ellipsis */}
          <span className="text-xs font-medium text-slate-600 tracking-wide">
            Thinking<span className="inline-block animate-thinking-dots w-3 text-left">.</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export const LoadingSpinner = memo(LoadingSpinnerComponent)

