import React, { forwardRef, memo } from 'react'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  hint?: string
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-sm',
  lg: 'px-4 py-3.5 text-base',
}

const InputComponent = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, size = 'md', leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" aria-hidden="true">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full rounded-lg border bg-slate-50 dark:bg-slate-800
              text-slate-900 dark:text-slate-50 placeholder:text-slate-500
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent
              hover:border-slate-300 dark:hover:border-slate-600
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-red-300 dark:border-red-700' : 'border-slate-200 dark:border-slate-700'}
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${sizeClasses[size]}
              ${className}
            `.trim().replace(/\s+/g, ' ')}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" aria-hidden="true">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

InputComponent.displayName = 'Input'

export const Input = memo(InputComponent)

