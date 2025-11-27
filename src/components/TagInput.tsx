/**
 * Tag Input Component
 * Allows users to add and remove tags
 */

import React, { memo, useState } from 'react'
import { FiX } from '../utils/icons'

interface TagInputProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
}

const TagInputComponent: React.FC<TagInputProps> = ({
  tags,
  onTagsChange,
  placeholder = 'Add tags...',
  maxTags = 10,
}) => {
  const [inputValue, setInputValue] = useState('')

  const handleAddTag = () => {
    const trimmedValue = inputValue.trim().toLowerCase()
    if (trimmedValue && !tags.includes(trimmedValue) && tags.length < maxTags) {
      onTagsChange([...tags, trimmedValue])
      setInputValue('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      handleRemoveTag(tags[tags.length - 1])
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
        {tags.map((tag) => (
          <div
            key={tag}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
          >
            <span>{tag}</span>
            <button
              onClick={() => handleRemoveTag(tag)}
              className="hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
              aria-label={`Remove tag: ${tag}`}
              type="button"
            >
              <FiX size={14} />
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length < maxTags ? placeholder : 'Max tags reached'}
          disabled={tags.length >= maxTags}
          className="flex-1 min-w-[120px] bg-transparent text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none text-sm"
          aria-label="Tag input"
        />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {tags.length}/{maxTags} tags
      </p>
    </div>
  )
}

export const TagInput = memo(TagInputComponent)

