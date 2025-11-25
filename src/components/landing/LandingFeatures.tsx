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
      title: 'Natural Conversations',
      description: 'Chat naturally about your calls. Ask follow-ups. Get clarity instantly.',
    },
    {
      icon: HiOutlineDocumentText,
      title: 'Organized History',
      description: 'All conversations saved and searchable. Linked to voice notes.',
    },
    {
      icon: HiOutlineMicrophone,
      title: 'Audio Integration',
      description: 'Upload calls. AI transcribes. Chat about content directly.',
    },
  ]

  return (
    <section id="features" className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 bg-gradient-to-b from-white via-slate-50/60 to-white dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950 relative overflow-hidden">
      {/* Minimal background - very subtle with enhanced depth */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 dark:bg-blue-950/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-50/40 dark:bg-cyan-950/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
            Core Features
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything built for underwriting workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="group relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/60 shadow-lg dark:shadow-lg dark:shadow-slate-900/50 hover:shadow-2xl dark:hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/15 transition-all duration-300 hover:-translate-y-2 hover:border-blue-300/80 dark:hover:border-blue-600/80 animate-fade-in-up hover:scale-[1.01] dark:hover:shadow-slate-900/60"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/60 dark:to-cyan-900/50 rounded-xl flex items-center justify-center mb-5 group-hover:from-blue-200 group-hover:to-cyan-200 dark:group-hover:from-blue-900/80 dark:group-hover:to-cyan-900/70 transition-all duration-300 flex-shrink-0 group-hover:shadow-lg dark:group-hover:shadow-lg group-hover:shadow-blue-500/40 dark:group-hover:shadow-blue-500/25 group-hover:-translate-y-1 border border-blue-200/50 dark:border-blue-700/50">
                  <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
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

