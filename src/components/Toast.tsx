import React, { useEffect, memo } from 'react'
import { FiCheck, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi'

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
          bg: 'bg-gradient-to-r from-green-50 to-green-100/60 dark:from-green-950/50 dark:to-green-900/40',
          border: 'border-green-200/60 dark:border-green-800/60',
          text: 'text-green-800 dark:text-green-200',
          shadow: 'shadow-lg dark:shadow-lg dark:shadow-green-500/10',
          icon: <FiCheck className="w-5 h-5 text-green-600 dark:text-green-400" />,
        }
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-red-100/60 dark:from-red-950/50 dark:to-red-900/40',
          border: 'border-red-200/60 dark:border-red-800/60',
          text: 'text-red-800 dark:text-red-200',
          shadow: 'shadow-lg dark:shadow-lg dark:shadow-red-500/10',
          icon: <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
        }
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-amber-50 to-amber-100/60 dark:from-amber-950/50 dark:to-amber-900/40',
          border: 'border-amber-200/60 dark:border-amber-800/60',
          text: 'text-amber-800 dark:text-amber-200',
          shadow: 'shadow-lg dark:shadow-lg dark:shadow-amber-500/10',
          icon: <FiAlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
        }
      case 'info':
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-50 to-blue-100/60 dark:from-blue-950/50 dark:to-blue-900/40',
          border: 'border-blue-200/60 dark:border-blue-800/60',
          text: 'text-blue-800 dark:text-blue-200',
          shadow: 'shadow-lg dark:shadow-lg dark:shadow-blue-500/10',
          icon: <FiInfo className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
        }
    }
  }

  const styles = getStyles()

  return (
    <div
      className={`${styles.bg} ${styles.border} ${styles.text} ${styles.shadow} border rounded-xl p-4 flex items-center gap-3 animate-slide-in-down max-w-sm backdrop-blur-sm hover:shadow-xl dark:hover:shadow-xl transition-all duration-200`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex-shrink-0" aria-hidden="true">{styles.icon}</div>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent hover:scale-110 active:scale-95"
        aria-label="Close notification"
        type="button"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  )
}

export const Toast = memo(ToastComponent)

