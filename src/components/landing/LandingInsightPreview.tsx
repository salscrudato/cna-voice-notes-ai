import React, { memo } from 'react'

const LandingInsightPreviewComponent: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 relative overflow-hidden">
      {/* Minimal background - very subtle with enhanced depth */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-50/40 dark:bg-blue-950/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-50/30 dark:bg-cyan-950/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
            See It In Action
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Chat naturally. Extract insights instantly.
          </p>
        </div>

        <div className="relative animate-fade-in-up">
          {/* Main preview card - enhanced */}
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 hover:border-blue-300/70 dark:hover:border-blue-600/70 hover:scale-[1.01]">
            <div className="p-8 sm:p-10 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Chat preview */}
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    <div className="flex justify-end animate-slide-in-right">
                      <div className="bg-gradient-to-br from-blue-600 via-blue-600 to-cyan-600 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-xs text-sm shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 border border-blue-500/30">
                        <p className="font-medium">What were the key points?</p>
                      </div>
                    </div>
                    <div className="flex justify-start animate-slide-in-left" style={{ animationDelay: '100ms' }}>
                      <div className="bg-gradient-to-br from-slate-100/80 to-slate-50/80 dark:from-slate-700/80 dark:to-slate-800/80 text-slate-900 dark:text-slate-50 rounded-2xl rounded-tl-none px-4 py-3 max-w-xs text-sm shadow-md hover:shadow-lg hover:scale-[1.01] border border-slate-200/50 dark:border-slate-600/50 backdrop-blur-md transition-all duration-200">
                        <p className="font-semibold mb-3">Key Points:</p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2 hover:translate-x-1 transition-transform duration-200">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                            <span>Coverage limits discussed</span>
                          </li>
                          <li className="flex items-start gap-2 hover:translate-x-1 transition-transform duration-200">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                            <span>Loss history reviewed</span>
                          </li>
                          <li className="flex items-start gap-2 hover:translate-x-1 transition-transform duration-200">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                            <span>Premium negotiation pending</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insights sidebar - enhanced */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Extracted Insights</h3>
                  <div className="space-y-3">
                    <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/50 dark:from-blue-900/40 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-lg p-3 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 hover:-translate-y-1 hover:scale-[1.01] backdrop-blur-md group">
                      <div className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Broker</div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-50 mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-200">Marsh & McLennan</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50/80 to-purple-100/50 dark:from-purple-900/40 dark:to-purple-900/20 border border-purple-200/50 dark:border-purple-800/50 rounded-lg p-3 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 hover:-translate-y-1 hover:scale-[1.01] backdrop-blur-md group">
                      <div className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider">LOB</div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-50 mt-1 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors duration-200">Workers Comp</div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50/80 to-emerald-100/50 dark:from-emerald-900/40 dark:to-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/50 rounded-lg p-3 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 hover:-translate-y-1 hover:scale-[1.01] backdrop-blur-md group">
                      <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Next Steps</div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-50 mt-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors duration-200">Follow up on loss runs</div>
                    </div>
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

export const LandingInsightPreview = memo(LandingInsightPreviewComponent)

