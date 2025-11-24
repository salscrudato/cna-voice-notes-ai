import React, { memo } from 'react'
import { HiOutlineMicrophone, HiOutlineSparkles, HiOutlineQuestionMarkCircle } from 'react-icons/hi2'

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
      title: 'Record or Upload a Call',
      description: 'Upload your underwriting call recordings or voice notes directly to the platform.',
      icon: HiOutlineMicrophone,
    },
    {
      number: 2,
      title: 'AI Transcribes & Understands',
      description: 'Advanced AI transcribes and analyzes the conversation to extract key information.',
      icon: HiOutlineSparkles,
    },
    {
      number: 3,
      title: 'Ask Questions & Act',
      description: 'Chat with the AI to ask questions and get actionable insights instantly.',
      icon: HiOutlineQuestionMarkCircle,
    },
  ]

  return (
    <section className="py-24 sm:py-32 lg:py-40 px-4 sm:px-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 sm:mb-24">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            How It Works
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-medium">
            Three simple steps to transform your voice notes into actionable insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div key={index} className="relative animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                {/* Connecting line (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-20 left-1/2 w-full h-1.5 bg-gradient-to-r from-cyan-400/50 via-blue-400/30 to-transparent transform -translate-y-1/2" />
                )}

                <div className="relative flex flex-col items-center text-center">
                  {/* Number badge with enhanced styling */}
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-slate-950 font-bold text-2xl shadow-lg shadow-cyan-500/50 mb-8 flex-shrink-0 relative z-10 hover:scale-110 transition-transform duration-300 hover:shadow-2xl hover:shadow-cyan-400/70">
                    {step.number}
                  </div>

                  {/* Icon container */}
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl flex items-center justify-center mb-8 shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-400/30 transition-all duration-300 border border-cyan-500/30">
                    <IconComponent className="w-10 h-10 text-cyan-400" aria-hidden="true" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-slate-300 text-base leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export const LandingHowItWorks = memo(LandingHowItWorksComponent)

