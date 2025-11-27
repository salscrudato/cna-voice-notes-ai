import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { AccentColor } from '../utils/accentColors'

export type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  isDarkMode: boolean
  accentColor: AccentColor
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setAccentColor: (color: AccentColor) => void
  availableThemes: Theme[]
  availableAccentColors: AccentColor[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const availableThemes: Theme[] = ['light', 'dark']
  const availableAccentColors: AccentColor[] = ['blue', 'emerald', 'violet', 'red', 'amber', 'slate']

  // Initialize theme from localStorage or default to light mode
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme
    return (saved && availableThemes.includes(saved)) ? saved : 'light'
  })

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'light'
    return savedTheme === 'dark'
  })

  // Initialize accent color from localStorage or default to red
  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem('accentColor') as AccentColor
    return (saved && availableAccentColors.includes(saved)) ? saved : 'red'
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
    if (!availableThemes.includes(newTheme)) return
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    setIsDarkMode(newTheme === 'dark')
  }, [])

  const setAccentColor = useCallback((newColor: AccentColor) => {
    if (!availableAccentColors.includes(newColor)) return
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
    availableThemes,
    availableAccentColors,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

