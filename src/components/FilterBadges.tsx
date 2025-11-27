import React, { useMemo } from 'react'
import { FiX } from '../utils/icons'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'
import type { ConversationMetadata } from '../types'

interface FilterBadgesProps {
  metadata?: ConversationMetadata
  onRemoveFilter?: (key: keyof ConversationMetadata) => void
  onClearAll?: () => void
  compact?: boolean
}

const getFilterLabel = (key: string, value: string | number | boolean | string[]): string => {
  const displayValue = Array.isArray(value) ? value.join(', ') : String(value)
  if (key === 'broker') return `Broker: ${displayValue}`
  if (key === 'lob') return `LOB: ${displayValue}`
  if (key === 'businessType') return `Type: ${displayValue}`
  if (key === 'client') return `Client: ${displayValue}`
  if (key === 'accountNumber') return `Acc: ${displayValue}`
  if (key === 'riskCategory') return `Risk: ${displayValue}`
  if (key === 'industry') return `Industry: ${displayValue}`
  if (key === 'coverageType') return `Coverage: ${displayValue}`
  if (key === 'premium') return `Premium: ${displayValue}`
  if (key === 'underwritingStatus') return `Status: ${displayValue}`
  return `${key}: ${displayValue}`
}

const FilterBadgesComponent: React.FC<FilterBadgesProps> = ({
  metadata,
  onRemoveFilter,
  onClearAll,
  compact = false,
}) => {
  const { accentColor } = useTheme()
  // Memoize filter calculations to prevent unnecessary re-renders
  const { activeFilters, hasMoreFilters } = useMemo(() => {
    if (!metadata) {
      return { activeFilters: [], hasMoreFilters: false }
    }

    // Filter out empty values and tags (tags are handled separately)
    const filters = Object.entries(metadata)
      .filter(([key, value]) => {
        if (key === 'tags') return false
        return value !== undefined && value !== null && value !== ''
      })
      .slice(0, compact ? 3 : undefined)

    const more = compact && Object.entries(metadata).filter(([key]) => key !== 'tags').length > 3

    return { activeFilters: filters, hasMoreFilters: more }
  }, [metadata, compact])

  // Show nothing if no active filters
  if (activeFilters.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Filter label */}
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <span className="text-sm font-medium">FILTER</span>
      </div>

      {/* Filter badges */}
      {activeFilters.map(([key, value]) => {
        // Type guard: value is guaranteed to be defined by the filter above
        if (!value) return null
        return (
          <div
            key={key}
            className="inline-flex items-center gap-2 px-3 py-1.5 border rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
            style={{
              background: `linear-gradient(to right, ${getAccentColor(accentColor, '50')}40, ${getAccentColor(accentColor, '50')}20)`,
              borderColor: getAccentColor(accentColor, '200')
            }}
          >
            <span
              className="text-sm font-medium truncate max-w-[120px]"
              style={{
                color: getAccentColor(accentColor, '700')
              }}
            >
              {getFilterLabel(key, value)}
            </span>
            {onRemoveFilter && (
              <button
                onClick={() => onRemoveFilter(key as keyof ConversationMetadata)}
                className="flex items-center justify-center w-5 h-5 rounded-full transition-all duration-200 flex-shrink-0 hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
                style={{
                  color: getAccentColor(accentColor, '600'),
                  '--tw-ring-color': getAccentColor(accentColor, '500')
                } as React.CSSProperties}
                aria-label={`Remove ${key} filter`}
                title={`Remove ${key} filter`}
                type="button"
              >
                <FiX size={14} aria-hidden="true" />
              </button>
            )}
          </div>
        )
      })}

      {/* More indicator */}
      {hasMoreFilters && metadata && (
        <div className="inline-flex items-center px-3 py-1.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-full text-sm font-medium text-slate-600 dark:text-slate-400 shadow-sm">
          +{Object.entries(metadata).length - 3} more
        </div>
      )}

      {/* Clear all button */}
      {onClearAll && activeFilters.length > 0 && (
        <button
          onClick={onClearAll}
          className="text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-200 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
          style={{
            color: getAccentColor(accentColor, '600'),
            '--tw-ring-color': getAccentColor(accentColor, '500')
          } as React.CSSProperties}
          aria-label="Clear all filters"
          title="Clear all filters"
          type="button"
        >
          Clear
        </button>
      )}
    </div>
  )
}

export const FilterBadges = FilterBadgesComponent

