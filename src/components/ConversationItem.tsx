import React, { useState, useRef, useEffect } from 'react'
import { FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi'
import type { Conversation } from '../types'

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, newTitle: string) => void
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onSelect,
  onDelete,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(conversation.title)
  const [isHovering, setIsHovering] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleRename = () => {
    const trimmedValue = editValue.trim()
    if (!trimmedValue) {
      setEditValue(conversation.title)
      setIsEditing(false)
      return
    }
    if (trimmedValue !== conversation.title && trimmedValue.length > 0 && trimmedValue.length <= 100) {
      onRename(conversation.id, trimmedValue)
    }
    setIsEditing(false)
    setEditValue(conversation.title)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditValue(conversation.title)
  }

  const handleDelete = () => {
    if (window.confirm(`Delete "${conversation.title}"?`)) {
      onDelete(conversation.id)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRename()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (isEditing) {
    return (
      <div className="w-full px-3 py-2 rounded-lg bg-slate-700/40 border border-blue-500/50 flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => {
            if (e.target.value.length <= 100) {
              setEditValue(e.target.value)
            }
          }}
          onKeyDown={handleKeyDown}
          maxLength={100}
          className="flex-1 bg-transparent text-white text-sm outline-none placeholder-slate-400"
          placeholder="Rename conversation..."
          aria-label="Edit conversation title"
        />
        <button
          onClick={handleRename}
          className="p-1.5 hover:bg-green-500/20 rounded transition-colors text-green-400 hover:text-green-300"
          title="Save"
          aria-label="Save rename"
        >
          <FiCheck size={16} />
        </button>
        <button
          onClick={handleCancel}
          className="p-1.5 hover:bg-red-500/20 rounded transition-colors text-red-400 hover:text-red-300"
          title="Cancel"
          aria-label="Cancel rename"
        >
          <FiX size={16} />
        </button>
      </div>
    )
  }

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="group relative"
    >
      <button
        onClick={() => onSelect(conversation.id)}
        className={`w-full text-left px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-lg transition-all duration-200 truncate text-xs sm:text-sm font-medium flex items-center gap-2 touch-target ${
          isActive
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
            : 'text-slate-300 hover:bg-slate-700/60 hover:text-slate-100 hover:scale-105 active:scale-95'
        }`}
        title={conversation.title}
        aria-label={`Load conversation: ${conversation.title}`}
        aria-current={isActive ? 'page' : undefined}
      >
        <span
          className={`w-2 h-2 rounded-full transition-all flex-shrink-0 ${
            isActive ? 'bg-white scale-125' : 'bg-slate-500 group-hover:bg-slate-300'
          }`}
          aria-hidden="true"
        />
        <span className="truncate flex-1">{conversation.title}</span>
      </button>

      {/* Hover Actions */}
      {isHovering && !isActive && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-slate-800/90 backdrop-blur-sm rounded-lg p-1 border border-slate-700/50 shadow-lg animate-fade-in">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 hover:bg-blue-500/20 rounded transition-colors text-slate-400 hover:text-blue-300"
            title="Rename"
            aria-label="Rename conversation"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-red-500/20 rounded transition-colors text-slate-400 hover:text-red-400"
            title="Delete"
            aria-label="Delete conversation"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      )}

      {/* Show actions on active item on hover */}
      {isHovering && isActive && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-blue-900/90 backdrop-blur-sm rounded-lg p-1 border border-blue-500/50 shadow-lg animate-fade-in">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 hover:bg-white/20 rounded transition-colors text-white/70 hover:text-white"
            title="Rename"
            aria-label="Rename conversation"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-red-500/30 rounded transition-colors text-white/70 hover:text-red-300"
            title="Delete"
            aria-label="Delete conversation"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

