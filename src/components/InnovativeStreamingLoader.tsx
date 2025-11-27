import React, { memo } from 'react'
import { FiCpu, FiZap, FiCheck, FiActivity } from 'react-icons/fi'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'

interface InnovativeStreamingLoaderProps {
  stage?: 'thinking' | 'generating' | 'finalizing'
}

const InnovativeStreamingLoaderComponent: React.FC<InnovativeStreamingLoaderProps> = ({
  stage = 'thinking',
}) => {
  const { accentColor } = useTheme()
  const accentHex = getAccentColor(accentColor, '600')

  const stageConfig = {
    thinking: {
      label: 'Analyzing',
      description: 'Processing your input',
      icon: FiCpu,
      animationClass: 'animate-pulse-glow',
    },
    generating: {
      label: 'Generating',
      description: 'Creating response',
      icon: FiZap,
      animationClass: 'animate-pulse-glow',
    },
    finalizing: {
      label: 'Finalizing',
      description: 'Polishing response',
      icon: FiCheck,
      animationClass: 'animate-pulse-glow',
    },
  }

  const config = stageConfig[stage]

  return (
    <div className="flex justify-start animate-slide-in-left" role="status" aria-live="polite">
      <div className="message-bubble message-bubble-assistant">
        <div className="flex items-center gap-4">
          {/* Innovative Animated Indicator */}
          <div className="flex-shrink-0 flex items-center gap-3">
            {/* Outer pulsing ring */}
            <div
              className="relative w-8 h-8 flex items-center justify-center"
              style={{
                animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            >
              {/* Inner rotating circle */}
              <div
                className="absolute inset-0 rounded-full border-2 border-transparent"
                style={{
                  borderTopColor: accentHex,
                  borderRightColor: accentHex,
                  animation: 'spin-smooth 2s linear infinite',
                }}
              />

              {/* Center icon */}
              <div className="relative z-10 flex items-center justify-center">
                {React.createElement(config.icon, {
                  className: 'w-4 h-4',
                  style: { color: accentHex },
                  'aria-hidden': 'true',
                })}
              </div>

              {/* Pulsing dot background */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${accentHex}20 0%, transparent 70%)`,
                  animation: 'pulse-scale 2s ease-in-out infinite',
                }}
              />
            </div>

            {/* Activity indicator dots */}
            <div className="flex gap-1.5 items-center h-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: accentHex,
                    animation: 'bounce-dots 1.4s ease-in-out infinite',
                    animationDelay: `${i * 0.2}s`,
                    opacity: 0.6,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-wide">
                {config.label}
              </span>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: `${accentHex}15`,
                  color: accentHex,
                }}
              >
                {stage}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
              {config.description}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export const InnovativeStreamingLoader = memo(InnovativeStreamingLoaderComponent)

