import React, { memo } from 'react'

const LoadingSpinnerComponent: React.FC = () => {
  return (
    <div className="flex justify-start animate-slide-in-left" aria-live="polite" aria-label="Assistant is thinking">
      <div className="bg-gradient-to-br from-slate-100 via-slate-50/90 to-slate-50 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900 text-slate-900 dark:text-slate-50 px-5 py-3.5 rounded-2xl rounded-bl-none shadow-md dark:shadow-md dark:shadow-slate-900/50 hover:shadow-lg dark:hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.01] border border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300/80 dark:hover:border-slate-600/80 transition-all duration-200 dark:hover:shadow-slate-900/60">
        <div className="flex items-center gap-3">
          {/* Sleek Animated Dots with Wave Effect */}
          <div className="flex gap-1.5 items-center h-5">
            <div
              className="w-2.5 h-2.5 bg-gradient-to-b from-blue-500 via-blue-600 to-blue-600 dark:from-blue-400 dark:via-blue-500 dark:to-blue-500 rounded-full shadow-md dark:shadow-lg dark:shadow-blue-500/30 animate-wave-dot"
              style={{ animationDelay: '0s' }}
              aria-hidden="true"
            />
            <div
              className="w-2.5 h-2.5 bg-gradient-to-b from-blue-500 via-blue-600 to-blue-600 dark:from-blue-400 dark:via-blue-500 dark:to-blue-500 rounded-full shadow-md dark:shadow-lg dark:shadow-blue-500/30 animate-wave-dot"
              style={{ animationDelay: '0.15s' }}
              aria-hidden="true"
            />
            <div
              className="w-2.5 h-2.5 bg-gradient-to-b from-blue-500 via-blue-600 to-blue-600 dark:from-blue-400 dark:via-blue-500 dark:to-blue-500 rounded-full shadow-md dark:shadow-lg dark:shadow-blue-500/30 animate-wave-dot"
              style={{ animationDelay: '0.3s' }}
              aria-hidden="true"
            />
          </div>

          {/* Thinking Text with Smooth Ellipsis */}
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
            Thinking<span className="inline-block animate-thinking-dots w-3 text-left">.</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export const LoadingSpinner = memo(LoadingSpinnerComponent)

