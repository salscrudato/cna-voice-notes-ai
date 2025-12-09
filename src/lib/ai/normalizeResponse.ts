/**
 * AI Response Normalization Layer
 * Converts raw AI responses (JSON, Markdown, mixed) into normalized structures
 */

import type {
  NormalizedAiResponse,
  AiSection,
  AiSectionType,
  AiCitation,
  AiMetric,
  AiTable,
} from '../../types/ai'
import { logger } from '../../services/logger'

/** Known section heading patterns */
const SECTION_PATTERNS: Record<string, AiSectionType> = {
  summary: 'summary',
  'executive summary': 'summary',
  overview: 'summary',
  risks: 'risks',
  'risk assessment': 'risks',
  'key risks': 'risks',
  opportunities: 'opportunities',
  actions: 'actions',
  'action items': 'actions',
  'recommended actions': 'actions',
  recommendations: 'recommendations',
  'next steps': 'nextSteps',
  metrics: 'metrics',
  'key metrics': 'metrics',
  kpis: 'metrics',
  analysis: 'analysis',
  'key points': 'keyPoints',
  'follow-up questions': 'followUps',
  'follow up': 'followUps',
}

/** JSON field mappings to section types */
const JSON_FIELD_MAPPINGS: Record<string, AiSectionType> = {
  summary: 'summary',
  risks: 'risks',
  opportunities: 'opportunities',
  actions: 'actions',
  recommendations: 'recommendations',
  nextSteps: 'nextSteps',
  next_steps: 'nextSteps',
  metrics: 'metrics',
  analysis: 'analysis',
  keyPoints: 'keyPoints',
  key_points: 'keyPoints',
}

/** Normalize any AI response format into a structured NormalizedAiResponse */
export function normalizeResponse(rawResponse: string): NormalizedAiResponse {
  try {
    logger.debug('Normalizing AI response', { length: rawResponse.length })

    // Try JSON parsing first
    const jsonResult = tryParseAsJson(rawResponse)
    if (jsonResult) {
      logger.debug('Response parsed as JSON')
      return jsonResult
    }

    // Try Markdown with structured sections
    const markdownResult = parseMarkdownSections(rawResponse)
    if (markdownResult.sections.length > 0) {
      logger.debug('Response parsed as structured Markdown', {
        sectionCount: markdownResult.sections.length,
      })
      return markdownResult
    }

    // Fallback: treat as raw text
    logger.debug('Response treated as raw text')
    return {
      sections: [
        {
          type: 'raw',
          contentMarkdown: rawResponse.trim(),
        },
      ],
      rawText: rawResponse,
    }
  } catch (error) {
    logger.error('Error normalizing response', error)
    return {
      sections: [],
      rawText: rawResponse,
      error: error instanceof Error ? error.message : 'Failed to normalize response',
    }
  }
}

/** Try to parse response as JSON */
function tryParseAsJson(rawResponse: string): NormalizedAiResponse | null {
  try {
    // Try direct JSON parse
    let jsonData: unknown
    try {
      jsonData = JSON.parse(rawResponse.trim())
    } catch {
      // Try extracting JSON from markdown code block
      const jsonMatch = rawResponse.match(/```json\s*\n([\s\S]*?)\n```/)
      if (jsonMatch) {
        jsonData = JSON.parse(jsonMatch[1])
      } else {
        return null
      }
    }

    if (!jsonData || typeof jsonData !== 'object') {
      return null
    }

    return normalizeJsonResponse(jsonData as Record<string, unknown>)
  } catch (error) {
    logger.debug('Not a valid JSON response', error)
    return null
  }
}

/**
 * Normalize a JSON object into NormalizedAiResponse
 */
function normalizeJsonResponse(json: Record<string, unknown>): NormalizedAiResponse {
  const sections: AiSection[] = []
  let citations: AiCitation[] | undefined
  let followUpQuestions: string[] | undefined

  // Extract known fields
  for (const [key, value] of Object.entries(json)) {
    const lowerKey = key.toLowerCase()

    // Handle citations/sources
    if (lowerKey === 'citations' || lowerKey === 'sources') {
      citations = normalizeCitations(value)
      continue
    }

    // Handle follow-up questions
    if (lowerKey === 'followupquestions' || lowerKey === 'follow_up_questions' || lowerKey === 'followup') {
      followUpQuestions = normalizeFollowUpQuestions(value)
      continue
    }

    // Handle metrics
    if (lowerKey === 'metrics' || lowerKey === 'kpis') {
      const metrics = normalizeMetrics(value)
      if (metrics.length > 0) {
        sections.push({ type: 'metrics', title: 'Metrics', metrics })
      }
      continue
    }

    // Map to section type
    const sectionType = JSON_FIELD_MAPPINGS[key] || JSON_FIELD_MAPPINGS[lowerKey]
    if (sectionType) {
      sections.push(createSectionFromValue(sectionType, key, value))
    }
  }

  return {
    sections,
    citations,
    followUpQuestions,
    rawJson: json,
  }
}

/**
 * Create a section from a JSON value
 */
function createSectionFromValue(type: AiSectionType, title: string, value: unknown): AiSection {
  // Handle array values (list items)
  if (Array.isArray(value)) {
    return {
      type,
      title: formatTitle(title),
      listItems: value.map(item => String(item)),
    }
  }

  // Handle string values
  if (typeof value === 'string') {
    return {
      type,
      title: formatTitle(title),
      contentMarkdown: value,
    }
  }

  // Handle object values
  if (typeof value === 'object' && value !== null) {
    return {
      type,
      title: formatTitle(title),
      contentMarkdown: JSON.stringify(value, null, 2),
    }
  }

  // Fallback
  return {
    type,
    title: formatTitle(title),
    contentMarkdown: String(value),
  }
}

/** Structure raw unformatted content into sections */
function structureRawContent(content: string): AiSection[] {
  const sections: AiSection[] = []
  const lines = content.split('\n')
  let currentSection: AiSection | null = null
  let currentContent: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Skip empty lines but don't add them to content
    if (!line) {
      continue
    }

    // Detect numbered list items (1. Item, 2. Item, etc.)
    const numberedMatch = line.match(/^\d+\.\s+(.+)$/)
    if (numberedMatch) {
      // If we have content, save it
      if (currentContent.length > 0) {
        if (!currentSection) {
          currentSection = { type: 'raw' }
        }
        currentSection.contentMarkdown = currentContent.join('\n').trim()
        sections.push(currentSection)
        currentSection = null
        currentContent = []
      }

      // Start collecting list items
      if (!currentSection) {
        currentSection = { type: 'raw' }
      }
      currentContent.push(`- ${numberedMatch[1]}`)
      continue
    }

    // Detect bold patterns like "**Text**: content" or "Text: content"
    const boldMatch = line.match(/^(\*\*)?([A-Z][^:]*?)(\*\*)?\s*:\s+(.+)$/)
    if (boldMatch && i > 0) {
      const [, , boldText, , content] = boldMatch
      currentContent.push(`**${boldText}:** ${content}`)
      continue
    }

    // Regular content
    currentContent.push(line)
  }

  // Save last section
  if (currentContent.length > 0) {
    if (!currentSection) {
      currentSection = { type: 'raw' }
    }
    currentSection.contentMarkdown = currentContent.join('\n').trim()
    sections.push(currentSection)
  }

  return sections.length > 0 ? sections : [{ type: 'raw', contentMarkdown: content }]
}

/**
 * Parse Markdown content into structured sections
 */
function parseMarkdownSections(markdown: string): NormalizedAiResponse {
  const sections: AiSection[] = []
  const lines = markdown.split('\n')
  let currentSection: AiSection | null = null
  let currentContent: string[] = []
  let hasStructure = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Check for heading (## Section Name or # Section Name)
    const headingMatch = line.match(/^#{1,3}\s+(.+)$/)
    if (headingMatch) {
      hasStructure = true
      // Save previous section
      if (currentSection) {
        currentSection.contentMarkdown = currentContent.join('\n').trim()
        sections.push(currentSection)
      }

      // Start new section
      const headingText = headingMatch[1].trim()
      const sectionType = detectSectionType(headingText)
      currentSection = {
        type: sectionType,
        title: headingText,
      }
      currentContent = []
      continue
    }

    // Check for numbered section headers (1. **SECTION NAME** or 1. SECTION NAME)
    const numberedSectionMatch = line.match(/^\d+\.\s+(\*\*)?([A-Z][^*\n]+?)(\*\*)?\s*$/)
    if (numberedSectionMatch && line.trim().length < 100) {
      // This looks like a section header, not a list item
      hasStructure = true
      // Save previous section
      if (currentSection) {
        currentSection.contentMarkdown = currentContent.join('\n').trim()
        sections.push(currentSection)
      }

      // Start new section
      const sectionText = numberedSectionMatch[2].trim()
      const sectionType = detectSectionType(sectionText)
      currentSection = {
        type: sectionType,
        title: sectionText,
      }
      currentContent = []
      continue
    }

    // Check for numbered list items (1. 2. 3. etc) - convert to markdown
    const numberedListMatch = line.match(/^\d+\.\s+(.+)$/)
    if (numberedListMatch) {
      // Convert to markdown list format without extra spacing
      currentContent.push(`- ${numberedListMatch[1]}`)
      continue
    }

    // Check for bullet points (- or *)
    const bulletMatch = line.match(/^[\s]*[-*]\s+(.+)$/)
    if (bulletMatch) {
      // Keep bullet points as-is without extra spacing
      currentContent.push(`- ${bulletMatch[1]}`)
      continue
    }

    // Check for Markdown table
    if (line.trim().startsWith('|')) {
      const table = parseMarkdownTable(lines, i)
      if (table) {
        // Save current section content
        if (currentSection && currentContent.length > 0) {
          currentSection.contentMarkdown = currentContent.join('\n').trim()
          currentContent = []
        }

        // Add table as separate section or to current section
        if (currentSection) {
          currentSection.table = table
        } else {
          sections.push({
            type: 'table',
            table,
          })
        }

        // Skip table lines
        i += table.rows.length + 1 // +1 for header separator
        continue
      }
    }

    // Accumulate content
    currentContent.push(line)
  }

  // Save last section
  if (currentSection) {
    currentSection.contentMarkdown = currentContent.join('\n').trim()
    sections.push(currentSection)
  } else if (currentContent.length > 0) {
    // No explicit sections found, but we may have structured content
    if (hasStructure || markdown.includes('\n-') || markdown.match(/^\d+\./m)) {
      // Has some structure, keep as is
      sections.push({
        type: 'raw',
        contentMarkdown: currentContent.join('\n').trim(),
      })
    } else {
      // No structure, try to intelligently structure it
      const structuredContent = structureRawContent(currentContent.join('\n'))
      sections.push(...structuredContent)
    }
  }

  return { sections }
}

/**
 * Detect section type from heading text
 */
function detectSectionType(heading: string): AiSectionType {
  const normalized = heading.toLowerCase().trim()
  return SECTION_PATTERNS[normalized] || 'raw'
}

/**
 * Parse a Markdown table starting at the given line index
 */
function parseMarkdownTable(lines: string[], startIndex: number): AiTable | null {
  try {
    const headerLine = lines[startIndex]
    const separatorLine = lines[startIndex + 1]

    if (!separatorLine || !separatorLine.match(/^\|[\s:-]+\|/)) {
      return null
    }

    // Parse header
    const columns = headerLine
      .split('|')
      .map(col => col.trim())
      .filter(col => col.length > 0)

    // Parse rows
    const rows: (string | number | null)[][] = []
    let i = startIndex + 2
    while (i < lines.length && lines[i].trim().startsWith('|')) {
      const cells = lines[i]
        .split('|')
        .map(cell => cell.trim())
        .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1) // Remove empty first/last

      rows.push(cells)
      i++
    }

    return { columns, rows }
  } catch (error) {
    logger.debug('Failed to parse markdown table', error)
    return null
  }
}

/** Normalize citations from various formats */
function normalizeCitations(value: unknown): AiCitation[] | undefined {
  if (!Array.isArray(value)) {
    return undefined
  }

  const citations: AiCitation[] = []
  for (const item of value) {
    if (typeof item === 'object' && item !== null) {
      const citation = item as Record<string, unknown>
      citations.push({
        id: String(citation.id || citation.citationId || ''),
        title: String(citation.title || citation.name || ''),
        sourceType: (citation.sourceType || citation.type || 'other') as AiCitation['sourceType'],
        url: citation.url ? String(citation.url) : undefined,
        pageNumber: typeof citation.pageNumber === 'number' ? citation.pageNumber : undefined,
        timestampRange: citation.timestampRange as AiCitation['timestampRange'],
        metadata: citation.metadata as Record<string, unknown>,
      })
    }
  }

  return citations.length > 0 ? citations : undefined
}

/**
 * Normalize metrics from various formats
 */
function normalizeMetrics(value: unknown): AiMetric[] {
  if (!Array.isArray(value)) {
    return []
  }

  const metrics: AiMetric[] = []
  for (const item of value) {
    if (typeof item === 'object' && item !== null) {
      const metric = item as Record<string, unknown>
      const metricValue = metric.value
      metrics.push({
        name: String(metric.name || metric.label || ''),
        value: metricValue !== undefined && metricValue !== null
          ? (typeof metricValue === 'number' || typeof metricValue === 'string' ? metricValue : String(metricValue))
          : 0,
        unit: metric.unit ? String(metric.unit) : undefined,
        description: metric.description ? String(metric.description) : undefined,
        severity: metric.severity as AiMetric['severity'],
        trend: metric.trend as AiMetric['trend'],
      })
    }
  }

  return metrics
}

/**
 * Normalize follow-up questions from various formats
 */
function normalizeFollowUpQuestions(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    return value.map(item => String(item)).filter(q => q.length > 0)
  }

  if (typeof value === 'string') {
    // Split by newlines or numbered list
    return value
      .split(/\n/)
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(q => q.length > 0)
  }

  return undefined
}

/**
 * Format a title from camelCase or snake_case to Title Case
 */
function formatTitle(title: string): string {
  return title
    .replace(/([A-Z])/g, ' $1') // camelCase to spaces
    .replace(/_/g, ' ') // snake_case to spaces
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/** Create an error response */
export function createErrorResponse(error: string | Error): NormalizedAiResponse {
  const errorMessage = typeof error === 'string' ? error : error.message

  return {
    sections: [
      {
        type: 'error',
        title: 'Error',
        contentMarkdown: errorMessage,
      },
    ],
    error: errorMessage,
  }
}

/**
 * Check if a response is an error response
 */
export function isErrorResponse(response: NormalizedAiResponse): boolean {
  return !!response.error || response.sections.some(s => s.type === 'error')
}

