/**
 * AI Response Type Definitions
 * Comprehensive types for normalized AI responses supporting various content formats
 */

// ============================================================================
// SECTION TYPES
// ============================================================================

/** Types of AI response sections */
export type AiSectionType =
  | 'summary'
  | 'risks'
  | 'opportunities'
  | 'actions'
  | 'metrics'
  | 'raw'
  | 'followUps'
  | 'table'
  | 'recommendations'
  | 'nextSteps'
  | 'analysis'
  | 'keyPoints'
  | 'error'

// ============================================================================
// CITATION TYPES
// ============================================================================

/** Source type for citations */
export type CitationSourceType = 'voiceNote' | 'pdf' | 'email' | 'document' | 'web' | 'other'

/** Citation/source reference in AI response */
export interface AiCitation {
  /** Unique identifier for the citation */
  id?: string
  /** Title or name of the source */
  title?: string
  /** Type of source */
  sourceType?: CitationSourceType
  /** URL or link to the source */
  url?: string
  /** Timestamp range for audio/video sources */
  timestampRange?: {
    startSec: number
    endSec: number
  }
  /** Page number for document sources */
  pageNumber?: number
  /** Additional metadata */
  metadata?: Record<string, unknown>
}

// ============================================================================
// METRIC TYPES
// ============================================================================

/** Numeric metric or KPI in AI response */
export interface AiMetric {
  /** Metric name/label */
  name: string
  /** Metric value (can be number or formatted string) */
  value: string | number
  /** Unit of measurement (e.g., '%', '$', 'days') */
  unit?: string
  /** Description or context for the metric */
  description?: string
  /** Severity or status indicator */
  severity?: 'low' | 'medium' | 'high' | 'critical' | 'info'
  /** Trend indicator */
  trend?: 'up' | 'down' | 'stable'
}

// ============================================================================
// TABLE TYPES
// ============================================================================

/** Table structure in AI response */
export interface AiTable {
  /** Optional table title */
  title?: string
  /** Column headers */
  columns: string[]
  /** Table rows (each row is an array of cell values) */
  rows: (string | number | null)[][]
  /** Optional footer notes */
  footer?: string
}

// ============================================================================
// SECTION TYPES
// ============================================================================

/** A section of structured AI response content */
export interface AiSection {
  /** Type of section */
  type: AiSectionType
  /** Optional section title/heading */
  title?: string
  /** Markdown content for the section */
  contentMarkdown?: string
  /** List items (for bullet/numbered lists) */
  listItems?: string[]
  /** Metrics/KPIs */
  metrics?: AiMetric[]
  /** Table data */
  table?: AiTable
  /** Nested subsections */
  subsections?: AiSection[]
  /** Section-specific metadata */
  metadata?: Record<string, unknown>
}

// ============================================================================
// NORMALIZED RESPONSE
// ============================================================================

/** Fully normalized AI response ready for rendering */
export interface NormalizedAiResponse {
  /** Structured sections of content */
  sections: AiSection[]
  /** Citations and sources */
  citations?: AiCitation[]
  /** Suggested follow-up questions */
  followUpQuestions?: string[]
  /** Raw text fallback (if normalization partially failed) */
  rawText?: string
  /** Raw JSON fallback (if response was JSON) */
  rawJson?: unknown
  /** Error message if normalization failed */
  error?: string
  /** Confidence score (0-1) if provided by AI */
  confidence?: number
  /** Response metadata */
  metadata?: {
    /** Model that generated the response */
    model?: string
    /** Processing time in ms */
    processingTimeMs?: number
    /** Token usage */
    tokensUsed?: number
    /** Whether response was streamed */
    streamed?: boolean
  }
}

