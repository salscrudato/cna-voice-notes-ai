import React from 'react'
import type { ReactNode } from 'react'
import { useToast } from '../hooks/useToast'
import { useTheme } from '../hooks/useTheme'
import { ToastContainer } from './ToastContainer'

interface LayoutShellProps {
  children: ReactNode
}

/**
 * Global layout shell that applies global styles and manages theme
 * Should wrap the entire application
 */
const LayoutShellComponent: React.FC<LayoutShellProps> = ({ children }) => {
  const { isDarkMode } = useTheme()
  const { toasts, removeToast } = useToast()

  return (
    <div>
      <style>{`
        :root {
          color-scheme: ${isDarkMode ? 'dark' : 'light'};
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  )
}

export const LayoutShell = React.memo(LayoutShellComponent)

