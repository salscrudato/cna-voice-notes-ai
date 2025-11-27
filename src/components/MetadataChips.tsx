import React, { memo, useMemo, useCallback } from 'react'
import { FiX } from '../utils/icons'
import type { ConversationMetadata } from '../types'

interface MetadataChipsProps {
  metadata: ConversationMetadata
  onEdit?: () => void
  onRemoveTag?: (tag: string) => void
  compact?: boolean
}

const MetadataChipsComponent: React.FC<MetadataChipsProps> = ({
  metadata,
  onEdit,
  onRemoveTag,
  compact = false,
}) => {
  // Memoize chips calculation to prevent unnecessary re-renders
  const chips = useMemo(() => {
    const result: Array<{ label: string; value: string; removable?: boolean }> = []

    // Add primary metadata chips
    if (metadata.broker) {
      result.push({ label: 'Broker', value: metadata.broker })
    }
    if (metadata.lob) {
      result.push({ label: 'LOB', value: metadata.lob })
    }
    if (metadata.businessType) {
      result.push({ label: 'Type', value: metadata.businessType })
    }
    if (metadata.client) {
      result.push({ label: 'Client', value: metadata.client })
    }

    // Add tags
    if (metadata.tags && metadata.tags.length > 0) {
      metadata.tags.forEach(tag => {
        result.push({ label: tag, value: tag, removable: true })
      })
    }

    return result
  }, [metadata])

  // Memoize the remove handler
  const handleRemoveTag = useCallback((tag: string) => {
    onRemoveTag?.(tag)
  }, [onRemoveTag])

  if (chips.length === 0) {
    return null
  }

  return (
    <div className={`flex flex-wrap gap-3 items-center ${compact ? 'text-xs' : 'text-sm'}`}>
      {chips.map((chip, idx) => (
        <div
          key={`${chip.label}-${idx}`}
          className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md dark:hover:shadow-lg ${
            chip.removable
              ? 'bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50'
              : 'bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50'
          }`}
        >
          <span className="font-semibold">{chip.label}:</span>
          <span className="truncate max-w-xs">{chip.value}</span>
          {chip.removable && onRemoveTag && (
            <button
              onClick={() => handleRemoveTag(chip.value)}
              className="ml-1 hover:bg-amber-200 dark:hover:bg-amber-800 rounded-full p-1 transition-all duration-200 hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
              aria-label={`Remove tag: ${chip.value}`}
              type="button"
            >
              <FiX size={16} />
            </button>
          )}
        </div>
      ))}
      {onEdit && (
        <button
          onClick={onEdit}
          className="px-3 py-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-200 text-sm font-medium hover:shadow-md hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
          aria-label="Edit metadata"
          type="button"
        >
          Edit
        </button>
      )}
    </div>
  )
}

export const MetadataChips = memo(MetadataChipsComponent)

