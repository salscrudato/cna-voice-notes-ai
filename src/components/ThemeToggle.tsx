import React, { memo } from 'react'
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi'
import { useTheme } from '../hooks/useTheme'
import type { Theme } from '../hooks/useTheme'

const ThemeToggleComponent: React.FC = () => {
  const { theme, setTheme } = useTheme()

  const themes: Array<{ value: Theme; label: string; icon: React.ReactNode }> = [
    { value: 'light', label: 'Light', icon: <FiSun size={16} /> },
    { value: 'dark', label: 'Dark', icon: <FiMoon size={16} /> },
    { value: 'system', label: 'System', icon: <FiMonitor size={16} /> },
  ]

  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
      {themes.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`p-2 rounded transition-all duration-200 flex items-center justify-center ${
            theme === value
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          title={label}
          aria-label={`Switch to ${label} theme`}
          aria-pressed={theme === value}
        >
          {icon}
        </button>
      ))}
    </div>
  )
}

export const ThemeToggle = memo(ThemeToggleComponent)

