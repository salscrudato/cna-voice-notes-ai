import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiMic, FiMessageCircle, FiBook } from 'react-icons/fi'

const LandingHeroComponent: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Soft, light background glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center">
        <div className="h-64 w-[42rem] bg-gradient-to-b from-blue-100/80 via-cyan-50 to-transparent opacity-70 blur-2xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-12 lg:gap-16 items-center">
          {/* Left: copy and primary actions */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 ring-1 ring-blue-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live underwriting workbench
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
                Turn voice notes into
                <span className="block gradient-text mt-1">
                  searchable underwriting insight.
                </span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-xl">
                Chat with GPT-4o-mini, keep every thread in Firestore, and connect audio uploads
                directly into the same workspaceno extra dashboards or tooling to learn.
              </p>
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/chat')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-md hover:shadow-lg hover:bg-slate-800 hover:scale-[1.02] active:scale-95 focus-visible-ring"
              >
                Start a conversation
                <FiArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate('/upload')}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-slate-400 hover:bg-slate-50 focus-visible-ring"
              >
                <FiMic className="h-4 w-4" />
                Upload a voice note
              </button>
            </div>

            {/* Concise feature overview */}
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm">
                <dt className="flex items-center gap-2 text-slate-500">
                  <FiMessageCircle className="h-4 w-4 text-blue-600" />
                  Conversational AI
                </dt>
                <dd className="mt-1 font-medium text-slate-900">
                  GPT-4o-mini chat tuned for underwriting workflows.
                </dd>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm">
                <dt className="flex items-center gap-2 text-slate-500">
                  <FiBook className="h-4 w-4 text-emerald-600" />
                  Persistent history
                </dt>
                <dd className="mt-1 font-medium text-slate-900">
                  Every conversation stored in Firestore with rich metadata.
                </dd>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm">
                <dt className="flex items-center gap-2 text-slate-500">
                  <FiMic className="h-4 w-4 text-indigo-600" />
                  Audio &amp; voice notes
                </dt>
                <dd className="mt-1 font-medium text-slate-900">
                  Upload audio, track processing, and open notes directly in chat.
                </dd>
              </div>
            </dl>
          </div>

          {/* Right: simple chat preview card */}
          <div className="hidden lg:block animate-fade-in-slow">
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-blue-100 via-cyan-100 to-transparent blur-xl" />
              <div className="relative rounded-3xl border border-slate-200 bg-white/90 shadow-xl backdrop-blur-sm p-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
                      CNA
                    </div>
                    <div className="text-[11px]">
                      <p className="font-semibold text-slate-900">Live chat</p>
                      <p className="text-slate-500">Underwriting assistant</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Ready
                  </span>
                </div>

                <div className="space-y-2 text-[11px] leading-relaxed">
                  <div className="flex justify-end">
                    <div className="max-w-[70%] rounded-2xl bg-slate-900 px-3 py-2 text-white">
                      How risky is this workers comp renewal?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl bg-slate-100 px-3 py-2 text-slate-900">
                      Ive reviewed the submission and transcript. Loss ratio is improving and
                      exposure is stable. Here are three scenarios to consider
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-600 flex items-center gap-2">
                  <FiMic className="h-3.5 w-3.5 text-slate-500" />
                  <span className="font-medium text-slate-900 truncate">
                    Linked voice note: ACME-renewal-call.m4a
                  </span>
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

