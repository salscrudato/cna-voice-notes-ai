import React, { memo } from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md'
  removable?: boolean
  onRemove?: () => void
}

const variantClasses = {
  default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  primary: 'bg-accent-100 dark:bg-accent-900/40 text-accent-700 dark:text-accent-300 border-accent-200 dark:border-accent-700/50',
  success: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700/50',
  warning: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700/50',
  danger: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/50',
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
}

const BadgeComponent: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  removable,
  onRemove,
  className = '',
  children,
  ...props
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium border
        transition-all duration-200
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {children}
      {removable && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-0.5 -mr-1 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          aria-label="Remove"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  )
}

export const Badge = memo(BadgeComponent)

