import React, { useEffect } from 'react'
import type { ReactNode } from 'react'

interface LayoutShellProps {
  children: ReactNode
}

/**
 * Global layout shell that applies global styles
 * Should wrap the entire application
 */
const LayoutShellComponent: React.FC<LayoutShellProps> = ({ children }) => {
  // Ensure light theme is applied on mount
  useEffect(() => {
    const htmlElement = document.documentElement
    htmlElement.classList.remove('dark')
  }, [])

  return (
    <div>
      <style>{`
        :root {
          color-scheme: light;
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
    </div>
  )
}

export const LayoutShell = React.memo(LayoutShellComponent)

