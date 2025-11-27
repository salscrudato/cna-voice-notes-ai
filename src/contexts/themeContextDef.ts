import { createContext } from 'react'
import type { AccentColor } from '../utils/accentColors'

export type Theme = 'light' | 'dark'

export interface ThemeContextType {
  theme: Theme
  isDarkMode: boolean
  accentColor: AccentColor
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setAccentColor: (color: AccentColor) => void
  availableThemes: Theme[]
  availableAccentColors: AccentColor[]
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const AVAILABLE_THEMES: Theme[] = ['light', 'dark']
export const AVAILABLE_ACCENT_COLORS: AccentColor[] = ['blue', 'emerald', 'violet', 'red', 'amber', 'slate']

