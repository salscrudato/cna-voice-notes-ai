/**
 * Application-wide constants
 * Centralized configuration for easy maintenance and AI agent comprehension
 */

// ============================================================================
// UI CONSTANTS
// ============================================================================

export const UI = {
  // Chat input
  MAX_MESSAGE_LENGTH: 4000,
  MESSAGE_INPUT_MAX_HEIGHT: 120,
  MESSAGE_INPUT_ROWS: 1,

  // Chat messages
  MAX_MESSAGES_TO_SEND_TO_API: 20,
  MESSAGE_SCROLL_BEHAVIOR: 'smooth' as const,

  // Timeouts
  COPY_FEEDBACK_DURATION: 2000,
} as const

// ============================================================================
// API CONSTANTS
// ============================================================================

export const API = {
  // OpenAI / Chat Provider
  MODEL: 'gpt-4o-mini',
  TEMPERATURE: 0.7,
  MAX_TOKENS: 1000,
  REQUEST_TIMEOUT_MS: 30000,
} as const

// ============================================================================
// METADATA CONSTANTS
// ============================================================================

export const METADATA = {
  // Brokers
  BROKER_OPTIONS: [
    { value: 'acme_insurance', label: 'Acme Insurance' },
    { value: 'global_brokers', label: 'Global Brokers' },
    { value: 'premier_insurance', label: 'Premier Insurance' },
    { value: 'apex_group', label: 'Apex Group' },
    { value: 'century_insurance', label: 'Century Insurance' },
    { value: 'elite_brokers', label: 'Elite Brokers' },
    { value: 'first_choice', label: 'First Choice' },
    { value: 'guardian_insurance', label: 'Guardian Insurance' },
    { value: 'horizon_brokers', label: 'Horizon Brokers' },
    { value: 'infinity_group', label: 'Infinity Group' },
  ] as const,

  // Lines of Business
  LOB_OPTIONS: [
    { value: 'commercial_general_liability', label: 'Commercial General Liability' },
    { value: 'property', label: 'Property' },
    { value: 'workers_compensation', label: 'Workers Compensation' },
    { value: 'professional_liability', label: 'Professional Liability' },
    { value: 'cyber_liability', label: 'Cyber Liability' },
    { value: 'management_liability', label: 'Management Liability' },
    { value: 'commercial_auto', label: 'Commercial Auto' },
    { value: 'umbrella', label: 'Umbrella' },
  ] as const,

  // Business Types
  BUSINESS_TYPE_OPTIONS: [
    { value: 'new_business', label: 'New Business' },
    { value: 'renewal', label: 'Renewal' },
    { value: 'modification', label: 'Modification' },
    { value: 'cancellation', label: 'Cancellation' },
  ] as const,

  // Client Names
  CLIENT_OPTIONS: [
    { value: 'acme_corp', label: 'Acme Corporation' },
    { value: 'tech_innovations', label: 'Tech Innovations Inc' },
    { value: 'global_retail', label: 'Global Retail Group' },
    { value: 'premier_healthcare', label: 'Premier Healthcare Systems' },
    { value: 'summit_manufacturing', label: 'Summit Manufacturing Co' },
    { value: 'nexus_financial', label: 'Nexus Financial Services' },
    { value: 'horizon_logistics', label: 'Horizon Logistics LLC' },
    { value: 'elite_hospitality', label: 'Elite Hospitality Group' },
    { value: 'quantum_tech', label: 'Quantum Tech Solutions' },
    { value: 'zenith_consulting', label: 'Zenith Consulting Partners' },
  ] as const,

  // Risk Categories
  RISK_CATEGORY_OPTIONS: [
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'retail', label: 'Retail' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'technology', label: 'Technology' },
    { value: 'professional_services', label: 'Professional Services' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'construction', label: 'Construction' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'financial_services', label: 'Financial Services' },
    { value: 'education', label: 'Education' },
  ] as const,

  // Underwriting Status
  UNDERWRITING_STATUS_OPTIONS: [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'declined', label: 'Declined' },
    { value: 'referred', label: 'Referred' },
    { value: 'in_review', label: 'In Review' },
  ] as const,

  // Coverage Types
  COVERAGE_TYPE_OPTIONS: [
    { value: 'basic', label: 'Basic' },
    { value: 'standard', label: 'Standard' },
    { value: 'enhanced', label: 'Enhanced' },
    { value: 'premium', label: 'Premium' },
  ] as const,

  // Required fields for conversation creation
  REQUIRED_FIELDS: ['broker', 'lob', 'businessType'] as const,

  // Optional fields for enrichment
  OPTIONAL_FIELDS: [
    'client',
    'accountNumber',
    'riskCategory',
    'industry',
    'coverageType',
    'premium',
    'underwritingStatus',
    'tags',
  ] as const,
} as const





