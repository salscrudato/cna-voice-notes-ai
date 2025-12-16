import React, { forwardRef, memo } from 'react'

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'solid'
  size?: 'sm' | 'md' | 'lg'
  'aria-label': string
}

const variantClasses = {
  default: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200/50 dark:border-slate-700/50',
  ghost: 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100',
  solid: 'bg-accent-600 text-white hover:bg-accent-700 shadow-sm hover:shadow-md',
}

const sizeClasses = {
  sm: 'p-1.5 rounded-md',
  md: 'p-2.5 rounded-lg',
  lg: 'p-3 rounded-lg',
}

const IconButtonComponent = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'default', size = 'md', className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={`
          inline-flex items-center justify-center
          transition-all duration-200 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950
          hover:scale-110 hover:-translate-y-0.5 active:scale-95 active:translate-y-0
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...props}
      >
        {children}
      </button>
    )
  }
)

IconButtonComponent.displayName = 'IconButton'

export const IconButton = memo(IconButtonComponent)

