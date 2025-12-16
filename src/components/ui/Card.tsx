import React, { memo } from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'interactive'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const variantClasses = {
  default: 'bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 shadow-sm',
  elevated: 'bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-shadow duration-300',
  outlined: 'bg-transparent border border-slate-200 dark:border-slate-700',
  interactive: 'bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-lg hover:border-accent-300/80 dark:hover:border-accent-600/80 hover:-translate-y-1 transition-all duration-300 cursor-pointer',
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4 sm:p-5',
  lg: 'p-6 sm:p-8',
}

const CardComponent: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  className = '',
  children,
  ...props
}) => {
  return (
    <div
      className={`
        rounded-xl
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {children}
    </div>
  )
}

export const Card = memo(CardComponent)

