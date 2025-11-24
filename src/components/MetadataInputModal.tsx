import React, { useState, memo } from 'react'
import { FiX } from 'react-icons/fi'
import { FILTER_OPTIONS, getFilterLabel } from '../constants/filterOptions'
import type { ConversationMetadata } from '../types'

interface MetadataInputModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (metadata: Partial<ConversationMetadata>) => void
}

const MetadataInputModalComponent: React.FC<MetadataInputModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [metadata, setMetadata] = useState<Partial<ConversationMetadata>>({})

  const handleSubmit = () => {
    onSubmit(metadata)
    setMetadata({})
    onClose()
  }

  const handleClose = () => {
    setMetadata({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Add Metadata (Optional)</h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Broker */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Broker</label>
              <select
                value={metadata.broker || ''}
                onChange={(e) => setMetadata({ ...metadata, broker: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a broker...</option>
                {FILTER_OPTIONS.brokers.map((broker) => (
                  <option key={broker} value={broker}>
                    {broker}
                  </option>
                ))}
              </select>
            </div>

            {/* LOB */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Line of Business</label>
              <select
                value={metadata.lob || ''}
                onChange={(e) => setMetadata({ ...metadata, lob: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a LOB...</option>
                {FILTER_OPTIONS.lobs.map((lob) => (
                  <option key={lob} value={lob}>
                    {getFilterLabel('lobs', lob)}
                  </option>
                ))}
              </select>
            </div>

            {/* Business Type */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Business Type</label>
              <select
                value={metadata.businessType || ''}
                onChange={(e) => setMetadata({ ...metadata, businessType: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a type...</option>
                {FILTER_OPTIONS.businessTypes.map((type) => (
                  <option key={type} value={type}>
                    {getFilterLabel('businessTypes', type)}
                  </option>
                ))}
              </select>
            </div>

            {/* Risk Category */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Risk Category</label>
              <select
                value={metadata.riskCategory || ''}
                onChange={(e) => setMetadata({ ...metadata, riskCategory: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category...</option>
                {FILTER_OPTIONS.riskCategories.map((category) => (
                  <option key={category} value={category}>
                    {getFilterLabel('riskCategories', category)}
                  </option>
                ))}
              </select>
            </div>

            {/* Underwriting Status */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Underwriting Status</label>
              <select
                value={metadata.underwritingStatus || ''}
                onChange={(e) => setMetadata({ ...metadata, underwritingStatus: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a status...</option>
                {FILTER_OPTIONS.underwritingStatus.map((status) => (
                  <option key={status} value={status}>
                    {getFilterLabel('underwritingStatus', status)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-4 flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors font-medium text-sm"
            >
              Skip
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export const MetadataInputModal = memo(MetadataInputModalComponent)

