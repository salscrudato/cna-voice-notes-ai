import React, { memo } from 'react'

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
  const isCompact = variant === 'compact'

  return (
    <div className={`flex items-center justify-center ${isCompact ? 'py-8 px-4' : 'h-full py-12 px-4'}`}>
      <div className={`text-center animate-fade-in ${isCompact ? 'max-w-sm' : 'max-w-2xl'}`}>
        {icon && (
          <div className={`mb-8 flex justify-center ${isCompact ? '' : ''}`} aria-hidden="true">
            <div className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-100 dark:from-blue-900/40 dark:via-blue-900/30 dark:to-cyan-900/30 shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 dark:hover:shadow-blue-500/20 hover:scale-110 transition-all duration-300 rounded-3xl border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300/80 dark:hover:border-blue-600/80 hover:-translate-y-2">
              {icon}
            </div>
          </div>
        )}

        <h2 className={`font-bold text-slate-900 dark:text-slate-50 mb-3 ${
          isCompact ? 'text-xl' : 'text-4xl sm:text-5xl'
        }`}>
          {title}
        </h2>

        <p className={`text-slate-600 dark:text-slate-400 mb-8 ${
          isCompact ? 'text-sm' : 'text-lg font-medium'
        }`}>
          {description}
        </p>

        {action && (
          <button
            onClick={action.onClick}
            className="btn-primary inline-block hover:shadow-lg hover:shadow-blue-500/40 dark:hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95"
            type="button"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}

export const EmptyState = memo(EmptyStateComponent)

