import React, { useState, useEffect, useCallback } from 'react'
import type { AccentColor } from '../utils/accentColors'
import { ThemeContext, AVAILABLE_THEMES, AVAILABLE_ACCENT_COLORS } from './themeContextDef'
import type { Theme, ThemeContextType } from './themeContextDef'

export type { Theme, ThemeContextType }
export { ThemeContext }

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize theme from localStorage or default to light mode
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme
    return (saved && AVAILABLE_THEMES.includes(saved)) ? saved : 'light'
  })

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'light'
    return savedTheme === 'dark'
  })

  // Initialize accent color from localStorage or default to red
  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem('accentColor') as AccentColor
    return (saved && AVAILABLE_ACCENT_COLORS.includes(saved)) ? saved : 'red'
  })

  // Apply theme and accent color to DOM
  const applyTheme = useCallback((newTheme: Theme, newAccentColor: AccentColor) => {
    const htmlElement = document.documentElement

    // Update dark mode class
    if (newTheme === 'dark') {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }

    // Update accent color class
    htmlElement.classList.remove('accent-blue', 'accent-emerald', 'accent-violet', 'accent-red', 'accent-amber', 'accent-slate')
    htmlElement.classList.add(`accent-${newAccentColor}`)
  }, [])

  // Apply initial theme on mount and when theme/accentColor changes
  useEffect(() => {
    applyTheme(theme, accentColor)
  }, [theme, accentColor, applyTheme])

  const setTheme = useCallback((newTheme: Theme) => {
    if (!AVAILABLE_THEMES.includes(newTheme)) return
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    setIsDarkMode(newTheme === 'dark')
  }, [])

  const setAccentColor = useCallback((newColor: AccentColor) => {
    if (!AVAILABLE_ACCENT_COLORS.includes(newColor)) return
    setAccentColorState(newColor)
    localStorage.setItem('accentColor', newColor)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) => {
      const newTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', newTheme)
      setIsDarkMode(newTheme === 'dark')
      return newTheme
    })
  }, [])

  const value: ThemeContextType = {
    theme,
    isDarkMode,
    accentColor,
    setTheme,
    toggleTheme,
    setAccentColor,
    availableThemes: AVAILABLE_THEMES,
    availableAccentColors: AVAILABLE_ACCENT_COLORS,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// useTheme hook is exported from src/hooks/useTheme.ts to satisfy react-refresh

