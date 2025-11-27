import React, { useEffect, memo } from 'react'
import { FiCheck, FiAlertCircle, FiInfo, FiX } from '../utils/icons'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  id: string
  type: ToastType
  message: string
  duration?: number
  onClose: (id: string) => void
}

/**
 * Individual toast notification component
 * Displays a temporary notification with auto-dismiss
 */
const ToastComponent: React.FC<ToastProps> = ({
  id,
  type,
  message,
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-50 to-green-50/50 dark:from-green-950/40 dark:to-green-950/20',
          border: 'border-green-200 dark:border-green-800/50',
          text: 'text-green-800 dark:text-green-200',
          icon: <FiCheck className="w-6 h-6 text-green-600 dark:text-green-400" />,
        }
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-red-50/50 dark:from-red-950/40 dark:to-red-950/20',
          border: 'border-red-200 dark:border-red-800/50',
          text: 'text-red-800 dark:text-red-200',
          icon: <FiAlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />,
        }
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-amber-50 to-amber-50/50 dark:from-amber-950/40 dark:to-amber-950/20',
          border: 'border-amber-200 dark:border-amber-800/50',
          text: 'text-amber-800 dark:text-amber-200',
          icon: <FiAlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
        }
      case 'info':
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-950/40 dark:to-blue-950/20',
          border: 'border-blue-200 dark:border-blue-800/50',
          text: 'text-blue-800 dark:text-blue-200',
          icon: <FiInfo className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
        }
    }
  }

  const styles = getStyles()

  return (
    <div
      className={`${styles.bg} ${styles.border} ${styles.text} border rounded-xl p-5 flex items-center gap-4 animate-slide-in-down max-w-sm shadow-lg dark:shadow-lg transition-all duration-300 hover:shadow-xl dark:hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex-shrink-0 animate-enhanced-pulse" aria-hidden="true">{styles.icon}</div>
      <p className="flex-1 text-sm font-semibold">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-2 hover:bg-white/30 dark:hover:bg-white/15 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-sm dark:hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
        aria-label="Close notification"
        type="button"
      >
        <FiX className="w-5 h-5" />
      </button>
    </div>
  )
}

export const Toast = memo(ToastComponent)

