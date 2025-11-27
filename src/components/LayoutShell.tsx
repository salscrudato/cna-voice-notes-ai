import React from 'react'
import type { ReactNode } from 'react'
import { useToast } from '../hooks/useToast'
import { ToastContainer } from './ToastContainer'

interface LayoutShellProps {
  children: ReactNode
}

/**
 * Global layout shell that applies global styles and manages theme
 * Should wrap the entire application
 */
const LayoutShellComponent: React.FC<LayoutShellProps> = ({ children }) => {
  const { toasts, removeToast } = useToast()

  return (
    <div>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  )
}

export const LayoutShell = React.memo(LayoutShellComponent)

