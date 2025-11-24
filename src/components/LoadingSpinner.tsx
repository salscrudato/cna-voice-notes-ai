import React, { memo } from 'react'

const LoadingSpinnerComponent: React.FC = () => {
  return (
    <div className="flex justify-start animate-slide-in-left" aria-live="polite" aria-label="Assistant is thinking">
      <div className="bg-gradient-to-r from-white to-blue-50/30 text-slate-900 px-6 py-4 rounded-2xl rounded-bl-none shadow-sm border border-slate-200/80 hover:shadow-md hover:border-blue-200/60 transition-all duration-200">
        <div className="flex items-center gap-3">
          {/* Sleek Animated Dots with Wave Effect */}
          <div className="flex gap-1 items-center h-5">
            <div
              className="w-2.5 h-2.5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full shadow-sm animate-wave-dot"
              style={{ animationDelay: '0s' }}
              aria-hidden="true"
            />
            <div
              className="w-2.5 h-2.5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full shadow-sm animate-wave-dot"
              style={{ animationDelay: '0.15s' }}
              aria-hidden="true"
            />
            <div
              className="w-2.5 h-2.5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full shadow-sm animate-wave-dot"
              style={{ animationDelay: '0.3s' }}
              aria-hidden="true"
            />
          </div>

          {/* Thinking Text with Smooth Ellipsis */}
          <span className="text-sm font-medium text-slate-600 tracking-wide">
            Thinking<span className="inline-block animate-thinking-dots w-4 text-left">.</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export const LoadingSpinner = memo(LoadingSpinnerComponent)

