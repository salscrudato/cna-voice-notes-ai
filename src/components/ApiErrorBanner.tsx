import React, { memo } from 'react'
import { FiAlertCircle, FiX } from '../utils/icons'

interface ApiErrorBannerProps {
  error: string | undefined
  onDismiss?: () => void
}

const ApiErrorBannerComponent: React.FC<ApiErrorBannerProps> = ({ error, onDismiss }) => {
  if (!error) return null

  return (
    <div className="border-b border-red-200/50 dark:border-red-900/50 bg-gradient-to-r from-red-50 to-red-50/50 dark:from-red-950/40 dark:to-red-950/20 px-6 py-5 shadow-md dark:shadow-lg animate-slide-in-down hover:shadow-lg dark:hover:shadow-lg transition-all duration-300 hover:-translate-y-1" role="alert" aria-live="assertive" aria-atomic="true">
      <div className="flex items-start gap-4 max-w-4xl mx-auto">
        <FiAlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-1 animate-pulse" size={22} aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-red-900 dark:text-red-300">Error</p>
          <p className="text-sm text-red-800 dark:text-red-200 mt-2 break-words leading-relaxed">{error}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-2 hover:bg-red-200 dark:hover:bg-red-900/40 rounded-lg transition-all duration-300 text-red-600 dark:text-red-400 hover:scale-125 active:scale-95 hover:shadow-sm dark:hover:shadow-md hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
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

