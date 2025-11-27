/**
 * Unit Tests for AI Response Normalization
 */

import { describe, it, expect } from 'vitest'
import { normalizeResponse, createErrorResponse, isErrorResponse } from '../normalizeResponse'

describe('normalizeResponse', () => {
  describe('JSON responses', () => {
    it('should parse a valid JSON response with known fields', () => {
      const jsonResponse = JSON.stringify({
        summary: 'This is a summary of the analysis',
        risks: ['Risk 1', 'Risk 2', 'Risk 3'],
        opportunities: ['Opportunity 1', 'Opportunity 2'],
        metrics: [
          { name: 'Risk Score', value: 75, unit: '%', severity: 'high' },
          { name: 'Confidence', value: 0.85, unit: '', severity: 'info' },
        ],
        citations: [
          { id: '1', title: 'Document A', sourceType: 'pdf', pageNumber: 5 },
          { id: '2', title: 'Email Thread', sourceType: 'email' },
        ],
        followUpQuestions: [
          'What are the mitigation strategies?',
          'How does this compare to industry standards?',
        ],
      })

      const result = normalizeResponse(jsonResponse)

      expect(result.sections).toHaveLength(4) // summary, risks, opportunities, metrics
      expect(result.sections[0].type).toBe('summary')
      expect(result.sections[0].contentMarkdown).toBe('This is a summary of the analysis')
      expect(result.sections[1].type).toBe('risks')
      expect(result.sections[1].listItems).toEqual(['Risk 1', 'Risk 2', 'Risk 3'])
      expect(result.sections[3].type).toBe('metrics')
      expect(result.sections[3].metrics).toHaveLength(2)
      expect(result.citations).toHaveLength(2)
      expect(result.followUpQuestions).toHaveLength(2)
    })

    it('should parse JSON from markdown code block', () => {
      const markdownJson = `
\`\`\`json
{
  "summary": "Test summary",
  "actions": ["Action 1", "Action 2"]
}
\`\`\`
      `

      const result = normalizeResponse(markdownJson)

      expect(result.sections).toHaveLength(2)
      expect(result.sections[0].type).toBe('summary')
      expect(result.sections[1].type).toBe('actions')
    })

    it('should handle malformed JSON gracefully', () => {
      const malformedJson = '{ "summary": "Test", invalid }'

      const result = normalizeResponse(malformedJson)

      // Should fall back to markdown parsing
      expect(result.sections).toBeDefined()
      expect(result.error).toBeUndefined()
    })
  })

  describe('Markdown responses', () => {
    it('should parse structured markdown with headings', () => {
      const markdown = `
## Summary
This is the executive summary of the analysis.

## Key Risks
- Risk item 1
- Risk item 2
- Risk item 3

## Recommendations
1. First recommendation
2. Second recommendation
      `

      const result = normalizeResponse(markdown)

      expect(result.sections.length).toBeGreaterThan(0)
      const summarySection = result.sections.find(s => s.type === 'summary')
      expect(summarySection).toBeDefined()
      expect(summarySection?.contentMarkdown).toContain('executive summary')
    })

    it('should parse markdown tables', () => {
      const markdownWithTable = `
## Metrics

| Metric | Value | Status |
|--------|-------|--------|
| Risk Score | 75% | High |
| Confidence | 85% | Good |
| Coverage | 90% | Excellent |
      `

      const result = normalizeResponse(markdownWithTable)

      const metricsSection = result.sections.find(s => s.type === 'metrics')
      expect(metricsSection).toBeDefined()
      expect(metricsSection?.table).toBeDefined()
      expect(metricsSection?.table?.columns).toEqual(['Metric', 'Value', 'Status'])
      expect(metricsSection?.table?.rows).toHaveLength(3)
    })

    it('should handle plain text without structure', () => {
      const plainText = 'This is just plain text without any structure.'

      const result = normalizeResponse(plainText)

      expect(result.sections).toHaveLength(1)
      expect(result.sections[0].type).toBe('raw')
      expect(result.sections[0].contentMarkdown).toBe(plainText)
    })
  })

  describe('Mixed content', () => {
    it('should handle markdown with embedded JSON', () => {
      const mixed = `
## Analysis Results

Here are the findings:

\`\`\`json
{
  "metrics": [
    { "name": "Score", "value": 85 }
  ]
}
\`\`\`

## Next Steps
- Review the metrics
- Take action
      `

      const result = normalizeResponse(mixed)

      expect(result.sections).toBeDefined()
      expect(result.sections.length).toBeGreaterThan(0)
    })
  })

  describe('Raw content parsing', () => {
    it('should parse numbered list items into markdown', () => {
      const rawContent = `1. Product Development: This stage involves researching market needs
2. Underwriting: Underwriting involves assessing risk
3. Distribution: This refers to the channels through which products are sold`

      const result = normalizeResponse(rawContent)
      expect(result.sections).toBeDefined()
      expect(result.sections.length).toBeGreaterThan(0)

      const content = result.sections[0].contentMarkdown || ''
      expect(content).toContain('- Product Development')
      expect(content).toContain('- Underwriting')
      expect(content).toContain('- Distribution')
    })

    it('should parse bold patterns into markdown', () => {
      const rawContent = `**Product Development**: This stage involves researching market needs
**Underwriting**: Underwriting involves assessing risk`

      const result = normalizeResponse(rawContent)
      expect(result.sections).toBeDefined()

      const content = result.sections[0].contentMarkdown || ''
      expect(content).toContain('**Product Development:**')
      expect(content).toContain('**Underwriting:**')
    })

    it('should handle mixed content with paragraphs and lists', () => {
      const rawContent = `The insurance value chain refers to the series of activities and processes.

1. Product Development: This stage involves researching
2. Underwriting: Underwriting involves assessing risk
3. Distribution: This refers to the channels`

      const result = normalizeResponse(rawContent)
      expect(result.sections).toBeDefined()
      expect(result.sections.length).toBeGreaterThan(0)
    })
  })

  describe('Error handling', () => {
    it('should create error response', () => {
      const error = createErrorResponse('Test error message')

      expect(error.sections).toHaveLength(1)
      expect(error.sections[0].type).toBe('error')
      expect(error.error).toBe('Test error message')
    })

    it('should detect error responses', () => {
      const errorResponse = createErrorResponse('Error')
      const normalResponse = normalizeResponse('Normal text')

      expect(isErrorResponse(errorResponse)).toBe(true)
      expect(isErrorResponse(normalResponse)).toBe(false)
    })

    it('should handle empty input', () => {
      const result = normalizeResponse('')

      expect(result.sections).toBeDefined()
      expect(result.error).toBeUndefined()
    })

    it('should handle very long responses without crashing', () => {
      const longText = 'A'.repeat(100000)

      const result = normalizeResponse(longText)

      expect(result.sections).toBeDefined()
      expect(result.error).toBeUndefined()
    })
  })
})

