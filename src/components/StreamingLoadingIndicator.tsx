import React, { memo, useState, useEffect, useMemo } from 'react'
import { FiLoader, FiSend, FiCheck } from '../utils/icons'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'

interface StreamingLoadingIndicatorProps {
  stage?: 'thinking' | 'generating' | 'finalizing'
}

// Stage progress configuration
const STAGE_CONFIG = {
  thinking: { base: 0, target: 30 },
  generating: { base: 33, target: 75 },
  finalizing: { base: 80, target: 100 },
} as const

// Inner component that handles progress animation for a single stage
const ProgressAnimator: React.FC<{
  stage: 'thinking' | 'generating' | 'finalizing'
  onProgress: (progress: number) => void
}> = memo(({ stage, onProgress }) => {
  const { base, target } = STAGE_CONFIG[stage]

  useEffect(() => {
    let current = base
    onProgress(current)

    const interval = setInterval(() => {
      if (current < target) {
        current += 1
        onProgress(current)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [base, target, onProgress])

  return null
})

ProgressAnimator.displayName = 'ProgressAnimator'

const StreamingLoadingIndicatorComponent: React.FC<StreamingLoadingIndicatorProps> = ({
  stage = 'thinking',
}) => {
  const { accentColor } = useTheme()
  const [progress, setProgress] = useState<number>(STAGE_CONFIG[stage].base)

  const stageConfig = useMemo(() => ({
    thinking: {
      label: 'Analyzing',
      description: 'Understanding your question',
      icon: FiLoader,
    },
    generating: {
      label: 'Generating',
      description: 'Crafting response',
      icon: FiSend,
    },
    finalizing: {
      label: 'Finalizing',
      description: 'Almost ready',
      icon: FiCheck,
    },
  }), [])

  const config = stageConfig[stage]
  const accentHex = getAccentColor(accentColor, '500')
  const accentHex600 = getAccentColor(accentColor, '600')
  const IconComponent = config.icon

  return (
    <div className="flex justify-start animate-slide-in-left" role="status" aria-live="polite" aria-label={`AI is ${stage}: ${config.label}`}>
      {/* Use key to force remount and reset progress when stage changes */}
      <ProgressAnimator key={stage} stage={stage} onProgress={setProgress} />
      <div className="message-bubble message-bubble-assistant min-w-[280px] sm:min-w-[320px]">
        <div className="flex flex-col gap-3">
          {/* Header with icon and label */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="animate-pulse" style={{ color: accentHex }} aria-hidden="true">
                <IconComponent size={20} />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {config.label}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {config.description}
                </span>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="relative h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${accentHex}, ${accentHex600})`,
              }}
            />
            {/* Shimmer effect */}
            <div
              className="absolute inset-0 opacity-50"
              style={{
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
                animation: 'shimmer-advanced 1.5s infinite',
                backgroundSize: '200% 100%',
              }}
            />
          </div>

          {/* Stage indicators */}
          <div className="flex items-center justify-between text-xs">
            {['thinking', 'generating', 'finalizing'].map((s, i) => (
              <div
                key={s}
                className={`flex items-center gap-1.5 transition-all duration-300 ${
                  stage === s
                    ? 'text-slate-900 dark:text-slate-100 font-medium'
                    : i < ['thinking', 'generating', 'finalizing'].indexOf(stage)
                    ? 'text-slate-500 dark:text-slate-400'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    stage === s
                      ? 'scale-125'
                      : ''
                  }`}
                  style={{
                    background: stage === s
                      ? accentHex
                      : i < ['thinking', 'generating', 'finalizing'].indexOf(stage)
                      ? accentHex
                      : undefined,
                  }}
                />
                <span className="hidden sm:inline capitalize">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const StreamingLoadingIndicator = memo(StreamingLoadingIndicatorComponent)

