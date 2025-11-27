import React, { useState, useCallback, memo } from 'react'
import { FiX, FiInfo } from '../utils/icons'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'
import { METADATA } from '../constants'
import type { ConversationMetadata } from '../types'

interface NewConversationDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (metadata: ConversationMetadata) => Promise<void>
  isLoading?: boolean
}

const NewConversationDialogComponent: React.FC<NewConversationDialogProps> = ({
  isOpen,
  onClose,
  onCreate,
  isLoading = false,
}) => {
  const { accentColor } = useTheme()
  const [broker, setBroker] = useState('')
  const [lob, setLob] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleCreate = useCallback(async () => {
    setError(null)

    if (!broker.trim()) {
      setError('Broker is required')
      return
    }
    if (!lob) {
      setError('Line of Business is required')
      return
    }
    if (!businessType) {
      setError('Business Type is required')
      return
    }

    try {
      await onCreate({
        broker: broker.trim(),
        lob,
        businessType,
      })
      // Reset form
      setBroker('')
      setLob('')
      setBusinessType('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create conversation')
    }
  }, [broker, lob, businessType, onCreate])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 rounded-2xl shadow-xl max-w-md w-full p-8 space-y-6 border border-slate-200 dark:border-slate-800 animate-fade-in">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">New Conversation</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 text-slate-600 dark:text-slate-400 hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            aria-label="Close dialog"
            type="button"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-5">
          {/* Broker */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Broker *
            </label>
            <input
              type="text"
              value={broker}
              onChange={(e) => setBroker(e.target.value)}
              placeholder="Enter broker name..."
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
              disabled={isLoading}
            />
          </div>

          {/* Line of Business */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Line of Business *
            </label>
            <select
              value={lob}
              onChange={(e) => setLob(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
              disabled={isLoading}
            >
              <option value="">Select LOB...</option>
              {METADATA.LOB_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Business Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Business Type *
            </label>
            <div className="space-y-2.5">
              {METADATA.BUSINESS_TYPE_OPTIONS.map(opt => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 p-3 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-700/50">
                  <input
                    type="radio"
                    name="businessType"
                    value={opt.value}
                    checked={businessType === opt.value}
                    onChange={(e) => setBusinessType(e.target.value)}
                    disabled={isLoading}
                    className="w-5 h-5 accent-blue-600"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-gradient-to-r from-red-50 to-red-50/50 dark:from-red-950/40 dark:to-red-950/20 border border-red-200 dark:border-red-700/50 rounded-lg text-sm text-red-700 dark:text-red-300 font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              {error}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium hover:shadow-sm hover:scale-105 hover:-translate-y-1 active:scale-95 focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={isLoading}
            className="flex-1 px-4 py-3 text-white rounded-lg active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg hover:scale-105 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            style={{
              background: `linear-gradient(to right, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
              '--tw-ring-color': getAccentColor(accentColor, '500')
            } as React.CSSProperties}
            type="button"
          >
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 text-center font-medium flex items-center justify-center gap-2">
          <FiInfo className="w-4 h-4" />
          You can add more details after creating
        </p>
      </div>
    </div>
  )
}

export const NewConversationDialog = memo(NewConversationDialogComponent)

