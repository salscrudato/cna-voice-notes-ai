import React from 'react'
import { IoChatbubblesOutline, HiOutlineDocumentText, HiOutlineMicrophone } from '../../utils/icons'
import { useTheme } from '../../hooks/useTheme'
import { getAccentColor } from '../../utils/accentColors'

interface Feature {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

const LandingFeaturesComponent: React.FC = () => {
  const { accentColor } = useTheme()
  const features: Feature[] = [
    {
      icon: IoChatbubblesOutline,
      title: 'Context-aware AI assistant',
      description:
        'Ask questions about your calls and get answers backed by direct quotes from the conversation.',
    },
    {
      icon: HiOutlineDocumentText,
      title: 'Searchable conversation library',
      description:
        'Find any call instantly by broker, account, topic, or date with full transcripts and audio.',
    },
    {
      icon: HiOutlineMicrophone,
      title: 'Seamless call capture',
      description:
        'Record from Teams or upload audio files—automatically transcribed and ready to analyze.',
    },
  ]

  return (
    <section id="features" className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 bg-gradient-to-b from-slate-50/50 via-white/95 to-white dark:from-slate-900/50 dark:via-slate-950/95 dark:to-slate-950 relative overflow-hidden">
      {/* Minimal background - very subtle - using dynamic accent color */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: `${getAccentColor(accentColor, '50')}4d`
          }}
        />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: `${getAccentColor(accentColor, '50')}33`
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
            Core features
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything built for real underwriting workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 hover:scale-[1.03] animate-fade-in-up focus-within:ring-2 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-950 overflow-hidden"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${getAccentColor(accentColor, '50')}1a, transparent)`
                  }}
                />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-125 group-hover:-translate-y-2 transition-all duration-300 flex-shrink-0 shadow-md group-hover:shadow-lg border"
                    style={{
                      background: `linear-gradient(135deg, ${getAccentColor(accentColor, '100')}, ${getAccentColor(accentColor, '50')})`,
                      borderColor: `${getAccentColor(accentColor, '200')}80`
                    }}
                  >
                    <div style={{ color: getAccentColor(accentColor, '600') }}>
                      <IconComponent
                        className="w-7 h-7 group-hover:scale-125 transition-all duration-300"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50 mb-3 transition-colors duration-300"
                    style={{
                      color: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLHeadingElement).style.color = getAccentColor(accentColor, '600')
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLHeadingElement).style.color = 'inherit'
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                    {feature.description}
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

export const LandingFeatures = LandingFeaturesComponent

