import React from 'react'
import { HiOutlineClock, HiOutlineCheckCircle, HiOutlineSparkles } from '../../utils/icons'
import { useTheme } from '../../hooks/useTheme'
import { getAccentColor } from '../../utils/accentColors'

interface Step {
  number: number
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const InsightsHowItWorksComponent: React.FC = () => {
  const { accentColor } = useTheme()

  const steps: Step[] = [
    {
      number: 1,
      title: 'Connect your data',
      description: 'Import conversations from your existing tools or record new ones directly. We support multiple formats and integrations.',
      icon: HiOutlineClock,
    },
    {
      number: 2,
      title: 'AI analyzes patterns',
      description: 'Our AI automatically processes your conversations, identifying themes, sentiment, and key information without manual tagging.',
      icon: HiOutlineSparkles,
    },
    {
      number: 3,
      title: 'Get actionable insights',
      description: 'Access dashboards, reports, and alerts that help you make data-driven decisions and improve outcomes.',
      icon: HiOutlineCheckCircle,
    },
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            From raw conversations to actionable insights in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="relative text-center group">
                {/* Step Number */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${getAccentColor(accentColor, '500')}, ${getAccentColor(accentColor, '700')})`
                  }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Step Number Badge */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: getAccentColor(accentColor, '600') }}
                >
                  {step.number}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export const InsightsHowItWorks = InsightsHowItWorksComponent

