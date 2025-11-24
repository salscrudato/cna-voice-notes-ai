import React, { memo } from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'

interface DarkModeToggleProps {
  isDarkMode: boolean
  onToggle: () => void
}

const DarkModeToggleComponent: React.FC<DarkModeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:scale-110 active:scale-95 font-medium touch-target"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Light mode' : 'Dark mode'}
      type="button"
    >
      {isDarkMode ? (
        <FiSun size={20} aria-hidden="true" />
      ) : (
        <FiMoon size={20} aria-hidden="true" />
      )}
    </button>
  )
}

export const DarkModeToggle = memo(DarkModeToggleComponent)

