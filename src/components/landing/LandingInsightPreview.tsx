import React, { memo } from 'react'

const LandingInsightPreviewComponent: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 lg:py-40 px-4 sm:px-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 sm:mb-24">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            See It In Action
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-medium">
            Get instant insights from your underwriting conversations.
          </p>
        </div>

        <div className="relative animate-fade-in-up">
          {/* Main preview card with dark theme */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 overflow-hidden hover:shadow-3xl hover:shadow-cyan-400/30 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
            <div className="p-8 sm:p-10 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Chat preview */}
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    <div className="flex justify-end">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 rounded-3xl rounded-tr-none px-6 py-4 max-w-xs shadow-lg shadow-cyan-500/50">
                        <p className="text-base font-medium">What were the key discussion points?</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 text-slate-100 rounded-3xl rounded-tl-none px-6 py-4 max-w-xs shadow-md border border-slate-600/50">
                        <p className="text-base font-bold mb-4">Key Points:</p>
                        <ul className="text-sm space-y-3">
                          <li className="flex items-start gap-3">
                            <span className="text-cyan-400 font-bold mt-0.5">•</span>
                            <span>Coverage limits discussed</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-cyan-400 font-bold mt-0.5">•</span>
                            <span>Loss history reviewed</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-cyan-400 font-bold mt-0.5">•</span>
                            <span>Premium negotiation pending</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insights sidebar */}
                <div className="space-y-5">
                  <h3 className="text-xs font-bold text-cyan-300 mb-6 uppercase tracking-widest">Extracted Insights</h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/40 rounded-2xl p-5 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-1">
                      <div className="text-xs font-bold text-cyan-300 uppercase tracking-widest">Broker</div>
                      <div className="text-base font-bold text-cyan-200 mt-3">Marsh & McLennan</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/40 rounded-2xl p-5 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1">
                      <div className="text-xs font-bold text-purple-300 uppercase tracking-widest">LOB</div>
                      <div className="text-base font-bold text-purple-200 mt-3">Workers Compensation</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/40 rounded-2xl p-5 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                      <div className="text-xs font-bold text-blue-300 uppercase tracking-widest">Next Steps</div>
                      <div className="text-base font-bold text-blue-200 mt-3">Follow up on loss runs</div>
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

