import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { FiChevronDown, FiX } from '../utils/icons'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'

interface Option {
  value: string
  label: string
}

interface SearchableSelectProps {
  options: readonly Option[]
  value: string | undefined
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  label?: string
}

const SearchableSelectComponent: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  disabled = false,
  label,
}) => {
  const { accentColor } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredOptions = useMemo(() =>
    (options as Option[]).filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [options, searchTerm]
  )

  const selectedOption = useMemo(() =>
    (options as Option[]).find(opt => opt.value === value),
    [options, value]
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSelect = useCallback((optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setSearchTerm('')
  }, [onChange])

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    setSearchTerm('')
  }, [onChange])

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          {label}
        </label>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full px-4 py-3 border rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50 text-sm focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between transition-all duration-200 hover:shadow-sm"
        style={{
          borderColor: getAccentColor(accentColor, '300'),
          '--tw-ring-color': getAccentColor(accentColor, '500')
        } as React.CSSProperties}
        type="button"
      >
        <span className="truncate font-medium">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {value && (
            <FiX
              size={18}
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all duration-200 hover:scale-110 active:scale-95"
            />
          )}
          <FiChevronDown
            size={18}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50 border rounded-lg shadow-lg z-50 animate-fade-in"
          style={{
            borderColor: getAccentColor(accentColor, '300')
          }}
        >
          <div
            className="p-3 border-b"
            style={{
              borderColor: getAccentColor(accentColor, '200')
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 hover:shadow-sm"
              style={{
                borderColor: getAccentColor(accentColor, '300'),
                '--tw-ring-color': getAccentColor(accentColor, '500')
              } as React.CSSProperties}
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left px-4 py-3 text-sm transition-all duration-200 border-l-4 ${
                    value === option.value
                      ? 'font-semibold hover:translate-x-1'
                      : 'text-slate-900 dark:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:translate-x-1 border-l-transparent'
                  }`}
                  style={value === option.value ? {
                    background: `linear-gradient(to right, ${getAccentColor(accentColor, '100')}40, ${getAccentColor(accentColor, '50')}20)`,
                    color: getAccentColor(accentColor, '900'),
                    borderLeftColor: getAccentColor(accentColor, '600')
                  } : {
                    borderLeftColor: 'transparent'
                  }}
                  type="button"
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 text-center font-medium">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export const SearchableSelect = SearchableSelectComponent

