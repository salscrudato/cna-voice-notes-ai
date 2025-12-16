import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight } from '../../utils/icons'
import { useTheme } from '../../hooks/useTheme'
import { getAccentColor } from '../../utils/accentColors'

const LandingHeroComponent: React.FC = () => {
  const navigate = useNavigate()
  const { accentColor } = useTheme()

  return (
    <section id="hero" className="relative py-16 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50">
      {/* Subtle background gradient - using dynamic accent color */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 via-transparent to-transparent"
        style={{
          background: `linear-gradient(to bottom, ${getAccentColor(accentColor, '50')}40, transparent, transparent)`
        }}
      />

      {/* Subtle animated blob effect - using dynamic accent color */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-blob"
        style={{
          background: `linear-gradient(135deg, ${getAccentColor(accentColor, '200')}33, ${getAccentColor(accentColor, '200')}1a)`,
          animationDuration: '8s'
        }}
      />

      {/* Additional blob for depth - using dynamic accent color */}
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl animate-blob"
        style={{
          background: `linear-gradient(135deg, ${getAccentColor(accentColor, '200')}26, ${getAccentColor(accentColor, '200')}1a)`,
          animationDelay: '2s',
          animationDuration: '10s'
        }}
      />

      {/* Third blob for additional depth */}
      <div className="pointer-events-none absolute top-1/2 left-1/4 w-72 h-72 rounded-full blur-3xl animate-blob"
        style={{
          background: `linear-gradient(135deg, ${getAccentColor(accentColor, '100')}1a, ${getAccentColor(accentColor, '100')}0d)`,
          animationDelay: '4s',
          animationDuration: '12s'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left: copy and CTAs */}
          <div className="space-y-6">
            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
                Marmalade turns your voice notes into
                <span
                  className="block font-bold mt-2"
                  style={{
                    color: getAccentColor(accentColor, '600')
                  }}
                >
                  actionable insights
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl">
                Record your call notes, then use AI to extract insights, identify risks, and find key details with direct quotes.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-6">
              <button
                onClick={() => navigate('/chat')}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:shadow-2xl active:scale-95 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 hover:-translate-y-1.5 hover:scale-105 group relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`
                }}
                onMouseEnter={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement
                  btn.style.background = `linear-gradient(135deg, ${getAccentColor(accentColor, '700')}, ${getAccentColor(accentColor, '800')})`
                  btn.style.boxShadow = `0 20px 25px -5px ${getAccentColor(accentColor, '600')}40`
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement
                  btn.style.background = `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`
                  btn.style.boxShadow = ''
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 0 3px rgba(255, 255, 255, 0.1), 0 0 0 5px ${getAccentColor(accentColor, '500')}`
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = ''
                }}
                type="button"
              >
                Start Chatting
                <FiArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>
            </div>
          </div>

          {/* Right: simple chat preview */}
          <div className="hidden lg:block">
            <div className="relative mx-auto w-full max-w-md animate-fade-in-up">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-300 p-5 space-y-4 group overflow-hidden hover:-translate-y-3 hover:scale-[1.03]">
                {/* Subtle gradient overlay - using dynamic accent color */}
                <div className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${getAccentColor(accentColor, '50')}1a, transparent)`
                  }}
                />

                {/* Animated background glow */}
                <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"
                  style={{
                    background: `linear-gradient(135deg, ${getAccentColor(accentColor, '500')}33, ${getAccentColor(accentColor, '600')}1a)`
                  }}
                />

                {/* Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-slate-200/60 dark:border-slate-700/60 transition-colors duration-200 relative z-10"
                  style={{
                    borderBottomColor: `${getAccentColor(accentColor, '300')}99`
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderBottomColor = `${getAccentColor(accentColor, '300')}cc`
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderBottomColor = `${getAccentColor(accentColor, '300')}99`
                  }}
                >
                  <div className="h-10 w-10 rounded-lg text-white flex items-center justify-center text-sm font-semibold flex-shrink-0 shadow-md dark:shadow-lg border group-hover:shadow-lg group-hover:scale-110 transition-all duration-200"
                    style={{
                      background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
                      borderColor: `${getAccentColor(accentColor, '500')}4d`,
                      boxShadow: `0 0 0 0 ${getAccentColor(accentColor, '500')}33`
                    }}
                  >
                    E
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-slate-900 dark:text-slate-50">EVR</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Ask about your notes</p>
                  </div>
                </div>

                {/* Chat bubbles */}
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-end animate-slide-in-right">
                    <div className="max-w-[75%] rounded-2xl rounded-br-lg px-4 py-3 text-sm text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-medium"
                      style={{
                        backgroundColor: getAccentColor(accentColor, '600'),
                        boxShadow: `0 4px 12px ${getAccentColor(accentColor, '500')}40`
                      }}
                    >
                      What did the broker say about coverage limits?
                    </div>
                  </div>
                  <div className="flex justify-start animate-slide-in-left" style={{ animationDelay: '100ms' }}>
                    <div className="max-w-[85%] rounded-2xl rounded-bl-lg bg-slate-100 dark:bg-slate-700 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                      Broker recommended $2M limit with $250K deductible for property coverage.
                    </div>
                  </div>
                  <div className="flex justify-end animate-slide-in-right" style={{ animationDelay: '200ms' }}>
                    <div className="max-w-[75%] rounded-2xl rounded-br-lg px-4 py-3 text-sm text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-medium"
                      style={{
                        backgroundColor: getAccentColor(accentColor, '600'),
                        boxShadow: `0 4px 12px ${getAccentColor(accentColor, '500')}40`
                      }}
                    >
                      Any concerns mentioned?
                    </div>
                  </div>
                  <div className="flex justify-start animate-slide-in-left" style={{ animationDelay: '300ms' }}>
                    <div className="max-w-[85%] rounded-2xl rounded-bl-lg bg-slate-100 dark:bg-slate-700 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                      Yes, recent water damage claim and aging roof flagged as underwriting concerns.
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

export const LandingHero = LandingHeroComponent
