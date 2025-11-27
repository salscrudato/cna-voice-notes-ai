import { useCallback, useRef, useEffect } from 'react'
import {
  announceToScreenReader,
  focusElement,
  getFocusTrapBoundaries,
  isEscapeKey,
} from '../utils/accessibility'

interface UseAccessibilityOptions {
  enableFocusTrap?: boolean
  onEscape?: () => void
}

/**
 * Hook for accessibility features
 * Provides focus management, announcements, and keyboard handling
 */
export function useAccessibility(options: UseAccessibilityOptions = {}) {
  const { enableFocusTrap = false, onEscape } = options
  const containerRef = useRef<HTMLDivElement>(null)

  // Announce message to screen readers
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceToScreenReader(message, priority)
  }, [])

  // Focus element
  const focus = useCallback((element: HTMLElement | null, smooth: boolean = true) => {
    if (element) {
      focusElement(element, smooth)
    }
  }, [])

  // Handle focus trap
  useEffect(() => {
    if (!enableFocusTrap || !containerRef.current) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEscapeKey(event)) {
        onEscape?.()
        return
      }

      if (event.key !== 'Tab') return

      const { first, last } = getFocusTrapBoundaries(containerRef.current!)

      if (!first || !last) return

      if (event.shiftKey) {
        // Shift+Tab
        if (document.activeElement === first) {
          event.preventDefault()
          last.focus()
        }
      } else {
        // Tab
        if (document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    containerRef.current.addEventListener('keydown', handleKeyDown)

    return () => {
      containerRef.current?.removeEventListener('keydown', handleKeyDown)
    }
  }, [enableFocusTrap, onEscape])

  return {
    containerRef,
    announce,
    focus,
  }
}

