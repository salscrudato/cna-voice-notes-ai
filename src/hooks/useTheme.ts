/**
 * Hook for managing theme (light/dark mode)
 * Persists preference to localStorage and respects system preferences
 */

import { useState, useEffect, useCallback } from 'react'

export type Theme = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'cna-voice-notes-theme'

/**
 * Get the effective theme (resolves 'system' to actual theme)
 */
function getEffectiveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}

/**
 * Hook to manage theme preference
 * @returns Current theme, effective theme, and function to set theme
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Try to load from localStorage
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored
    }
    // Default to system preference
    return 'system'
  })

  const effectiveTheme = getEffectiveTheme(theme)

  // Update document class when theme changes
  useEffect(() => {
    const htmlElement = document.documentElement
    if (effectiveTheme === 'dark') {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }
  }, [effectiveTheme])

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      // Trigger re-render by updating effective theme
      const htmlElement = document.documentElement
      if (mediaQuery.matches) {
        htmlElement.classList.add('dark')
      } else {
        htmlElement.classList.remove('dark')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
  }, [])

  return {
    theme,
    effectiveTheme,
    setTheme,
  }
}

