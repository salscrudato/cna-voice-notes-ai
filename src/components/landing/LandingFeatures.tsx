import React, { memo } from 'react'
import { IoChatbubblesOutline } from 'react-icons/io5'
import { HiOutlineDocumentText, HiOutlineMicrophone } from 'react-icons/hi2'

interface Feature {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

const LandingFeaturesComponent: React.FC = () => {
  const features: Feature[] = [
    {
      icon: IoChatbubblesOutline,
      title: 'Conversational AI Insights',
      description: 'Ask questions naturally and get instant insights from your voice notes with advanced NLP.',
    },
    {
      icon: HiOutlineDocumentText,
      title: 'Smart Chat History',
      description: 'Access and review all your previous conversations in one organized, searchable place.',
    },
    {
      icon: HiOutlineMicrophone,
      title: 'Audio Upload & Processing',
      description: 'Upload voice notes and let AI extract key information automatically in seconds.',
    },
  ]

  return (
    <section className="py-24 sm:py-32 lg:py-40 px-4 sm:px-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 sm:mb-24">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            Powerful Features
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-medium">
            Everything you need to transform voice notes into actionable underwriting insights.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 sm:p-10 shadow-lg shadow-slate-950/50 border border-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-2 focus-within:ring-2 focus-within:ring-cyan-500 animate-fade-in-up overflow-hidden backdrop-blur-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-300 -z-10" />

                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:from-cyan-400/30 group-hover:to-blue-400/30 transition-all duration-300 shadow-md shadow-cyan-500/20 flex-shrink-0">
                  <IconComponent className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" aria-hidden="true" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-300 text-base leading-relaxed">
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

export const LandingFeatures = memo(LandingFeaturesComponent)

