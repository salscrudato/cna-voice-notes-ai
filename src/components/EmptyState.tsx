import React, { memo } from 'react'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  variant?: 'default' | 'compact'
  suggestions?: string[]
  onSuggestionClick?: (suggestion: string) => void
}

const EmptyStateComponent: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  variant = 'default',
  suggestions,
  onSuggestionClick,
}) => {
  const { accentColor } = useTheme()
  const isCompact = variant === 'compact'

  return (
    <div className={`flex items-center justify-center ${isCompact ? 'py-8 px-4' : 'h-full py-12 px-4'}`}>
      <div className={`text-center animate-fade-in ${isCompact ? 'max-w-sm' : 'max-w-2xl'}`}>
        {icon && (
          <div className="mb-8 flex justify-center" aria-hidden="true">
            <div className="relative">
              {/* Animated rings */}
              <div
                className="absolute inset-0 rounded-3xl animate-pulse-scale opacity-30"
                style={{ background: getAccentColor(accentColor, '300') }}
              />
              <div
                className="absolute inset-0 rounded-3xl animate-pulse-scale opacity-20 [animation-delay:500ms]"
                style={{ background: getAccentColor(accentColor, '400'), transform: 'scale(1.2)' }}
              />
              <div
                className="relative inline-flex items-center justify-center p-5 transition-all duration-300 rounded-3xl hover:scale-110 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-lg shadow-lg dark:shadow-md border backdrop-blur-sm"
                style={{
                  background: `linear-gradient(135deg, ${getAccentColor(accentColor, '100')}, ${getAccentColor(accentColor, '50')})`,
                  borderColor: `${getAccentColor(accentColor, '200')}80`,
                }}
              >
                <div style={{ color: getAccentColor(accentColor, '600') }}>
                  {icon}
                </div>
              </div>
            </div>
          </div>
        )}

        <h2 className={`font-bold text-slate-900 dark:text-slate-50 mb-3 ${
          isCompact ? 'text-lg' : 'text-3xl sm:text-4xl'
        }`}>
          {title}
        </h2>

        <p className={`text-slate-600 dark:text-slate-400 ${
          isCompact ? 'text-sm mb-4' : 'text-base mb-6'
        }`}>
          {description}
        </p>

        {/* Suggestion chips */}
        {suggestions && suggestions.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick?.(suggestion)}
                className="px-4 py-2 text-sm rounded-full border transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                style={{
                  borderColor: getAccentColor(accentColor, '300'),
                  color: getAccentColor(accentColor, '700'),
                  background: `${getAccentColor(accentColor, '50')}80`,
                }}
                type="button"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 transition-all duration-200 hover:shadow-lg active:scale-95 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 text-white rounded-xl px-6 py-3 font-medium"
            style={{
              background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
              '--tw-ring-color': getAccentColor(accentColor, '500')
            } as React.CSSProperties}
            type="button"
          >
            {action.label}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export const EmptyState = memo(EmptyStateComponent)

