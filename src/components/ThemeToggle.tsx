import React, { memo } from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'
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
      className="btn-icon relative group hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all duration-300 hover:scale-125 hover:-translate-y-0.5 active:scale-95 border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Light mode' : 'Dark mode'}
      type="button"
    >
      {/* Sun icon - shown in dark mode */}
      <div className={`absolute transition-all duration-300 ${isDarkMode ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-90'}`}>
        <FiSun size={20} className="text-amber-500 drop-shadow-md group-hover:drop-shadow-lg group-hover:text-amber-400 group-hover:scale-125 transition-all duration-300" aria-hidden="true" />
      </div>

      {/* Moon icon - shown in light mode */}
      <div className={`transition-all duration-300 ${isDarkMode ? 'opacity-0 scale-75 rotate-90' : 'opacity-100 scale-100 rotate-0'}`}>
        <FiMoon size={20} className="text-slate-600 drop-shadow-md group-hover:drop-shadow-lg group-hover:text-slate-700 group-hover:scale-125 transition-all duration-300" aria-hidden="true" />
      </div>
    </button>
  )
}

export const ThemeToggle = memo(ThemeToggleComponent)

