import React from 'react'
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
}

const EmptyStateComponent: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  variant = 'default',
}) => {
  const { accentColor } = useTheme()
  const isCompact = variant === 'compact'

  return (
    <div className={`flex items-center justify-center ${isCompact ? 'py-8 px-4' : 'h-full py-12 px-4'}`}>
      <div className={`text-center animate-fade-in ${isCompact ? 'max-w-sm' : 'max-w-2xl'}`}>
        {icon && (
          <div className={`mb-8 flex justify-center ${isCompact ? '' : ''}`} aria-hidden="true">
            <div className="inline-flex items-center justify-center p-5 transition-all duration-300 rounded-3xl hover:scale-110 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-lg shadow-lg dark:shadow-md border"
              style={{
                background: `linear-gradient(to bottom right, ${getAccentColor(accentColor, '100')}, ${getAccentColor(accentColor, '50')})`,
                borderColor: `${getAccentColor(accentColor, '200')}80`,
                boxShadow: `0 0 0 0 ${getAccentColor(accentColor, '500')}33`
              }}
            >
              <div style={{ color: getAccentColor(accentColor, '600') }}>
                {icon}
              </div>
            </div>
          </div>
        )}

        <h2 className={`font-bold text-slate-900 dark:text-slate-50 mb-3 ${
          isCompact ? 'text-lg' : 'text-3xl sm:text-4xl'
        }`}>
          {title}
        </h2>

        <p className={`text-slate-600 dark:text-slate-400 mb-8 ${
          isCompact ? 'text-sm' : 'text-base'
        }`}>
          {description}
        </p>

        {action && (
          <button
            onClick={action.onClick}
            className="inline-block transition-all duration-200 hover:shadow-lg active:scale-95 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 text-white rounded-lg px-6 py-2.5 font-medium"
            style={{
              background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
              '--tw-ring-color': getAccentColor(accentColor, '500')
            } as React.CSSProperties}
            type="button"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}

export const EmptyState = EmptyStateComponent

