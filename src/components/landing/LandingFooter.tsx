import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'

const LandingFooterComponent: React.FC = () => {
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()

  const links = [
    { label: 'Start Chatting', path: '/chat' },
    { label: 'Upload Audio', path: '/upload' },
    { label: 'Chat History', path: '/history' },
  ]

  return (
    <footer className="border-t border-slate-800/50 bg-gradient-to-b from-slate-900 to-slate-950 py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 sm:mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/50">
                CNA
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Marlamade
                </h3>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              Transform voice notes into actionable underwriting insights with advanced AI.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200 focus-visible-ring rounded px-2 py-1"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <p className="text-xs text-slate-400">
              For internal CNA pilot use only. All data is encrypted and securely stored.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {currentYear} CNA. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Enterprise-grade security • Real-time insights • Secure by default
          </p>
        </div>
      </div>
    </footer>
  )
}

export const LandingFooter = memo(LandingFooterComponent)

