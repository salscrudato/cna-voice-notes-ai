import React, { forwardRef, memo, useCallback, useRef, useImperativeHandle, useEffect } from 'react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  autoGrow?: boolean
  maxHeight?: number
  showCharCount?: boolean
  maxLength?: number
}

const TextareaComponent = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, autoGrow = false, maxHeight = 200, showCharCount, maxLength, className = '', id, value, onChange, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const inputId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)
    
    useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement)

    const adjustHeight = useCallback(() => {
      const textarea = textareaRef.current
      if (!textarea || !autoGrow) return
      
      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`
    }, [autoGrow, maxHeight])

    useEffect(() => {
      adjustHeight()
    }, [value, adjustHeight])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e)
      if (autoGrow) {
        adjustHeight()
      }
    }

    const charCount = typeof value === 'string' ? value.length : 0
    
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
        <textarea
          ref={textareaRef}
          id={inputId}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          className={`
            w-full px-4 py-3 rounded-lg border bg-slate-50 dark:bg-slate-800
            text-slate-900 dark:text-slate-50 placeholder:text-slate-500
            transition-all duration-200 resize-none
            focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent
            hover:border-slate-300 dark:hover:border-slate-600
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-300 dark:border-red-700' : 'border-slate-200 dark:border-slate-700'}
            ${className}
          `.trim().replace(/\s+/g, ' ')}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        <div className="flex justify-between mt-1.5">
          <div>
            {error && (
              <p id={`${inputId}-error`} className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            {hint && !error && (
              <p id={`${inputId}-hint`} className="text-sm text-slate-500 dark:text-slate-400">
                {hint}
              </p>
            )}
          </div>
          {showCharCount && maxLength && (
            <span className={`text-xs ${charCount >= maxLength ? 'text-red-500' : 'text-slate-400'}`}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  }
)

TextareaComponent.displayName = 'Textarea'

export const Textarea = memo(TextareaComponent)

