import React, { memo } from 'react'
import { FiTrendingUp, FiClock, FiShield, FiZap } from 'react-icons/fi'

interface Benefit {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

const LandingBenefitsComponent: React.FC = () => {
  const benefits: Benefit[] = [
    {
      icon: FiTrendingUp,
      title: 'Increased Efficiency',
      description: 'Process voice notes 10x faster with AI-powered analysis, reducing manual review time and accelerating underwriting decisions.',
    },
    {
      icon: FiClock,
      title: 'Time Savings',
      description: 'Spend less time transcribing and organizing notes. Focus on what matters: making informed underwriting decisions.',
    },
    {
      icon: FiShield,
      title: 'Consistent Quality',
      description: 'Ensure consistent evaluation criteria across all voice notes with standardized AI analysis and insights.',
    },
    {
      icon: FiZap,
      title: 'Instant Insights',
      description: 'Get immediate answers to complex questions about your voice notes and conversations with natural language queries.',
    },
  ]

  return (
    <section className="py-24 sm:py-32 lg:py-40 px-4 sm:px-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 sm:mb-24">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            Real Benefits for Your Team
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-medium">
            Transform how your underwriting team works with AI-powered voice note analysis and intelligent conversations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 shadow-lg shadow-slate-950/50 border border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:-translate-y-2 focus-within:ring-2 focus-within:ring-blue-500 animate-fade-in-up overflow-hidden backdrop-blur-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300 -z-10" />

                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:from-blue-400/30 group-hover:to-cyan-400/30 transition-all duration-300 shadow-md shadow-blue-500/20 flex-shrink-0">
                  <IconComponent className="w-7 h-7 text-blue-400 group-hover:text-blue-300 transition-colors" aria-hidden="true" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export const LandingBenefits = memo(LandingBenefitsComponent)

