/**
 * Shared filter options for underwriting filters and metadata input
 * Consolidates filter choices to avoid duplication
 */

export const FILTER_OPTIONS = {
  brokers: ['Marsh', 'Aon', 'Willis Towers Watson', 'Gallagher', 'Brown & Brown', 'Other'],
  lobs: ['commercial_general_liability', 'property', 'workers_compensation', 'commercial_auto', 'umbrella', 'cyber', 'management_liability'],
  businessTypes: ['new_business', 'renewal', 'modification', 'cancellation'],
  riskCategories: ['manufacturing', 'retail', 'healthcare', 'technology', 'construction', 'professional_services', 'hospitality', 'education'],
  underwritingStatus: ['pending', 'approved', 'declined', 'referred'],
}

/**
 * Display labels for filter options (for UI rendering)
 */
export const FILTER_LABELS: Record<string, Record<string, string>> = {
  lobs: {
    commercial_general_liability: 'Commercial General Liability',
    property: 'Property',
    workers_compensation: 'Workers Compensation',
    commercial_auto: 'Commercial Auto',
    umbrella: 'Umbrella',
    cyber: 'Cyber',
    management_liability: 'Management Liability',
  },
  businessTypes: {
    new_business: 'New Business',
    renewal: 'Renewal',
    modification: 'Modification',
    cancellation: 'Cancellation',
  },
  riskCategories: {
    manufacturing: 'Manufacturing',
    retail: 'Retail',
    healthcare: 'Healthcare',
    technology: 'Technology',
    construction: 'Construction',
    professional_services: 'Professional Services',
    hospitality: 'Hospitality',
    education: 'Education',
  },
  underwritingStatus: {
    pending: 'Pending',
    approved: 'Approved',
    declined: 'Declined',
    referred: 'Referred',
  },
}

/**
 * Helper function to get display label for a filter value
 */
export const getFilterLabel = (category: string, value: string): string => {
  return FILTER_LABELS[category]?.[value] || value.replace(/_/g, ' ').charAt(0).toUpperCase() + value.slice(1)
}

