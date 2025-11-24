import React, { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useTheme } from '../hooks/useTheme'

interface LayoutShellProps {
  children: ReactNode
}

/**
 * Global layout shell that handles theme initialization and applies global styles
 * Should wrap the entire application
 */
const LayoutShellComponent: React.FC<LayoutShellProps> = ({ children }) => {
  const { effectiveTheme } = useTheme()

  // Ensure theme is applied on mount
  useEffect(() => {
    const htmlElement = document.documentElement
    if (effectiveTheme === 'dark') {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }
  }, [effectiveTheme])

  return (
    <div className={`${effectiveTheme === 'dark' ? 'dark' : ''}`}>
      <style>{`
        :root {
          color-scheme: ${effectiveTheme};
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

