import React from 'react'
import { HiOutlineClock, HiOutlineCheckCircle, HiOutlineSparkles } from '../../utils/icons'
import { useTheme } from '../../hooks/useTheme'
import { getAccentColor } from '../../utils/accentColors'

interface Feature {
  number: number
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const LandingHowItWorksComponent: React.FC = () => {
  const { accentColor } = useTheme()
  const features: Feature[] = [
    {
      number: 1,
      title: 'Work more efficiently',
      description:
        'Reduce time spent on call review and note-taking. Focus your expertise on judgment and decision-making instead of manual documentation.',
      icon: HiOutlineClock,
    },
    {
      number: 2,
      title: 'Gain deeper insights',
      description:
        'Access a searchable repository of all conversations. Spot patterns, understand risk factors, and make better-informed underwriting decisions.',
      icon: HiOutlineCheckCircle,
    },
    {
      number: 3,
      title: 'Write better business',
      description:
	        'Leverage collective knowledge from your team\'s conversations. Improve consistency, reduce risk, and strengthen relationships with brokers.',
      icon: HiOutlineSparkles,
    },
  ]

  return (
    <section id="key-benefits" className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 relative overflow-hidden">
      {/* Minimal background - very subtle - using dynamic accent color */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: `${getAccentColor(accentColor, '50')}4d`
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: `${getAccentColor(accentColor, '50')}33`
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
            Key benefits
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Build a shared knowledge repository. Underwrite faster, smarter, and with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className="relative flex flex-col items-center text-center group animate-fade-in-up hover:scale-[1.05] transition-all duration-300 focus-within:ring-2 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-950 rounded-xl p-6 hover:-translate-y-3 bg-white dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-2xl dark:hover:shadow-2xl overflow-hidden"
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
                {/* Connecting line (hidden on mobile) */}
                {index < features.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-px transform -translate-y-1/2 transition-all duration-300"
                    style={{
                      background: getAccentColor(accentColor, '400')
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background = getAccentColor(accentColor, '600')
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background = getAccentColor(accentColor, '400')
                    }}
                  />
                )}

                {/* Number badge - simplified */}
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg dark:shadow-lg group-hover:shadow-2xl dark:group-hover:shadow-2xl transition-all duration-300 mb-6 flex-shrink-0 relative z-20 group-hover:scale-125 group-hover:-translate-y-3 border"
                  style={{
                    background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
                    borderColor: `${getAccentColor(accentColor, '500')}4d`
                  }}
                >
                  {feature.number}
                </div>

                {/* Icon container */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 flex-shrink-0 group-hover:scale-125 group-hover:-translate-y-2 transition-all duration-300 shadow-md group-hover:shadow-lg border relative z-20"
                  style={{
                    background: `linear-gradient(135deg, ${getAccentColor(accentColor, '100')}, ${getAccentColor(accentColor, '50')})`,
                    borderColor: `${getAccentColor(accentColor, '200')}80`
                  }}
                >
                  <div style={{ color: getAccentColor(accentColor, '600') }}>
                    <IconComponent
                      className="w-6 h-6 group-hover:scale-125 transition-all duration-300"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50 mb-3 transition-colors duration-300 relative z-20"
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
            )
          })}
        </div>
      </div>
    </section>
  )
}

export const LandingHowItWorks = LandingHowItWorksComponent

