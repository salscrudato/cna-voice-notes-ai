import React, { memo } from 'react'
import { FiAlertCircle } from 'react-icons/fi'

interface ApiErrorBannerProps {
  error: string | undefined
}

const ApiErrorBannerComponent: React.FC<ApiErrorBannerProps> = ({ error }) => {
  if (!error) return null

  return (
    <div className="border-b border-red-200 bg-red-50 px-6 py-4 shadow-sm animate-slide-in-down" role="alert" aria-live="assertive">
      <div className="flex items-start gap-3 max-w-4xl mx-auto">
        <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5 animate-pulse" size={20} aria-hidden="true" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-900">⚠️ API Error</p>
          <p className="text-sm text-red-700 mt-1">{error}</p>
          <p className="text-xs text-red-600 mt-1">Please check your API key configuration and try again.</p>
        </div>
      </div>
    </div>
  )
}

export const ApiErrorBanner = memo(ApiErrorBannerComponent)

