import React, { memo } from 'react'
import { FiAlertCircle, FiX } from 'react-icons/fi'

interface ApiErrorBannerProps {
  error: string | undefined
  onDismiss?: () => void
}

const ApiErrorBannerComponent: React.FC<ApiErrorBannerProps> = ({ error, onDismiss }) => {
  if (!error) return null

  return (
    <div className="border-b border-red-200/60 bg-red-50/80 px-6 py-4 shadow-sm animate-slide-in-down backdrop-blur-sm" role="alert" aria-live="assertive" aria-atomic="true">
      <div className="flex items-start gap-3 max-w-4xl mx-auto">
        <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5 animate-pulse" size={20} aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-900">Error</p>
          <p className="text-sm text-red-700 mt-1 break-words">{error}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 hover:bg-red-100 rounded transition-colors text-red-600 hover:text-red-700"
            aria-label="Dismiss error"
            type="button"
          >
            <FiX size={18} />
          </button>
        )}
      </div>
    </div>
  )
}

export const ApiErrorBanner = memo(ApiErrorBannerComponent)

