import React, { memo } from 'react'
import { FiMoon, FiSun } from '../utils/icons'
import { useTheme } from '../hooks/useTheme'

/**
 * Theme toggle button component
 * Allows users to switch between light and dark modes
 */
const ThemeToggleComponent: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative group w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-md dark:hover:shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 border border-slate-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 hover:-translate-y-0.5"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Light mode' : 'Dark mode'}
      type="button"
    >
      {/* Sun icon - shown in dark mode */}
      <div className={`absolute transition-all duration-300 ${isDarkMode ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-90'}`}>
        <FiSun size={22} className="text-yellow-400 transition-colors duration-200" aria-hidden="true" />
      </div>

      {/* Moon icon - shown in light mode */}
      <div className={`transition-all duration-300 ${isDarkMode ? 'opacity-0 scale-75 rotate-90' : 'opacity-100 scale-100 rotate-0'}`}>
        <FiMoon size={22} className="text-slate-600 group-hover:text-slate-700 transition-colors duration-200" aria-hidden="true" />
      </div>
    </button>
  )
}

export const ThemeToggle = memo(ThemeToggleComponent)

