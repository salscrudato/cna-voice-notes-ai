/**
 * AI Section Renderer Components
 * Renders different types of AI response sections
 */

import React, { memo, useMemo, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { AiSection, AiMetric, AiTable, AiCitation } from '../../types/ai'
import { FiAlertTriangle, FiCheckCircle, FiTrendingUp, FiTrendingDown, FiMinus } from '../../utils/icons'

// ============================================================================
// SECTION TITLE
// ============================================================================

interface SectionTitleProps {
  title: string
  type: AiSection['type']
}

const SectionTitleComponent: React.FC<SectionTitleProps> = ({ title, type }) => {
  const getIcon = useCallback(() => {
    switch (type) {
      case 'risks':
        return <FiAlertTriangle className="text-red-500 dark:text-red-400" size={20} aria-hidden="true" />
      case 'opportunities':
        return <FiCheckCircle className="text-green-500 dark:text-green-400" size={20} aria-hidden="true" />
      case 'metrics':
        return <FiTrendingUp className="text-blue-500 dark:text-blue-400" size={20} aria-hidden="true" />
      default:
        return null
    }
  }, [type])

  return (
    <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 transition-colors duration-300">
      <div className="transform hover:scale-110 transition-transform duration-300">
        {getIcon()}
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide" role="heading" aria-level={3}>
        {title}
      </h3>
    </div>
  )
}

const SectionTitle = memo(SectionTitleComponent)

// ============================================================================
// MARKDOWN CONTENT
// ============================================================================

interface MarkdownContentProps {
  content: string
}

// Memoized markdown components for performance
const markdownComponents = {
  h1: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 {...props} className="text-2xl font-bold mt-4 mb-3 text-slate-900 dark:text-slate-50" />
  ),
  h2: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 {...props} className="text-xl font-bold mt-4 mb-3 text-slate-900 dark:text-slate-50" />
  ),
  h3: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 {...props} className="text-lg font-semibold mt-3 mb-2 text-slate-800 dark:text-slate-100" />
  ),
  a: ({ ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      {...props}
      className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 rounded-sm hover:scale-105 hover:-translate-y-0.5 inline-block"
      target="_blank"
      rel="noopener noreferrer"
    />
  ),
  code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement> & { className?: string }) => {
    const isInline = !className?.includes('language-')
    return isInline ? (
      <code
        {...props}
        className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm font-mono border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:shadow-sm"
      >
        {children}
      </code>
    ) : (
      <code
        {...props}
        className="block p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-mono overflow-x-auto border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg dark:hover:shadow-lg my-3 transition-all duration-300 hover:-translate-y-1"
      >
        {children}
      </code>
    )
  },
  ul: ({ ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul {...props} className="list-disc list-outside space-y-2 my-3 ml-6" />
  ),
  ol: ({ ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol {...props} className="list-decimal list-outside space-y-2 my-3 ml-6" />
  ),
  li: ({ ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li {...props} className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs" />
  ),
  p: ({ ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} className="my-2 leading-relaxed text-slate-700 dark:text-slate-300 text-xs" />
  ),
  blockquote: ({ ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      {...props}
      className="border-l-4 border-blue-500 dark:border-blue-400 pl-3 italic my-2 text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/20 py-1.5 pr-3 rounded-r text-sm"
    />
  ),
  table: ({ ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
      <table {...props} className="min-w-full border-collapse text-sm" />
    </div>
  ),
  thead: ({ ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead {...props} className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700" />
  ),
  th: ({ ...props }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
    <th
      {...props}
      className="px-3 py-2 text-left font-semibold text-slate-900 dark:text-slate-50 text-xs uppercase tracking-wide"
    />
  ),
  td: ({ ...props }: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
    <td {...props} className="px-3 py-2 text-slate-700 dark:text-slate-300 text-xs border-t border-slate-200 dark:border-slate-700" />
  ),
  tr: ({ ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr {...props} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-300" />
  ),
}

const MarkdownContentComponent: React.FC<MarkdownContentProps> = ({ content }) => {
  const memoizedComponents = useMemo(() => markdownComponents, [])

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-slate prose-compact">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={memoizedComponents}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

const MarkdownContent = memo(MarkdownContentComponent)

// ============================================================================
// LIST ITEMS
// ============================================================================

interface ListItemsProps {
  items: string[]
}

const ListItemsComponent: React.FC<ListItemsProps> = ({ items }) => {
  return (
    <ul className="space-y-2 my-3" role="list">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex items-start gap-2.5 group hover:translate-x-1 transition-transform duration-300" role="listitem">
          <span className="text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0 font-bold text-sm group-hover:scale-125 transition-transform duration-300" aria-hidden="true">→</span>
          <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {item}
          </span>
        </li>
      ))}
    </ul>
  )
}

const ListItems = memo(ListItemsComponent)

// ============================================================================
// METRICS GRID
// ============================================================================

interface MetricsGridProps {
  metrics: AiMetric[]
}

const getTrendIcon = (trend?: AiMetric['trend']) => {
  switch (trend) {
    case 'up':
      return <FiTrendingUp className="text-green-500 dark:text-green-400" size={16} aria-label="Trending up" />
    case 'down':
      return <FiTrendingDown className="text-red-500 dark:text-red-400" size={16} aria-label="Trending down" />
    case 'stable':
      return <FiMinus className="text-slate-500 dark:text-slate-400" size={16} aria-label="Stable" />
    default:
      return null
  }
}

const getSeverityColor = (severity?: AiMetric['severity']) => {
  switch (severity) {
    case 'critical':
      return 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
    case 'high':
      return 'border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20'
    case 'medium':
      return 'border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20'
    case 'low':
      return 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
    default:
      return 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
  }
}

const MetricsGridComponent: React.FC<MetricsGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" role="region" aria-label="Metrics">
      {metrics.map((metric, index) => (
        <div
          key={`${metric.name}-${index}`}
          className={`p-3 rounded-lg border-l-4 ${getSeverityColor(metric.severity)} transition-all duration-300 hover:shadow-md dark:hover:shadow-lg hover:-translate-y-1 hover:scale-105 cursor-default`}
          role="article"
          aria-label={`${metric.name}: ${metric.value}${metric.unit ? ' ' + metric.unit : ''}`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 truncate">
                {metric.name}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  {metric.value}
                </span>
                {metric.unit && (
                  <span className="text-sm text-slate-600 dark:text-slate-400">{metric.unit}</span>
                )}
              </div>
            </div>
            {getTrendIcon(metric.trend)}
          </div>
          {metric.description && (
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {metric.description}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const MetricsGrid = memo(MetricsGridComponent)

// ============================================================================
// TABLE RENDERER
// ============================================================================

interface TableRendererProps {
  table: AiTable
}

const TableRendererComponent: React.FC<TableRendererProps> = ({ table }) => {
  return (
    <div className="overflow-x-auto">
      {table.title && (
        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" id={`table-title-${table.title}`}>
          {table.title}
        </div>
      )}
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
        <table
          className="min-w-full divide-y divide-slate-200 dark:divide-slate-700"
          role="table"
          aria-label={table.title || 'Data table'}
          aria-describedby={table.title ? `table-title-${table.title}` : undefined}
        >
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr role="row">
              {table.columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                  role="columnheader"
                  scope="col"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
            {table.rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" role="row">
                {row.map((cell, cellIndex) => (
                  <td
                    key={`cell-${rowIndex}-${cellIndex}`}
                    className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap"
                    role="cell"
                  >
                    {cell ?? '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.footer && (
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">
          {table.footer}
        </div>
      )}
    </div>
  )
}

const TableRenderer = memo(TableRendererComponent)

// ============================================================================
// CITATIONS
// ============================================================================

interface CitationsProps {
  citations: AiCitation[]
}

const getSourceIcon = () => '📄'

const CitationsComponent: React.FC<CitationsProps> = ({ citations }) => {
  return (
    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700" role="region" aria-label="Sources">
      <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
        Sources
      </div>
      <div className="flex flex-wrap gap-2" role="list">
        {citations.map((citation) => (
          <div
            key={citation.id || citation.title || 'source'}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
            role="listitem"
          >
            <span aria-hidden="true">{getSourceIcon()}</span>
            {citation.url ? (
              <a
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-sm"
              >
                {citation.title || 'Source'}
              </a>
            ) : (
              <span className="text-slate-700 dark:text-slate-300">
                {citation.title || 'Source'}
              </span>
            )}
            {citation.pageNumber && (
              <span className="text-slate-500 dark:text-slate-400" aria-label={`Page ${citation.pageNumber}`}>p. {citation.pageNumber}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export const Citations = memo(CitationsComponent)

// ============================================================================
// FOLLOW-UP QUESTIONS
// ============================================================================

interface FollowUpQuestionsProps {
  questions: string[]
  onQuestionClick?: (question: string) => void
}

const FollowUpQuestionsComponent: React.FC<FollowUpQuestionsProps> = ({ questions, onQuestionClick }) => {
  const handleQuestionClick = useCallback((question: string) => {
    onQuestionClick?.(question)
  }, [onQuestionClick])

  return (
    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors duration-300">
      <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide">
        Suggested Follow-up Questions
      </div>
      <div className="flex flex-wrap gap-2">
        {questions.map((question) => (
          <button
            key={question}
            onClick={() => handleQuestionClick(question)}
            className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 text-left hover:shadow-md dark:hover:shadow-lg hover:scale-105 hover:-translate-y-1 active:scale-95"
            type="button"
            aria-label={`Ask: ${question}`}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  )
}

export const FollowUpQuestions = memo(FollowUpQuestionsComponent)

// ============================================================================
// MAIN SECTION RENDERER
// ============================================================================

interface AiSectionRendererProps {
  section: AiSection
  onFollowUpClick?: (question: string) => void
}

const AiSectionRendererComponent: React.FC<AiSectionRendererProps> = ({ section, onFollowUpClick }) => {
  return (
    <div className="space-y-3 mb-5 last:mb-0 animate-fade-in-up" style={{
      animation: 'fade-in-up 0.5s ease-out forwards'
    }}>
      {section.title && <SectionTitle title={section.title} type={section.type} />}

      {section.contentMarkdown && (
        <div className="space-y-2 animate-fade-in-up" style={{
          animation: 'fade-in-up 0.5s ease-out forwards',
          animationDelay: '0.1s'
        }}>
          <MarkdownContent content={section.contentMarkdown} />
        </div>
      )}

      {section.listItems && section.listItems.length > 0 && (
        <div className="space-y-1.5 animate-fade-in-up" style={{
          animation: 'fade-in-up 0.5s ease-out forwards',
          animationDelay: '0.2s'
        }}>
          <ListItems items={section.listItems} />
        </div>
      )}

      {section.metrics && section.metrics.length > 0 && (
        <div className="space-y-2 animate-fade-in-up" style={{
          animation: 'fade-in-up 0.5s ease-out forwards',
          animationDelay: '0.3s'
        }}>
          <MetricsGrid metrics={section.metrics} />
        </div>
      )}

      {section.table && (
        <div className="space-y-2 animate-fade-in-up" style={{
          animation: 'fade-in-up 0.5s ease-out forwards',
          animationDelay: '0.4s'
        }}>
          <TableRenderer table={section.table} />
        </div>
      )}

      {section.subsections && section.subsections.length > 0 && (
        <div className="ml-3 mt-3 space-y-3 border-l-4 border-blue-300 dark:border-blue-700 pl-3 py-1.5 animate-fade-in-up" style={{
          animation: 'fade-in-up 0.5s ease-out forwards',
          animationDelay: '0.5s'
        }}>
          {section.subsections.map((subsection, index) => (
            <AiSectionRendererComponent
              key={`subsection-${index}`}
              section={subsection}
              onFollowUpClick={onFollowUpClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const AiSectionRenderer = memo(AiSectionRendererComponent)

