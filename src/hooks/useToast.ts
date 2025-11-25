import { useState, useCallback } from 'react'
import type { ToastType } from '../components/Toast'

export interface ToastMessage {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface UseToastReturn {
  toasts: ToastMessage[]
  showToast: (message: string, type?: ToastType, duration?: number) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

/**
 * Hook for managing toast notifications
 * Provides methods to show, remove, and clear toasts
 */
export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((
    message: string,
    type: ToastType = 'info',
    duration: number = 3000,
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    const newToast: ToastMessage = { id, type, message, duration }

    setToasts((prev) => [...prev, newToast])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    showToast,
    removeToast,
    clearToasts,
  }
}

