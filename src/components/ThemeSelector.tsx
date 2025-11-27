import React, { memo } from 'react'
import { FiSun, FiMoon } from '../utils/icons'
import { useTheme, type Theme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'
import { AccentColorSelector } from './AccentColorSelector'

/**
 * Theme selector component
 * Allows users to switch between light and dark themes and select accent colors
 */
const ThemeSelectorComponent: React.FC = () => {
  const { theme, toggleTheme, accentColor } = useTheme()

  const themeIcons: Record<Theme, React.ReactNode> = {
    light: <FiSun size={16} />,
    dark: <FiMoon size={16} />,
  }

  return (
    <div className="flex items-center gap-3">
      {/* Accent Color Selector */}
      <AccentColorSelector />

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="relative group w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-lg dark:hover:shadow-lg transition-all duration-300 hover:scale-125 active:scale-95 border border-slate-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 hover:-translate-y-1"
        style={{
          '--tw-ring-color': accentColor ? getAccentColor(accentColor, '500') : '#3b82f6'
        } as React.CSSProperties}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        type="button"
      >
        {/* Sun icon - shown in light mode */}
        <div className={`absolute transition-all duration-300 ${theme === 'light' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-90'}`}>
          <span className="text-slate-700 dark:text-slate-300">{themeIcons.light}</span>
        </div>

        {/* Moon icon - shown in dark mode */}
        <div className={`transition-all duration-300 ${theme === 'dark' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-90'}`}>
          <span className="text-slate-700 dark:text-slate-300">{themeIcons.dark}</span>
        </div>
      </button>
    </div>
  )
}

export const ThemeSelector = memo(ThemeSelectorComponent)

