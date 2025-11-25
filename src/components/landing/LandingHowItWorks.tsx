import React, { memo } from 'react'
import { HiOutlineSparkles, HiOutlineQuestionMarkCircle, HiOutlineLightBulb } from 'react-icons/hi2'

interface Step {
  number: number
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const LandingHowItWorksComponent: React.FC = () => {
  const steps: Step[] = [
    {
      number: 1,
      title: 'Start a Chat',
      description: 'Begin a conversation with our AI assistant.',
      icon: HiOutlineSparkles,
    },
    {
      number: 2,
      title: 'Ask Questions',
      description: 'Get instant answers and insights.',
      icon: HiOutlineQuestionMarkCircle,
    },
    {
      number: 3,
      title: 'Get Results',
      description: 'Receive actionable underwriting insights.',
      icon: HiOutlineLightBulb,
    },
  ]

  return (
    <section id="how-it-works" className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 bg-gradient-to-b from-slate-50 via-white/60 to-slate-50 dark:from-slate-900 dark:via-slate-950/60 dark:to-slate-900 relative overflow-hidden">
      {/* Minimal background - very subtle with enhanced depth */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50/50 dark:bg-blue-950/20 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-50/40 dark:bg-cyan-950/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Three simple steps to actionable insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div key={index} className="relative flex flex-col items-center text-center group animate-fade-in-up hover:scale-[1.02] transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-950 rounded-lg p-4 hover:-translate-y-2" style={{ animationDelay: `${index * 100}ms` }}>
                {/* Connecting line (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-gradient-to-r from-slate-300 via-blue-400 to-slate-300 dark:from-slate-700 dark:via-blue-600 dark:to-slate-700 transform -translate-y-1/2 group-hover:via-blue-500 dark:group-hover:via-blue-500 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/30" />
                )}

                {/* Number badge - enhanced */}
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 dark:from-blue-600 dark:via-blue-600 dark:to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg dark:shadow-lg dark:shadow-blue-500/30 group-hover:shadow-2xl group-hover:shadow-blue-500/70 dark:group-hover:shadow-blue-500/40 group-hover:scale-125 transition-all duration-300 mb-6 flex-shrink-0 relative z-10 border border-blue-500/40 dark:border-blue-400/40 group-hover:-translate-y-2">
                  {step.number}
                </div>

                {/* Icon container */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100/90 via-blue-50/80 to-cyan-100/90 dark:from-blue-900/60 dark:via-blue-900/50 dark:to-cyan-900/50 rounded-xl flex items-center justify-center mb-4 flex-shrink-0 group-hover:from-blue-200 group-hover:via-blue-100 group-hover:to-cyan-200 dark:group-hover:from-blue-900/80 dark:group-hover:via-blue-900/70 dark:group-hover:to-cyan-900/70 transition-all duration-300 group-hover:shadow-lg dark:group-hover:shadow-lg group-hover:shadow-blue-500/50 dark:group-hover:shadow-blue-500/35 backdrop-blur-md border border-blue-200/60 dark:border-blue-700/60 group-hover:-translate-y-1.5 group-hover:border-blue-300/80 dark:group-hover:border-blue-600/80">
                  <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:scale-125 transition-all duration-300" aria-hidden="true" />
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 group-hover:scale-105">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
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

export const LandingHowItWorks = memo(LandingHowItWorksComponent)

