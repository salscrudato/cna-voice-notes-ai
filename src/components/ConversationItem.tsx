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

  const handleEditKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRename()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }, [handleRename, handleCancel])

  const handleButtonKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    // Enter or Space to select
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(conversation.id)
    }
    // e to edit (when not active)
    if (e.key === 'e' && !isActive && !isEditing) {
      e.preventDefault()
      setIsEditing(true)
    }
    // d to delete (when not active)
    if (e.key === 'd' && !isActive && !isEditing) {
      e.preventDefault()
      handleDelete()
    }
  }, [conversation.id, isActive, isEditing, onSelect, handleDelete])

  if (isEditing) {
    return (
      <div className="w-full px-2 py-1.5 rounded-lg bg-blue-50/90 dark:bg-blue-950/40 border border-blue-300/60 dark:border-blue-700/60 flex items-center gap-1.5 backdrop-blur-sm animate-fade-in shadow-md dark:shadow-lg dark:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-300">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => {
            if (e.target.value.length <= 100) {
              setEditValue(e.target.value)
            }
          }}
          onKeyDown={handleEditKeyDown}
          maxLength={100}
          className="flex-1 bg-transparent text-slate-900 dark:text-slate-50 text-xs outline-none placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 rounded px-1 transition-all duration-300 focus:scale-[1.01]"
          placeholder="Rename..."
          aria-label="Edit conversation title"
        />
        <button
          onClick={handleRename}
          className="p-1 hover:bg-green-100 dark:hover:bg-green-900/40 rounded transition-all duration-300 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:scale-125 active:scale-95 hover:shadow-sm dark:hover:shadow-md hover:-translate-y-0.5 focus-visible:ring-1 focus-visible:ring-green-500"
          title="Save"
          aria-label="Save rename"
          type="button"
        >
          <FiCheck size={14} />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded transition-all duration-300 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:scale-125 active:scale-95 hover:shadow-sm dark:hover:shadow-md hover:-translate-y-0.5 focus-visible:ring-1 focus-visible:ring-red-500"
          title="Cancel"
          aria-label="Cancel rename"
          type="button"
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
        onKeyDown={handleButtonKeyDown}
        className={`w-full text-left px-3 py-2.5 sm:py-2 rounded-lg transition-all duration-300 truncate text-xs font-medium flex items-center gap-2 border-l-4 min-h-10 sm:min-h-9 border focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
          isActive
            ? 'bg-gradient-to-r from-blue-50/90 to-transparent dark:from-blue-950/40 dark:to-transparent text-blue-900 dark:text-blue-300 shadow-lg dark:shadow-lg dark:shadow-blue-500/20 hover:shadow-xl dark:hover:shadow-xl hover:-translate-y-0.5 active:scale-95 border border-blue-300/60 dark:border-blue-700/60 border-l-blue-600 dark:border-l-blue-400 font-semibold transition-all duration-300 backdrop-blur-sm hover:scale-[1.01] dark:hover:shadow-blue-500/25'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 hover:shadow-md dark:hover:shadow-lg hover:-translate-y-0.5 active:scale-95 border-l-transparent hover:border-l-slate-400 dark:hover:border-l-slate-500 border-slate-200/30 dark:border-slate-700/30 hover:border-slate-200/50 dark:hover:border-slate-700/50 transition-all duration-300 hover:scale-[1.01] dark:hover:shadow-slate-900/50'
        }`}
        title={conversation.title}
        aria-label={`Load conversation: ${conversation.title}${!isActive ? ' (Press e to edit, d to delete)' : ''}`}
        aria-current={isActive ? 'page' : undefined}
      >
        <span
          className={`w-2 h-2 rounded-full transition-all flex-shrink-0 ${
            isActive ? 'bg-blue-600 dark:bg-blue-400 shadow-md shadow-blue-500/50 animate-pulse' : 'bg-slate-400 dark:bg-slate-600 group-hover:bg-slate-500 dark:group-hover:bg-slate-500'
          }`}
          aria-hidden="true"
        />
        <span className="truncate flex-1">{conversation.title}</span>
      </button>

      {/* Hover Actions */}
      {isHovering && !isActive && (
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-lg p-1 border border-slate-200 dark:border-slate-700 shadow-lg dark:shadow-lg dark:shadow-slate-900/50 animate-fade-in hover:shadow-xl dark:hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-md transition-all duration-300 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-125 active:scale-95 hover:shadow-sm dark:hover:shadow-md hover:-translate-y-0.5 focus-visible:ring-1 focus-visible:ring-blue-500"
            title="Rename"
            aria-label="Rename conversation"
            type="button"
          >
            <FiEdit2 size={12} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-md transition-all duration-300 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:scale-125 active:scale-95 hover:shadow-sm dark:hover:shadow-md hover:-translate-y-0.5 focus-visible:ring-1 focus-visible:ring-red-500"
            title="Delete"
            aria-label="Delete conversation"
            type="button"
          >
            <FiTrash2 size={12} />
          </button>
        </div>
      )}

      {/* Show actions on active item on hover */}
      {isHovering && isActive && (
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-blue-100/95 dark:bg-blue-950/50 backdrop-blur-lg rounded-lg p-1 border border-blue-300 dark:border-blue-700/60 shadow-lg dark:shadow-lg dark:shadow-blue-500/20 animate-fade-in hover:shadow-xl dark:hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 hover:bg-blue-200 dark:hover:bg-blue-900/60 rounded-md transition-all duration-300 text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200 hover:scale-125 active:scale-95 hover:shadow-sm dark:hover:shadow-md hover:-translate-y-0.5 focus-visible:ring-1 focus-visible:ring-blue-600"
            title="Rename"
            aria-label="Rename conversation"
            type="button"
          >
            <FiEdit2 size={12} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-red-200 dark:hover:bg-red-900/60 rounded-md transition-all duration-300 text-blue-700 dark:text-blue-300 hover:text-red-600 dark:hover:text-red-400 hover:scale-125 active:scale-95 hover:shadow-sm dark:hover:shadow-md hover:-translate-y-0.5 focus-visible:ring-1 focus-visible:ring-red-600"
            title="Delete"
            aria-label="Delete conversation"
            type="button"
          >
            <FiTrash2 size={12} />
          </button>
        </div>
      )}
    </div>
  )
}

export const ConversationItem = memo(ConversationItemComponent)
