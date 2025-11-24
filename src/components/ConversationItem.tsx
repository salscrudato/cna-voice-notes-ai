import React, { useState, useRef, useEffect, memo, useCallback } from 'react'
import { FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi'
import type { Conversation } from '../types'

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, newTitle: string) => void
}

const ConversationItemComponent: React.FC<ConversationItemProps> = ({
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

  const handleRename = useCallback(() => {
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
  }, [editValue, conversation.title, conversation.id, onRename])

  const handleCancel = useCallback(() => {
    setIsEditing(false)
    setEditValue(conversation.title)
  }, [conversation.title])

  const handleDelete = useCallback(() => {
    if (window.confirm(`Delete "${conversation.title}"?`)) {
      onDelete(conversation.id)
    }
  }, [conversation.title, conversation.id, onDelete])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRename()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }, [handleRename, handleCancel])

  if (isEditing) {
    return (
      <div className="w-full px-2 py-1.5 rounded-lg bg-blue-50 border border-blue-300 flex items-center gap-1.5">
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
          className="flex-1 bg-transparent text-slate-900 text-xs outline-none placeholder-slate-500"
          placeholder="Rename..."
          aria-label="Edit conversation title"
        />
        <button
          onClick={handleRename}
          className="p-1 hover:bg-green-100 rounded transition-colors text-green-600 hover:text-green-700"
          title="Save"
          aria-label="Save rename"
        >
          <FiCheck size={14} />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 hover:bg-red-100 rounded transition-colors text-red-600 hover:text-red-700"
          title="Cancel"
          aria-label="Cancel rename"
        >
          <FiX size={14} />
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
        className={`w-full text-left px-2 py-1.5 rounded-lg transition-all duration-200 truncate text-xs font-medium flex items-center gap-2 ${
          isActive
            ? 'bg-blue-100 text-blue-900 shadow-sm hover:shadow-md hover:scale-105 active:scale-95'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:scale-105 active:scale-95'
        }`}
        title={conversation.title}
        aria-label={`Load conversation: ${conversation.title}`}
        aria-current={isActive ? 'page' : undefined}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full transition-all flex-shrink-0 ${
            isActive ? 'bg-blue-600' : 'bg-slate-400 group-hover:bg-slate-500'
          }`}
          aria-hidden="true"
        />
        <span className="truncate flex-1">{conversation.title}</span>
      </button>

      {/* Hover Actions */}
      {isHovering && !isActive && (
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm rounded p-0.5 border border-slate-200 shadow-md animate-fade-in">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 hover:bg-blue-100 rounded transition-colors text-slate-600 hover:text-blue-600"
            title="Rename"
            aria-label="Rename conversation"
          >
            <FiEdit2 size={12} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-red-100 rounded transition-colors text-slate-600 hover:text-red-600"
            title="Delete"
            aria-label="Delete conversation"
          >
            <FiTrash2 size={12} />
          </button>
        </div>
      )}

      {/* Show actions on active item on hover */}
      {isHovering && isActive && (
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-blue-200/90 backdrop-blur-sm rounded p-0.5 border border-blue-300 shadow-md animate-fade-in">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 hover:bg-blue-300 rounded transition-colors text-blue-700 hover:text-blue-900"
            title="Rename"
            aria-label="Rename conversation"
          >
            <FiEdit2 size={12} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-red-200 rounded transition-colors text-blue-700 hover:text-red-600"
            title="Delete"
            aria-label="Delete conversation"
          >
            <FiTrash2 size={12} />
          </button>
        </div>
      )}
    </div>
  )
}

export const ConversationItem = memo(ConversationItemComponent)
