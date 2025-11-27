import React, { memo } from 'react'
import { useTheme } from '../hooks/useTheme'
import type { AccentColor } from '../utils/accentColors'

/**
 * Accent color selector component
 * Allows users to dynamically select the accent color used throughout the app
 * Shows 6 popular accent colors
 */
const AccentColorSelectorComponent: React.FC = () => {
  const { accentColor, setAccentColor } = useTheme()

  const accentColors: Array<{ value: AccentColor; label: string; lightColor: string; darkColor: string }> = [
    {
      value: 'blue',
      label: 'Blue',
      lightColor: '#3b82f6',
      darkColor: '#60a5fa',
    },
    {
      value: 'emerald',
      label: 'Emerald',
      lightColor: '#10b981',
      darkColor: '#4ade80',
    },
    {
      value: 'violet',
      label: 'Violet',
      lightColor: '#a855f7',
      darkColor: '#c084fc',
    },
    {
      value: 'red',
      label: 'Red',
      lightColor: '#dc2626',
      darkColor: '#ef4444',
    },
    {
      value: 'amber',
      label: 'Amber',
      lightColor: '#f59e0b',
      darkColor: '#fbbf24',
    },
    {
      value: 'slate',
      label: 'Slate',
      lightColor: '#475569',
      darkColor: '#64748b',
    },
  ]

  return (
    <div className="flex items-center gap-2">
      {accentColors.map((color) => (
        <button
          key={color.value}
          onClick={() => setAccentColor(color.value)}
          className={`w-8 h-8 rounded-full transition-all duration-300 border-2 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
            accentColor === color.value
              ? 'border-slate-900 dark:border-slate-50 scale-125 shadow-lg hover:-translate-y-1'
              : 'border-slate-300 dark:border-slate-600 hover:scale-125 hover:shadow-lg hover:-translate-y-1'
          }`}
          style={{
            background: `linear-gradient(135deg, ${color.lightColor}, ${color.darkColor})`
          }}
          aria-label={`Select ${color.label} accent color`}
          title={`${color.label} accent`}
          type="button"
        />
      ))}
    </div>
  )
}

export const AccentColorSelector = memo(AccentColorSelectorComponent)

