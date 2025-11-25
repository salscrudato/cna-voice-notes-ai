import React, { memo } from 'react'
import { FiAlertCircle, FiX } from 'react-icons/fi'

interface ApiErrorBannerProps {
  error: string | undefined
  onDismiss?: () => void
}

const ApiErrorBannerComponent: React.FC<ApiErrorBannerProps> = ({ error, onDismiss }) => {
  if (!error) return null

  return (
    <div className="border-b border-red-300 dark:border-red-900 bg-gradient-to-r from-red-50 via-red-50/80 to-red-100/50 dark:from-red-950/30 dark:via-red-950/25 dark:to-red-900/20 px-6 py-4 shadow-md dark:shadow-lg dark:shadow-red-500/20 animate-slide-in-down backdrop-blur-md hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-red-500/30 hover:-translate-y-1 transition-all duration-300" role="alert" aria-live="assertive" aria-atomic="true">
      <div className="flex items-start gap-3 max-w-4xl mx-auto">
        <FiAlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5 animate-pulse shadow-md shadow-red-500/40 hover:scale-110 transition-transform duration-300" size={22} aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-red-900 dark:text-red-300">Error</p>
          <p className="text-sm text-red-800 dark:text-red-200 mt-1 break-words font-medium">{error}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1.5 hover:bg-red-200 dark:hover:bg-red-900/40 rounded-lg transition-all duration-300 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:scale-125 hover:-translate-y-1 active:scale-95 focus-visible:ring-2 focus-visible:ring-red-500 border border-red-300/50 dark:border-red-700/50 hover:border-red-400/80 dark:hover:border-red-600/80"
            aria-label="Dismiss error"
            type="button"
          >
            <FiX size={20} />
          </button>
        )}
      </div>
    </div>
  )
}

export const ApiErrorBanner = memo(ApiErrorBannerComponent)

