import React, { memo } from 'react'
import { Toast, type ToastType } from './Toast'

export interface ToastMessage {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastContainerProps {
  toasts: ToastMessage[]
  onClose: (id: string) => void
}

/**
 * Container component for displaying multiple toast notifications
 * Positioned at the bottom-right of the screen
 */
const ToastContainerComponent: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            id={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={onClose}
          />
        </div>
      ))}
    </div>
  )
}

export const ToastContainer = memo(ToastContainerComponent)

