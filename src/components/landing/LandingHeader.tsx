import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThemeSelector } from '../ThemeSelector'
import { useTheme } from '../../hooks/useTheme'
import { getAccentColor } from '../../utils/accentColors'

/**
 * Landing page header with navigation
 */
const LandingHeaderComponent: React.FC = () => {
  const navigate = useNavigate()
  const { accentColor } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 shadow-sm dark:shadow-md backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group hover:scale-105 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 rounded-lg px-3 py-2 active:scale-95 hover:-translate-y-1"
            style={{
              '--tw-ring-color': getAccentColor(accentColor, '500')
            } as React.CSSProperties}
            aria-label="EVR home"
            type="button"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 border group-hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
                borderColor: `${getAccentColor(accentColor, '500')}4d`
              }}
            >
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-base text-slate-900 dark:text-slate-50 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-200">EVR</span>
          </button>

          {/* Theme Selector */}
          <ThemeSelector />
        </div>
      </div>
    </header>
  )
}

export const LandingHeader = memo(LandingHeaderComponent)

