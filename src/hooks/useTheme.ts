import { useState, useEffect, useCallback } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface UseThemeReturn {
  theme: Theme
  isDarkMode: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

/**
 * Hook for managing application theme (light/dark mode)
 * Persists preference to localStorage and respects system preference
 */
export const useTheme = (): UseThemeReturn => {
  // Initialize theme from localStorage or system preference
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'system'
  })

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'system'
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return savedTheme === 'dark' || (savedTheme === 'system' && prefersDark)
  })

  // Apply theme to DOM
  const applyTheme = useCallback((dark: boolean) => {
    const htmlElement = document.documentElement
    if (dark) {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }
  }, [])

  // Apply initial theme on mount
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = theme === 'dark' || (theme === 'system' && prefersDark)
    applyTheme(shouldBeDark)
  }, [theme, applyTheme])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setIsDarkMode(e.matches)
        applyTheme(e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, applyTheme])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = newTheme === 'dark' || (newTheme === 'system' && prefersDark)

    setIsDarkMode(shouldBeDark)
    applyTheme(shouldBeDark)
  }, [applyTheme])

  const toggleTheme = useCallback(() => {
    const newTheme: Theme = isDarkMode ? 'light' : 'dark'
    setTheme(newTheme)
  }, [isDarkMode, setTheme])

  return {
    theme,
    isDarkMode,
    setTheme,
    toggleTheme,
  }
}

