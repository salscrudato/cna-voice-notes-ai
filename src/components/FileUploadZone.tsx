/**
 * File Upload Zone Component
 * Drag-and-drop interface for file uploads
 */

import React, { memo, useRef, useState } from 'react'
import { FiUploadCloud, FiAlertCircle } from '../utils/icons'

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void
  acceptedTypes: string[]
  maxSize: number
  isLoading?: boolean
}

const FileUploadZoneComponent: React.FC<FileUploadZoneProps> = ({
  onFilesSelected,
  acceptedTypes,
  maxSize,
  isLoading = false,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFiles = (files: FileList): File[] => {
    const validFiles: File[] = []
    setError(null)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Check file type
      if (!acceptedTypes.includes(file.type)) {
        setError(`File type not supported: ${file.name}`)
        continue
      }

      // Check file size
      if (file.size > maxSize) {
        setError(`File too large: ${file.name} (max ${Math.round(maxSize / 1024 / 1024)}MB)`)
        continue
      }

      validFiles.push(file)
    }

    return validFiles
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = validateFiles(e.dataTransfer.files)
    if (files.length > 0) {
      onFilesSelected(files)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = validateFiles(e.target.files)
      if (files.length > 0) {
        onFilesSelected(files)
      }
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 transition-all duration-300 shadow-sm hover:shadow-md ${
        isDragging
          ? 'border-accent-500 bg-accent-50 dark:bg-accent-950/30 shadow-lg'
          : 'border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-md'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        disabled={isLoading}
        className="hidden"
        aria-label="Upload files"
      />

      <div
        className="flex flex-col items-center gap-3 text-center"
        onClick={() => !isLoading && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isLoading) {
            fileInputRef.current?.click()
          }
        }}
      >
        <FiUploadCloud
          size={40}
          className={`transition-all duration-300 ${
            isDragging ? 'text-accent-500 scale-125 -translate-y-2' : 'text-slate-400 dark:text-slate-500'
          }`}
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Drag and drop files here
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            or click to browse
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg animate-fade-in shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <FiAlertCircle size={16} className="text-red-600 dark:text-red-400 flex-shrink-0 animate-pulse" />
          <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
    </div>
  )
}

export const FileUploadZone = memo(FileUploadZoneComponent)

