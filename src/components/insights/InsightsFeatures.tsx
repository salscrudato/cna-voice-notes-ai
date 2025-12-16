import React from 'react'
import { FiTrendingUp, FiActivity } from '../../utils/icons'
import { HiOutlineSparkles } from '../../utils/icons'
import { useTheme } from '../../hooks/useTheme'
import { getAccentColor } from '../../utils/accentColors'

interface Feature {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

const InsightsFeaturesComponent: React.FC = () => {
  const { accentColor } = useTheme()

  const features: Feature[] = [
    {
      icon: FiTrendingUp,
      title: 'Trend Analysis',
      description: 'Identify patterns and trends across your conversations over time. Spot emerging topics and recurring themes automatically.',
    },
    {
      icon: FiActivity,
      title: 'Sentiment Tracking',
      description: 'Monitor the emotional tone of your conversations. Understand customer satisfaction and team dynamics at a glance.',
    },
    {
      icon: HiOutlineSparkles,
      title: 'AI-Powered Summaries',
      description: 'Get intelligent summaries of key points, decisions, and action items from hundreds of conversations in seconds.',
    },
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
            Powerful Analytics
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Transform your conversation data into actionable business intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 overflow-hidden hover:-translate-y-1"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${getAccentColor(accentColor, '500')}, ${getAccentColor(accentColor, '700')})`
                  }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export const InsightsFeatures = InsightsFeaturesComponent

