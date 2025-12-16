/**
 * File List Component
 * Displays uploaded files with tags and management options
 */

import React, { memo } from 'react'
import { FiTrash2, FiEdit2, FiMusic, FiFile } from '../utils/icons'
import type { UploadedFile } from '../types'
import { formatTime } from '../utils/formatting'

interface FileListProps {
  files: UploadedFile[]
  onEdit: (file: UploadedFile) => void
  onDelete: (fileId: string) => void
  isLoading?: boolean
}

const FileListComponent: React.FC<FileListProps> = ({
  files,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">No files uploaded yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <div
          key={file.id}
          className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-md dark:hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-600 group"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {file.fileType === 'audio' ? (
                <FiMusic size={20} className="text-accent-600 dark:text-accent-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300" />
              ) : (
                <FiFile size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-slate-50 truncate">
                  {file.originalName}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {formatFileSize(file.size)} • {formatTime(file.uploadedAt)}
                </p>
                {file.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {file.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-1 bg-accent-100 dark:bg-accent-900/40 text-accent-700 dark:text-accent-300 rounded text-xs font-medium hover:bg-accent-200 dark:hover:bg-accent-900/60 transition-all duration-300 hover:shadow-sm hover:scale-105"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => onEdit(file)}
                disabled={isLoading}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 hover:-translate-y-1 active:scale-95"
                aria-label={`Edit tags for ${file.originalName}`}
                type="button"
              >
                <FiEdit2 size={16} className="text-slate-600 dark:text-slate-400" />
              </button>
              <button
                onClick={() => onDelete(file.id)}
                disabled={isLoading}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 hover:-translate-y-1 active:scale-95"
                aria-label={`Delete ${file.originalName}`}
                type="button"
              >
                <FiTrash2 size={16} className="text-red-600 dark:text-red-400" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export const FileList = memo(FileListComponent)

