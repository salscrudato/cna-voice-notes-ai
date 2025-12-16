import React, { forwardRef, memo } from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const variantClasses = {
  primary: 'bg-gradient-to-r from-accent-600 to-accent-700 text-white hover:from-accent-700 hover:to-accent-800 shadow-md hover:shadow-lg focus-visible:ring-accent-500',
  secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 focus-visible:ring-slate-500',
  ghost: 'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-slate-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg focus-visible:ring-red-500',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-lg gap-2',
  lg: 'px-6 py-3 text-base rounded-lg gap-2.5',
}

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, className = '', disabled, ...props }, ref) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center font-medium
          transition-all duration-200 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950
          hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
        ) : leftIcon ? (
          <span className="flex-shrink-0" aria-hidden="true">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !isLoading && (
          <span className="flex-shrink-0" aria-hidden="true">{rightIcon}</span>
        )}
      </button>
    )
  }
)

ButtonComponent.displayName = 'Button'

export const Button = memo(ButtonComponent)

