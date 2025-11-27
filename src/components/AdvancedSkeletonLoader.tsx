import React, { memo } from 'react'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'

interface AdvancedSkeletonLoaderProps {
  variant?: 'message' | 'card' | 'list'
  count?: number
}

const AdvancedSkeletonLoaderComponent: React.FC<AdvancedSkeletonLoaderProps> = ({
  variant = 'message',
  count = 1,
}) => {
  const { accentColor } = useTheme()
  const accentHex = getAccentColor(accentColor, '600')

  const getVariantStyles = () => {
    switch (variant) {
      case 'card':
        return {
          height: 'h-32',
          width: 'w-full',
          rounded: 'rounded-lg',
          margin: 'mb-4',
        }
      case 'list':
        return {
          height: 'h-12',
          width: 'w-full',
          rounded: 'rounded-md',
          margin: 'mb-3',
        }
      case 'message':
      default:
        return {
          height: 'h-20',
          width: 'w-3/4',
          rounded: 'rounded-2xl',
          margin: 'mb-4',
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${styles.height} ${styles.width} ${styles.rounded} ${styles.margin} relative overflow-hidden bg-slate-200 dark:bg-slate-700 border border-slate-300/50 dark:border-slate-600/50`}
          aria-hidden="true"
          style={{
            background: `linear-gradient(90deg, 
              var(--skeleton-bg-light) 0%, 
              var(--skeleton-bg-light) 45%, 
              var(--skeleton-highlight) 50%, 
              var(--skeleton-bg-light) 55%, 
              var(--skeleton-bg-light) 100%)`,
            backgroundSize: '200% 100%',
            animation: 'shimmer-advanced 2s infinite',
            '--skeleton-bg-light': 'rgb(226, 232, 240)',
            '--skeleton-highlight': `${accentHex}20`,
          } as React.CSSProperties}
        >
          {/* Animated gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, transparent, ${accentHex}10, transparent)`,
              animation: 'pulse-overlay 2s ease-in-out infinite',
            }}
          />
        </div>
      ))}
    </div>
  )
}

export const AdvancedSkeletonLoader = memo(AdvancedSkeletonLoaderComponent)

