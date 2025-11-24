import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { LandingHero } from '../components/landing/LandingHero'
import { LandingFeatures } from '../components/landing/LandingFeatures'
import { LandingHowItWorks } from '../components/landing/LandingHowItWorks'
import { LandingInsightPreview } from '../components/landing/LandingInsightPreview'
import { LandingBenefits } from '../components/landing/LandingBenefits'

const LandingPageComponent: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col overflow-hidden">
      {/* Animated background elements - Dark theme with vibrant accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-500/15 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" style={{ animationDelay: '4s' }} />
        <div className="absolute -bottom-1/2 left-0 w-full h-full bg-gradient-to-t from-slate-950/50 to-transparent pointer-events-none" />
      </div>

      {/* Header with improved navigation */}
      <header className="px-4 sm:px-8 py-5 sm:py-6 bg-slate-950/40 backdrop-blur-xl border-b border-slate-800/50 relative z-10 shadow-lg shadow-slate-950/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform duration-300 min-w-0 focus-visible-ring rounded-lg p-1"
            aria-label="Marlamade home"
          >
            <div className="w-11 h-11 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-cyan-500/50 group-hover:shadow-xl group-hover:shadow-cyan-400/70 group-hover:scale-110 transition-all duration-300 flex-shrink-0 text-sm">
              CNA
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                Marlamade
              </h1>
            </div>
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 rounded-lg font-semibold text-sm shadow-lg shadow-cyan-500/40 hover:shadow-xl hover:shadow-cyan-400/60 hover:scale-105 active:scale-95 transition-all duration-200 focus-visible-ring"
            aria-label="Enter the application"
          >
            Enter App
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10">
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingInsightPreview />
        <LandingBenefits />
      </main>
    </div>
  )
}

export const LandingPage = memo(LandingPageComponent)
