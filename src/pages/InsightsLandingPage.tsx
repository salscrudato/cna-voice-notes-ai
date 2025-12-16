import React, { memo, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiArrowLeft } from '../utils/icons'
import { HiOutlineSparkles } from '../utils/icons'
import { ThemeSelector } from '../components/ThemeSelector'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'
import { ErrorBoundary } from '../components/ErrorBoundary'

// Lazy load sections
const InsightsFeatures = lazy(() => import('../components/insights/InsightsFeatures').then(m => ({ default: m.InsightsFeatures })))
const InsightsHowItWorks = lazy(() => import('../components/insights/InsightsHowItWorks').then(m => ({ default: m.InsightsHowItWorks })))

const SectionLoader: React.FC = () => (
  <div className="w-full py-12 flex items-center justify-center">
    <div className="flex gap-1">
      <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
)

const InsightsLandingPageComponent: React.FC = () => {
  const navigate = useNavigate()
  const { accentColor } = useTheme()

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 flex flex-col transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 shadow-sm dark:shadow-md backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-3 group hover:scale-105 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 rounded-lg px-3 py-2 active:scale-95"
                style={{ '--tw-ring-color': getAccentColor(accentColor, '500') } as React.CSSProperties}
                aria-label="EVR home"
                type="button"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg border group-hover:shadow-xl group-hover:scale-110 transition-all duration-200"
                  style={{
                    background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
                    borderColor: `${getAccentColor(accentColor, '500')}4d`
                  }}
                >
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="font-bold text-base text-slate-900 dark:text-slate-50 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-200">EVR</span>
              </button>
              <ThemeSelector />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
          <div className="pointer-events-none absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-blob"
            style={{ background: `linear-gradient(135deg, ${getAccentColor(accentColor, '200')}33, ${getAccentColor(accentColor, '200')}1a)`, animationDuration: '8s' }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
                    Discover patterns in your
                    <span className="block font-bold mt-2" style={{ color: getAccentColor(accentColor, '600') }}>
                      conversations
                    </span>
                  </h1>
                  <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl">
                    Uncover trends, track sentiment, and visualize key metrics across all your recorded conversations with AI-powered analytics.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-6">
                  <button
                    onClick={() => navigate('/chat')}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:shadow-2xl active:scale-95 transition-all duration-300"
                    style={{ background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})` }}
                  >
                    Explore Insights <FiArrowRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 font-medium transition-colors"
                  >
                    <FiArrowLeft className="h-4 w-4" /> Back to Home
                  </button>
                </div>
              </div>
              {/* Preview Card */}
              <div className="hidden lg:block">
                <div className="relative mx-auto w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl p-5 space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-200/60 dark:border-slate-700/60">
                    <div className="h-10 w-10 rounded-lg text-white flex items-center justify-center shadow-md"
                      style={{ background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})` }}>
                      <HiOutlineSparkles className="w-5 h-5" />
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold text-slate-900 dark:text-slate-50">Insights Dashboard</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Real-time analytics</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <span className="text-sm text-slate-600 dark:text-slate-300">Total Conversations</span>
                      <span className="text-lg font-bold" style={{ color: getAccentColor(accentColor, '600') }}>247</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <span className="text-sm text-slate-600 dark:text-slate-300">Positive Sentiment</span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">78%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <span className="text-sm text-slate-600 dark:text-slate-300">Action Items Found</span>
                      <span className="text-lg font-bold text-amber-600 dark:text-amber-400">156</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features & How It Works */}
        <main className="flex-1 flex flex-col">
          <Suspense fallback={<SectionLoader />}>
            <InsightsFeatures />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <InsightsHowItWorks />
          </Suspense>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/50 dark:border-slate-700/50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} Marmalade. AI-powered insights for your conversations.
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  )
}

export const InsightsLandingPage = memo(InsightsLandingPageComponent)

