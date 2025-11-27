import { useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'
import type { ThemeContextType, Theme } from '../contexts/ThemeContext'
import type { AccentColor } from '../utils/accentColors'

export type { Theme, ThemeContextType, AccentColor }

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

