import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

const LandingHeroComponent: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section id="hero" className="relative py-16 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-white via-blue-50/40 to-white dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-950">
      {/* Enhanced background gradient with animation */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-blue-50/90 via-cyan-50/50 to-transparent dark:from-blue-950/50 dark:via-cyan-950/30 dark:to-transparent" />

      {/* Subtle animated blob effect - enhanced */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/40 to-cyan-200/20 rounded-full blur-3xl dark:from-blue-900/20 dark:to-cyan-900/15 animate-blob" />

      {/* Additional blob for depth */}
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-200/30 to-blue-200/15 rounded-full blur-3xl dark:from-cyan-900/15 dark:to-blue-900/10 animate-blob" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left: copy and CTAs */}
          <div className="space-y-6">
            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
                Transform underwriting voice notes
                <span className="block gradient-text mt-2">
                  into actionable insights in seconds.
                </span>
              </h1>

            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
              <button
                onClick={() => navigate('/chat')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 hover:from-blue-500 hover:via-blue-500 hover:to-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg dark:shadow-lg dark:shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/50 hover:-translate-y-1 active:scale-95 transition-all duration-200 focus-visible-ring hover:scale-[1.01] border border-blue-500/40 hover:border-blue-400/60"
                type="button"
              >
                Start chatting
                <FiArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right: simple chat preview */}
          <div className="hidden lg:block">
            <div className="relative mx-auto w-full max-w-md animate-fade-in-up">
              <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-2xl dark:shadow-2xl dark:shadow-slate-900/50 hover:shadow-2xl dark:hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-4 space-y-4 hover-lift dark:hover:shadow-slate-900/60">
                {/* Header */}
                <div className="flex items-center gap-2 pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 shadow-md dark:shadow-lg dark:shadow-blue-500/20 border border-blue-500/30">
                    CNA
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-slate-900 dark:text-slate-50">Live chat</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Ready to help</p>
                  </div>
                </div>

                {/* Chat bubbles */}
                <div className="space-y-3">
                  <div className="flex justify-end animate-slide-in-right">
                    <div className="max-w-[75%] rounded-2xl rounded-tr-none bg-gradient-to-br from-blue-600 via-blue-600 to-cyan-600 px-4 py-2.5 text-sm text-white shadow-md dark:shadow-lg dark:shadow-blue-500/20 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 border border-blue-500/40">
                      Summarize this call
                    </div>
                  </div>
                  <div className="flex justify-start animate-slide-in-left" style={{ animationDelay: '100ms' }}>
                    <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-50 shadow-md dark:shadow-lg dark:shadow-slate-900/50 hover:shadow-lg dark:hover:shadow-lg hover:scale-[1.01] border border-slate-200 dark:border-slate-700 transition-all duration-200 dark:hover:shadow-slate-900/60">
                      Call covered commercial property renewal. Client concerned about recent claims history.
                    </div>
                  </div>
                  <div className="flex justify-end animate-slide-in-right" style={{ animationDelay: '200ms' }}>
                    <div className="max-w-[75%] rounded-2xl rounded-tr-none bg-gradient-to-br from-blue-600 via-blue-600 to-cyan-600 px-4 py-2.5 text-sm text-white shadow-md dark:shadow-lg dark:shadow-blue-500/20 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 border border-blue-500/40">
                      What are the key risks?
                    </div>
                  </div>
                  <div className="flex justify-start animate-slide-in-left" style={{ animationDelay: '300ms' }}>
                    <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-50 shadow-md dark:shadow-lg dark:shadow-slate-900/50 hover:shadow-lg dark:hover:shadow-lg hover:scale-[1.01] border border-slate-200 dark:border-slate-700 transition-all duration-200 dark:hover:shadow-slate-900/60">
                      Loss history, building age, and occupancy changes are primary concerns.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export const LandingHero = memo(LandingHeroComponent)
