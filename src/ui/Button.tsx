import React, { memo } from 'react'
import { FiLoader } from 'react-icons/fi'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg active:shadow-sm',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 hover:border-slate-400 shadow-sm hover:shadow-md',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg active:shadow-sm',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  success: 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg active:shadow-sm',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm font-medium rounded-lg',
  md: 'px-4 py-2.5 text-base font-semibold rounded-lg',
  lg: 'px-6 py-3 text-lg font-semibold rounded-xl',
}

const ButtonComponent = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading

    const baseClasses = 'inline-flex items-center justify-center gap-2 transition-all duration-200 ease-out focus-visible-ring disabled:opacity-60 disabled:cursor-not-allowed hover:scale-105 active:scale-95'

    const fullWidthClass = fullWidth ? 'w-full' : ''

    const finalClassName = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidthClass} ${className || ''}`

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={finalClassName}
        {...props}
      >
        {isLoading && <FiLoader className="animate-spin" size={18} aria-hidden="true" />}
        {!isLoading && icon && iconPosition === 'left' && icon}
        {children}
        {!isLoading && icon && iconPosition === 'right' && icon}
      </button>
    )
  }
)

ButtonComponent.displayName = 'Button'

export const Button = memo(ButtonComponent)

