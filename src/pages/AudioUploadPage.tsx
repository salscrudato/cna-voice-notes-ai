import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiUploadCloud, FiCheck, FiMic, FiAlertCircle } from 'react-icons/fi'
import { voiceNoteService } from '../services/voiceNoteService'
import { logger } from '../services/logger'

const AudioUploadPage: React.FC = () => {
  const navigate = useNavigate()
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string>()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string>()
  const [uploadedVoiceNoteId, setUploadedVoiceNoteId] = useState<string>()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const validateFile = (file: File): string | null => {
    // Validate file type
    const validAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/ogg', 'audio/webm', 'audio/flac']
    if (!file.type.startsWith('audio/') && !validAudioTypes.includes(file.type)) {
      return 'Please select a valid audio file (MP3, WAV, M4A, OGG, WebM, FLAC)'
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      return `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds 100MB limit. Please select a smaller file.`
    }

    // Validate minimum file size (at least 1KB)
    if (file.size < 1024) {
      return 'File is too small. Please select a valid audio file.'
    }

    return null
  }

  const handleFileSelect = (file: File) => {
    setUploadError(undefined)

    // Validate file
    const validationError = validateFile(file)
    if (validationError) {
      setUploadError(validationError)
      logger.warn('File validation failed', { fileName: file.name, error: validationError })
      return
    }

    setFileName(file.name)
    performUpload(file)
  }

  const performUpload = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)
    setUploadError(undefined)

    try {
      logger.info('Starting real Firebase upload', { fileName: file.name })

      const result = await voiceNoteService.uploadAudioFile(file, (progress) => {
        setUploadProgress(Math.round(progress.progress))
      })

      logger.info('Upload completed successfully', { voiceNoteId: result.voiceNote.id })
      setUploadedVoiceNoteId(result.voiceNote.id)
      setUploadProgress(100)

      // Navigate to chat after a short delay, passing the voice note ID
      setTimeout(() => {
        navigate('/chat', { state: { voiceNoteId: result.voiceNote.id } })
      }, 1500)
    } catch (error) {
      logger.error('Upload failed', error)
      const errorMsg = error instanceof Error ? error.message : 'Upload failed. Please try again.'
      setUploadError(errorMsg)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 px-4 sm:px-6 py-4 sm:py-5 bg-white shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/chat')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200 text-slate-700 hover:text-slate-900 hover:scale-110 active:scale-95 flex-shrink-0"
            aria-label="Go back to chat"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2 min-w-0">
            <FiMic size={20} className="text-blue-600 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">Upload Audio</span>
          </h1>
        </div>
      </div>

      {/* Error Banner */}
      {uploadError && (
        <div className="bg-red-50 border-b border-red-200 px-4 sm:px-6 py-4 sm:py-5 flex items-start gap-3">
          <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-red-800 font-medium break-words">{uploadError}</p>
          </div>
          <button
            onClick={() => setUploadError(undefined)}
            className="text-red-600 hover:text-red-700 flex-shrink-0 font-bold"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-2xl w-full">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-16 text-center transition-all duration-300 ${
              isDragging
                ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20 scale-105 -translate-y-1'
                : 'border-slate-300 bg-white hover:border-blue-400 hover:shadow-md hover:shadow-blue-500/10 hover:scale-105 hover:-translate-y-0.5'
            }`}
            role="region"
            aria-label="Audio upload area"
          >
            {uploadProgress === 100 && uploadedVoiceNoteId ? (
              <div className="space-y-6 animate-fade-in">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all duration-300 animate-pulse-soft flex-shrink-0">
                  <FiCheck size={32} className="text-green-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2 justify-center">
                    <FiCheck size={20} className="text-green-600 flex-shrink-0" aria-hidden="true" />
                    Upload Complete!
                  </h3>
                  <p className="text-slate-600 text-base font-medium truncate">{fileName}</p>
                  <p className="text-slate-500 text-sm mt-4">Redirecting to chat in a moment...</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <button
                    onClick={() => navigate('/chat', { state: { voiceNoteId: uploadedVoiceNoteId } })}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 text-sm"
                  >
                    Go to Chat Now
                  </button>
                </div>
              </div>
            ) : isUploading ? (
              <div className="space-y-6 animate-fade-in">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                  <div className="animate-spin">
                    <FiUploadCloud size={32} className="text-blue-600" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2 justify-center">
                    <FiUploadCloud size={20} className="text-blue-600 animate-bounce flex-shrink-0" aria-hidden="true" />
                    Uploading...
                  </h3>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden shadow-sm">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                      role="progressbar"
                      aria-valuenow={uploadProgress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <p className="text-base text-slate-600 font-semibold mt-3">{uploadProgress}%</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all duration-300 animate-pulse-soft flex-shrink-0">
                  <FiUploadCloud size={32} className="text-blue-600" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">Upload Audio File</h3>
                  <p className="text-slate-600 text-base mb-4 font-medium">Drag and drop your audio file here, or click to select</p>
                  <p className="text-slate-500 text-sm">Supported formats: MP3, WAV, M4A, OGG (Max 100MB)</p>
                </div>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                  className="hidden"
                  id="audio-input"
                  aria-label="Select audio file"
                />
                <label
                  htmlFor="audio-input"
                  className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 cursor-pointer font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 text-sm"
                >
                  Select File
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export { AudioUploadPage }

