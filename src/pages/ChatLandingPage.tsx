import React, { memo, lazy, Suspense } from 'react'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { LandingHeader } from '../components/landing/LandingHeader'
import { LandingHero } from '../components/landing/LandingHero'

// Lazy load below-the-fold sections for better initial load performance
const LandingFeatures = lazy(() => import('../components/landing/LandingFeatures').then(m => ({ default: m.LandingFeatures })))
const LandingHowItWorks = lazy(() => import('../components/landing/LandingHowItWorks').then(m => ({ default: m.LandingHowItWorks })))
const LandingInsightPreview = lazy(() => import('../components/landing/LandingInsightPreview').then(m => ({ default: m.LandingInsightPreview })))
const LandingFooter = lazy(() => import('../components/landing/LandingFooter').then(m => ({ default: m.LandingFooter })))
const ScrollToTopButton = lazy(() => import('../components/landing/ScrollToTopButton').then(m => ({ default: m.ScrollToTopButton })))

// Minimal loading fallback for lazy sections
const SectionLoader: React.FC = () => (
  <div className="w-full py-12 flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <p className="text-sm text-slate-400 dark:text-slate-600 font-medium">Loading section...</p>
    </div>
  </div>
)

const ChatLandingPageComponent: React.FC = () => {

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 flex flex-col transition-colors duration-300">
        {/* Header with theme toggle - above the fold */}
        <LandingHeader />

        {/* Main content */}
        <main className="flex-1 flex flex-col">
          {/* Hero section - above the fold */}
          <LandingHero />

          {/* Below-the-fold sections - lazy loaded */}
          <Suspense fallback={<SectionLoader />}>
            <LandingFeatures />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <LandingHowItWorks />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <LandingInsightPreview />
          </Suspense>
        </main>

        {/* Footer - lazy loaded */}
        <Suspense fallback={<SectionLoader />}>
          <LandingFooter />
        </Suspense>

        {/* Scroll to top button - lazy loaded */}
        <Suspense fallback={null}>
          <ScrollToTopButton />
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}

export const ChatLandingPage = memo(ChatLandingPageComponent)
