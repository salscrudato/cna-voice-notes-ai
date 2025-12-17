import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiMessageCircle, FiHelpCircle } from '../utils/icons'
import { HiOutlineSparkles, HiOutlineDocumentText } from '../utils/icons'
import { ThemeSelector } from '../components/ThemeSelector'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'

interface ProductCard {
  id: string
  title: string
  subtitle: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  route: string
  gradient: { from: string; to: string }
  disabled?: boolean
}

const HomePageComponent: React.FC = () => {
  const navigate = useNavigate()
  const { accentColor } = useTheme()

  const products: ProductCard[] = [
    {
      id: 'chat',
      title: 'EVR Chat',
      subtitle: 'Conversational AI',
      description: 'Turn your voice notes into actionable insights. Ask questions about your calls and get intelligent answers.',
      icon: FiMessageCircle,
      route: '/chat',
      gradient: { from: '500', to: '700' }
    },
    {
      id: 'insights',
      title: 'EVR Insights',
      subtitle: 'Analytics & Trends',
      description: 'Discover patterns and trends across all your conversations. Visualize key metrics and uncover hidden insights.',
      icon: HiOutlineSparkles,
      route: '/insights',
      gradient: { from: '400', to: '600' },
      disabled: true
    },
    {
      id: 'reporting',
      title: 'EVR Reporting',
      subtitle: 'Action Tracking',
      description: 'Track action items, follow-ups, and commitments. Never miss a deadline with our interactive tracker.',
      icon: HiOutlineDocumentText,
      route: '/reporting',
      gradient: { from: '600', to: '800' }
    },
    {
      id: 'support',
      title: 'Get Support',
      subtitle: 'Help & Resources',
      description: 'Find answers to your questions and get help with EVR. Access our knowledge base and support resources.',
      icon: FiHelpCircle,
      route: '/support',
      gradient: { from: '500', to: '600' }
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 shadow-sm dark:shadow-md backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 group hover:scale-105 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 rounded-lg px-3 py-2 active:scale-95"
              style={{
                '--tw-ring-color': getAccentColor(accentColor, '500')
              } as React.CSSProperties}
              aria-label="EVR home"
              type="button"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg border group-hover:shadow-xl group-hover:scale-110 transition-all duration-200"
                style={{
                  background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
                  borderColor: `${getAccentColor(accentColor, '500')}4d`
                }}
              >
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-slate-50 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-200">EVR</span>
            </button>
            <ThemeSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
          {/* Background Effects */}
          <div
            className="pointer-events-none absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-blob"
            style={{
              background: `linear-gradient(135deg, ${getAccentColor(accentColor, '200')}33, ${getAccentColor(accentColor, '200')}1a)`,
              animationDuration: '8s'
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl animate-blob"
            style={{
              background: `linear-gradient(135deg, ${getAccentColor(accentColor, '200')}26, ${getAccentColor(accentColor, '200')}1a)`,
              animationDelay: '2s',
              animationDuration: '10s'
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Title */}
            <div className="text-center mb-16 sm:mb-20">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-tight mb-6">
                Welcome to{' '}
                <span
                  className="font-bold"
                  style={{ color: getAccentColor(accentColor, '600') }}
                >
                  EVR
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Your AI-powered suite for voice notes, insights, and action tracking.
                Choose a product to get started.
              </p>
            </div>

            {/* Product Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {products.map((product) => {
                const Icon = product.icon
                return (
                  <button
                    key={product.id}
                    onClick={() => !product.disabled && navigate(product.route)}
                    disabled={product.disabled}
                    className={`group relative rounded-2xl border bg-white dark:bg-slate-800 shadow-lg transition-all duration-300 p-6 sm:p-8 text-left overflow-hidden focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      product.disabled
                        ? 'border-slate-200/50 dark:border-slate-700/50 opacity-60 cursor-not-allowed'
                        : 'border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]'
                    }`}
                    style={{
                      '--tw-ring-color': getAccentColor(accentColor, '500')
                    } as React.CSSProperties}
                  >
                    {/* Coming Soon Badge */}
                    {product.disabled && (
                      <div className="absolute top-4 right-4 z-20">
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Coming Soon
                        </div>
                      </div>
                    )}

                    {/* Gradient overlay on hover */}
                    {!product.disabled && (
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl"
                        style={{
                          background: `linear-gradient(135deg, ${getAccentColor(accentColor, product.gradient.from)}, ${getAccentColor(accentColor, product.gradient.to)})`
                        }}
                      />
                    )}

                    {/* Icon */}
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg transition-transform duration-300 ${!product.disabled && 'group-hover:scale-110'}`}
                      style={{
                        background: `linear-gradient(135deg, ${getAccentColor(accentColor, product.gradient.from)}, ${getAccentColor(accentColor, product.gradient.to)})`
                      }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <p
                        className="text-sm font-medium mb-1"
                        style={{ color: getAccentColor(accentColor, '600') }}
                      >
                        {product.subtitle}
                      </p>
                      <h3 className={`text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3 transition-colors duration-200 ${!product.disabled && 'group-hover:text-accent-600 dark:group-hover:text-accent-400'}`}>
                        {product.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                        {product.description}
                      </p>

                      {/* CTA */}
                      {!product.disabled && (
                        <div
                          className="inline-flex items-center gap-2 font-semibold transition-all duration-200 group-hover:gap-3"
                          style={{ color: getAccentColor(accentColor, '600') }}
                        >
                          Get Started
                          <FiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 dark:border-slate-700/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Marmalade. AI-powered insights for your conversations.
          </p>
        </div>
      </footer>
    </div>
  )
}

export const HomePage = memo(HomePageComponent)

