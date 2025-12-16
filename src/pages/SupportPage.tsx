import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiMail, FiHelpCircle } from '../utils/icons'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'

const SupportPageComponent: React.FC = () => {
  const navigate = useNavigate()
  const { accentColor } = useTheme()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/30 to-white dark:from-slate-950 dark:via-slate-900/30 dark:to-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 group hover:scale-105 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 rounded-lg px-2 py-1 active:scale-95"
              style={{
                '--tw-ring-color': getAccentColor(accentColor, '500')
              } as React.CSSProperties}
              aria-label="EVR home"
              type="button"
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200 border group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
                  borderColor: `${getAccentColor(accentColor, '500')}4d`
                }}
              >
                <span className="text-white font-bold text-xs">E</span>
              </div>
              <span className="hidden sm:inline font-bold text-sm text-slate-900 dark:text-slate-50 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-200">EVR</span>
            </button>
            <button
              onClick={() => navigate('/chat')}
              className="flex items-center gap-2 hover:transition-all duration-300 hover:-translate-x-1 focus-visible:ring-2 rounded px-2 py-1"
              style={{
                color: getAccentColor(accentColor, '600'),
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = getAccentColor(accentColor, '700')
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = getAccentColor(accentColor, '600')
              }}
              type="button"
            >
              <FiArrowLeft size={18} />
              <span className="text-sm font-medium">Back to Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 dark:text-slate-50">
              Get Support
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              We're here to help. Reach out to our support team for any questions or issues.
            </p>
          </div>

          {/* Support Options Grid */}
          <div className="grid grid-cols-1 gap-6">
            {/* Email Support */}
            <div className="group bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl dark:hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-300/80 dark:hover:border-blue-600/80 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-950">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-100 dark:from-blue-900/60 dark:via-blue-900/50 dark:to-cyan-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:from-blue-200 group-hover:via-blue-100 group-hover:to-cyan-200 dark:group-hover:from-blue-900/80 dark:group-hover:via-blue-900/70 dark:group-hover:to-cyan-900/70 transition-all duration-300 group-hover:shadow-lg dark:group-hover:shadow-lg group-hover:shadow-blue-500/50 dark:group-hover:shadow-blue-500/35 group-hover:-translate-y-1.5">
                <FiMail className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:scale-125 transition-all duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300">
                Email Support
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                Send us an email and we'll get back to you within 24 hours.
              </p>
              <a
                href="mailto:support@cna.com"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-all duration-300 hover:translate-x-1"
              >
                support@cna.com
              </a>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="transform hover:scale-110 transition-transform duration-300">
                <FiHelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                Frequently Asked Questions
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-base">
              For comprehensive FAQs and documentation, please visit our{' '}
              <a
                href="https://atlassian.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium underline transition-colors duration-300"
              >
                Atlassian Knowledge Base
              </a>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export const SupportPage = memo(SupportPageComponent)

