import React, { memo, useState, useEffect } from 'react'
import { FiCpu, FiZap, FiCheck } from 'react-icons/fi'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'

interface StreamingLoadingIndicatorProps {
  stage?: 'thinking' | 'generating' | 'finalizing'
  isStreaming?: boolean
}

const StreamingLoadingIndicatorComponent: React.FC<StreamingLoadingIndicatorProps> = ({
  stage = 'thinking',
}) => {
  const { accentColor } = useTheme()
  const [displayStage, setDisplayStage] = useState(stage)

  useEffect(() => {
    setDisplayStage(stage)
  }, [stage])

  const stageConfig = {
    thinking: {
      label: 'Analyzing your question',
      description: 'Understanding context and intent',
      icon: FiCpu,
    },
    generating: {
      label: 'Generating response',
      description: 'Crafting a thoughtful answer',
      icon: FiZap,
    },
    finalizing: {
      label: 'Finalizing',
      description: 'Polishing the response',
      icon: FiCheck,
    },
  }

  const config = stageConfig[displayStage]
  const accentHex = getAccentColor(accentColor, '600')
  const accentHex700 = getAccentColor(accentColor, '700')
  const accentHex500 = getAccentColor(accentColor, '500')

  return (
    <div className="flex justify-start animate-slide-in-left" role="status" aria-live="polite" aria-label={`AI is ${displayStage}: ${config.label}`}>
      <div className="message-bubble message-bubble-assistant">
        <div className="flex items-center gap-4">
          {/* AI-Inspired Animated Indicator */}
          <div className="flex-shrink-0 flex items-center gap-2">
            {displayStage === 'thinking' && (
              <div className="flex items-center gap-2">
                {/* Thinking dots with enhanced animation */}
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    background: accentHex,
                    animation: 'ai-thinking-dots 1.4s ease-in-out infinite',
                    animationDelay: '0s',
                  }}
                  aria-hidden="true"
                />
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    background: accentHex,
                    animation: 'ai-thinking-dots 1.4s ease-in-out infinite',
                    animationDelay: '0.2s',
                  }}
                  aria-hidden="true"
                />
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    background: accentHex,
                    animation: 'ai-thinking-dots 1.4s ease-in-out infinite',
                    animationDelay: '0.4s',
                  }}
                  aria-hidden="true"
                />
              </div>
            )}
            {displayStage === 'generating' && (
              <div className="flex items-end gap-1.5 h-6">
                {/* Generating bars with wave effect */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full"
                    style={{
                      background: `linear-gradient(180deg, ${accentHex500} 0%, ${accentHex} 50%, ${accentHex700} 100%)`,
                      animation: 'ai-generating-bars 0.8s ease-in-out infinite',
                      animationDelay: `${i * 0.1}s`,
                      height: '4px',
                    }}
                    aria-hidden="true"
                  />
                ))}
              </div>
            )}
            {displayStage === 'finalizing' && (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${accentHex}, ${accentHex700})`,
                  animation: 'ai-check-scale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: `0 0 0 0 ${accentHex}33`,
                }}
                aria-hidden="true"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeDasharray="50" strokeDashoffset="50" style={{ animation: 'ai-finalizing-checkmark 0.6s ease-out forwards' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>

          {/* Stage Label and Description */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {React.createElement(config.icon, {
                className: 'w-5 h-5 transition-all duration-300',
                style: { color: getAccentColor(accentColor, '600') },
                'aria-hidden': 'true',
              })}
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-wide">
                {config.label}
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

export const StreamingLoadingIndicator = memo(StreamingLoadingIndicatorComponent)

