import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import { FiTrash2, FiEdit2, FiCheck, FiX } from '../utils/icons'
import type { Conversation } from '../types'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, newTitle: string) => void
}

const ConversationItemComponent = memo<ConversationItemProps>(({
  conversation,
  isActive,
  onSelect,
  onDelete,
  onRename,
}) => {
  const { accentColor } = useTheme()
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
      <div
        className="w-full px-3 py-2 rounded-lg border flex items-center gap-2 animate-fade-in shadow-sm dark:shadow-md hover:shadow-md dark:hover:shadow-lg transition-all duration-200"
        style={{
          backgroundColor: `${getAccentColor(accentColor, '50')}20`,
          borderColor: getAccentColor(accentColor, '300')
        }}
      >
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
          className="flex-1 bg-transparent text-slate-900 dark:text-slate-50 text-sm outline-none placeholder-slate-500 dark:placeholder-slate-400 rounded px-2 transition-all duration-200 focus:ring-2"
          placeholder="Rename..."
          aria-label="Edit conversation title"
          style={{
            '--tw-ring-color': getAccentColor(accentColor, '400')
          } as React.CSSProperties}
        />
        <button
          onClick={handleRename}
          className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-md transition-all duration-300 text-green-600 dark:text-green-400 hover:scale-125 hover:-translate-y-1 active:scale-95 active:translate-y-0 hover:shadow-md dark:hover:shadow-lg focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          title="Save"
          aria-label="Save rename"
          type="button"
        >
          <FiCheck size={16} />
        </button>
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-all duration-300 text-red-600 dark:text-red-400 hover:scale-125 hover:-translate-y-1 active:scale-95 active:translate-y-0 hover:shadow-md dark:hover:shadow-lg focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          title="Cancel"
          aria-label="Cancel rename"
          type="button"
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
        onKeyDown={handleButtonKeyDown}
        className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-300 truncate text-sm font-medium flex items-center gap-2.5 min-h-11 border focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
          isActive
            ? 'text-slate-900 dark:text-slate-100 shadow-md dark:shadow-lg hover:shadow-lg dark:hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md dark:hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]'
        }`}
        style={isActive ? {
          background: `linear-gradient(to right, ${getAccentColor(accentColor, '50')}40, ${getAccentColor(accentColor, '50')}20)`,
          borderColor: getAccentColor(accentColor, '300'),
          '--tw-ring-color': getAccentColor(accentColor, '500')
        } as React.CSSProperties : {
          '--tw-ring-color': getAccentColor(accentColor, '500')
        } as React.CSSProperties}
        title={conversation.title}
        aria-label={`Load conversation: ${conversation.title}${!isActive ? ' (Press e to edit, d to delete)' : ''}`}
        aria-current={isActive ? 'page' : undefined}
      >
        <span
          className="w-2.5 h-2.5 rounded-full transition-all flex-shrink-0 shadow-md"
          style={{
            backgroundColor: isActive ? getAccentColor(accentColor, '600') : '#a1a5ab',
            boxShadow: isActive ? `0 0 8px ${getAccentColor(accentColor, '500')}80` : 'none'
          }}
          aria-hidden="true"
        />
        <span className="truncate flex-1">{conversation.title}</span>
      </button>

      {/* Hover Actions */}
      {isHovering && !isActive && (
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-lg p-1.5 border shadow-md dark:shadow-lg animate-fade-in hover:shadow-lg dark:hover:shadow-xl transition-all duration-200"
          style={{
            background: `linear-gradient(to right, white, ${getAccentColor(accentColor, '50')}30)`,
            borderColor: getAccentColor(accentColor, '200')
          }}
        >
          <button
            onClick={() => setIsEditing(true)}
            className="p-2.5 rounded-md transition-all duration-300 text-slate-600 dark:text-slate-400 hover:scale-125 hover:-translate-y-1 active:scale-95 active:translate-y-0 hover:shadow-md dark:hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            style={{
              color: getAccentColor(accentColor, '600'),
              '--tw-ring-color': getAccentColor(accentColor, '500')
            } as React.CSSProperties}
            title="Rename"
            aria-label="Rename conversation"
            type="button"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2.5 rounded-md transition-all duration-300 text-slate-600 dark:text-slate-400 hover:scale-125 hover:-translate-y-1 active:scale-95 active:translate-y-0 hover:shadow-md dark:hover:shadow-lg focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            title="Delete"
            aria-label="Delete conversation"
            type="button"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      )}

      {/* Show actions on active item on hover */}
      {isHovering && isActive && (
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-lg p-1.5 border shadow-md dark:shadow-lg animate-fade-in hover:shadow-lg dark:hover:shadow-xl transition-all duration-200"
          style={{
            background: `linear-gradient(to right, ${getAccentColor(accentColor, '100')}40, ${getAccentColor(accentColor, '50')}20)`,
            borderColor: getAccentColor(accentColor, '300')
          }}
        >
          <button
            onClick={() => setIsEditing(true)}
            className="p-2.5 rounded-md transition-all duration-300 hover:scale-125 hover:-translate-y-1 active:scale-95 active:translate-y-0 hover:shadow-md dark:hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            style={{
              color: getAccentColor(accentColor, '700'),
              '--tw-ring-color': getAccentColor(accentColor, '500')
            } as React.CSSProperties}
            title="Rename"
            aria-label="Rename conversation"
            type="button"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2.5 rounded-md transition-all duration-300 hover:text-red-600 dark:hover:text-red-400 hover:scale-125 hover:-translate-y-1 active:scale-95 active:translate-y-0 hover:shadow-md dark:hover:shadow-lg focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            style={{
              color: getAccentColor(accentColor, '700')
            } as React.CSSProperties}
            title="Delete"
            aria-label="Delete conversation"
            type="button"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      )}
    </div>
  )
})

ConversationItemComponent.displayName = 'ConversationItem'

export const ConversationItem = ConversationItemComponent
