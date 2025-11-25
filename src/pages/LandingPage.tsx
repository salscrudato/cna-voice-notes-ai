import React, { memo } from 'react'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { LandingHeader } from '../components/landing/LandingHeader'
import { LandingHero } from '../components/landing/LandingHero'
import { LandingFeatures } from '../components/landing/LandingFeatures'
import { LandingHowItWorks } from '../components/landing/LandingHowItWorks'
import { LandingInsightPreview } from '../components/landing/LandingInsightPreview'
import { LandingFooter } from '../components/landing/LandingFooter'

const LandingPageComponent: React.FC = () => {

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white dark:from-slate-950 dark:via-blue-950/10 dark:to-slate-950 flex flex-col transition-colors duration-300">
        {/* Header with theme toggle */}
        <LandingHeader />

        {/* Main content */}
        <main className="flex-1 flex flex-col">
          <LandingHero />
          <LandingFeatures />
          <LandingHowItWorks />
          <LandingInsightPreview />
        </main>

        {/* Footer */}
        <LandingFooter />
      </div>
    </ErrorBoundary>
  )
}

export const LandingPage = memo(LandingPageComponent)
