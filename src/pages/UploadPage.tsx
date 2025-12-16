/**
 * Upload Page
 * Main page for file uploads and management
 */

import React, { memo, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiAlertCircle, FiCheckCircle, FiX } from '../utils/icons'
import { FileUploadZone } from '../components/FileUploadZone'
import { FileList } from '../components/FileList'
import { useUploadedFiles } from '../hooks/useUploadedFiles'
import { useToast } from '../hooks/useToast'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'
import { getAccentColor } from '../utils/accentColors'
import type { UploadedFile } from '../types'

// Simple inline TagInput component
interface TagInputProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
}

const TagInput: React.FC<TagInputProps> = memo(({ tags, onTagsChange }) => {
  const [inputValue, setInputValue] = useState('')

  const handleAddTag = useCallback(() => {
    const trimmed = inputValue.trim()
    if (trimmed && !tags.includes(trimmed)) {
      onTagsChange([...tags, trimmed])
      setInputValue('')
    }
  }, [inputValue, tags, onTagsChange])

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    onTagsChange(tags.filter(t => t !== tagToRemove))
  }, [tags, onTagsChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }, [handleAddTag])

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag..."
          className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
        <button
          onClick={handleAddTag}
          type="button"
          className="px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 bg-accent-100 dark:bg-accent-900/40 text-accent-700 dark:text-accent-300 rounded-full text-sm"
          >
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              type="button"
              className="hover:text-accent-900 dark:hover:text-accent-100 transition-colors"
            >
              <FiX size={14} />
            </button>
          </span>
        ))}
      </div>
    </div>
  )
})

// File type configurations
const FILE_CONFIGS = {
  audio: {
    mimeTypes: ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/ogg', 'audio/webm'],
    extensions: ['.mp3', '.m4a', '.wav', '.ogg', '.webm'],
    maxSize: 100 * 1024 * 1024, // 100MB
    description: 'Voice memos and audio files',
  },
  document: {
    mimeTypes: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    extensions: ['.doc', '.docx'],
    maxSize: 50 * 1024 * 1024, // 50MB
    description: 'Word documents',
  },
}

const UploadPageComponent: React.FC = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { accentColor } = useTheme()
  const { user, isLoading: isAuthLoading } = useAuth()
  const { files, isLoading, error, uploadProgress, loadFiles, uploadFile, updateFileTags, deleteFile, clearError } = useUploadedFiles()
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)
  const [editingTags, setEditingTags] = useState<string[]>([])
  const [isEditingTags, setIsEditingTags] = useState(false)

  // Load user files on mount
  useEffect(() => {
    if (user?.id) {
      loadFiles(user.id)
    }
  }, [loadFiles, user?.id])

  const handleFilesSelected = async (selectedFiles: File[]) => {
    if (!user?.id) {
      showToast('Please sign in to upload files', 'error')
      return
    }
    for (const file of selectedFiles) {
      const fileType = file.type.startsWith('audio/') ? 'audio' : 'document'
      const result = await uploadFile(file, user.id, fileType, [])
      if (result) {
        showToast(`${file.name} uploaded successfully`, 'success')
      } else {
        showToast(`Failed to upload ${file.name}`, 'error')
      }
    }
  }

  // Show loading state while auth is initializing
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 flex items-center justify-center">
        <div className="animate-pulse text-slate-500 dark:text-slate-400">Loading...</div>
      </div>
    )
  }

  const handleEditFile = (file: UploadedFile) => {
    setSelectedFile(file)
    setEditingTags(file.tags)
    setIsEditingTags(true)
  }

  const handleSaveTags = async () => {
    if (selectedFile) {
      await updateFileTags(selectedFile.id, editingTags)
      showToast('Tags updated successfully', 'success')
      setIsEditingTags(false)
      setSelectedFile(null)
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    const file = files.find((f) => f.id === fileId)
    if (file && window.confirm(`Delete ${file.originalName}?`)) {
      await deleteFile(fileId, file.storagePath)
      showToast('File deleted successfully', 'success')
    }
  }

  const acceptedTypes = [...FILE_CONFIGS.audio.mimeTypes, ...FILE_CONFIGS.document.mimeTypes]
  const maxSize = Math.max(FILE_CONFIGS.audio.maxSize, FILE_CONFIGS.document.maxSize)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/30 to-white dark:from-slate-950 dark:via-slate-900/30 dark:to-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <button
            onClick={() => navigate('/chat')}
            className="flex items-center gap-2 hover:transition-all duration-300 hover:-translate-x-1 focus-visible:ring-2 rounded px-2 py-1"
            style={{
              color: getAccentColor(accentColor, '600'),
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = getAccentColor(accentColor, '700')
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = getAccentColor(accentColor, '600')
            }}
            type="button"
          >
            <FiArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Chat</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 dark:text-slate-50">
              Upload Files
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Upload voice memos and documents to use as context in your conversations
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg animate-fade-in shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <FiAlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 animate-pulse" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900 dark:text-red-100">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:scale-110 transition-transform duration-300 active:scale-95"
                type="button"
              >
                ✕
              </button>
            </div>
          )}

          {/* Upload Progress */}
          {uploadProgress && (
            <div className="p-4 bg-accent-50 dark:bg-accent-950/30 border border-accent-200 dark:border-accent-800 rounded-lg animate-fade-in shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3">
                {uploadProgress.status === 'completed' ? (
                  <FiCheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 animate-bounce" />
                ) : (
                  <div className="w-5 h-5 border-2 border-accent-600 border-t-transparent rounded-full animate-spin" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-accent-900 dark:text-accent-100">
                    {uploadProgress.filename}
                  </p>
                  <div className="w-full bg-accent-200 dark:bg-accent-900 rounded-full h-2 mt-2 shadow-sm">
                    <div
                      className="bg-gradient-to-r from-accent-600 to-accent-500 dark:from-accent-400 dark:to-accent-300 h-2 rounded-full transition-all duration-300 shadow-md"
                      style={{ width: `${uploadProgress.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Zone */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              Upload New Files
            </h2>
            <FileUploadZone
              onFilesSelected={handleFilesSelected}
              acceptedTypes={acceptedTypes}
              maxSize={maxSize}
              isLoading={isLoading}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="font-medium text-slate-900 dark:text-slate-50">Audio Files</p>
                <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
                  MP3, M4A, WAV, OGG (up to 100MB)
                </p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="font-medium text-slate-900 dark:text-slate-50">Documents</p>
                <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
                  DOC, DOCX (up to 50MB)
                </p>
              </div>
            </div>
          </div>

          {/* Files List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              Your Files ({files.length})
            </h2>
            <FileList
              files={files}
              onEdit={handleEditFile}
              onDelete={handleDeleteFile}
              isLoading={isLoading}
            />
          </div>

          {/* Edit Tags Modal */}
          {isEditingTags && selectedFile && (
            <div className="fixed inset-0 bg-black/30 dark:bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full p-6 space-y-4 animate-fade-in">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  Edit Tags
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedFile.originalName}
                </p>
                <TagInput tags={editingTags} onTagsChange={setEditingTags} />
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setIsEditingTags(false)}
                    className="flex-1 px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveTags}
                    className="flex-1 px-4 py-2 text-white bg-accent-600 hover:bg-accent-700 rounded-lg transition-colors"
                    type="button"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export const UploadPage = memo(UploadPageComponent)

