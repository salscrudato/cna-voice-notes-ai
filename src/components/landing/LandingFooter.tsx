import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'

const LandingFooterComponent: React.FC = () => {
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()

  const links = [
    { label: 'Start Chatting', path: '/chat' },
    { label: 'Upload Audio', path: '/upload' },
  ]

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white via-slate-50/50 to-slate-50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-900 py-12 sm:py-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-blue-50/20 dark:bg-blue-950/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 sm:mb-12">
          {/* Brand */}
          <div className="group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 dark:from-blue-600 dark:via-blue-600 dark:to-blue-800 rounded-lg flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-110">
                M
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  Marlamade
                </h3>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              AI-powered underwriting assistant. Transform voice notes into actionable insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1 transition-all duration-200 focus-visible-ring rounded px-2 py-1 hover:scale-105 active:scale-95"
                    type="button"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Security & Compliance */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Security</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Enterprise-grade encryption</li>
              <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">SOC 2 compliant</li>
              <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">99.9% uptime SLA</li>
              <li className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">GDPR ready</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600 dark:text-slate-500">
            © {currentYear} Marlamade. All rights reserved.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-500">
            For internal CNA pilot use only. All data encrypted and securely stored.
          </p>
        </div>
      </div>
    </footer>
  )
}

export const LandingFooter = memo(LandingFooterComponent)

