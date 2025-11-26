import React, { useState, useEffect, memo, useCallback } from 'react'
import { FiX } from 'react-icons/fi'
import { METADATA } from '../constants'
import { SearchableSelect } from './SearchableSelect'
import type { ConversationMetadata } from '../types'

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
  const [formData, setFormData] = useState<ConversationMetadata>(metadata)
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    setFormData(metadata)
  }, [metadata])

  const handleSave = useCallback(async () => {
    await onUpdate(formData)
    onClose()
  }, [formData, onUpdate, onClose])

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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 text-slate-600 dark:text-slate-400 hover:shadow-sm dark:hover:shadow-md hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            aria-label="Close panel"
            type="button"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4 pb-32">
          {/* All Fields - No Section Headers */}
          <SearchableSelect
            label="Broker"
            options={METADATA.BROKER_OPTIONS}
            value={formData.broker}
            onChange={(value) => setFormData({ ...formData, broker: value })}
            placeholder="Select a broker..."
            disabled={isUpdating}
          />
          <SearchableSelect
            label="LOB"
            options={METADATA.LOB_OPTIONS}
            value={formData.lob}
            onChange={(value) => setFormData({ ...formData, lob: value })}
            placeholder="Select LOB..."
            disabled={isUpdating}
          />
          <SearchableSelect
            label="Client Name"
            options={METADATA.CLIENT_OPTIONS}
            value={formData.client}
            onChange={(value) => setFormData({ ...formData, client: value })}
            placeholder="Select client..."
            disabled={isUpdating}
          />
          <SearchableSelect
            label="Risk County"
            options={METADATA.RISK_CATEGORY_OPTIONS}
            value={formData.riskCategory}
            onChange={(value) => setFormData({ ...formData, riskCategory: value })}
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
                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-200 disabled:opacity-50 text-sm font-semibold shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                type="button"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {(formData.tags || []).map(tag => (
                <div
                  key={tag}
                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-900/20 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium border border-amber-200 dark:border-amber-700/50 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-amber-900 dark:hover:text-amber-100 transition-all duration-200 hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 rounded p-0.5"
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

      <div className="fixed bottom-0 right-0 w-full sm:w-96 flex gap-3 p-6 border-t border-slate-200 dark:border-slate-800 bg-gradient-to-t from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 shadow-xl">
        <button
          onClick={onClose}
          disabled={isUpdating}
          className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold hover:shadow-sm focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          type="button"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isUpdating}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          type="button"
        >
          {isUpdating ? 'Saving...' : 'Save'}
        </button>
      </div>
    </>
  )
}

export const ConversationDetailsPanel = memo(ConversationDetailsPanelComponent)

