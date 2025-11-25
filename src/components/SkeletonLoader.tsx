import React, { memo } from 'react'

type SkeletonVariant = 'message' | 'conversation' | 'card'

interface SkeletonLoaderProps {
  variant?: SkeletonVariant
  count?: number
  height?: string
  width?: string
}

/**
 * Skeleton loader component for showing loading states
 * Displays animated placeholder while data is loading
 */
const SkeletonLoaderComponent: React.FC<SkeletonLoaderProps> = ({
  variant = 'message',
  count = 1,
  height,
  width,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'message':
        return {
          height: height || 'h-16',
          width: width || 'w-4/5',
          rounded: 'rounded-2xl',
          margin: 'mb-4',
        }
      case 'conversation':
        return {
          height: height || 'h-10',
          width: width || 'w-full',
          rounded: 'rounded-lg',
          margin: 'mb-2',
        }
      case 'card':
        return {
          height: height || 'h-48',
          width: width || 'w-full',
          rounded: 'rounded-xl',
          margin: 'mb-4',
        }
      default:
        return {
          height: height || 'h-12',
          width: width || 'w-full',
          rounded: 'rounded-lg',
          margin: 'mb-3',
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${styles.height} ${styles.width} ${styles.rounded} ${styles.margin} bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-shimmer shadow-sm hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-slate-700/60 border border-slate-300/40 dark:border-slate-600/40 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] dark:hover:shadow-slate-700/50 group`}
          aria-hidden="true"
          style={{ animationDelay: `${index * 50}ms` }}
        />
      ))}
    </div>
  )
}

export const SkeletonLoader = memo(SkeletonLoaderComponent)

