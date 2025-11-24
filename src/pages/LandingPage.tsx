import React, { useEffect, useState, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoChatbubblesOutline } from 'react-icons/io5'
import { HiOutlineDocumentText } from 'react-icons/hi2'
import { HiOutlineMicrophone } from 'react-icons/hi2'
import { FiArrowRight, FiZap, FiClock, FiLock, FiStar } from 'react-icons/fi'
import { MdRocketLaunch } from 'react-icons/md'

const LandingPageComponent: React.FC = () => {
  const navigate = useNavigate()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const features = [
    {
      icon: IoChatbubblesOutline,
      title: 'Conversational AI Interface',
      description: 'Ask questions naturally and get instant insights from your voice notes',
    },
    {
      icon: HiOutlineDocumentText,
      title: 'Smart Chat History',
      description: 'Access and review all your previous conversations in one place',
    },
    {
      icon: HiOutlineMicrophone,
      title: 'Audio Upload & Processing',
      description: 'Upload voice notes and let AI extract key information automatically',
    },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      {/* Header */}
      <header className={`px-8 py-6 bg-white/80 backdrop-blur-md border-b border-slate-200/50 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform duration-300">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
              AI
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Voice Notes AI</h1>
              <p className="text-xs text-slate-600">Underwriting Assistant</p>
            </div>
          </div>
          <div className="text-xs text-slate-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 font-medium flex items-center gap-1.5">
            <FiStar size={14} className="text-blue-600" />
            Production Ready
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-16 relative z-10">
        <div className="max-w-6xl w-full">
          {/* Hero Section */}
          <div className={`text-center mb-20 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-block mb-6 animate-fade-in-up">
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-300 flex items-center gap-2">
                <MdRocketLaunch size={16} />
                AI-Powered Underwriting Assistant
              </span>
            </div>
            <h2 className="text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Transform Voice Notes into
              <span className="block gradient-text mt-2 hover:scale-105 transition-transform duration-300 inline-block">
                Actionable Insights
              </span>
            </h2>
            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Leverage advanced AI to analyze underwriting conversations, extract key information, and make
              data-driven decisions faster than ever before.
            </p>
            <div className="flex gap-4 justify-center items-center flex-wrap">
              <button
                onClick={() => navigate('/chat')}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 flex items-center gap-2 active:scale-95"
              >
                Start Chatting
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              <button
                onClick={() => navigate('/upload')}
                className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-semibold hover:bg-blue-50 hover:border-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
              >
                Upload Audio
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 group opacity-0 animate-fade-in-up hover:scale-105 active:scale-95 hover:-translate-y-1`}
                  style={{ animationDelay: `${(index + 1) * 150}ms` }}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mb-5 group-hover:scale-125 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 shadow-sm">
                    <IconComponent className="w-7 h-7 text-blue-600 group-hover:text-blue-700 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>

          {/* Stats/Trust Indicators */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-12 shadow-sm border border-slate-200 opacity-0 animate-fade-in-up hover:shadow-xl transition-all duration-300" style={{ animationDelay: '600ms' }}>
            <div className="grid md:grid-cols-3 gap-10 text-center">
              <div className="group cursor-pointer">
                <div className="text-5xl mb-3 group-hover:scale-125 transition-transform duration-300">
                  <FiZap className="w-12 h-12 mx-auto text-blue-600" />
                </div>
                <div className="text-sm text-slate-600 font-semibold group-hover:text-slate-900 transition-colors">Advanced NLP Analysis</div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-5xl mb-3 group-hover:scale-125 transition-transform duration-300">
                  <FiClock className="w-12 h-12 mx-auto text-blue-600" />
                </div>
                <div className="text-sm text-slate-600 font-semibold group-hover:text-slate-900 transition-colors">Real-time Insights</div>
              </div>
              <div className="group cursor-pointer">
                <div className="text-5xl mb-3 group-hover:scale-125 transition-transform duration-300">
                  <FiLock className="w-12 h-12 mx-auto text-blue-600" />
                </div>
                <div className="text-sm text-slate-600 font-semibold group-hover:text-slate-900 transition-colors">Enterprise-grade Security</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '750ms' }}>
            <p className="text-slate-600 text-sm font-medium mb-6">Ready to transform your workflow?</p>
            <button
              onClick={() => navigate('/chat')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Get Started Now
              <FiArrowRight size={20} />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 text-center text-sm text-slate-600 bg-white/80 backdrop-blur-md border-t border-slate-200/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <p className="font-medium">© 2024 CNA Voice Notes AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export const LandingPage = memo(LandingPageComponent)
