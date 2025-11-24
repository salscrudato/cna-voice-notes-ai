import React, { useState, memo } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import type { ConversationMetadata } from '../types'

interface UnderwritingFiltersProps {
  onFilterChange: (filters: Partial<ConversationMetadata>) => void
  activeFilters: Partial<ConversationMetadata>
}

const BROKERS = ['All Brokers', 'Marsh', 'Aon', 'Willis Towers Watson', 'Gallagher', 'Brown & Brown', 'Other']
const LOBS = ['All LOBs', 'Commercial General Liability', 'Property', 'Workers Compensation', 'Commercial Auto', 'Umbrella', 'Cyber', 'Management Liability']
const BUSINESS_TYPES = ['All Types', 'New Business', 'Renewal', 'Modification', 'Cancellation']
const RISK_CATEGORIES = ['All Categories', 'Manufacturing', 'Retail', 'Healthcare', 'Technology', 'Construction', 'Professional Services', 'Hospitality', 'Education']
const UNDERWRITING_STATUS = ['All Status', 'Pending', 'Approved', 'Declined', 'Referred']

const UnderwritingFiltersComponent: React.FC<UnderwritingFiltersProps> = ({ onFilterChange, activeFilters }) => {
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

  const handleFilterSelect = (filterType: string, value: string) => {
    if (value === 'All Brokers' || value === 'All LOBs' || value === 'All Types' || value === 'All Categories' || value === 'All Status') {
      const newFilters = { ...activeFilters }
      delete newFilters[filterType as keyof ConversationMetadata]
      onFilterChange(newFilters)
    } else {
      onFilterChange({
        ...activeFilters,
        [filterType]: value.toLowerCase().replace(/\s+/g, '_'),
      })
    }
  }

  const clearAllFilters = () => {
    onFilterChange({})
  }

  const hasActiveFilters = Object.keys(activeFilters).length > 0

  return (
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
          options={BROKERS}
          selectedValue={activeFilters.broker}
          onSelect={(value) => handleFilterSelect('broker', value)}
        />

        {/* LOB Filter */}
        <FilterSection
          title="Line of Business"
          section="lob"
          expanded={expandedSections.lob}
          onToggle={() => toggleSection('lob')}
          options={LOBS}
          selectedValue={activeFilters.lob}
          onSelect={(value) => handleFilterSelect('lob', value)}
        />

        {/* Business Type Filter */}
        <FilterSection
          title="Business Type"
          section="businessType"
          expanded={expandedSections.businessType}
          onToggle={() => toggleSection('businessType')}
          options={BUSINESS_TYPES}
          selectedValue={activeFilters.businessType}
          onSelect={(value) => handleFilterSelect('businessType', value)}
        />

        {/* Risk Category Filter */}
        <FilterSection
          title="Risk Category"
          section="riskCategory"
          expanded={expandedSections.riskCategory}
          onToggle={() => toggleSection('riskCategory')}
          options={RISK_CATEGORIES}
          selectedValue={activeFilters.riskCategory}
          onSelect={(value) => handleFilterSelect('riskCategory', value)}
        />

        {/* Underwriting Status Filter */}
        <FilterSection
          title="Underwriting Status"
          section="status"
          expanded={expandedSections.status}
          onToggle={() => toggleSection('status')}
          options={UNDERWRITING_STATUS}
          selectedValue={activeFilters.underwritingStatus}
          onSelect={(value) => handleFilterSelect('underwritingStatus', value)}
        />
      </div>
    </div>
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

