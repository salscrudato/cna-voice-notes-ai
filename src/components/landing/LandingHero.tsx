import React, { memo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiPlay } from 'react-icons/fi'

const LandingHeroComponent: React.FC = () => {
  const navigate = useNavigate()
  const [isHovering, setIsHovering] = useState(false)

  return (
    <section className="relative py-20 sm:py-28 lg:py-36 px-4 sm:px-6 overflow-hidden">
      {/* Enhanced animated gradient background with multiple layers */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text & CTAs */}
          <div className="flex flex-col justify-center space-y-8 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 w-fit px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-cyan-300">AI-Powered Voice Analysis</span>
            </div>

            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                Transform Voice
                <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mt-3">
                  Into Insights
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl font-medium">
                Analyze underwriting voice memos with AI-powered intelligence. Extract key insights instantly. Make data-driven decisions that improve win rates.
              </p>
            </div>

            <div className="flex gap-3 sm:gap-4 flex-wrap pt-4">
              <button
                onClick={() => navigate('/chat')}
                className="group px-8 sm:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 rounded-xl font-semibold shadow-lg shadow-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-400/70 hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 text-sm sm:text-base focus-visible-ring"
              >
                <span>Start Chatting</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </button>
              <button
                onClick={() => navigate('/upload')}
                className="group px-8 sm:px-10 py-3.5 sm:py-4 bg-slate-800 text-cyan-300 border-2 border-cyan-500/50 rounded-xl font-semibold hover:bg-slate-700 hover:border-cyan-400 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg hover:shadow-cyan-500/30 text-sm sm:text-base focus-visible-ring flex items-center gap-2"
              >
                <FiPlay size={16} />
                <span>Upload Audio</span>
              </button>
            </div>
          </div>

          {/* Right: Interactive Visual Hero Element */}
          <div className="hidden lg:flex items-center justify-center animate-fade-in stagger-2">
            <div
              className="relative w-full max-w-md h-96 cursor-pointer"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Glassmorphic background with dark theme */}
              <div className={`absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl backdrop-blur-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 transition-all duration-500 ${isHovering ? 'shadow-cyan-400/50 scale-105 border-cyan-400/50' : ''}`} />

              {/* Animated border glow on hover */}
              {isHovering && (
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/20 to-blue-400/20 blur-xl animate-pulse" />
              )}

              {/* Mock chat panel with dark theme */}
              <div className="absolute inset-4 flex flex-col">
                <div className="h-10 bg-slate-700/50 rounded-lg mb-4" />
                <div className="flex-1 space-y-4 overflow-hidden">
                  <div className="h-8 bg-cyan-500/20 rounded-lg w-3/4 animate-pulse" />
                  <div className="h-8 bg-slate-600/30 rounded-lg w-4/5 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="h-8 bg-cyan-500/20 rounded-lg w-2/3 animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>

              {/* Floating insight cards with dark theme */}
              <div className="absolute -bottom-8 -right-8 bg-slate-800 rounded-2xl p-5 shadow-2xl shadow-cyan-500/30 border border-cyan-500/30 backdrop-blur-sm max-w-xs hover:shadow-2xl hover:shadow-cyan-400/50 transition-all duration-300 hover:scale-110 hover:-translate-y-2">
                <div className="text-xs font-bold text-cyan-300 mb-4 uppercase tracking-wider">Key Insights</div>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full" />
                    <span className="font-medium">Broker: Marsh & McLennan</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-purple-400 rounded-full" />
                    <span className="font-medium">LOB: Workers Comp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export const LandingHero = memo(LandingHeroComponent)

