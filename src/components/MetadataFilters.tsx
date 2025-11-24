import React, { memo, useState, useCallback } from 'react'
import { FiChevronDown, FiX } from 'react-icons/fi'
import type { ConversationMetadata } from '../types'

interface MetadataFiltersProps {
  activeFilters: ConversationMetadata
  onFilterChange: (filters: ConversationMetadata) => void
  availableMetadata?: {
    brokers: string[]
    lobs: string[]
    clients: string[]
  }
}

const MetadataFiltersComponent: React.FC<MetadataFiltersProps> = ({
  activeFilters,
  onFilterChange,
  availableMetadata = {
    brokers: ['Marsh', 'Aon', 'Willis Towers Watson', 'Gallagher'],
    lobs: ['Workers Comp', 'General Liability', 'Property', 'Cyber'],
    clients: [],
  },
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = useCallback((section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }, [expandedSection])

  const handleFilterToggle = useCallback((key: string, value: string | number | boolean) => {
    const valueStr = String(value)
    const currentValues = (activeFilters[key] as string[]) || []
    const newValues = currentValues.includes(valueStr)
      ? currentValues.filter(v => v !== valueStr)
      : [...currentValues, valueStr]

    onFilterChange({
      ...activeFilters,
      [key]: newValues.length > 0 ? newValues : undefined,
    })
  }, [activeFilters, onFilterChange])

  const handleClearAll = useCallback(() => {
    onFilterChange({})
  }, [onFilterChange])

  const hasActiveFilters = Object.values(activeFilters).some(v => v && (Array.isArray(v) ? v.length > 0 : true))

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
            type="button"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filters List */}
      <div className="flex-1 overflow-y-auto">
        {/* Broker Filter */}
        <div className="border-b border-slate-100">
          <button
            onClick={() => toggleSection('broker')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
            type="button"
          >
            <span className="text-sm font-medium text-slate-700">Broker</span>
            <FiChevronDown
              size={16}
              className={`text-slate-400 transition-transform ${expandedSection === 'broker' ? 'rotate-180' : ''}`}
            />
          </button>
          {expandedSection === 'broker' && (
            <div className="px-4 py-2 bg-slate-50 space-y-2">
              {availableMetadata.brokers.map(broker => {
                const brokerValues = (Array.isArray(activeFilters.broker) ? activeFilters.broker : []) as string[]
                return (
                  <label key={broker} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={brokerValues.includes(broker)}
                      onChange={() => handleFilterToggle('broker', broker)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{broker}</span>
                  </label>
                )
              })}
            </div>
          )}
        </div>

        {/* LOB Filter */}
        <div className="border-b border-slate-100">
          <button
            onClick={() => toggleSection('lob')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
            type="button"
          >
            <span className="text-sm font-medium text-slate-700">Line of Business</span>
            <FiChevronDown
              size={16}
              className={`text-slate-400 transition-transform ${expandedSection === 'lob' ? 'rotate-180' : ''}`}
            />
          </button>
          {expandedSection === 'lob' && (
            <div className="px-4 py-2 bg-slate-50 space-y-2">
              {availableMetadata.lobs.map(lob => {
                const lobValues = (Array.isArray(activeFilters.lob) ? activeFilters.lob : []) as string[]
                return (
                  <label key={lob} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={lobValues.includes(lob)}
                      onChange={() => handleFilterToggle('lob', lob)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{lob}</span>
                  </label>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <p className="text-xs font-medium text-slate-600 mb-2">Active filters:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([key, values]) => {
              if (!values || (Array.isArray(values) && values.length === 0)) return null
              const valueArray = Array.isArray(values) ? values : [values]
              return valueArray.map(value => (
                <div
                  key={`${key}-${value}`}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                >
                  <span>{value}</span>
                  <button
                    onClick={() => handleFilterToggle(key, value)}
                    className="hover:text-blue-900 transition-colors"
                    type="button"
                    aria-label={`Remove ${value} filter`}
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export const MetadataFilters = memo(MetadataFiltersComponent)

