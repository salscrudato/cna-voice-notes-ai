import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { LandingHero } from '../components/landing/LandingHero'

const LandingPageComponent: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex flex-col">
      {/* Top bar: brand and primary call-to-action */}
      <header className="px-4 sm:px-8 py-4 sm:py-5 bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group cursor-pointer focus-visible-ring rounded-lg p-1"
            aria-label="CNA Voice Notes AI home"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg group-hover:scale-105 transition-transform">
              CNA
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Voice Notes AI
              </p>
              <p className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                Marlamade Workbench
              </p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs font-medium text-slate-500">
              Powered by GPT-4o-mini &amp; Firestore
            </span>
            <button
              onClick={() => navigate('/chat')}
              className="px-4 sm:px-5 py-2.5 bg-slate-900 text-white rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:bg-slate-800 hover:scale-[1.02] active:scale-95 focus-visible-ring"
              aria-label="Enter the application"
            >
              Enter app
            </button>
          </div>
        </div>
      </header>

      {/* Main hero section keeps content minimal and focused */}
      <main className="flex-1 flex flex-col">
        <LandingHero />
      </main>
    </div>
  )
}

export const LandingPage = memo(LandingPageComponent)
