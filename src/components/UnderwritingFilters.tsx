import React, { useState, memo } from 'react'
import { FiChevronDown, FiX } from 'react-icons/fi'
import { FILTER_OPTIONS } from '../constants/filterOptions'
import type { ConversationMetadata } from '../types'

interface UnderwritingFiltersProps {
  onFilterChange: (filters: Partial<ConversationMetadata>) => void
  activeFilters: Partial<ConversationMetadata>
  isOpen?: boolean
  onClose?: () => void
}

const UnderwritingFiltersComponent: React.FC<UnderwritingFiltersProps> = ({
  onFilterChange,
  activeFilters,
  isOpen = false,
  onClose,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    broker: true,
    lob: true,
    businessType: false,
    riskCategory: false,
    status: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Build filter options with "All" prefix for display
  const brokerOptions = ['All Brokers', ...FILTER_OPTIONS.brokers]
  const lobOptions = ['All LOBs', ...FILTER_OPTIONS.lobs]
  const businessTypeOptions = ['All Types', ...FILTER_OPTIONS.businessTypes]
  const riskCategoryOptions = ['All Categories', ...FILTER_OPTIONS.riskCategories]
  const statusOptions = ['All Status', ...FILTER_OPTIONS.underwritingStatus]

  const handleFilterSelect = (filterType: string, value: string) => {
    if (value.startsWith('All ')) {
      const newFilters = { ...activeFilters }
      delete newFilters[filterType as keyof ConversationMetadata]
      onFilterChange(newFilters)
    } else {
      onFilterChange({
        ...activeFilters,
        [filterType]: value,
      })
    }
  }

  const clearAllFilters = () => {
    onFilterChange({})
  }

  const hasActiveFilters = Object.keys(activeFilters).length > 0

  // Desktop sidebar version
  const desktopContent = (
    <div className="w-64 bg-white border-r border-slate-200 overflow-y-auto flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 p-4 z-10">
        <h3 className="font-semibold text-slate-900 text-sm mb-3">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
            aria-label="Clear all filters"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="flex-1 overflow-y-auto">
        {/* Broker Filter */}
        <FilterSection
          title="Broker"
          section="broker"
          expanded={expandedSections.broker}
          onToggle={() => toggleSection('broker')}
          options={brokerOptions}
          selectedValue={activeFilters.broker}
          onSelect={(value) => handleFilterSelect('broker', value)}
        />

        {/* LOB Filter */}
        <FilterSection
          title="Line of Business"
          section="lob"
          expanded={expandedSections.lob}
          onToggle={() => toggleSection('lob')}
          options={lobOptions}
          selectedValue={activeFilters.lob}
          onSelect={(value) => handleFilterSelect('lob', value)}
        />

        {/* Business Type Filter */}
        <FilterSection
          title="Business Type"
          section="businessType"
          expanded={expandedSections.businessType}
          onToggle={() => toggleSection('businessType')}
          options={businessTypeOptions}
          selectedValue={activeFilters.businessType}
          onSelect={(value) => handleFilterSelect('businessType', value)}
        />

        {/* Risk Category Filter */}
        <FilterSection
          title="Risk Category"
          section="riskCategory"
          expanded={expandedSections.riskCategory}
          onToggle={() => toggleSection('riskCategory')}
          options={riskCategoryOptions}
          selectedValue={activeFilters.riskCategory}
          onSelect={(value) => handleFilterSelect('riskCategory', value)}
        />

        {/* Underwriting Status Filter */}
        <FilterSection
          title="Underwriting Status"
          section="status"
          expanded={expandedSections.status}
          onToggle={() => toggleSection('status')}
          options={statusOptions}
          selectedValue={activeFilters.underwritingStatus}
          onSelect={(value) => handleFilterSelect('underwritingStatus', value)}
        />
      </div>
    </div>
  )

  // Mobile drawer version
  const mobileDrawer = (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close button */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 text-sm">Filters</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close filters"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Filter content */}
        <div className="overflow-y-auto h-[calc(100vh-60px)]">
          {hasActiveFilters && (
            <div className="p-4 border-b border-slate-200">
              <button
                onClick={clearAllFilters}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                aria-label="Clear all filters"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Filter Sections */}
          <FilterSection
            title="Broker"
            section="broker"
            expanded={expandedSections.broker}
            onToggle={() => toggleSection('broker')}
            options={brokerOptions}
            selectedValue={activeFilters.broker}
            onSelect={(value) => handleFilterSelect('broker', value)}
          />

          <FilterSection
            title="Line of Business"
            section="lob"
            expanded={expandedSections.lob}
            onToggle={() => toggleSection('lob')}
            options={lobOptions}
            selectedValue={activeFilters.lob}
            onSelect={(value) => handleFilterSelect('lob', value)}
          />

          <FilterSection
            title="Business Type"
            section="businessType"
            expanded={expandedSections.businessType}
            onToggle={() => toggleSection('businessType')}
            options={businessTypeOptions}
            selectedValue={activeFilters.businessType}
            onSelect={(value) => handleFilterSelect('businessType', value)}
          />

          <FilterSection
            title="Risk Category"
            section="riskCategory"
            expanded={expandedSections.riskCategory}
            onToggle={() => toggleSection('riskCategory')}
            options={riskCategoryOptions}
            selectedValue={activeFilters.riskCategory}
            onSelect={(value) => handleFilterSelect('riskCategory', value)}
          />

          <FilterSection
            title="Underwriting Status"
            section="status"
            expanded={expandedSections.status}
            onToggle={() => toggleSection('status')}
            options={statusOptions}
            selectedValue={activeFilters.underwritingStatus}
            onSelect={(value) => handleFilterSelect('underwritingStatus', value)}
          />
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden md:flex">
        {desktopContent}
      </div>

      {/* Mobile drawer */}
      <div className="md:hidden">
        {mobileDrawer}
      </div>
    </>
  )
}

interface FilterSectionProps {
  title: string
  section: string
  expanded: boolean
  onToggle: () => void
  options: string[]
  selectedValue?: string
  onSelect: (value: string) => void
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  expanded,
  onToggle,
  options,
  selectedValue,
  onSelect,
}) => (
  <div className="border-b border-slate-100">
    <button
      onClick={onToggle}
      className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-sm font-medium text-slate-900"
      aria-expanded={expanded}
    >
      <span>{title}</span>
      <FiChevronDown size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
    </button>
    {expanded && (
      <div className="px-2 py-2 bg-slate-50 space-y-1">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${
              selectedValue === option.toLowerCase().replace(/\s+/g, '_') || (option.startsWith('All') && !selectedValue)
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    )}
  </div>
)

export const UnderwritingFilters = memo(UnderwritingFiltersComponent)

