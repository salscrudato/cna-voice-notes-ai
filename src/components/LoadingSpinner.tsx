import React, { memo } from 'react'
import { FiActivity } from 'react-icons/fi'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'

const LoadingSpinnerComponent: React.FC = () => {
  const { accentColor } = useTheme()
  const accentHex = getAccentColor(accentColor, '600')

  return (
    <div className="flex justify-start animate-slide-in-left" aria-live="polite" aria-label="Assistant is thinking">
      <div className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 px-5 py-3.5 rounded-2xl rounded-bl-none shadow-md dark:shadow-md hover:shadow-lg dark:hover:shadow-lg transition-all duration-200 group border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center gap-3">
          {/* Animated Icon with Pulse */}
          <div className="flex items-center gap-2">
            <div
              className="relative w-5 h-5 flex items-center justify-center"
              style={{
                animation: 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            >
              <FiActivity
                className="w-5 h-5"
                style={{ color: accentHex }}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Animated Dots with Wave Effect - Enhanced */}
          <div className="flex gap-2 items-center h-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full shadow-md dark:shadow-md"
                style={{
                  background: accentHex,
                  animation: 'bounce-dots 1.4s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`,
                }}
                aria-hidden="true"
              />
            ))}
          </div>

          {/* Thinking Text with Smooth Ellipsis */}
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
            Thinking<span className="inline-block animate-thinking-dots w-3 text-left">.</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export const LoadingSpinner = memo(LoadingSpinnerComponent)

