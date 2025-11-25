import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Landing page header with navigation
 */
const LandingHeaderComponent: React.FC = () => {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-all duration-300 shadow-sm hover:shadow-md dark:shadow-lg dark:shadow-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group hover:scale-110 transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 rounded-lg px-2 py-1 active:scale-95"
            aria-label="Marlamade home"
            type="button"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-blue-500/60 group-hover:scale-125 transition-all duration-300 border border-blue-500/30 group-hover:border-blue-400/60 group-hover:-translate-y-0.5">
              <span className="text-white font-bold text-xs">CNA</span>
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-slate-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 group-hover:scale-105">Marlamade</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export const LandingHeader = memo(LandingHeaderComponent)

