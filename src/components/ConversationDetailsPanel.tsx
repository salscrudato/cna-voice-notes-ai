import React, { useState, useEffect, useCallback, useRef, memo } from 'react'
import { FiX } from '../utils/icons'
import { METADATA } from '../constants'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'
import type { ConversationMetadata } from '../types'

// Simple select component to replace SearchableSelect
interface SimpleSelectProps {
  label: string
  options: readonly { value: string; label: string }[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

const SimpleSelect: React.FC<SimpleSelectProps> = memo(({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
}) => (
  <div>
    <label className="block text-sm font-bold text-slate-900 dark:text-slate-50 mb-2 uppercase tracking-wide">
      {label}
    </label>
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600 disabled:opacity-50"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
))

interface ConversationDetailsPanelProps {
  isOpen: boolean
  onClose: () => void
  metadata: ConversationMetadata
  onUpdate: (metadata: ConversationMetadata) => Promise<void>
  isUpdating?: boolean
}

const ConversationDetailsPanelComponent: React.FC<ConversationDetailsPanelProps> = ({
  isOpen,
  onClose,
  metadata,
  onUpdate,
  isUpdating = false,
}) => {
  const { accentColor } = useTheme()
  const [formData, setFormData] = useState<ConversationMetadata>(metadata)
  const [newTag, setNewTag] = useState('')
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setFormData(metadata)
  }, [metadata])

  // Auto-save with debounce
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (JSON.stringify(formData) !== JSON.stringify(metadata)) {
        onUpdate(formData)
      }
    }, 1000) // Auto-save after 1 second of inactivity

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [formData, metadata, onUpdate])

  const handleAddTag = useCallback(() => {
    if (newTag.trim()) {
      const tags = formData.tags || []
      if (!tags.includes(newTag.trim())) {
        setFormData({ ...formData, tags: [...tags, newTag.trim()] })
        setNewTag('')
      }
    }
  }, [newTag, formData])

  const handleRemoveTag = useCallback((tag: string) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter(t => t !== tag),
    })
  }, [formData])

  if (!isOpen) return null

  // Right pane filter panel
  return (
    <>
      <div className={`fixed top-0 right-0 h-screen w-full sm:w-96 bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 shadow-xl border-l border-slate-200 dark:border-slate-800 z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 z-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-wider">FILTER</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 text-slate-600 dark:text-slate-400 hover:shadow-sm dark:hover:shadow-md hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            style={{
              '--tw-ring-color': getAccentColor(accentColor, '500')
            } as React.CSSProperties}
            aria-label="Close panel"
            type="button"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4 pb-32">
          {/* All Fields - No Section Headers */}
          <SimpleSelect
            label="Broker"
            options={METADATA.BROKER_OPTIONS}
            value={formData.broker}
            onChange={(value: string) => setFormData({ ...formData, broker: value })}
            placeholder="Select a broker..."
            disabled={isUpdating}
          />
          <SimpleSelect
            label="LOB"
            options={METADATA.LOB_OPTIONS}
            value={formData.lob}
            onChange={(value: string) => setFormData({ ...formData, lob: value })}
            placeholder="Select LOB..."
            disabled={isUpdating}
          />
          <SimpleSelect
            label="Client Name"
            options={METADATA.CLIENT_OPTIONS}
            value={formData.client}
            onChange={(value: string) => setFormData({ ...formData, client: value })}
            placeholder="Select client..."
            disabled={isUpdating}
          />
          <SimpleSelect
            label="Risk County"
            options={METADATA.RISK_CATEGORY_OPTIONS}
            value={formData.riskCategory}
            onChange={(value: string) => setFormData({ ...formData, riskCategory: value })}
            placeholder="Select risk category..."
            disabled={isUpdating}
          />

          {/* Tags */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-4 uppercase tracking-wide">Tags</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                disabled={isUpdating}
              />
              <button
                onClick={handleAddTag}
                disabled={isUpdating}
                className="px-4 py-3 text-white rounded-lg active:scale-95 transition-all duration-200 disabled:opacity-50 text-sm font-semibold shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                style={{
                  background: `linear-gradient(to right, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
                  '--tw-ring-color': getAccentColor(accentColor, '500')
                } as React.CSSProperties}
                type="button"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {(formData.tags || []).map(tag => (
                <div
                  key={tag}
                  className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                  style={{
                    background: `linear-gradient(to right, ${getAccentColor(accentColor, '100')}40, ${getAccentColor(accentColor, '50')}20)`,
                    color: getAccentColor(accentColor, '700'),
                    borderColor: getAccentColor(accentColor, '200')
                  }}
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="transition-all duration-200 hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 rounded p-0.5"
                    style={{
                      color: getAccentColor(accentColor, '700'),
                      '--tw-ring-color': getAccentColor(accentColor, '500')
                    } as React.CSSProperties}
                    type="button"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export const ConversationDetailsPanel = memo(ConversationDetailsPanelComponent)

