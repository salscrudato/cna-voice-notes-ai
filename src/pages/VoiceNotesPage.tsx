import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiArrowRight, FiRefreshCw } from 'react-icons/fi'
import { useVoiceNotes } from '../hooks/useVoiceNotes'
import { useDebounce } from '../hooks/useDebounce'
import { chatService } from '../services/chatService'
import { voiceNoteService } from '../services/voiceNoteService'
import { logger } from '../services/logger'
import { LoadingSpinner } from '../components/LoadingSpinner'
import type { VoiceNoteStatus } from '../types'

const VoiceNotesPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<VoiceNoteStatus | 'all'>('all')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const { voiceNotes, isLoading, error, refetch } = useVoiceNotes({
    statusFilter,
    searchTerm: debouncedSearchTerm,
  })

  const handleOpenInChat = useCallback(async (voiceNoteId: string) => {
    try {
      logger.info('Opening voice note in chat', { voiceNoteId })
      const voiceNote = await voiceNoteService.getVoiceNoteById(voiceNoteId)
      
      if (!voiceNote) {
        logger.error('Voice note not found', { voiceNoteId })
        return
      }

      // If already linked to a conversation, navigate to it
      if (voiceNote.conversationId) {
        navigate('/chat', { state: { conversationId: voiceNote.conversationId } })
        return
      }

      // Create new conversation and link voice note
      const title = `Voice Note – ${voiceNote.fileName.split('.')[0]}`
      const conversationId = await chatService.createConversation(title, {
        tags: ['voice_note'],
      })
      await voiceNoteService.linkVoiceNoteToConversation(voiceNoteId, conversationId)
      
      logger.info('Voice note linked to new conversation', { voiceNoteId, conversationId })
      navigate('/chat', { state: { conversationId } })
    } catch (err) {
      logger.error('Error opening voice note in chat', err)
    }
  }, [navigate])

  const getStatusColor = (status: VoiceNoteStatus) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'uploaded':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 p-4 md:p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Voice Notes</h1>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by filename or transcript..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as VoiceNoteStatus | 'all')}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="uploaded">Uploaded</option>
            <option value="processing">Processing</option>
            <option value="ready">Ready</option>
            <option value="error">Error</option>
          </select>

          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2"
            aria-label="Refresh voice notes"
          >
            <FiRefreshCw size={18} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 font-medium">Error loading voice notes</p>
            <p className="text-slate-600 text-sm mt-1">{error.message}</p>
          </div>
        ) : voiceNotes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-600">No voice notes found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {voiceNotes.map((note) => (
              <div
                key={note.id}
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 truncate">{note.fileName}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(note.status)}`}>
                        {note.status}
                      </span>
                      <span className="text-xs text-slate-500">{formatDate(note.createdAt)}</span>
                    </div>
                    {note.transcriptSummary && (
                      <p className="text-sm text-slate-600 mt-2 line-clamp-2">{note.transcriptSummary}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleOpenInChat(note.id)}
                    className="flex-shrink-0 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
                    aria-label={`Open ${note.fileName} in chat`}
                  >
                    <span className="hidden sm:inline">Open</span>
                    <FiArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default VoiceNotesPage

