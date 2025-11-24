import React, { memo } from 'react'

const LoadingSpinnerComponent: React.FC = () => {
  return (
    <div className="flex justify-start animate-slide-in-left" aria-live="polite" aria-label="Assistant is thinking">
      <div className="bg-slate-100 text-slate-900 px-5 py-3.5 rounded-2xl rounded-bl-none shadow-md border border-slate-200 hover:shadow-lg transition-all duration-200">
        <div className="flex items-center gap-3">
          {/* Sleek Animated Dots with Wave Effect */}
          <div className="flex gap-1.5 items-center h-5">
            <div
              className="w-2.5 h-2.5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full shadow-md animate-wave-dot"
              style={{ animationDelay: '0s' }}
              aria-hidden="true"
            />
            <div
              className="w-2.5 h-2.5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full shadow-md animate-wave-dot"
              style={{ animationDelay: '0.15s' }}
              aria-hidden="true"
            />
            <div
              className="w-2.5 h-2.5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full shadow-md animate-wave-dot"
              style={{ animationDelay: '0.3s' }}
              aria-hidden="true"
            />
          </div>

          {/* Thinking Text with Smooth Ellipsis */}
          <span className="text-sm font-semibold text-slate-700 tracking-wide">
            Thinking<span className="inline-block animate-thinking-dots w-3 text-left">.</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export const LoadingSpinner = memo(LoadingSpinnerComponent)

