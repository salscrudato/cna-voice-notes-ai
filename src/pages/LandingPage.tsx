import React, { useState, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoChatbubblesOutline } from 'react-icons/io5'
import { HiOutlineDocumentText } from 'react-icons/hi2'
import { HiOutlineMicrophone } from 'react-icons/hi2'
import { FiArrowRight, FiZap, FiClock, FiLock } from 'react-icons/fi'

const LandingPageComponent: React.FC = () => {
  const navigate = useNavigate()
  const [isLoaded] = useState(true)

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
      <header className={`px-4 sm:px-8 py-5 bg-white/70 backdrop-blur-md border-b border-slate-200/30 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10 gap-4">
          <div className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform duration-300 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 flex-shrink-0">
              AI
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">CNA Voice Notes AI</h1>
              <p className="text-xs text-slate-500 truncate">Workbench</p>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        <div className="max-w-6xl w-full">
          {/* Hero Section */}
          <div className={`text-center mb-16 sm:mb-20 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Transform Voice Notes into
              <span className="block gradient-text mt-2 hover:scale-105 transition-transform duration-300 inline-block">
                Actionable Insights
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
              Leverage advanced AI to analyze underwriting conversations, extract key information, and make
              data-driven decisions faster than ever before.
            </p>
            <div className="flex gap-3 sm:gap-4 justify-center items-center flex-wrap">
              <button
                onClick={() => navigate('/chat')}
                className="group px-7 sm:px-9 py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 flex items-center gap-2.5 active:scale-95 text-sm sm:text-base"
              >
                Start Chatting
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              <button
                onClick={() => navigate('/upload')}
                className="px-7 sm:px-9 py-3.5 sm:py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-semibold hover:bg-blue-50 hover:border-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md text-sm sm:text-base"
              >
                Upload Audio
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 group opacity-0 animate-fade-in-up hover:scale-105 active:scale-95 hover:-translate-y-1`}
                  style={{ animationDelay: `${(index + 1) * 150}ms` }}
                >
                  <div className="w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-125 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 shadow-sm flex-shrink-0">
                    <IconComponent className="w-6 sm:w-7 h-6 sm:h-7 text-blue-600 group-hover:text-blue-700 transition-colors" aria-hidden="true" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>

          {/* Stats/Trust Indicators */}
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 sm:p-12 shadow-sm border border-slate-200 opacity-0 animate-fade-in-up hover:shadow-xl transition-all duration-300" style={{ animationDelay: '600ms' }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 text-center">
              <div className="group cursor-pointer">
                <div className="mb-3 group-hover:scale-125 transition-transform duration-300 flex justify-center">
                  <FiZap className="w-10 sm:w-12 h-10 sm:h-12 text-blue-600" aria-hidden="true" />
                </div>
                <div className="text-xs sm:text-sm text-slate-600 font-semibold group-hover:text-slate-900 transition-colors">Advanced NLP Analysis</div>
              </div>
              <div className="group cursor-pointer">
                <div className="mb-3 group-hover:scale-125 transition-transform duration-300 flex justify-center">
                  <FiClock className="w-10 sm:w-12 h-10 sm:h-12 text-blue-600" aria-hidden="true" />
                </div>
                <div className="text-xs sm:text-sm text-slate-600 font-semibold group-hover:text-slate-900 transition-colors">Real-time Insights</div>
              </div>
              <div className="group cursor-pointer">
                <div className="mb-3 group-hover:scale-125 transition-transform duration-300 flex justify-center">
                  <FiLock className="w-10 sm:w-12 h-10 sm:h-12 text-blue-600" aria-hidden="true" />
                </div>
                <div className="text-xs sm:text-sm text-slate-600 font-semibold group-hover:text-slate-900 transition-colors">Enterprise-grade Security</div>
              </div>
            </div>
          </div>


        </div>
      </main>


    </div>
  )
}

export const LandingPage = memo(LandingPageComponent)
