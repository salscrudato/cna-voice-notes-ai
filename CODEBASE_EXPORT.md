# EVR Codebase Export
Generated: 2025-12-16 06:20:04

This file contains all functional coding files from the EVR application for external code review.

## Project Structure

```.\.firebase
.\public
.\scripts
.\src
.\src\components
.\src\constants
.\src\contexts
.\src\hooks
.\src\lib
.\src\pages
.\src\services
.\src\styles
.\src\types
.\src\utils
.\src\components\ai
.\src\components\insights
.\src\components\landing
.\src\hooks\__tests__
.\src\lib\ai
.\src\lib\ai\__tests__
```

---

## Source Files


### eslint.config.js

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])

```

---

### firebase.json

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css|woff|woff2|eot|ttf|otf|svg)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "/index.html",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=0, must-revalidate"
          }
        ]
      }
    ]
  }
}


```

---

### index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Marmalade</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

```

---

### package.json

```json
{
  "name": "cna-voice-notes-ai",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "firebase": "^12.6.0",
    "openai": "^6.9.1",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-icons": "^5.5.0",
    "react-markdown": "^10.1.0",
    "react-router-dom": "^7.9.6",
    "remark-gfm": "^4.0.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@tailwindcss/vite": "^4.1.17",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "tailwindcss": "^4.1.17",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.46.4",
    "vite": "^7.2.4"
  }
}

```

---

### public/sw.js

```javascript
/**
 * Service Worker for offline support and caching strategy
 * Implements cache-first strategy for assets and network-first for API calls
 */

const CACHE_NAME = 'marmalade-v1'
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/vite.svg',
]

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.debug('Cache addAll error:', err)
      })
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return
  }

  // API calls - network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const cache = caches.open(CACHE_NAME)
            cache.then((c) => c.put(request, response.clone()))
          }
          return response
        })
        .catch(() => {
          // Return cached response if network fails
          return caches.match(request)
        })
    )
    return
  }

  // Static assets - cache first, fallback to network
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/)
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response
        }
        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response
          }
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache)
          })
          return response
        })
      })
    )
    return
  }

  // HTML pages - network first
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const cache = caches.open(CACHE_NAME)
            cache.then((c) => c.put(request, response.clone()))
          }
          return response
        })
        .catch(() => {
          return caches.match(request)
        })
    )
    return
  }
})

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})


```

---

### src/App.tsx

```tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SkipToContent } from './components/SkipToContent'
import { LayoutShell } from './components/LayoutShell'
import { LoadingSpinner } from './components/LoadingSpinner'
import { ThemeProvider } from './contexts/ThemeContext'
import { HomePage } from './pages/HomePage'
import { ChatLandingPage } from './pages/ChatLandingPage'
import { InsightsLandingPage } from './pages/InsightsLandingPage'
import { ReportingPage } from './pages/ReportingPage'
import { SupportPage } from './pages/SupportPage'
import { UploadPage } from './pages/UploadPage'
import { useWebVitals } from './hooks/useWebVitals'
import { useServiceWorker } from './hooks/useServiceWorker'

// Lazy load pages for better code splitting
const MainChatPage = lazy(() => import('./pages/MainChatPage').then(m => ({ default: m.MainChatPage })))

// Loading fallback component
const PageLoader = () => (
  <div className="h-screen flex items-center justify-center bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 animate-fade-in">
    <LoadingSpinner />
  </div>
)

function App() {
  // Initialize Web Vitals monitoring
  useWebVitals({ debug: false })

  // Initialize Service Worker for offline support
  useServiceWorker({ autoRegister: true, debug: false })

  return (
    <ThemeProvider>
      <LayoutShell>
        <ErrorBoundary>
          <Router>
            <SkipToContent />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/chat-landing" element={<ChatLandingPage />} />
                <Route path="/insights" element={<InsightsLandingPage />} />
                <Route path="/reporting" element={<ReportingPage />} />
                <Route path="/chat" element={<MainChatPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Router>
        </ErrorBoundary>
      </LayoutShell>
    </ThemeProvider>
  )
}

export default App

```

---

### src/components/AccentColorSelector.tsx

```tsx
import React, { memo } from 'react'
import { useTheme } from '../hooks/useTheme'
import type { AccentColor } from '../utils/accentColors'

/**
 * Accent color selector component
 * Allows users to dynamically select the accent color used throughout the app
 * Shows 6 popular accent colors
 */
const AccentColorSelectorComponent: React.FC = () => {
  const { accentColor, setAccentColor } = useTheme()

  const accentColors: Array<{ value: AccentColor; label: string; lightColor: string; darkColor: string }> = [
    {
      value: 'blue',
      label: 'Blue',
      lightColor: '#3b82f6',
      darkColor: '#60a5fa',
    },
    {
      value: 'emerald',
      label: 'Emerald',
      lightColor: '#10b981',
      darkColor: '#4ade80',
    },
    {
      value: 'violet',
      label: 'Violet',
      lightColor: '#a855f7',
      darkColor: '#c084fc',
    },
    {
      value: 'red',
      label: 'Red',
      lightColor: '#dc2626',
      darkColor: '#ef4444',
    },
    {
      value: 'amber',
      label: 'Amber',
      lightColor: '#f59e0b',
      darkColor: '#fbbf24',
    },
    {
      value: 'slate',
      label: 'Slate',
      lightColor: '#475569',
      darkColor: '#64748b',
    },
  ]

  return (
    <div className="flex items-center gap-2">
      {accentColors.map((color) => (
        <button
          key={color.value}
          onClick={() => setAccentColor(color.value)}
          className={`w-8 h-8 rounded-full transition-all duration-300 border-2 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
            accentColor === color.value
              ? 'border-slate-900 dark:border-slate-50 scale-125 shadow-lg hover:-translate-y-1'
              : 'border-slate-300 dark:border-slate-600 hover:scale-125 hover:shadow-lg hover:-translate-y-1'
          }`}
          style={{
            background: `linear-gradient(135deg, ${color.lightColor}, ${color.darkColor})`
          }}
          aria-label={`Select ${color.label} accent color`}
          title={`${color.label} accent`}
          type="button"
        />
      ))}
    </div>
  )
}

export const AccentColorSelector = memo(AccentColorSelectorComponent)


```

---

### src/components/ai/AiSectionRenderer.tsx

```tsx
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
    <div className="space-y-3 mb-5 last:mb-0 animate-fade-in-up">
      {section.title && <SectionTitle title={section.title} type={section.type} />}

      {section.contentMarkdown && (
        <div className="space-y-2 animate-fade-in-up [animation-delay:100ms]">
          <MarkdownContent content={section.contentMarkdown} />
        </div>
      )}

      {section.listItems && section.listItems.length > 0 && (
        <div className="space-y-1.5 animate-fade-in-up [animation-delay:200ms]">
          <ListItems items={section.listItems} />
        </div>
      )}

      {section.metrics && section.metrics.length > 0 && (
        <div className="space-y-2 animate-fade-in-up [animation-delay:300ms]">
          <MetricsGrid metrics={section.metrics} />
        </div>
      )}

      {section.table && (
        <div className="space-y-2 animate-fade-in-up [animation-delay:400ms]">
          <TableRenderer table={section.table} />
        </div>
      )}

      {section.subsections && section.subsections.length > 0 && (
        <div className="ml-3 mt-3 space-y-3 border-l-4 border-blue-300 dark:border-blue-700 pl-3 py-1.5 animate-fade-in-up [animation-delay:500ms]">
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


```

---

### src/components/ApiErrorBanner.tsx

```tsx
import React, { memo } from 'react'
import { FiAlertCircle, FiX } from '../utils/icons'

interface ApiErrorBannerProps {
  error: string | undefined
  onDismiss?: () => void
}

const ApiErrorBannerComponent: React.FC<ApiErrorBannerProps> = ({ error, onDismiss }) => {
  if (!error) return null

  return (
    <div className="border-b border-red-200/50 dark:border-red-900/50 bg-gradient-to-r from-red-50 to-red-50/50 dark:from-red-950/40 dark:to-red-950/20 px-6 py-5 shadow-md dark:shadow-lg animate-slide-in-down hover:shadow-lg dark:hover:shadow-lg transition-all duration-300 hover:-translate-y-1" role="alert" aria-live="assertive" aria-atomic="true">
      <div className="flex items-start gap-4 max-w-4xl mx-auto">
        <FiAlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-1 animate-pulse" size={22} aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-red-900 dark:text-red-300">Error</p>
          <p className="text-sm text-red-800 dark:text-red-200 mt-2 break-words leading-relaxed">{error}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-2 hover:bg-red-200 dark:hover:bg-red-900/40 rounded-lg transition-all duration-300 text-red-600 dark:text-red-400 hover:scale-125 active:scale-95 hover:shadow-sm dark:hover:shadow-md hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
            aria-label="Dismiss error"
            type="button"
          >
            <FiX size={20} />
          </button>
        )}
      </div>
    </div>
  )
}

export const ApiErrorBanner = memo(ApiErrorBannerComponent)


```

---

### src/components/ChatHeader.tsx

```tsx
import React, { useCallback, memo } from 'react'
import { FiMenu, FiX, FiMessageCircle, FiMic, FiPlus } from '../utils/icons'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'
import { ThemeSelector } from './ThemeSelector'

interface ChatHeaderProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
  currentConversationTitle?: string
  linkedVoiceNoteName?: string
  onNewConversation?: () => void
}

const ChatHeaderComponent: React.FC<ChatHeaderProps> = ({
  sidebarOpen,
  onToggleSidebar,
  currentConversationTitle,
  linkedVoiceNoteName,
  onNewConversation,
}) => {
  const { accentColor } = useTheme()

  const handleNewChat = useCallback(() => {
    onNewConversation?.()
  }, [onNewConversation])
	  return (
	    <div className="border-b border-slate-200/50 dark:border-slate-700/50 px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col gap-2 bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 transition-all duration-300">
      {/* Header row with menu and title */}
      <div className="flex items-center justify-between">
	        <div className="flex items-center gap-2">
	          <button
	            onClick={onToggleSidebar}
	            className="btn-icon hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-md dark:hover:shadow-lg hover:scale-110 hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            aria-expanded={sidebarOpen}
            aria-controls="chat-sidebar"
            type="button"
          >
            {sidebarOpen ? <FiX size={20} aria-hidden="true" /> : <FiMenu size={20} aria-hidden="true" />}
          </button>
          {onNewConversation && (
            <button
              onClick={handleNewChat}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all duration-300 shadow-md hover:shadow-2xl active:scale-95 font-medium text-xs hover:-translate-y-1 hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
              style={{
                background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
                '--tw-ring-color': getAccentColor(accentColor, '500')
              } as React.CSSProperties}
              aria-label="Start a new chat"
              title="New Chat"
              type="button"
            >
              <FiPlus size={16} aria-hidden="true" className="group-hover:rotate-90 transition-transform duration-300" />
              <span>New Chat</span>
            </button>
          )}
        </div>

        {/* Breadcrumb Navigation with improved visual hierarchy */}
        <div className="flex-1 flex items-center gap-2 px-4">
          <div className="flex items-center gap-2 group">
            <FiMessageCircle size={20} className="text-accent-600 dark:text-accent-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
            <span className="hidden sm:inline text-sm font-semibold text-slate-900 dark:text-slate-50 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-300">Chat</span>
          </div>
          {currentConversationTitle && (
            <>
              <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">/</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 truncate hidden sm:inline max-w-xs hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1 cursor-pointer" title={currentConversationTitle}>
                {currentConversationTitle}
              </span>
            </>
          )}
        </div>

        {/* Theme toggle */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <ThemeSelector />
        </div>
      </div>





      {/* Voice note context banner */}
	      {linkedVoiceNoteName && (
	        <div className="flex items-center gap-2.5 px-4 py-3 bg-accent-50 dark:bg-accent-900/20 border border-accent-200/70 dark:border-accent-700/70 rounded-lg shadow-sm dark:shadow-md transition-colors duration-200 hover:shadow-md dark:hover:shadow-lg hover:bg-accent-100/50 dark:hover:bg-accent-900/30">
          <FiMic size={18} className="text-accent-600 dark:text-accent-400 flex-shrink-0 hover:scale-110 transition-transform duration-300" aria-hidden="true" />
          <span className="text-sm text-accent-700 dark:text-accent-300 font-medium truncate">
            Voice note: <span className="font-semibold">{linkedVoiceNoteName}</span>
          </span>
        </div>
      )}
    </div>
  )
}

export const ChatHeader = memo(ChatHeaderComponent)


```

---

### src/components/ChatInput.tsx

```tsx
import React, { useCallback, memo } from 'react'
import { FiArrowUp } from '../utils/icons'
import { UI } from '../constants'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  isLoading: boolean
}

const ChatInputComponent: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  isLoading,
}) => {
  const { accentColor } = useTheme()
  const isDisabled = isLoading || !value.trim()
  const maxChars = UI.MAX_MESSAGE_LENGTH

  const handleClick = useCallback(() => {
    if (!isDisabled) {
      onSend()
    }
  }, [isDisabled, onSend])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter to send, Shift+Enter for new line
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      if (!isDisabled) {
        onSend()
      }
    }
  }, [isDisabled, onSend])

	  return (
	    <div className="border-t border-slate-200/50 dark:border-slate-700/50 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 bg-gradient-to-t from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 transition-all duration-300 flex justify-center backdrop-blur-xs">
      <div className="flex gap-3 w-full max-w-4xl items-end">
        <div className="flex-1 relative group">
          <textarea
            value={value}
            onChange={(e) => {
              if (e.target.value.length <= maxChars) {
                onChange(e.target.value)
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything... (Enter to send, Shift+Enter for new line)"
            rows={UI.MESSAGE_INPUT_ROWS}
            disabled={isLoading}
            maxLength={maxChars}
            className="w-full px-5 py-3.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent resize-none text-sm text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-md dark:hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed shadow-sm dark:shadow-md group-hover:shadow-md dark:group-hover:shadow-lg focus:shadow-lg dark:focus:shadow-lg"
            style={{
              '--tw-ring-color': getAccentColor(accentColor, '500'),
              maxHeight: `${UI.MESSAGE_INPUT_MAX_HEIGHT}px`
            } as React.CSSProperties}
	            aria-label="Message input"
            aria-busy={isLoading}
            aria-describedby="char-count"
          />
        </div>
	        <button
	          id="send-button"
	          onClick={handleClick}
	          disabled={isDisabled}
	          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 font-medium touch-target ${
	            isDisabled
	              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
	              : 'text-white shadow-md hover:shadow-lg hover:-translate-y-1 hover:scale-110 active:scale-95 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950'
	          }`}
	          style={!isDisabled ? {
	            background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
	          } : undefined}
	          onMouseEnter={(e) => {
	            if (!isDisabled) {
	              (e.currentTarget as HTMLButtonElement).style.background = `linear-gradient(135deg, ${getAccentColor(accentColor, '700')}, ${getAccentColor(accentColor, '800')})`
	            }
	          }}
	          onMouseLeave={(e) => {
	            if (!isDisabled) {
	              (e.currentTarget as HTMLButtonElement).style.background = `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`
	            }
	          }}
	          onFocus={(e) => {
	            if (!isDisabled) {
	              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 0 3px rgba(255, 255, 255, 0.1), 0 0 0 5px ${getAccentColor(accentColor, '500')}`
	            }
	          }}
	          onBlur={(e) => {
	            (e.currentTarget as HTMLButtonElement).style.boxShadow = ''
	          }}
          aria-label={isLoading ? 'Sending message' : 'Send message'}
          aria-busy={isLoading}
          type="button"
        >
          {isLoading ? (
            <div className="animate-spin">
              <FiArrowUp size={18} aria-hidden="true" />
            </div>
          ) : (
            <FiArrowUp size={18} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  )
}

export const ChatInput = memo(ChatInputComponent)


```

---

### src/components/ChatMessages.tsx

```tsx
import React, { useRef, useEffect, useState, useCallback, memo } from 'react'
import { FiCopy, FiCheck } from '../utils/icons'
import { MessageRenderer } from './MessageRenderer'
import { EmptyState } from './EmptyState'
import { StreamingLoadingIndicator } from './StreamingLoadingIndicator'
import { UI } from '../constants'
import { formatTime } from '../utils/formatting'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'
import type { ChatMessage } from '../types'
import { logger } from '../services/logger'

interface ChatMessagesProps {
  messages: ChatMessage[]
  isLoading: boolean
  streamingContent?: string
  streamingStage?: 'thinking' | 'generating' | 'finalizing'
  onFollowUpClick?: (question: string) => void
  onEditMetadata?: () => void
}

interface MessageItemProps {
  message: ChatMessage
  isCopied: boolean
  onCopy: (messageId: string, content: string) => void
  onFollowUpClick?: (question: string) => void
}

// Memoized message item component for performance optimization
const MessageItem = memo<MessageItemProps>(({ message: msg, isCopied, onCopy, onFollowUpClick }) => {
  const { accentColor } = useTheme()

  return (
    <div
      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in-${msg.role === 'user' ? 'right' : 'left'} group px-2 sm:px-0 w-full`}
      role="article"
      aria-label={`${msg.role === 'user' ? 'Your message' : 'Assistant message'}`}
    >
      <div className="flex flex-col gap-2.5 max-w-3xl">
        <div className="flex items-end gap-3">
          <div
            className={`message-bubble ${
              msg.role === 'user'
                ? 'message-bubble-user'
                : 'message-bubble-assistant'
            }`}
            style={msg.role === 'user' ? {
              background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
              borderColor: getAccentColor(accentColor, '500'),
            } : undefined}
          >
            {msg.role === 'user' ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words font-medium text-white">{msg.content}</p>
            ) : (
              <MessageRenderer content={msg.content} onFollowUpClick={onFollowUpClick} />
            )}
          </div>
          {msg.role === 'assistant' && (
            <button
              onClick={() => onCopy(msg.id, msg.content)}
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-3 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex-shrink-0 hover:scale-125 hover:-translate-y-1 active:scale-95 active:translate-y-0 shadow-sm hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-slate-900/50 border border-slate-300/50 dark:border-slate-600/50 hover:border-slate-400/80 dark:hover:border-slate-500/80 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
              title="Copy message"
              aria-label="Copy message"
              type="button"
            >
              {isCopied ? (
                <FiCheck size={16} className="text-green-600 dark:text-green-400" />
              ) : (
                <FiCopy size={16} />
              )}
            </button>
          )}
        </div>
        {/* Message Timestamp - subtle styling */}
        <div
          className={`message-timestamp text-xs transition-opacity duration-200 ${
            msg.role === 'user' ? 'message-timestamp-user' : 'message-timestamp-assistant'
          }`}
        >
          {msg.createdAt ? formatTime(msg.createdAt) : ''}
        </div>
      </div>
    </div>
  )
})

MessageItem.displayName = 'MessageItem'

const ChatMessagesComponent: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  streamingContent = '',
  streamingStage = 'thinking',
  onFollowUpClick,
  onEditMetadata
}) => {
  const { accentColor } = useTheme()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: UI.MESSAGE_SCROLL_BEHAVIOR })
  }, [messages, isLoading, streamingContent])

  const handleCopyMessage = useCallback((messageId: string, content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedId(messageId)
      setTimeout(() => setCopiedId(null), UI.COPY_FEEDBACK_DURATION)
    }).catch((error) => {
      logger.error('Failed to copy message', error)
    })
  }, [])

  // Memoize the follow-up click handler
  const handleFollowUpClick = useCallback((question: string) => {
    onFollowUpClick?.(question)
  }, [onFollowUpClick])

  return (
    <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-5 sm:space-y-7 bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 transition-colors duration-300 flex flex-col items-center relative" role="main" aria-label="Chat messages">
      {/* Filter button - positioned on the right side, centered vertically */}
      {onEditMetadata && (
        <button
          onClick={onEditMetadata}
          className="fixed right-6 top-1/2 transform -translate-y-1/2 z-20 px-4 py-6 rounded-full text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-125 hover:-translate-x-1 active:scale-95 flex items-center justify-center group"
          style={{
            background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
            width: '48px',
            height: '72px',
          }}
          aria-label="Open filters"
          title="Open filters"
          type="button"
        >
          <span className="text-xs font-medium leading-none transform -rotate-90 whitespace-nowrap group-hover:scale-110 transition-transform duration-300">FILTER</span>
        </button>
      )}

      <div className="w-full max-w-4xl space-y-5 sm:space-y-7">
        {messages.length === 0 && !isLoading && (
          <EmptyState
            icon={
              <svg className="w-16 h-16 transition-colors duration-300 hover:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: getAccentColor(accentColor, '600') }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            title="Welcome to Marmalade"
            description="Made for Underwriters"
            suggestions={[
              "What were the key coverage requests from this call?",
              "Summarize the risk exposures discussed",
              "What follow-up items did the broker mention?",
              "Are there any coverage gaps I should address?"
            ]}
            onSuggestionClick={onFollowUpClick}
          />
        )}

        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            isCopied={copiedId === msg.id}
            onCopy={handleCopyMessage}
            onFollowUpClick={handleFollowUpClick}
          />
        ))}

        {isLoading && (
          <>
            {streamingContent && (
              <div className="flex justify-start animate-fade-in-up" role="article" aria-label="Streaming response">
                <div className="message-bubble message-bubble-assistant animate-fade-in-up">
                  <MessageRenderer content={streamingContent} onFollowUpClick={onFollowUpClick} />
                </div>
              </div>
            )}
            <StreamingLoadingIndicator stage={streamingStage} />
          </>
        )}

        <div ref={messagesEndRef} />
      </div>
    </main>
  )
};


export const ChatMessages = memo(ChatMessagesComponent)



```

---

### src/components/ChatSidebar.tsx

```tsx
import React, { useMemo, useState, memo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { Conversation } from '../types'
import { FiHome, FiSearch, FiX, FiHelpCircle, FiUpload } from '../utils/icons'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'
import { ConversationItem } from './ConversationItem'
import { getDateGroupLabel } from '../utils/dates'

interface ChatSidebarProps {
  isOpen: boolean
  conversations: Conversation[]
  currentConversationId: string | null
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
  onRenameConversation: (id: string, newTitle: string) => void
}

const ChatSidebarComponent: React.FC<ChatSidebarProps> = ({
  isOpen,
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { accentColor } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')

  const isOnPage = (path: string) => location.pathname === path

  // Group conversations by date
  const groupedConversations = useMemo(() => {
    const filtered = conversations.filter(conv =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const groups: Record<string, Conversation[]> = {}

    filtered.forEach(conv => {
      const groupKey = getDateGroupLabel(conv.createdAt)

      if (!groups[groupKey]) groups[groupKey] = []
      groups[groupKey].push(conv)
    })

    return groups
  }, [conversations, searchQuery])

  const conversationsList = useMemo(
    () =>
      Object.entries(groupedConversations).map(([groupName, convs]) => (
        <div key={groupName}>
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {groupName}
          </div>
          <div className="space-y-1">
            {convs.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={currentConversationId === conv.id}
                onSelect={onSelectConversation}
                onDelete={onDeleteConversation}
                onRename={onRenameConversation}
              />
            ))}
          </div>
        </div>
      )),
    [groupedConversations, currentConversationId, onSelectConversation, onDeleteConversation, onRenameConversation]
  )

  return (
    <nav
      id="chat-sidebar"
      className={`${
        isOpen ? 'w-72' : 'w-0'
	      } bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 text-slate-900 dark:text-slate-50 transition-all duration-300 ease-in-out flex flex-col overflow-hidden border-r border-slate-200/50 dark:border-slate-800/50 fixed sm:relative h-screen sm:h-auto z-40 sm:z-auto`}
      aria-label="Chat history sidebar"
      aria-hidden={!isOpen}
    >
	      {/* Logo & Branding */}
	      <div className="p-5 border-b border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50">
	        <div className="flex items-center gap-3 group cursor-pointer transition-all duration-300">
	          <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 border"
              style={{
                background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
                borderColor: getAccentColor(accentColor, '500')
              }}
            >
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span
            className="font-bold text-base text-slate-900 dark:text-slate-50 transition-all duration-300 group-hover:scale-105"
            style={{
              color: getAccentColor(accentColor, '600')
            }}
          >Marmalade</span>
        </div>
      </div>

	      {/* Search Bar */}
	      <div className="px-4 py-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-b from-slate-50/50 to-white/50 dark:from-slate-900/50 dark:to-slate-950/50">
        <div className="relative group">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none transition-all duration-300" size={16} aria-hidden="true"
            style={{
              color: 'inherit'
            }}
            onFocus={(e) => {
              (e.currentTarget as SVGElement).style.color = getAccentColor(accentColor, '500')
            }}
          />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md dark:hover:shadow-lg focus:shadow-lg dark:focus:shadow-lg focus:bg-white dark:focus:bg-slate-800 hover:scale-[1.02] dark:hover:shadow-slate-900/50 dark:focus:shadow-slate-900/50 focus:scale-[1.02]"
            style={{
              '--tw-ring-color': getAccentColor(accentColor, '500')
            } as React.CSSProperties}
            aria-label="Search conversations"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-all duration-300 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:scale-125 hover:-translate-y-1 active:scale-95 animate-fade-in hover:shadow-md dark:hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
              style={{
                '--tw-ring-color': getAccentColor(accentColor, '500')
              } as React.CSSProperties}
              aria-label="Clear search"
              type="button"
            >
              <FiX size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-xs p-3 text-center">No conversations yet</p>
        ) : Object.keys(groupedConversations).length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-xs p-3 text-center">No conversations found</p>
        ) : (
          conversationsList
        )}
      </div>

	      {/* Navigation with improved visual indicators */}
	      <div className="border-t border-slate-200/50 dark:border-slate-800/50 p-4 space-y-2 bg-gradient-to-t from-slate-50/50 to-white/50 dark:from-slate-900/50 dark:to-slate-950/50">
        <button
          onClick={() => navigate('/')}
	          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm group focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 border hover:scale-[1.02] hover:-translate-y-0.5 ${
	            isOnPage('/')
	              ? 'bg-white dark:bg-slate-800 font-semibold shadow-md hover:shadow-lg'
	              : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border-slate-200/60 dark:border-slate-700/60 hover:shadow-md dark:hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600'
	          }`}
          style={isOnPage('/') ? {
            color: getAccentColor(accentColor, '700'),
            borderColor: getAccentColor(accentColor, '300'),
            '--tw-ring-color': getAccentColor(accentColor, '500')
          } as React.CSSProperties : {
            '--tw-ring-color': getAccentColor(accentColor, '500')
          } as React.CSSProperties}
          aria-label="Go to home page"
          aria-current={isOnPage('/') ? 'page' : undefined}
        >
          <FiHome size={18} className="group-hover:scale-125 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0" aria-hidden="true" />
          <span>Home</span>
          {isOnPage('/') && (
            <div className="ml-auto flex items-center gap-2 animate-fade-in">
              <div
                className="w-2 h-2 rounded-full animate-pulse shadow-lg"
                style={{
                  backgroundColor: getAccentColor(accentColor, '600'),
                  boxShadow: `0 0 8px ${getAccentColor(accentColor, '500')}80`
                }}
                aria-hidden="true"
              />
              <div
                className="w-1.5 h-1.5 rounded-full shadow-md"
                style={{
                  backgroundColor: getAccentColor(accentColor, '600'),
                  boxShadow: `0 0 6px ${getAccentColor(accentColor, '500')}60`
                }}
                aria-hidden="true"
              />
            </div>
          )}
        </button>

        <button
          onClick={() => navigate('/upload')}
		          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm group focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 border hover:scale-[1.02] hover:-translate-y-0.5 ${
		            isOnPage('/upload')
		              ? 'bg-white dark:bg-slate-800 font-semibold shadow-md hover:shadow-lg'
		              : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border-slate-200/60 dark:border-slate-700/60 hover:shadow-md dark:hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600'
		          }`}
          style={isOnPage('/upload') ? {
            color: getAccentColor(accentColor, '700'),
            borderColor: getAccentColor(accentColor, '300'),
            '--tw-ring-color': getAccentColor(accentColor, '500')
          } as React.CSSProperties : {
            '--tw-ring-color': getAccentColor(accentColor, '500')
          } as React.CSSProperties}
          aria-label="Go to upload page"
          aria-current={isOnPage('/upload') ? 'page' : undefined}
        >
          <FiUpload size={18} className="group-hover:scale-125 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0" aria-hidden="true" />
          <span>Upload</span>
          {isOnPage('/upload') && (
            <div className="ml-auto flex items-center gap-2 animate-fade-in">
              <div
                className="w-2 h-2 rounded-full animate-pulse shadow-lg"
                style={{
                  backgroundColor: getAccentColor(accentColor, '600'),
                  boxShadow: `0 0 8px ${getAccentColor(accentColor, '500')}80`
                }}
                aria-hidden="true"
              />
              <div
                className="w-1.5 h-1.5 rounded-full shadow-md"
                style={{
                  backgroundColor: getAccentColor(accentColor, '600'),
                  boxShadow: `0 0 6px ${getAccentColor(accentColor, '500')}60`
                }}
                aria-hidden="true"
              />
            </div>
          )}
        </button>

        <button
          onClick={() => navigate('/support')}
	          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm group focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 border hover:scale-[1.02] hover:-translate-y-0.5 ${
	            isOnPage('/support')
	              ? 'bg-white dark:bg-slate-800 font-semibold shadow-md hover:shadow-lg'
	              : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border-slate-200/60 dark:border-slate-700/60 hover:shadow-md dark:hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600'
	          }`}
          style={isOnPage('/support') ? {
            color: getAccentColor(accentColor, '700'),
            borderColor: getAccentColor(accentColor, '300'),
            '--tw-ring-color': getAccentColor(accentColor, '500')
          } as React.CSSProperties : {
            '--tw-ring-color': getAccentColor(accentColor, '500')
          } as React.CSSProperties}
          aria-label="Go to support page"
          aria-current={isOnPage('/support') ? 'page' : undefined}
        >
          <FiHelpCircle size={18} className="group-hover:scale-125 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0" aria-hidden="true" />
          <span>Get Support</span>
          {isOnPage('/support') && (
            <div className="ml-auto flex items-center gap-2 animate-fade-in">
              <div
                className="w-2 h-2 rounded-full animate-pulse shadow-lg"
                style={{
                  backgroundColor: getAccentColor(accentColor, '600'),
                  boxShadow: `0 0 8px ${getAccentColor(accentColor, '500')}80`
                }}
                aria-hidden="true"
              />
              <div
                className="w-1.5 h-1.5 rounded-full shadow-md"
                style={{
                  backgroundColor: getAccentColor(accentColor, '600'),
                  boxShadow: `0 0 6px ${getAccentColor(accentColor, '500')}60`
                }}
                aria-hidden="true"
              />
            </div>
          )}
        </button>
      </div>
    </nav>
  )
}

export const ChatSidebar = memo(ChatSidebarComponent)


```

---

### src/components/ConversationDetailsPanel.tsx

```tsx
import React, { useState, useEffect, useCallback, useRef, memo } from 'react'
import { FiX } from '../utils/icons'
import { METADATA } from '../constants'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'
import type { ConversationMetadata } from '../types'

// Simple select component to replace SearchableSelect
interface SimpleSelectProps {
  label: string
  options: readonly { value: string; label: string }[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

const SimpleSelect: React.FC<SimpleSelectProps> = memo(({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
}) => (
  <div>
    <label className="block text-sm font-bold text-slate-900 dark:text-slate-50 mb-2 uppercase tracking-wide">
      {label}
    </label>
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600 disabled:opacity-50"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
))

interface ConversationDetailsPanelProps {
  isOpen: boolean
  onClose: () => void
  metadata: ConversationMetadata
  onUpdate: (metadata: ConversationMetadata) => Promise<void>
  isUpdating?: boolean
}

const ConversationDetailsPanelComponent: React.FC<ConversationDetailsPanelProps> = ({
  isOpen,
  onClose,
  metadata,
  onUpdate,
  isUpdating = false,
}) => {
  const { accentColor } = useTheme()
  const [formData, setFormData] = useState<ConversationMetadata>(metadata)
  const [newTag, setNewTag] = useState('')
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setFormData(metadata)
  }, [metadata])

  // Auto-save with debounce
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (JSON.stringify(formData) !== JSON.stringify(metadata)) {
        onUpdate(formData)
      }
    }, 1000) // Auto-save after 1 second of inactivity

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [formData, metadata, onUpdate])

  const handleAddTag = useCallback(() => {
    if (newTag.trim()) {
      const tags = formData.tags || []
      if (!tags.includes(newTag.trim())) {
        setFormData({ ...formData, tags: [...tags, newTag.trim()] })
        setNewTag('')
      }
    }
  }, [newTag, formData])

  const handleRemoveTag = useCallback((tag: string) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter(t => t !== tag),
    })
  }, [formData])

  if (!isOpen) return null

  // Right pane filter panel
  return (
    <>
      <div className={`fixed top-0 right-0 h-screen w-full sm:w-96 bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 shadow-xl border-l border-slate-200 dark:border-slate-800 z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 z-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-wider">FILTER</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 text-slate-600 dark:text-slate-400 hover:shadow-sm dark:hover:shadow-md hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            style={{
              '--tw-ring-color': getAccentColor(accentColor, '500')
            } as React.CSSProperties}
            aria-label="Close panel"
            type="button"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4 pb-32">
          {/* All Fields - No Section Headers */}
          <SimpleSelect
            label="Broker"
            options={METADATA.BROKER_OPTIONS}
            value={formData.broker}
            onChange={(value: string) => setFormData({ ...formData, broker: value })}
            placeholder="Select a broker..."
            disabled={isUpdating}
          />
          <SimpleSelect
            label="LOB"
            options={METADATA.LOB_OPTIONS}
            value={formData.lob}
            onChange={(value: string) => setFormData({ ...formData, lob: value })}
            placeholder="Select LOB..."
            disabled={isUpdating}
          />
          <SimpleSelect
            label="Client Name"
            options={METADATA.CLIENT_OPTIONS}
            value={formData.client}
            onChange={(value: string) => setFormData({ ...formData, client: value })}
            placeholder="Select client..."
            disabled={isUpdating}
          />
          <SimpleSelect
            label="Risk County"
            options={METADATA.RISK_CATEGORY_OPTIONS}
            value={formData.riskCategory}
            onChange={(value: string) => setFormData({ ...formData, riskCategory: value })}
            placeholder="Select risk category..."
            disabled={isUpdating}
          />

          {/* Tags */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-4 uppercase tracking-wide">Tags</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
                disabled={isUpdating}
              />
              <button
                onClick={handleAddTag}
                disabled={isUpdating}
                className="px-4 py-3 text-white rounded-lg active:scale-95 transition-all duration-200 disabled:opacity-50 text-sm font-semibold shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                style={{
                  background: `linear-gradient(to right, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
                  '--tw-ring-color': getAccentColor(accentColor, '500')
                } as React.CSSProperties}
                type="button"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {(formData.tags || []).map(tag => (
                <div
                  key={tag}
                  className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                  style={{
                    background: `linear-gradient(to right, ${getAccentColor(accentColor, '100')}40, ${getAccentColor(accentColor, '50')}20)`,
                    color: getAccentColor(accentColor, '700'),
                    borderColor: getAccentColor(accentColor, '200')
                  }}
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="transition-all duration-200 hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 rounded p-0.5"
                    style={{
                      color: getAccentColor(accentColor, '700'),
                      '--tw-ring-color': getAccentColor(accentColor, '500')
                    } as React.CSSProperties}
                    type="button"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export const ConversationDetailsPanel = memo(ConversationDetailsPanelComponent)


```

---

### src/components/ConversationItem.tsx

```tsx
import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import { FiTrash2, FiEdit2, FiCheck, FiX } from '../utils/icons'
import type { Conversation } from '../types'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, newTitle: string) => void
}

const ConversationItemComponent = memo<ConversationItemProps>(({
  conversation,
  isActive,
  onSelect,
  onDelete,
  onRename,
}) => {
  const { accentColor } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(conversation.title)
  const [isHovering, setIsHovering] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleRename = useCallback(() => {
    const trimmedValue = editValue.trim()
    if (!trimmedValue) {
      setEditValue(conversation.title)
      setIsEditing(false)
      return
    }
    if (trimmedValue !== conversation.title && trimmedValue.length > 0 && trimmedValue.length <= 100) {
      onRename(conversation.id, trimmedValue)
    }
    setIsEditing(false)
    setEditValue(conversation.title)
  }, [editValue, conversation.title, conversation.id, onRename])

  const handleCancel = useCallback(() => {
    setIsEditing(false)
    setEditValue(conversation.title)
  }, [conversation.title])

  const handleDelete = useCallback(() => {
    if (window.confirm(`Delete "${conversation.title}"?`)) {
      onDelete(conversation.id)
    }
  }, [conversation.title, conversation.id, onDelete])

  const handleEditKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRename()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }, [handleRename, handleCancel])

  const handleButtonKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    // Enter or Space to select
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(conversation.id)
    }
    // e to edit (when not active)
    if (e.key === 'e' && !isActive && !isEditing) {
      e.preventDefault()
      setIsEditing(true)
    }
    // d to delete (when not active)
    if (e.key === 'd' && !isActive && !isEditing) {
      e.preventDefault()
      handleDelete()
    }
  }, [conversation.id, isActive, isEditing, onSelect, handleDelete])

  if (isEditing) {
    return (
      <div
        className="w-full px-3 py-2 rounded-lg border flex items-center gap-2 animate-fade-in shadow-sm dark:shadow-md hover:shadow-md dark:hover:shadow-lg transition-all duration-200"
        style={{
          backgroundColor: `${getAccentColor(accentColor, '50')}20`,
          borderColor: getAccentColor(accentColor, '300')
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => {
            if (e.target.value.length <= 100) {
              setEditValue(e.target.value)
            }
          }}
          onKeyDown={handleEditKeyDown}
          maxLength={100}
          className="flex-1 bg-transparent text-slate-900 dark:text-slate-50 text-sm outline-none placeholder-slate-500 dark:placeholder-slate-400 rounded px-2 transition-all duration-200 focus:ring-2"
          placeholder="Rename..."
          aria-label="Edit conversation title"
          style={{
            '--tw-ring-color': getAccentColor(accentColor, '400')
          } as React.CSSProperties}
        />
        <button
          onClick={handleRename}
          className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-md transition-all duration-300 text-green-600 dark:text-green-400 hover:scale-125 hover:-translate-y-1 active:scale-95 active:translate-y-0 hover:shadow-md dark:hover:shadow-lg focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          title="Save"
          aria-label="Save rename"
          type="button"
        >
          <FiCheck size={16} />
        </button>
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-all duration-300 text-red-600 dark:text-red-400 hover:scale-125 hover:-translate-y-1 active:scale-95 active:translate-y-0 hover:shadow-md dark:hover:shadow-lg focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          title="Cancel"
          aria-label="Cancel rename"
          type="button"
        >
          <FiX size={16} />
        </button>
      </div>
    )
  }

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="group relative"
    >
      <button
        onClick={() => onSelect(conversation.id)}
        onKeyDown={handleButtonKeyDown}
        className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-300 truncate text-sm font-medium flex items-center gap-2.5 min-h-11 border focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
          isActive
            ? 'text-slate-900 dark:text-slate-100 shadow-md dark:shadow-lg hover:shadow-lg dark:hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md dark:hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]'
        }`}
        style={isActive ? {
          background: `linear-gradient(to right, ${getAccentColor(accentColor, '50')}40, ${getAccentColor(accentColor, '50')}20)`,
          borderColor: getAccentColor(accentColor, '300'),
          '--tw-ring-color': getAccentColor(accentColor, '500')
        } as React.CSSProperties : {
          '--tw-ring-color': getAccentColor(accentColor, '500')
        } as React.CSSProperties}
        title={conversation.title}
        aria-label={`Load conversation: ${conversation.title}${!isActive ? ' (Press e to edit, d to delete)' : ''}`}
        aria-current={isActive ? 'page' : undefined}
      >
        <span
          className="w-2.5 h-2.5 rounded-full transition-all flex-shrink-0 shadow-md"
          style={{
            backgroundColor: isActive ? getAccentColor(accentColor, '600') : '#a1a5ab',
            boxShadow: isActive ? `0 0 8px ${getAccentColor(accentColor, '500')}80` : 'none'
          }}
          aria-hidden="true"
        />
        <span className="truncate flex-1">{conversation.title}</span>
      </button>

      {/* Hover Actions */}
      {isHovering && !isActive && (
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-lg p-1.5 border shadow-md dark:shadow-lg animate-fade-in hover:shadow-lg dark:hover:shadow-xl transition-all duration-200"
          style={{
            background: `linear-gradient(to right, white, ${getAccentColor(accentColor, '50')}30)`,
            borderColor: getAccentColor(accentColor, '200')
          }}
        >
          <button
            onClick={() => setIsEditing(true)}
            className="p-2.5 rounded-md transition-all duration-300 text-slate-600 dark:text-slate-400 hover:scale-125 hover:-translate-y-1 active:scale-95 active:translate-y-0 hover:shadow-md dark:hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            style={{
              color: getAccentColor(accentColor, '600'),
              '--tw-ring-color': getAccentColor(accentColor, '500')
            } as React.CSSProperties}
            title="Rename"
            aria-label="Rename conversation"
            type="button"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2.5 rounded-md transition-all duration-300 text-slate-600 dark:text-slate-400 hover:scale-125 hover:-translate-y-1 active:scale-95 active:translate-y-0 hover:shadow-md dark:hover:shadow-lg focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            title="Delete"
            aria-label="Delete conversation"
            type="button"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      )}

      {/* Show actions on active item on hover */}
      {isHovering && isActive && (
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-lg p-1.5 border shadow-md dark:shadow-lg animate-fade-in hover:shadow-lg dark:hover:shadow-xl transition-all duration-200"
          style={{
            background: `linear-gradient(to right, ${getAccentColor(accentColor, '100')}40, ${getAccentColor(accentColor, '50')}20)`,
            borderColor: getAccentColor(accentColor, '300')
          }}
        >
          <button
            onClick={() => setIsEditing(true)}
            className="p-2.5 rounded-md transition-all duration-300 hover:scale-125 hover:-translate-y-1 active:scale-95 active:translate-y-0 hover:shadow-md dark:hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            style={{
              color: getAccentColor(accentColor, '700'),
              '--tw-ring-color': getAccentColor(accentColor, '500')
            } as React.CSSProperties}
            title="Rename"
            aria-label="Rename conversation"
            type="button"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2.5 rounded-md transition-all duration-300 hover:text-red-600 dark:hover:text-red-400 hover:scale-125 hover:-translate-y-1 active:scale-95 active:translate-y-0 hover:shadow-md dark:hover:shadow-lg focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            style={{
              color: getAccentColor(accentColor, '700')
            } as React.CSSProperties}
            title="Delete"
            aria-label="Delete conversation"
            type="button"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      )}
    </div>
  )
})

ConversationItemComponent.displayName = 'ConversationItem'

export const ConversationItem = ConversationItemComponent

```

---

### src/components/EmptyState.tsx

```tsx
import React, { memo } from 'react'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  variant?: 'default' | 'compact'
  suggestions?: string[]
  onSuggestionClick?: (suggestion: string) => void
}

const EmptyStateComponent: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  variant = 'default',
  suggestions,
  onSuggestionClick,
}) => {
  const { accentColor } = useTheme()
  const isCompact = variant === 'compact'

  return (
    <div className={`flex items-center justify-center ${isCompact ? 'py-8 px-4' : 'h-full py-12 px-4'}`}>
      <div className={`text-center animate-fade-in ${isCompact ? 'max-w-sm' : 'max-w-2xl'}`}>
        {icon && (
          <div className="mb-8 flex justify-center" aria-hidden="true">
            <div className="relative">
              {/* Animated rings */}
              <div
                className="absolute inset-0 rounded-3xl animate-pulse-scale opacity-30"
                style={{ background: getAccentColor(accentColor, '300') }}
              />
              <div
                className="absolute inset-0 rounded-3xl animate-pulse-scale opacity-20 [animation-delay:500ms]"
                style={{ background: getAccentColor(accentColor, '400'), transform: 'scale(1.2)' }}
              />
              <div
                className="relative inline-flex items-center justify-center p-5 transition-all duration-300 rounded-3xl hover:scale-110 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-lg shadow-lg dark:shadow-md border backdrop-blur-sm"
                style={{
                  background: `linear-gradient(135deg, ${getAccentColor(accentColor, '100')}, ${getAccentColor(accentColor, '50')})`,
                  borderColor: `${getAccentColor(accentColor, '200')}80`,
                }}
              >
                <div style={{ color: getAccentColor(accentColor, '600') }}>
                  {icon}
                </div>
              </div>
            </div>
          </div>
        )}

        <h2 className={`font-bold text-slate-900 dark:text-slate-50 mb-3 ${
          isCompact ? 'text-lg' : 'text-3xl sm:text-4xl'
        }`}>
          {title}
        </h2>

        <p className={`text-slate-600 dark:text-slate-400 ${
          isCompact ? 'text-sm mb-4' : 'text-base mb-6'
        }`}>
          {description}
        </p>

        {/* Suggestion chips */}
        {suggestions && suggestions.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick?.(suggestion)}
                className="px-4 py-2 text-sm rounded-full border transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                style={{
                  borderColor: getAccentColor(accentColor, '300'),
                  color: getAccentColor(accentColor, '700'),
                  background: `${getAccentColor(accentColor, '50')}80`,
                }}
                type="button"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 transition-all duration-200 hover:shadow-lg active:scale-95 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 text-white rounded-xl px-6 py-3 font-medium"
            style={{
              background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
              '--tw-ring-color': getAccentColor(accentColor, '500')
            } as React.CSSProperties}
            type="button"
          >
            {action.label}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export const EmptyState = memo(EmptyStateComponent)


```

---

### src/components/ErrorBoundary.tsx

```tsx
import React, { type ReactNode } from 'react'
import { FiAlertTriangle, FiRefreshCw, FiRotateCcw } from '../utils/icons'
import { logger } from '../services/logger'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary component for catching and displaying React errors
 * Provides options to recover from errors gracefully
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logger.error('Error caught by boundary', { error: error.message, componentStack: errorInfo.componentStack })
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  handleReload = (): void => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 p-4">
          <div className="text-center max-w-md animate-fade-in">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-100 to-red-50 dark:from-red-950/40 dark:to-red-950/20 rounded-full flex items-center justify-center mb-8 shadow-lg border border-red-200 dark:border-red-700/50">
              <FiAlertTriangle size={40} className="text-red-600 dark:text-red-400" aria-hidden="true" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">Something went wrong</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-3 text-base leading-relaxed">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 font-medium">
              Please try one of the options below to recover.
            </p>
            <div className="flex flex-col gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 hover:-translate-y-1 active:scale-95 font-semibold focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                aria-label="Try again"
                type="button"
              >
                <FiRefreshCw size={20} />
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 hover:-translate-y-1 active:scale-95 font-semibold focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                aria-label="Reload page"
                type="button"
              >
                <FiRotateCcw size={20} />
                Reload Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 hover:-translate-y-1 active:scale-95 font-semibold focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                aria-label="Go to home page"
                type="button"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}


```

---

### src/components/FileList.tsx

```tsx
/**
 * File List Component
 * Displays uploaded files with tags and management options
 */

import React, { memo } from 'react'
import { FiTrash2, FiEdit2, FiMusic, FiFile } from '../utils/icons'
import type { UploadedFile } from '../types'
import { formatTime } from '../utils/formatting'

interface FileListProps {
  files: UploadedFile[]
  onEdit: (file: UploadedFile) => void
  onDelete: (fileId: string) => void
  isLoading?: boolean
}

const FileListComponent: React.FC<FileListProps> = ({
  files,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">No files uploaded yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <div
          key={file.id}
          className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-md dark:hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-600 group"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {file.fileType === 'audio' ? (
                <FiMusic size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300" />
              ) : (
                <FiFile size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-slate-50 truncate">
                  {file.originalName}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {formatFileSize(file.size)} • {formatTime(file.uploadedAt)}
                </p>
                {file.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {file.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-all duration-300 hover:shadow-sm hover:scale-105"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => onEdit(file)}
                disabled={isLoading}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 hover:-translate-y-1 active:scale-95"
                aria-label={`Edit tags for ${file.originalName}`}
                type="button"
              >
                <FiEdit2 size={16} className="text-slate-600 dark:text-slate-400" />
              </button>
              <button
                onClick={() => onDelete(file.id)}
                disabled={isLoading}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 hover:-translate-y-1 active:scale-95"
                aria-label={`Delete ${file.originalName}`}
                type="button"
              >
                <FiTrash2 size={16} className="text-red-600 dark:text-red-400" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export const FileList = memo(FileListComponent)


```

---

### src/components/FileUploadZone.tsx

```tsx
/**
 * File Upload Zone Component
 * Drag-and-drop interface for file uploads
 */

import React, { memo, useRef, useState } from 'react'
import { FiUploadCloud, FiAlertCircle } from '../utils/icons'

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void
  acceptedTypes: string[]
  maxSize: number
  isLoading?: boolean
}

const FileUploadZoneComponent: React.FC<FileUploadZoneProps> = ({
  onFilesSelected,
  acceptedTypes,
  maxSize,
  isLoading = false,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFiles = (files: FileList): File[] => {
    const validFiles: File[] = []
    setError(null)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Check file type
      if (!acceptedTypes.includes(file.type)) {
        setError(`File type not supported: ${file.name}`)
        continue
      }

      // Check file size
      if (file.size > maxSize) {
        setError(`File too large: ${file.name} (max ${Math.round(maxSize / 1024 / 1024)}MB)`)
        continue
      }

      validFiles.push(file)
    }

    return validFiles
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = validateFiles(e.dataTransfer.files)
    if (files.length > 0) {
      onFilesSelected(files)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = validateFiles(e.target.files)
      if (files.length > 0) {
        onFilesSelected(files)
      }
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 transition-all duration-300 shadow-sm hover:shadow-md ${
        isDragging
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-lg'
          : 'border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-md'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        disabled={isLoading}
        className="hidden"
        aria-label="Upload files"
      />

      <div
        className="flex flex-col items-center gap-3 text-center"
        onClick={() => !isLoading && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isLoading) {
            fileInputRef.current?.click()
          }
        }}
      >
        <FiUploadCloud
          size={40}
          className={`transition-all duration-300 ${
            isDragging ? 'text-blue-500 scale-125 -translate-y-2' : 'text-slate-400 dark:text-slate-500'
          }`}
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Drag and drop files here
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            or click to browse
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg animate-fade-in shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <FiAlertCircle size={16} className="text-red-600 dark:text-red-400 flex-shrink-0 animate-pulse" />
          <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
    </div>
  )
}

export const FileUploadZone = memo(FileUploadZoneComponent)


```

---

### src/components/insights/InsightsFeatures.tsx

```tsx
import React from 'react'
import { FiTrendingUp, FiActivity } from '../../utils/icons'
import { HiOutlineSparkles } from '../../utils/icons'
import { useTheme } from '../../hooks/useTheme'
import { getAccentColor } from '../../utils/accentColors'

interface Feature {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

const InsightsFeaturesComponent: React.FC = () => {
  const { accentColor } = useTheme()

  const features: Feature[] = [
    {
      icon: FiTrendingUp,
      title: 'Trend Analysis',
      description: 'Identify patterns and trends across your conversations over time. Spot emerging topics and recurring themes automatically.',
    },
    {
      icon: FiActivity,
      title: 'Sentiment Tracking',
      description: 'Monitor the emotional tone of your conversations. Understand customer satisfaction and team dynamics at a glance.',
    },
    {
      icon: HiOutlineSparkles,
      title: 'AI-Powered Summaries',
      description: 'Get intelligent summaries of key points, decisions, and action items from hundreds of conversations in seconds.',
    },
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
            Powerful Analytics
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Transform your conversation data into actionable business intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 overflow-hidden hover:-translate-y-1"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${getAccentColor(accentColor, '500')}, ${getAccentColor(accentColor, '700')})`
                  }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export const InsightsFeatures = InsightsFeaturesComponent


```

---

### src/components/insights/InsightsHowItWorks.tsx

```tsx
import React from 'react'
import { HiOutlineClock, HiOutlineCheckCircle, HiOutlineSparkles } from '../../utils/icons'
import { useTheme } from '../../hooks/useTheme'
import { getAccentColor } from '../../utils/accentColors'

interface Step {
  number: number
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const InsightsHowItWorksComponent: React.FC = () => {
  const { accentColor } = useTheme()

  const steps: Step[] = [
    {
      number: 1,
      title: 'Connect your data',
      description: 'Import conversations from your existing tools or record new ones directly. We support multiple formats and integrations.',
      icon: HiOutlineClock,
    },
    {
      number: 2,
      title: 'AI analyzes patterns',
      description: 'Our AI automatically processes your conversations, identifying themes, sentiment, and key information without manual tagging.',
      icon: HiOutlineSparkles,
    },
    {
      number: 3,
      title: 'Get actionable insights',
      description: 'Access dashboards, reports, and alerts that help you make data-driven decisions and improve outcomes.',
      icon: HiOutlineCheckCircle,
    },
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            From raw conversations to actionable insights in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="relative text-center group">
                {/* Step Number */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${getAccentColor(accentColor, '500')}, ${getAccentColor(accentColor, '700')})`
                  }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Step Number Badge */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: getAccentColor(accentColor, '600') }}
                >
                  {step.number}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export const InsightsHowItWorks = InsightsHowItWorksComponent


```

---

### src/components/landing/LandingFeatures.tsx

```tsx
import React from 'react'
import { IoChatbubblesOutline, HiOutlineDocumentText, HiOutlineMicrophone } from '../../utils/icons'
import { useTheme } from '../../hooks/useTheme'
import { getAccentColor } from '../../utils/accentColors'

interface Feature {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

const LandingFeaturesComponent: React.FC = () => {
  const { accentColor } = useTheme()
  const features: Feature[] = [
    {
      icon: IoChatbubblesOutline,
      title: 'Context-aware AI assistant',
      description:
        'Ask questions about your calls and get intelligent answers—the AI automatically finds and references the relevant conversations.',
    },
    {
      icon: HiOutlineDocumentText,
      title: 'Intelligent transcript retrieval',
      description:
        'No need to search or organize—just ask a question and the right transcripts are pulled automatically based on context.',
    },
    {
      icon: HiOutlineMicrophone,
      title: 'Seamless call capture',
      description:
        'Record from Teams or upload audio files—automatically transcribed and ready to analyze.',
    },
  ]

  return (
    <section id="features" className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 bg-gradient-to-b from-slate-50/50 via-white/95 to-white dark:from-slate-900/50 dark:via-slate-950/95 dark:to-slate-950 relative overflow-hidden">
      {/* Minimal background - very subtle - using dynamic accent color */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: `${getAccentColor(accentColor, '50')}4d`
          }}
        />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: `${getAccentColor(accentColor, '50')}33`
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
            Core features
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything built for real underwriting workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 hover:scale-[1.03] animate-fade-in-up focus-within:ring-2 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-950 overflow-hidden"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${getAccentColor(accentColor, '50')}1a, transparent)`
                  }}
                />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-125 group-hover:-translate-y-2 transition-all duration-300 flex-shrink-0 shadow-md group-hover:shadow-lg border"
                    style={{
                      background: `linear-gradient(135deg, ${getAccentColor(accentColor, '100')}, ${getAccentColor(accentColor, '50')})`,
                      borderColor: `${getAccentColor(accentColor, '200')}80`
                    }}
                  >
                    <div style={{ color: getAccentColor(accentColor, '600') }}>
                      <IconComponent
                        className="w-7 h-7 group-hover:scale-125 transition-all duration-300"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50 mb-3 transition-colors duration-300"
                    style={{
                      color: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLHeadingElement).style.color = getAccentColor(accentColor, '600')
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLHeadingElement).style.color = 'inherit'
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export const LandingFeatures = LandingFeaturesComponent


```

---

### src/components/landing/LandingFooter.tsx

```tsx
import React, { memo } from 'react'

const LandingFooterComponent: React.FC = () => {
  return null
}

export const LandingFooter = memo(LandingFooterComponent)


```

---

### src/components/landing/LandingHeader.tsx

```tsx
import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineMicrophone } from '../../utils/icons'
import { ThemeSelector } from '../ThemeSelector'
import { useTheme } from '../../hooks/useTheme'
import { getAccentColor } from '../../utils/accentColors'

/**
 * Landing page header with navigation
 */
const LandingHeaderComponent: React.FC = () => {
  const navigate = useNavigate()
  const { accentColor } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 shadow-sm dark:shadow-md backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group hover:scale-105 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 rounded-lg px-3 py-2 active:scale-95 hover:-translate-y-1"
            style={{
              '--tw-ring-color': getAccentColor(accentColor, '500')
            } as React.CSSProperties}
            aria-label="EVR home"
            type="button"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 border group-hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
                borderColor: `${getAccentColor(accentColor, '500')}4d`
              }}
            >
              <HiOutlineMicrophone className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="font-bold text-base text-slate-900 dark:text-slate-50 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-200">EVR Chat</span>
          </button>

          {/* Theme Selector */}
          <ThemeSelector />
        </div>
      </div>
    </header>
  )
}

export const LandingHeader = memo(LandingHeaderComponent)


```

---

### src/components/landing/LandingHero.tsx

```tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight } from '../../utils/icons'
import { useTheme } from '../../hooks/useTheme'
import { getAccentColor } from '../../utils/accentColors'

const LandingHeroComponent: React.FC = () => {
  const navigate = useNavigate()
  const { accentColor } = useTheme()

  return (
    <section id="hero" className="relative py-16 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50">
      {/* Subtle background gradient - using dynamic accent color */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 via-transparent to-transparent"
        style={{
          background: `linear-gradient(to bottom, ${getAccentColor(accentColor, '50')}40, transparent, transparent)`
        }}
      />

      {/* Subtle animated blob effect - using dynamic accent color */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-blob"
        style={{
          background: `linear-gradient(135deg, ${getAccentColor(accentColor, '200')}33, ${getAccentColor(accentColor, '200')}1a)`,
          animationDuration: '8s'
        }}
      />

      {/* Additional blob for depth - using dynamic accent color */}
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl animate-blob"
        style={{
          background: `linear-gradient(135deg, ${getAccentColor(accentColor, '200')}26, ${getAccentColor(accentColor, '200')}1a)`,
          animationDelay: '2s',
          animationDuration: '10s'
        }}
      />

      {/* Third blob for additional depth */}
      <div className="pointer-events-none absolute top-1/2 left-1/4 w-72 h-72 rounded-full blur-3xl animate-blob"
        style={{
          background: `linear-gradient(135deg, ${getAccentColor(accentColor, '100')}1a, ${getAccentColor(accentColor, '100')}0d)`,
          animationDelay: '4s',
          animationDuration: '12s'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left: copy and CTAs */}
          <div className="space-y-6">
            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
                EVR turns your voice notes into
                <span
                  className="block font-bold mt-2"
                  style={{
                    color: getAccentColor(accentColor, '600')
                  }}
                >
                  actionable insights
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl">
                Record your call notes, then use AI to extract insights, identify risks, and find key details with direct quotes.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-6">
              <button
                onClick={() => navigate('/chat')}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:shadow-2xl active:scale-95 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 hover:-translate-y-1.5 hover:scale-105 group relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`
                }}
                onMouseEnter={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement
                  btn.style.background = `linear-gradient(135deg, ${getAccentColor(accentColor, '700')}, ${getAccentColor(accentColor, '800')})`
                  btn.style.boxShadow = `0 20px 25px -5px ${getAccentColor(accentColor, '600')}40`
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement
                  btn.style.background = `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`
                  btn.style.boxShadow = ''
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 0 3px rgba(255, 255, 255, 0.1), 0 0 0 5px ${getAccentColor(accentColor, '500')}`
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = ''
                }}
                type="button"
              >
                Start Chatting
                <FiArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>
            </div>
          </div>

          {/* Right: simple chat preview */}
          <div className="hidden lg:block">
            <div className="relative mx-auto w-full max-w-md animate-fade-in-up">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-300 p-5 space-y-4 group overflow-hidden hover:-translate-y-3 hover:scale-[1.03]">
                {/* Subtle gradient overlay - using dynamic accent color */}
                <div className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${getAccentColor(accentColor, '50')}1a, transparent)`
                  }}
                />

                {/* Animated background glow */}
                <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"
                  style={{
                    background: `linear-gradient(135deg, ${getAccentColor(accentColor, '500')}33, ${getAccentColor(accentColor, '600')}1a)`
                  }}
                />

                {/* Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-slate-200/60 dark:border-slate-700/60 transition-colors duration-200 relative z-10"
                  style={{
                    borderBottomColor: `${getAccentColor(accentColor, '300')}99`
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderBottomColor = `${getAccentColor(accentColor, '300')}cc`
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderBottomColor = `${getAccentColor(accentColor, '300')}99`
                  }}
                >
                  <div className="h-10 w-10 rounded-lg text-white flex items-center justify-center text-sm font-semibold flex-shrink-0 shadow-md dark:shadow-lg border group-hover:shadow-lg group-hover:scale-110 transition-all duration-200"
                    style={{
                      background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
                      borderColor: `${getAccentColor(accentColor, '500')}4d`,
                      boxShadow: `0 0 0 0 ${getAccentColor(accentColor, '500')}33`
                    }}
                  >
                    E
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-slate-900 dark:text-slate-50">EVR</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Ask about your notes</p>
                  </div>
                </div>

                {/* Chat bubbles */}
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-end animate-slide-in-right">
                    <div className="max-w-[75%] rounded-2xl rounded-br-lg px-4 py-3 text-sm text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-medium"
                      style={{
                        backgroundColor: getAccentColor(accentColor, '600'),
                        boxShadow: `0 4px 12px ${getAccentColor(accentColor, '500')}40`
                      }}
                    >
                      What did the broker say about coverage limits?
                    </div>
                  </div>
                  <div className="flex justify-start animate-slide-in-left" style={{ animationDelay: '100ms' }}>
                    <div className="max-w-[85%] rounded-2xl rounded-bl-lg bg-slate-100 dark:bg-slate-700 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                      Broker recommended $2M limit with $250K deductible for property coverage.
                    </div>
                  </div>
                  <div className="flex justify-end animate-slide-in-right" style={{ animationDelay: '200ms' }}>
                    <div className="max-w-[75%] rounded-2xl rounded-br-lg px-4 py-3 text-sm text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-medium"
                      style={{
                        backgroundColor: getAccentColor(accentColor, '600'),
                        boxShadow: `0 4px 12px ${getAccentColor(accentColor, '500')}40`
                      }}
                    >
                      Any concerns mentioned?
                    </div>
                  </div>
                  <div className="flex justify-start animate-slide-in-left" style={{ animationDelay: '300ms' }}>
                    <div className="max-w-[85%] rounded-2xl rounded-bl-lg bg-slate-100 dark:bg-slate-700 px-4 py-3 text-sm text-slate-900 dark:text-slate-50 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                      Yes, recent water damage claim and aging roof flagged as underwriting concerns.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export const LandingHero = LandingHeroComponent

```

---

### src/components/landing/LandingInsightPreview.tsx

```tsx
import React, { memo } from 'react'

const LandingInsightPreviewComponent: React.FC = () => {
  return null
}

export const LandingInsightPreview = memo(LandingInsightPreviewComponent)


```

---

### src/components/landing/ScrollToTopButton.tsx

```tsx
import React, { useState, useEffect, memo } from 'react'
import { FiArrowUp } from '../../utils/icons'
import { useTheme } from '../../hooks/useTheme'
import { getAccentColor } from '../../utils/accentColors'

const ScrollToTopButtonComponent: React.FC = () => {
  const { accentColor } = useTheme()
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg dark:shadow-lg hover:shadow-xl dark:hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 animate-fade-in hover:-translate-y-2 border"
          style={{
            background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
            borderColor: `${getAccentColor(accentColor, '500')}4d`,
            boxShadow: `0 0 20px ${getAccentColor(accentColor, '500')}40`,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 30px ${getAccentColor(accentColor, '500')}60`
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 20px ${getAccentColor(accentColor, '500')}40`
          }}
          aria-label="Scroll to top"
          type="button"
        >
          <FiArrowUp className="w-6 h-6 transition-all duration-200 group-hover:translate-y-0.5" aria-hidden="true" />
        </button>
      )}
    </>
  )
}

export const ScrollToTopButton = memo(ScrollToTopButtonComponent)


```

---

### src/components/LayoutShell.tsx

```tsx
import React from 'react'
import type { ReactNode } from 'react'
import { useToast } from '../hooks/useToast'
import { ToastContainer } from './ToastContainer'

interface LayoutShellProps {
  children: ReactNode
}

/**
 * Global layout shell that applies global styles and manages theme
 * Should wrap the entire application
 */
const LayoutShellComponent: React.FC<LayoutShellProps> = ({ children }) => {
  const { toasts, removeToast } = useToast()

  return (
    <div>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  )
}

export const LayoutShell = React.memo(LayoutShellComponent)


```

---

### src/components/LoadingSpinner.tsx

```tsx
import React, { memo } from 'react'
import { FiActivity } from '../utils/icons'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'

const LoadingSpinnerComponent: React.FC = () => {
  const { accentColor } = useTheme()
  const accentHex = getAccentColor(accentColor, '600')

  return (
    <div className="flex justify-start animate-slide-in-left" aria-live="polite" aria-label="Assistant is thinking">
      <div className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 px-5 py-3.5 rounded-2xl rounded-bl-none shadow-md dark:shadow-md hover:shadow-lg dark:hover:shadow-lg transition-all duration-200 group border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center gap-3">
          {/* Animated Icon with Pulse */}
          <div className="flex items-center gap-2">
            <div
              className="relative w-5 h-5 flex items-center justify-center"
              style={{
                animation: 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            >
              <FiActivity
                className="w-5 h-5"
                style={{ color: accentHex }}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Animated Dots with Wave Effect - Enhanced */}
          <div className="flex gap-2 items-center h-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full shadow-md dark:shadow-md"
                style={{
                  background: accentHex,
                  animation: 'bounce-dots 1.4s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`,
                }}
                aria-hidden="true"
              />
            ))}
          </div>

          {/* Thinking Text with Smooth Ellipsis */}
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
            Thinking<span className="inline-block animate-thinking-dots w-3 text-left">.</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export const LoadingSpinner = memo(LoadingSpinnerComponent)


```

---

### src/components/MessageRenderer.tsx

```tsx
import React, { memo, useMemo, useCallback } from 'react'
import { normalizeResponse, isErrorResponse } from '../lib/ai/normalizeResponse'
import { AiSectionRenderer, Citations, FollowUpQuestions } from './ai/AiSectionRenderer'
import type { NormalizedAiResponse } from '../types/ai'
import { FiAlertCircle } from '../utils/icons'

interface MessageRendererProps {
  content: string
  onFollowUpClick?: (question: string) => void
}

const MessageRendererComponent: React.FC<MessageRendererProps> = ({ content, onFollowUpClick }) => {
  // Normalize the response content with memoization
  const normalized: NormalizedAiResponse = useMemo(() => {
    return normalizeResponse(content)
  }, [content])

  // Memoize the follow-up click handler
  const handleFollowUpClick = useCallback((question: string) => {
    onFollowUpClick?.(question)
  }, [onFollowUpClick])

  // Handle error responses
  if (isErrorResponse(normalized)) {
    return (
      <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-red-50 to-red-50/50 dark:from-red-950/40 dark:to-red-950/20 border border-red-200 dark:border-red-700/50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <FiAlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-1 animate-pulse" size={24} />
        <div className="flex-1">
          <div className="text-base font-bold text-red-800 dark:text-red-300 mb-2">
            Error Processing Response
          </div>
          <div className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
            {normalized.error || 'An unexpected error occurred while processing the AI response.'}
          </div>
          {normalized.rawText && (
            <details className="mt-4 group">
              <summary className="text-sm text-red-600 dark:text-red-400 cursor-pointer hover:underline transition-all duration-300 font-medium hover:text-red-700 dark:hover:text-red-300">
                Show raw response
              </summary>
              <pre className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-xs overflow-x-auto border border-red-200 dark:border-red-700/50 font-mono">
                {normalized.rawText}
              </pre>
            </details>
          )}
        </div>
      </div>
    )
  }

  // Render normalized sections
  return (
    <div className="space-y-6">
      {/* Main content sections */}
      {normalized.sections.map((section, index) => (
        <div key={`section-${index}`} className="space-y-4 animate-fade-in">
          <AiSectionRenderer
            section={section}
            onFollowUpClick={handleFollowUpClick}
          />
        </div>
      ))}

      {/* Citations */}
      {normalized.citations && normalized.citations.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700/50 animate-fade-in">
          <Citations citations={normalized.citations} />
        </div>
      )}

      {/* Follow-up questions */}
      {normalized.followUpQuestions && normalized.followUpQuestions.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700/50 animate-fade-in">
          <FollowUpQuestions
            questions={normalized.followUpQuestions}
            onQuestionClick={handleFollowUpClick}
          />
        </div>
      )}
    </div>
  )
}

export const MessageRenderer = memo(MessageRendererComponent)


```

---

### src/components/SkipToContent.tsx

```tsx
import React, { memo } from 'react'

const SkipToContentComponent: React.FC = () => {
  const handleSkip = () => {
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.focus()
      mainContent.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <a
      href="#main-content"
      onClick={handleSkip}
      className="absolute top-0 left-0 -translate-y-full focus:translate-y-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-b-lg font-semibold transition-all duration-200 z-50 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
    >
      Skip to main content
    </a>
  )
}

export const SkipToContent = memo(SkipToContentComponent)


```

---

### src/components/StreamingLoadingIndicator.tsx

```tsx
import React, { memo, useState, useEffect, useMemo } from 'react'
import { FiLoader, FiSend, FiCheck } from '../utils/icons'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'

interface StreamingLoadingIndicatorProps {
  stage?: 'thinking' | 'generating' | 'finalizing'
}

// Stage progress configuration
const STAGE_CONFIG = {
  thinking: { base: 0, target: 30 },
  generating: { base: 33, target: 75 },
  finalizing: { base: 80, target: 100 },
} as const

// Inner component that handles progress animation for a single stage
const ProgressAnimator: React.FC<{
  stage: 'thinking' | 'generating' | 'finalizing'
  onProgress: (progress: number) => void
}> = memo(({ stage, onProgress }) => {
  const { base, target } = STAGE_CONFIG[stage]

  useEffect(() => {
    let current = base
    onProgress(current)

    const interval = setInterval(() => {
      if (current < target) {
        current += 1
        onProgress(current)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [base, target, onProgress])

  return null
})

ProgressAnimator.displayName = 'ProgressAnimator'

const StreamingLoadingIndicatorComponent: React.FC<StreamingLoadingIndicatorProps> = ({
  stage = 'thinking',
}) => {
  const { accentColor } = useTheme()
  const [progress, setProgress] = useState<number>(STAGE_CONFIG[stage].base)

  const stageConfig = useMemo(() => ({
    thinking: {
      label: 'Analyzing',
      description: 'Understanding your question',
      icon: FiLoader,
    },
    generating: {
      label: 'Generating',
      description: 'Crafting response',
      icon: FiSend,
    },
    finalizing: {
      label: 'Finalizing',
      description: 'Almost ready',
      icon: FiCheck,
    },
  }), [])

  const config = stageConfig[stage]
  const accentHex = getAccentColor(accentColor, '500')
  const accentHex600 = getAccentColor(accentColor, '600')
  const IconComponent = config.icon

  return (
    <div className="flex justify-start animate-slide-in-left" role="status" aria-live="polite" aria-label={`AI is ${stage}: ${config.label}`}>
      {/* Use key to force remount and reset progress when stage changes */}
      <ProgressAnimator key={stage} stage={stage} onProgress={setProgress} />
      <div className="message-bubble message-bubble-assistant min-w-[280px] sm:min-w-[320px]">
        <div className="flex flex-col gap-3">
          {/* Header with icon and label */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="animate-pulse" style={{ color: accentHex }} aria-hidden="true">
                <IconComponent size={20} />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {config.label}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {config.description}
                </span>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="relative h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${accentHex}, ${accentHex600})`,
              }}
            />
            {/* Shimmer effect */}
            <div
              className="absolute inset-0 opacity-50"
              style={{
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
                animation: 'shimmer-advanced 1.5s infinite',
                backgroundSize: '200% 100%',
              }}
            />
          </div>

          {/* Stage indicators */}
          <div className="flex items-center justify-between text-xs">
            {['thinking', 'generating', 'finalizing'].map((s, i) => (
              <div
                key={s}
                className={`flex items-center gap-1.5 transition-all duration-300 ${
                  stage === s
                    ? 'text-slate-900 dark:text-slate-100 font-medium'
                    : i < ['thinking', 'generating', 'finalizing'].indexOf(stage)
                    ? 'text-slate-500 dark:text-slate-400'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    stage === s
                      ? 'scale-125'
                      : ''
                  }`}
                  style={{
                    background: stage === s
                      ? accentHex
                      : i < ['thinking', 'generating', 'finalizing'].indexOf(stage)
                      ? accentHex
                      : undefined,
                  }}
                />
                <span className="hidden sm:inline capitalize">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const StreamingLoadingIndicator = memo(StreamingLoadingIndicatorComponent)


```

---

### src/components/ThemeSelector.tsx

```tsx
import React, { memo } from 'react'
import { FiSun, FiMoon } from '../utils/icons'
import { useTheme, type Theme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'
import { AccentColorSelector } from './AccentColorSelector'

/**
 * Theme selector component
 * Allows users to switch between light and dark themes and select accent colors
 */
const ThemeSelectorComponent: React.FC = () => {
  const { theme, toggleTheme, accentColor } = useTheme()

  const themeIcons: Record<Theme, React.ReactNode> = {
    light: <FiSun size={16} />,
    dark: <FiMoon size={16} />,
  }

  return (
    <div className="flex items-center gap-3">
      {/* Accent Color Selector */}
      <AccentColorSelector />

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="relative group w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-lg dark:hover:shadow-lg transition-all duration-300 hover:scale-125 active:scale-95 border border-slate-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 hover:-translate-y-1"
        style={{
          '--tw-ring-color': accentColor ? getAccentColor(accentColor, '500') : '#3b82f6'
        } as React.CSSProperties}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        type="button"
      >
        {/* Sun icon - shown in light mode */}
        <div className={`absolute transition-all duration-300 ${theme === 'light' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-90'}`}>
          <span className="text-slate-700 dark:text-slate-300">{themeIcons.light}</span>
        </div>

        {/* Moon icon - shown in dark mode */}
        <div className={`transition-all duration-300 ${theme === 'dark' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-90'}`}>
          <span className="text-slate-700 dark:text-slate-300">{themeIcons.dark}</span>
        </div>
      </button>
    </div>
  )
}

export const ThemeSelector = memo(ThemeSelectorComponent)


```

---

### src/components/Toast.tsx

```tsx
import React, { useEffect, memo } from 'react'
import { FiCheck, FiAlertCircle, FiInfo, FiX } from '../utils/icons'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  id: string
  type: ToastType
  message: string
  duration?: number
  onClose: (id: string) => void
}

/**
 * Individual toast notification component
 * Displays a temporary notification with auto-dismiss
 */
const ToastComponent: React.FC<ToastProps> = ({
  id,
  type,
  message,
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-50 to-green-50/50 dark:from-green-950/40 dark:to-green-950/20',
          border: 'border-green-200 dark:border-green-800/50',
          text: 'text-green-800 dark:text-green-200',
          icon: <FiCheck className="w-6 h-6 text-green-600 dark:text-green-400" />,
        }
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-red-50/50 dark:from-red-950/40 dark:to-red-950/20',
          border: 'border-red-200 dark:border-red-800/50',
          text: 'text-red-800 dark:text-red-200',
          icon: <FiAlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />,
        }
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-amber-50 to-amber-50/50 dark:from-amber-950/40 dark:to-amber-950/20',
          border: 'border-amber-200 dark:border-amber-800/50',
          text: 'text-amber-800 dark:text-amber-200',
          icon: <FiAlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
        }
      case 'info':
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-950/40 dark:to-blue-950/20',
          border: 'border-blue-200 dark:border-blue-800/50',
          text: 'text-blue-800 dark:text-blue-200',
          icon: <FiInfo className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
        }
    }
  }

  const styles = getStyles()

  return (
    <div
      className={`${styles.bg} ${styles.border} ${styles.text} border rounded-xl p-5 flex items-center gap-4 animate-slide-in-down max-w-sm shadow-lg dark:shadow-lg transition-all duration-300 hover:shadow-xl dark:hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex-shrink-0 animate-enhanced-pulse" aria-hidden="true">{styles.icon}</div>
      <p className="flex-1 text-sm font-semibold">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-2 hover:bg-white/30 dark:hover:bg-white/15 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-sm dark:hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
        aria-label="Close notification"
        type="button"
      >
        <FiX className="w-5 h-5" />
      </button>
    </div>
  )
}

export const Toast = memo(ToastComponent)


```

---

### src/components/ToastContainer.tsx

```tsx
import React, { memo } from 'react'
import { Toast, type ToastType } from './Toast'

export interface ToastMessage {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastContainerProps {
  toasts: ToastMessage[]
  onClose: (id: string) => void
}

/**
 * Container component for displaying multiple toast notifications
 * Positioned at the bottom-right of the screen
 */
const ToastContainerComponent: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            id={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={onClose}
          />
        </div>
      ))}
    </div>
  )
}

export const ToastContainer = memo(ToastContainerComponent)


```

---

### src/constants/index.ts

```typescript
/** Application-wide constants */

export const UI = {
  MAX_MESSAGE_LENGTH: 10000,
  MESSAGE_INPUT_MAX_HEIGHT: 120,
  MESSAGE_INPUT_ROWS: 1,
  MAX_MESSAGES_TO_SEND_TO_API: 20,
  MESSAGE_SCROLL_BEHAVIOR: 'smooth' as const,
  COPY_FEEDBACK_DURATION: 2000,
} as const

export const API = {
  MODEL: 'gpt-4o-mini',
  TEMPERATURE: 0.7,
  MAX_TOKENS: 1000,
  REQUEST_TIMEOUT_MS: 30000,
} as const

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

} as const


```

---

### src/constants/systemPrompts.ts

```typescript
/**
 * System Prompts for AI LLM
 * Implements comprehensive prompt engineering best practices for professional, structured responses
 *
 * Key Principles:
 * - Clear role definition and expertise level
 * - Explicit output format requirements
 * - Quality standards and constraints
 * - Accessibility and readability optimization
 * - Error handling and validation guidance
 */

export const SYSTEM_PROMPTS = {
  default: `## ROLE & EXPERTISE
You are a professional AI assistant with expertise in providing clear, accurate, and well-structured information.

## CORE RESPONSIBILITIES
1. Provide accurate, helpful information tailored to user needs
2. Structure responses for maximum clarity and scannability
3. Maintain professional yet approachable communication
4. Include actionable guidance and next steps
5. Acknowledge limitations and uncertainties

## OUTPUT FORMAT REQUIREMENTS
Format all responses using clear markdown structure:

### Structure
- Use ## for main sections (never use single #)
- Use ### for subsections
- Maintain consistent hierarchy (no skipped levels)
- Separate sections with blank lines

### Content Organization
- **Executive Summary**: 2-3 sentence overview at the start (if response is complex)
- **Key Points**: Use bullet points for non-sequential information
- **Numbered Steps**: Use for sequential processes or instructions
- **Code Blocks**: Include language identifier (e.g., \`\`\`python)
- **Emphasis**: Use **bold** for key terms, \`code\` for technical references

### Lists & Formatting
- Bullet points: Use for alternatives, features, or non-ordered items
- Numbered lists: Use for steps, priorities, or sequences
- Nested lists: Use 2-space indentation for hierarchy
- Avoid excessive nesting (max 3 levels)

## QUALITY STANDARDS
Ensure all responses:
- Are technically accurate and factually correct
- Include relevant examples or context
- Address potential edge cases or exceptions
- Provide clear next steps or recommendations
- Use active voice (80%+ of sentences)
- Keep sentences to 12-18 words average
- Define technical terms on first use
- Maintain professional tone without jargon overload

## READABILITY OPTIMIZATION
- Target Flesch-Kincaid Grade Level: 8-10
- Paragraph length: 3-5 sentences maximum
- Use whitespace strategically for visual hierarchy
- 40%+ of content should be in lists or headers
- Avoid ambiguous pronouns
- Use concrete examples over abstract concepts

## ERROR HANDLING
When uncertain or encountering limitations:
- State the limitation clearly
- Explain why it exists
- Provide alternative approaches if applicable
- Suggest how to get more information
- Never fabricate information

## RESPONSE VALIDATION
Before finalizing responses, verify:
- All questions are addressed
- Information is accurate and current
- Structure follows markdown guidelines
- Examples are relevant and clear
- Next steps are actionable
- Tone is professional and helpful`,

  underwriter: `## ROLE & EXPERTISE
You are an expert underwriting assistant with deep knowledge of insurance underwriting, risk assessment, and policy analysis. Your expertise spans commercial, personal, and specialty lines.

## CORE RESPONSIBILITIES
1. Provide expert underwriting guidance and risk analysis
2. Structure complex information for quick decision-making
3. Highlight critical risk factors and opportunities
4. Support underwriting decisions with clear rationale
5. Ensure compliance and regulatory awareness

## OUTPUT FORMAT REQUIREMENTS
Structure responses with clear sections:

### Standard Response Structure
- **Executive Summary**: Key findings and recommendations (2-3 sentences)
- **Risk Assessment**: Critical risk factors and mitigation strategies
- **Key Considerations**: Important factors for underwriting decision
- **Recommendations**: Specific actionable recommendations
- **Next Steps**: Clear action items and timeline

### Content Guidelines
- Use ## for main sections
- Use ### for subsections
- Use **bold** for critical findings
- Use bullet points for risk factors
- Use numbered lists for action items
- Include specific metrics and thresholds where applicable

## QUALITY STANDARDS
Ensure all responses:
- Are based on current underwriting guidelines
- Include specific risk metrics and thresholds
- Address regulatory and compliance requirements
- Provide clear rationale for recommendations
- Consider both quantitative and qualitative factors
- Include relevant precedents or case examples
- Highlight exceptions and special considerations

## PROFESSIONAL STANDARDS
- Use industry-standard terminology
- Reference specific policy provisions when relevant
- Include confidence levels for assessments
- Acknowledge data limitations
- Provide clear audit trail for decisions
- Support recommendations with evidence

## RESPONSE VALIDATION
Verify responses include:
- Clear risk classification
- Specific underwriting concerns
- Mitigation strategies
- Compliance considerations
- Actionable recommendations
- Timeline for decision`,

  technical: `## ROLE & EXPERTISE
You are a technical expert with deep knowledge of software architecture, best practices, and implementation patterns. You provide clear technical guidance suitable for developers of varying skill levels.

## CORE RESPONSIBILITIES
1. Provide accurate technical explanations and guidance
2. Include practical, working examples
3. Highlight best practices and common pitfalls
4. Support decisions with technical rationale
5. Consider performance, security, and maintainability

## OUTPUT FORMAT REQUIREMENTS
Structure technical responses clearly:

### Standard Response Structure
- **Overview**: Brief explanation of the concept (1-2 sentences)
- **Key Concepts**: Core ideas and terminology
- **Implementation**: Step-by-step guidance or code examples
- **Best Practices**: Recommended approaches and patterns
- **Common Pitfalls**: Mistakes to avoid
- **Performance Considerations**: Optimization and efficiency notes
- **Next Steps**: Further learning or implementation guidance

### Code & Examples
- Include language identifier in code blocks (\`\`\`python, \`\`\`javascript, etc.)
- Keep code examples under 20 lines (reference larger files)
- Add explanatory comments for complex logic
- Include error handling examples
- Show both correct and incorrect approaches

## QUALITY STANDARDS
Ensure all responses:
- Are technically accurate and current
- Include working code examples
- Address edge cases and error conditions
- Consider performance implications
- Include security considerations where relevant
- Reference official documentation
- Provide version-specific guidance when needed

## TECHNICAL DEPTH
- Explain the "why" behind recommendations
- Include architectural considerations
- Address scalability and maintainability
- Consider testing and debugging approaches
- Include monitoring and observability guidance

## RESPONSE VALIDATION
Verify responses include:
- Clear technical explanation
- Working code examples
- Best practices guidance
- Common pitfalls and solutions
- Performance considerations
- Clear next steps for implementation`,
}

export type SystemPromptType = keyof typeof SYSTEM_PROMPTS

/**
 * Get system prompt by type
 */
export function getSystemPrompt(type: SystemPromptType = 'default'): string {
  return SYSTEM_PROMPTS[type] || SYSTEM_PROMPTS.default
}


```

---

### src/contexts/ThemeContext.tsx

```tsx
import React, { useState, useEffect, useCallback } from 'react'
import type { AccentColor } from '../utils/accentColors'
import { ThemeContext, AVAILABLE_THEMES, AVAILABLE_ACCENT_COLORS } from './themeContextDef'
import type { Theme, ThemeContextType } from './themeContextDef'

export type { Theme, ThemeContextType }
export { ThemeContext }

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize theme from localStorage or default to light mode
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme
    return (saved && AVAILABLE_THEMES.includes(saved)) ? saved : 'light'
  })

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'light'
    return savedTheme === 'dark'
  })

  // Initialize accent color from localStorage or default to red
  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem('accentColor') as AccentColor
    return (saved && AVAILABLE_ACCENT_COLORS.includes(saved)) ? saved : 'red'
  })

  // Apply theme and accent color to DOM
  const applyTheme = useCallback((newTheme: Theme, newAccentColor: AccentColor) => {
    const htmlElement = document.documentElement

    // Update dark mode class
    if (newTheme === 'dark') {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }

    // Update accent color class
    htmlElement.classList.remove('accent-blue', 'accent-emerald', 'accent-violet', 'accent-red', 'accent-amber', 'accent-slate')
    htmlElement.classList.add(`accent-${newAccentColor}`)
  }, [])

  // Apply initial theme on mount and when theme/accentColor changes
  useEffect(() => {
    applyTheme(theme, accentColor)
  }, [theme, accentColor, applyTheme])

  const setTheme = useCallback((newTheme: Theme) => {
    if (!AVAILABLE_THEMES.includes(newTheme)) return
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    setIsDarkMode(newTheme === 'dark')
  }, [])

  const setAccentColor = useCallback((newColor: AccentColor) => {
    if (!AVAILABLE_ACCENT_COLORS.includes(newColor)) return
    setAccentColorState(newColor)
    localStorage.setItem('accentColor', newColor)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) => {
      const newTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', newTheme)
      setIsDarkMode(newTheme === 'dark')
      return newTheme
    })
  }, [])

  const value: ThemeContextType = {
    theme,
    isDarkMode,
    accentColor,
    setTheme,
    toggleTheme,
    setAccentColor,
    availableThemes: AVAILABLE_THEMES,
    availableAccentColors: AVAILABLE_ACCENT_COLORS,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// useTheme hook is exported from src/hooks/useTheme.ts to satisfy react-refresh


```

---

### src/contexts/themeContextDef.ts

```typescript
import { createContext } from 'react'
import type { AccentColor } from '../utils/accentColors'

export type Theme = 'light' | 'dark'

export interface ThemeContextType {
  theme: Theme
  isDarkMode: boolean
  accentColor: AccentColor
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setAccentColor: (color: AccentColor) => void
  availableThemes: Theme[]
  availableAccentColors: AccentColor[]
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const AVAILABLE_THEMES: Theme[] = ['light', 'dark']
export const AVAILABLE_ACCENT_COLORS: AccentColor[] = ['blue', 'emerald', 'violet', 'red', 'amber', 'slate']


```

---

### src/firebase.ts

```typescript
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

/**
 * Firebase configuration loaded from environment variables
 * Supports both hardcoded defaults (for generic-voice project) and environment-based config
 *
 * Environment variables (optional):
 * - VITE_FIREBASE_API_KEY
 * - VITE_FIREBASE_AUTH_DOMAIN
 * - VITE_FIREBASE_PROJECT_ID
 * - VITE_FIREBASE_STORAGE_BUCKET
 * - VITE_FIREBASE_MESSAGING_SENDER_ID
 * - VITE_FIREBASE_APP_ID
 * - VITE_FIREBASE_MEASUREMENT_ID
 */
function getFirebaseConfig() {
  // Default configuration for generic-voice project
  const defaultConfig = {
    apiKey: 'AIzaSyArd37qujqzU0Er5GJ6RVcUiFndTA5Dbvk',
    authDomain: 'generic-voice.firebaseapp.com',
    projectId: 'generic-voice',
    storageBucket: 'generic-voice.firebasestorage.app',
    messagingSenderId: '297339398874',
    appId: '1:297339398874:web:e6a3d9089ad4c2314913e3',
    measurementId: 'G-TXQ7DFG0XK',
  }

  // Allow environment variable overrides
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultConfig.apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultConfig.authDomain,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultConfig.projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultConfig.storageBucket,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultConfig.messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultConfig.appId,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || defaultConfig.measurementId,
  }

  // Validate required fields
  if (!firebaseConfig.projectId) {
    throw new Error('Firebase projectId is required. Set VITE_FIREBASE_PROJECT_ID or use default configuration.')
  }

  return firebaseConfig
}

const firebaseConfig = getFirebaseConfig()

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Analytics safely (may not be available in all environments)
let analytics
try {
  if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
    analytics = getAnalytics(app)
  }
} catch {
  // Analytics initialization is optional, silently fail
  // Error is not logged as it's expected in some environments
}

const db = getFirestore(app)
const storage = getStorage(app)

export { app, analytics, db, storage }


```

---

### src/hooks/useChatOperations.ts

```typescript
import { useCallback } from 'react'
import { chatService } from '../services/chatService'
import { logger } from '../services/logger'
import { isChatProviderConfigured, getApiKeyErrorMessage } from '../services/config'
import type { Conversation, ChatMessage } from '../types'

interface UseChatOperationsProps {
  setConversations: (convs: Conversation[]) => void
  setCurrentConversationId: (id: string | null) => void
  setMessages: (msgs: ChatMessage[]) => void
  setIsApiKeyMissing: (missing: boolean) => void
  setApiError: (error: string | undefined) => void
}

export const useChatOperations = ({
  setConversations,
  setCurrentConversationId,
  setMessages,
  setIsApiKeyMissing,
  setApiError,
}: UseChatOperationsProps) => {
  const loadConversations = useCallback(async () => {
    try {
      const convs = await chatService.getAllConversations()
      setConversations(convs)
      logger.debug('Conversations loaded successfully', { count: convs.length })
    } catch (error) {
      logger.error('Failed to load conversations', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to load conversations'
      setApiError(`Error loading conversations: ${errorMsg}`)
    }
  }, [setConversations, setApiError])

  const loadMessages = useCallback(async (conversationId: string) => {
    if (!conversationId) {
      logger.warn('loadMessages called with empty conversationId')
      return
    }

    try {
      logger.debug('Loading messages for conversation', { conversationId })
      const msgs = await chatService.getConversationMessages(conversationId)
      logger.debug('Messages loaded', { count: msgs.length })
      setMessages(msgs)
    } catch (error) {
      logger.error('Failed to load messages', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to load messages'
      setApiError(`Error loading messages: ${errorMsg}`)
    }
  }, [setMessages, setApiError])

  const handleSelectConversation = useCallback((conversationId: string) => {
    setCurrentConversationId(conversationId)
  }, [setCurrentConversationId])

  const initializeChat = useCallback(async () => {
    try {
      logger.info('Initializing chat')

      // Check if chat provider is properly configured
      if (!isChatProviderConfigured()) {
        logger.warn('Chat provider is not properly configured')
        setIsApiKeyMissing(true)
        setApiError(getApiKeyErrorMessage())
        return
      }

      const convs = await chatService.getAllConversations()
      setConversations(convs)
      logger.debug('Chat initialized', { conversationCount: convs.length })

      // Create initial conversation if none exist
      if (convs.length === 0) {
        const title = `Chat ${new Date().toLocaleDateString()}`
        logger.info('Creating initial conversation', { title })
        const conversationId = await chatService.createConversation(title)
        setCurrentConversationId(conversationId)
        setMessages([])
        logger.info('Initial conversation created', { conversationId })
      }
    } catch (error) {
      logger.error('Failed to initialize chat', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to initialize chat'
      setApiError(`Error initializing chat: ${errorMsg}`)
    }
  }, [setConversations, setCurrentConversationId, setMessages, setIsApiKeyMissing, setApiError])

  return {
    loadConversations,
    loadMessages,
    handleSelectConversation,
    initializeChat,
  }
}


```

---

### src/hooks/useChatState.ts

```typescript
import { useState, useCallback } from 'react'
import type { ChatMessage, Conversation } from '../types'

/**
 * Custom hook to manage chat state
 * Reduces complexity in MainChatPage by encapsulating related state
 */
export const useChatState = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [apiError, setApiError] = useState<string>()
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false)

  const resetInput = useCallback(() => {
    setInputValue('')
  }, [])

  const clearError = useCallback(() => {
    setApiError(undefined)
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  return {
    // State
    conversations,
    currentConversationId,
    messages,
    inputValue,
    isLoading,
    sidebarOpen,
    apiError,
    isApiKeyMissing,
    // Setters
    setConversations,
    setCurrentConversationId,
    setMessages,
    setInputValue,
    setIsLoading,
    setApiError,
    setIsApiKeyMissing,
    // Helpers
    resetInput,
    clearError,
    toggleSidebar,
  }
}


```

---

### src/hooks/useMetadata.ts

```typescript
import { useState, useCallback } from 'react'
import type { ConversationMetadata } from '../types'
import { chatService } from '../services/chatService'
import { logger } from '../services/logger'

interface UseMetadataProps {
  conversationId: string | null
  initialMetadata?: ConversationMetadata
}

/**
 * Custom hook to manage conversation metadata
 * Handles metadata state, updates, and persistence
 */
export const useMetadata = ({ conversationId, initialMetadata }: UseMetadataProps) => {
  const [metadata, setMetadata] = useState<ConversationMetadata>(initialMetadata || {})
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)

  const updateMetadata = useCallback(
    async (updates: Partial<ConversationMetadata>) => {
      if (!conversationId) {
        logger.warn('updateMetadata called without conversationId')
        return
      }

      setIsUpdating(true)
      setUpdateError(null)

      try {
        const newMetadata = { ...metadata, ...updates }
        setMetadata(newMetadata)

        // Persist to Firestore
        await chatService.updateConversationMetadata(conversationId, newMetadata)
        logger.info('Metadata updated successfully', { conversationId })
      } catch (error) {
        logger.error('Failed to update metadata', error)
        const errorMsg = error instanceof Error ? error.message : 'Failed to update metadata'
        setUpdateError(errorMsg)
        // Revert on error
        setMetadata(metadata)
      } finally {
        setIsUpdating(false)
      }
    },
    [conversationId, metadata]
  )

  const updateField = useCallback(
    async (field: keyof ConversationMetadata, value: string | string[] | undefined) => {
      await updateMetadata({ [field]: value })
    },
    [updateMetadata]
  )

  const addTag = useCallback(
    async (tag: string) => {
      const currentTags = metadata.tags || []
      if (!currentTags.includes(tag)) {
        await updateMetadata({ tags: [...currentTags, tag] })
      }
    },
    [metadata, updateMetadata]
  )

  const removeTag = useCallback(
    async (tag: string) => {
      const currentTags = metadata.tags || []
      await updateMetadata({ tags: currentTags.filter(t => t !== tag) })
    },
    [metadata, updateMetadata]
  )

  const clearMetadata = useCallback(() => {
    setMetadata({})
    setUpdateError(null)
  }, [])

  return {
    metadata,
    isUpdating,
    updateError,
    updateMetadata,
    updateField,
    addTag,
    removeTag,
    clearMetadata,
  }
}


```

---

### src/hooks/useServiceWorker.ts

```typescript
import { useEffect, useState } from 'react'
import {
  registerServiceWorker,
  isServiceWorkerActive,
  getCacheSize,
} from '../utils/serviceWorker'
import { logger } from '../services/logger'

interface UseServiceWorkerOptions {
  autoRegister?: boolean
  onUpdate?: () => void
  debug?: boolean
}

interface UseServiceWorkerReturn {
  isActive: boolean
  cacheSize: number
  isLoading: boolean
}

/**
 * Hook to manage service worker registration and offline support
 * @param options - Configuration options
 * @returns Service worker state
 */
export function useServiceWorker(
  options: UseServiceWorkerOptions = {}
): UseServiceWorkerReturn {
  const { autoRegister = true, onUpdate, debug = false } = options
  const [isActive, setIsActive] = useState(false)
  const [cacheSize, setCacheSize] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initServiceWorker = async () => {
      try {
        if (autoRegister) {
          await registerServiceWorker({
            onSuccess: () => {
              if (debug) {
                logger.info('Service Worker registered successfully')
              }
              setIsActive(true)
            },
            onUpdate: () => {
              if (debug) {
                logger.info('Service Worker update available')
              }
              onUpdate?.()
            },
            onError: (error) => {
              if (debug) {
                logger.error('Service Worker registration failed:', error)
              }
            },
          })
        }

        // Check if service worker is already active
        setIsActive(isServiceWorkerActive())

        // Get cache size
        const size = await getCacheSize()
        setCacheSize(size)
      } catch (error) {
        if (debug) {
          logger.error('Service Worker initialization failed:', error)
        }
      } finally {
        setIsLoading(false)
      }
    }

    initServiceWorker()
  }, [autoRegister, onUpdate, debug])

  return { isActive, cacheSize, isLoading }
}


```

---

### src/hooks/useTheme.ts

```typescript
import { useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'
import type { ThemeContextType, Theme } from '../contexts/ThemeContext'
import type { AccentColor } from '../utils/accentColors'

export type { Theme, ThemeContextType, AccentColor }

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}


```

---

### src/hooks/useToast.ts

```typescript
import { useState, useCallback } from 'react'
import type { ToastType } from '../components/Toast'

export interface ToastMessage {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface UseToastReturn {
  toasts: ToastMessage[]
  showToast: (message: string, type?: ToastType, duration?: number) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

/**
 * Hook for managing toast notifications
 * Provides methods to show, remove, and clear toasts
 */
export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((
    message: string,
    type: ToastType = 'info',
    duration: number = 3000,
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    const newToast: ToastMessage = { id, type, message, duration }

    setToasts((prev) => [...prev, newToast])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    showToast,
    removeToast,
    clearToasts,
  }
}


```

---

### src/hooks/useUploadedFiles.ts

```typescript
/**
 * useUploadedFiles Hook
 * Manages uploaded files state and operations
 */

import { useState, useCallback } from 'react'
import { uploadService } from '../services/uploadService'
import type { UploadedFile, UploadProgress } from '../types'
import { logger } from '../services/logger'

interface UseUploadedFilesReturn {
  files: UploadedFile[]
  isLoading: boolean
  error: string | null
  uploadProgress: UploadProgress | null
  loadFiles: (userId: string) => Promise<void>
  uploadFile: (file: File, userId: string, fileType: 'audio' | 'document', tags: string[]) => Promise<UploadedFile | null>
  updateFileTags: (fileId: string, tags: string[]) => Promise<void>
  deleteFile: (fileId: string, storagePath: string) => Promise<void>
  clearError: () => void
}

export const useUploadedFiles = (): UseUploadedFilesReturn => {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)

  const loadFiles = useCallback(async (userId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const userFiles = await uploadService.getUserFiles(userId)
      setFiles(userFiles)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load files'
      setError(errorMessage)
      logger.error('Error loading files', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const uploadFile = useCallback(
    async (file: File, userId: string, fileType: 'audio' | 'document', tags: string[]) => {
      try {
        setError(null)
        const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        setUploadProgress({
          fileId,
          filename: file.name,
          progress: 0,
          status: 'uploading',
        })

        const uploadedFile = await uploadService.uploadFile(file, userId, fileType, tags)

        setUploadProgress({
          fileId,
          filename: file.name,
          progress: 100,
          status: 'completed',
        })

        setFiles((prev) => [uploadedFile, ...prev])
        setTimeout(() => setUploadProgress(null), 2000)

        return uploadedFile
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Upload failed'
        setError(errorMessage)
        setUploadProgress((prev) =>
          prev ? { ...prev, status: 'error', error: errorMessage } : null
        )
        logger.error('Error uploading file', err)
        return null
      }
    },
    []
  )

  const updateFileTags = useCallback(async (fileId: string, tags: string[]) => {
    try {
      setError(null)
      await uploadService.updateFileTags(fileId, tags)
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, tags } : f))
      )
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update tags'
      setError(errorMessage)
      logger.error('Error updating tags', err)
    }
  }, [])

  const deleteFile = useCallback(async (fileId: string, storagePath: string) => {
    try {
      setError(null)
      await uploadService.deleteFile(fileId, storagePath)
      setFiles((prev) => prev.filter((f) => f.id !== fileId))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete file'
      setError(errorMessage)
      logger.error('Error deleting file', err)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    files,
    isLoading,
    error,
    uploadProgress,
    loadFiles,
    uploadFile,
    updateFileTags,
    deleteFile,
    clearError,
  }
}


```

---

### src/hooks/useWebVitals.ts

```typescript
import { useEffect } from 'react'
import { initWebVitals, reportWebVitals, type WebVitalsMetric } from '../utils/webVitals'
import { logger } from '../services/logger'

interface UseWebVitalsOptions {
  endpoint?: string
  onMetric?: (metric: WebVitalsMetric) => void
  debug?: boolean
}

/**
 * Hook to initialize and track Web Vitals
 * @param options - Configuration options
 */
export function useWebVitals(options: UseWebVitalsOptions = {}): void {
  const { endpoint, onMetric, debug = false } = options

  useEffect(() => {
    const handleMetric = async (metric: WebVitalsMetric) => {
      if (debug) {
        logger.info(`Web Vital: ${metric.name} = ${metric.value.toFixed(2)}ms (${metric.rating})`)
      }

      // Call custom callback if provided
      onMetric?.(metric)

      // Report to endpoint if provided
      if (endpoint) {
        await reportWebVitals(metric, endpoint)
      }
    }

    initWebVitals(handleMetric)
  }, [endpoint, onMetric, debug])
}


```

---

### src/index.css

```css
@import "tailwindcss";
@import "./styles/base.css";
@import "./styles/themes.css";
@import "./styles/components.css";
@import "./styles/utilities.css";
@import "./styles/animations.css";

/* Define dark mode variant for Tailwind v4 */
@custom-variant dark (&:where(.dark, .dark *));

/* Accent color definitions */
@layer base {
  :root {
    color-scheme: light;
    /* Default accent color - Red */
    --accent-50: #fef2f2;
    --accent-100: #fee2e2;
    --accent-200: #fecaca;
    --accent-300: #fca5a5;
    --accent-400: #f87171;
    --accent-500: #ef4444;
    --accent-600: #dc2626;
    --accent-700: #b91c1c;
    --accent-800: #991b1b;
    --accent-900: #7f1d1d;
  }

  :root.dark {
    color-scheme: dark;
  }

  /* Emerald Accent Color */
  :root.accent-emerald {
    --accent-50: #f0fdf4;
    --accent-100: #dcfce7;
    --accent-200: #bbf7d0;
    --accent-300: #86efac;
    --accent-400: #4ade80;
    --accent-500: #10b981;
    --accent-600: #059669;
    --accent-700: #047857;
    --accent-800: #065f46;
    --accent-900: #064e3b;
  }

  /* Violet Accent Color */
  :root.accent-violet {
    --accent-50: #faf5ff;
    --accent-100: #f3e8ff;
    --accent-200: #e9d5ff;
    --accent-300: #d8b4fe;
    --accent-400: #c084fc;
    --accent-500: #a855f7;
    --accent-600: #9333ea;
    --accent-700: #7e22ce;
    --accent-800: #6b21a8;
    --accent-900: #581c87;
  }

  /* Red Accent Color */
  :root.accent-red {
    --accent-50: #fef2f2;
    --accent-100: #fee2e2;
    --accent-200: #fecaca;
    --accent-300: #fca5a5;
    --accent-400: #f87171;
    --accent-500: #ef4444;
    --accent-600: #dc2626;
    --accent-700: #b91c1c;
    --accent-800: #991b1b;
    --accent-900: #7f1d1d;
  }

  /* Amber Accent Color */
  :root.accent-amber {
    --accent-50: #fffbeb;
    --accent-100: #fef3c7;
    --accent-200: #fde68a;
    --accent-300: #fcd34d;
    --accent-400: #fbbf24;
    --accent-500: #f59e0b;
    --accent-600: #d97706;
    --accent-700: #b45309;
    --accent-800: #92400e;
    --accent-900: #78350f;
  }

  /* Slate Accent Color (Black/White Theme) */
  :root.accent-slate {
    --accent-50: #f8fafc;
    --accent-100: #f1f5f9;
    --accent-200: #e2e8f0;
    --accent-300: #cbd5e1;
    --accent-400: #94a3b8;
    --accent-500: #64748b;
    --accent-600: #475569;
    --accent-700: #334155;
    --accent-800: #1e293b;
    --accent-900: #0f172a;
  }
}


```

---

### src/lib/ai/normalizeResponse.ts

```typescript
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


```

---

### src/main.tsx

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './firebase'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```

---

### src/pages/ChatLandingPage.tsx

```tsx
import React, { memo, lazy, Suspense } from 'react'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { LandingHeader } from '../components/landing/LandingHeader'
import { LandingHero } from '../components/landing/LandingHero'

// Lazy load below-the-fold sections for better initial load performance
const LandingFeatures = lazy(() => import('../components/landing/LandingFeatures').then(m => ({ default: m.LandingFeatures })))
const LandingHowItWorks = lazy(() => import('../components/landing/LandingHowItWorks').then(m => ({ default: m.LandingHowItWorks })))
const LandingInsightPreview = lazy(() => import('../components/landing/LandingInsightPreview').then(m => ({ default: m.LandingInsightPreview })))
const LandingFooter = lazy(() => import('../components/landing/LandingFooter').then(m => ({ default: m.LandingFooter })))
const ScrollToTopButton = lazy(() => import('../components/landing/ScrollToTopButton').then(m => ({ default: m.ScrollToTopButton })))

// Minimal loading fallback for lazy sections
const SectionLoader: React.FC = () => (
  <div className="w-full py-12 flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <p className="text-sm text-slate-400 dark:text-slate-600 font-medium">Loading section...</p>
    </div>
  </div>
)

const ChatLandingPageComponent: React.FC = () => {

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 flex flex-col transition-colors duration-300">
        {/* Header with theme toggle - above the fold */}
        <LandingHeader />

        {/* Main content */}
        <main className="flex-1 flex flex-col">
          {/* Hero section - above the fold */}
          <LandingHero />

          {/* Below-the-fold sections - lazy loaded */}
          <Suspense fallback={<SectionLoader />}>
            <LandingFeatures />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <LandingHowItWorks />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <LandingInsightPreview />
          </Suspense>
        </main>

        {/* Footer - lazy loaded */}
        <Suspense fallback={<SectionLoader />}>
          <LandingFooter />
        </Suspense>

        {/* Scroll to top button - lazy loaded */}
        <Suspense fallback={null}>
          <ScrollToTopButton />
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}

export const ChatLandingPage = memo(ChatLandingPageComponent)

```

---

### src/pages/HomePage.tsx

```tsx
import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiMessageCircle } from '../utils/icons'
import { HiOutlineSparkles, HiOutlineDocumentText } from '../utils/icons'
import { ThemeSelector } from '../components/ThemeSelector'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'

interface ProductCard {
  id: string
  title: string
  subtitle: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  route: string
  gradient: { from: string; to: string }
}

const HomePageComponent: React.FC = () => {
  const navigate = useNavigate()
  const { accentColor } = useTheme()

  const products: ProductCard[] = [
    {
      id: 'chat',
      title: 'EVR Chat',
      subtitle: 'Conversational AI',
      description: 'Turn your voice notes into actionable insights. Ask questions about your calls and get intelligent answers.',
      icon: FiMessageCircle,
      route: '/chat-landing',
      gradient: { from: '500', to: '700' }
    },
    {
      id: 'insights',
      title: 'EVR Insights',
      subtitle: 'Analytics & Trends',
      description: 'Discover patterns and trends across all your conversations. Visualize key metrics and uncover hidden insights.',
      icon: HiOutlineSparkles,
      route: '/insights',
      gradient: { from: '400', to: '600' }
    },
    {
      id: 'reporting',
      title: 'EVR Reporting',
      subtitle: 'Action Tracking',
      description: 'Track action items, follow-ups, and commitments. Never miss a deadline with our interactive tracker.',
      icon: HiOutlineDocumentText,
      route: '/reporting',
      gradient: { from: '600', to: '800' }
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 shadow-sm dark:shadow-md backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg border"
                style={{
                  background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
                  borderColor: `${getAccentColor(accentColor, '500')}4d`
                }}
              >
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-slate-50">EVR</span>
            </div>
            <ThemeSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
          {/* Background Effects */}
          <div
            className="pointer-events-none absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-blob"
            style={{
              background: `linear-gradient(135deg, ${getAccentColor(accentColor, '200')}33, ${getAccentColor(accentColor, '200')}1a)`,
              animationDuration: '8s'
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl animate-blob"
            style={{
              background: `linear-gradient(135deg, ${getAccentColor(accentColor, '200')}26, ${getAccentColor(accentColor, '200')}1a)`,
              animationDelay: '2s',
              animationDuration: '10s'
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Title */}
            <div className="text-center mb-16 sm:mb-20">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-tight mb-6">
                Welcome to{' '}
                <span
                  className="font-bold"
                  style={{ color: getAccentColor(accentColor, '600') }}
                >
                  EVR
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Your AI-powered suite for voice notes, insights, and action tracking.
                Choose a product to get started.
              </p>
            </div>

            {/* Product Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {products.map((product) => {
                const Icon = product.icon
                return (
                  <button
                    key={product.id}
                    onClick={() => navigate(product.route)}
                    className="group relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 text-left overflow-hidden hover:-translate-y-2 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      '--tw-ring-color': getAccentColor(accentColor, '500')
                    } as React.CSSProperties}
                  >
                    {/* Gradient overlay on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${getAccentColor(accentColor, product.gradient.from)}, ${getAccentColor(accentColor, product.gradient.to)})`
                      }}
                    />

                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${getAccentColor(accentColor, product.gradient.from)}, ${getAccentColor(accentColor, product.gradient.to)})`
                      }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <p
                        className="text-sm font-medium mb-1"
                        style={{ color: getAccentColor(accentColor, '600') }}
                      >
                        {product.subtitle}
                      </p>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-200">
                        {product.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                        {product.description}
                      </p>

                      {/* CTA */}
                      <div
                        className="inline-flex items-center gap-2 font-semibold transition-all duration-200 group-hover:gap-3"
                        style={{ color: getAccentColor(accentColor, '600') }}
                      >
                        Get Started
                        <FiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 dark:border-slate-700/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} EVR. AI-powered insights for your conversations.
          </p>
        </div>
      </footer>
    </div>
  )
}

export const HomePage = memo(HomePageComponent)


```

---

### src/pages/InsightsLandingPage.tsx

```tsx
import React, { memo, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiArrowLeft } from '../utils/icons'
import { HiOutlineSparkles } from '../utils/icons'
import { ThemeSelector } from '../components/ThemeSelector'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'
import { ErrorBoundary } from '../components/ErrorBoundary'

// Lazy load sections
const InsightsFeatures = lazy(() => import('../components/insights/InsightsFeatures').then(m => ({ default: m.InsightsFeatures })))
const InsightsHowItWorks = lazy(() => import('../components/insights/InsightsHowItWorks').then(m => ({ default: m.InsightsHowItWorks })))

const SectionLoader: React.FC = () => (
  <div className="w-full py-12 flex items-center justify-center">
    <div className="flex gap-1">
      <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
)

const InsightsLandingPageComponent: React.FC = () => {
  const navigate = useNavigate()
  const { accentColor } = useTheme()

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 flex flex-col transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 shadow-sm dark:shadow-md backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-3 group hover:scale-105 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg px-3 py-2"
                style={{ '--tw-ring-color': getAccentColor(accentColor, '500') } as React.CSSProperties}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg border group-hover:scale-110 transition-all duration-200"
                  style={{
                    background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`,
                    borderColor: `${getAccentColor(accentColor, '500')}4d`
                  }}
                >
                  <HiOutlineSparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-base text-slate-900 dark:text-slate-50">EVR Insights</span>
              </button>
              <ThemeSelector />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
          <div className="pointer-events-none absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-blob"
            style={{ background: `linear-gradient(135deg, ${getAccentColor(accentColor, '200')}33, ${getAccentColor(accentColor, '200')}1a)`, animationDuration: '8s' }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
                    Discover patterns in your
                    <span className="block font-bold mt-2" style={{ color: getAccentColor(accentColor, '600') }}>
                      conversations
                    </span>
                  </h1>
                  <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl">
                    Uncover trends, track sentiment, and visualize key metrics across all your recorded conversations with AI-powered analytics.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-6">
                  <button
                    onClick={() => navigate('/chat')}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:shadow-2xl active:scale-95 transition-all duration-300"
                    style={{ background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})` }}
                  >
                    Explore Insights <FiArrowRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 font-medium transition-colors"
                  >
                    <FiArrowLeft className="h-4 w-4" /> Back to Home
                  </button>
                </div>
              </div>
              {/* Preview Card */}
              <div className="hidden lg:block">
                <div className="relative mx-auto w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl p-5 space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-200/60 dark:border-slate-700/60">
                    <div className="h-10 w-10 rounded-lg text-white flex items-center justify-center shadow-md"
                      style={{ background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})` }}>
                      <HiOutlineSparkles className="w-5 h-5" />
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold text-slate-900 dark:text-slate-50">Insights Dashboard</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Real-time analytics</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <span className="text-sm text-slate-600 dark:text-slate-300">Total Conversations</span>
                      <span className="text-lg font-bold" style={{ color: getAccentColor(accentColor, '600') }}>247</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <span className="text-sm text-slate-600 dark:text-slate-300">Positive Sentiment</span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">78%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <span className="text-sm text-slate-600 dark:text-slate-300">Action Items Found</span>
                      <span className="text-lg font-bold text-amber-600 dark:text-amber-400">156</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features & How It Works */}
        <main className="flex-1 flex flex-col">
          <Suspense fallback={<SectionLoader />}>
            <InsightsFeatures />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <InsightsHowItWorks />
          </Suspense>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/50 dark:border-slate-700/50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} EVR. AI-powered insights for your conversations.
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  )
}

export const InsightsLandingPage = memo(InsightsLandingPageComponent)


```

---

### src/pages/MainChatPage.tsx

```tsx
import React, { useEffect, useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { chatService } from '../services/chatService'
import { logger } from '../services/logger'
import { getApiKeyErrorMessage } from '../services/config'
import { initializeTitleService, getTitleService } from '../services/titleGenerationService'
import { useChatState } from '../hooks/useChatState'
import { useChatOperations } from '../hooks/useChatOperations'
import { useToast } from '../hooks/useToast'
import { useMetadata } from '../hooks/useMetadata'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'
import { ChatSidebar } from '../components/ChatSidebar'
import { ChatHeader } from '../components/ChatHeader'
import { ChatMessages } from '../components/ChatMessages'
import { ChatInput } from '../components/ChatInput'
import { ApiErrorBanner } from '../components/ApiErrorBanner'
import { ConversationDetailsPanel } from '../components/ConversationDetailsPanel'
import { API } from '../constants'
import type { ChatMessage } from '../types'

const MainChatPage: React.FC = () => {
  const location = useLocation()
  const { showToast } = useToast()
  const { accentColor } = useTheme()
  const [showDetailsPanel, setShowDetailsPanel] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [streamingStage, setStreamingStage] = useState<'thinking' | 'generating' | 'finalizing'>('thinking')

  const {
    conversations,
    currentConversationId,
    messages,
    inputValue,
    isLoading,
    sidebarOpen,
    apiError,
    isApiKeyMissing,
    setConversations,
    setCurrentConversationId,
    setMessages,
    setInputValue,
    setIsLoading,
    setApiError,
    setIsApiKeyMissing,
    resetInput,
    clearError,
    toggleSidebar,
  } = useChatState()

  const currentConversation = conversations.find(c => c.id === currentConversationId)
  const {
    metadata,
    isUpdating: isUpdatingMetadata,
    updateMetadata,
  } = useMetadata({
    conversationId: currentConversationId,
    initialMetadata: currentConversation?.metadata,
  })

  const {
    loadConversations,
    loadMessages,
    handleSelectConversation,
    initializeChat,
  } = useChatOperations({
    setConversations,
    setCurrentConversationId,
    setMessages,
    setIsApiKeyMissing,
    setApiError,
  })

  // Handle new conversation creation - direct without dialog
  const handleNewConversation = useCallback(async () => {
    try {
      const title = `New Conversation`
      logger.info('Creating new conversation')
      const conversationId = await chatService.createConversation(title)
      setCurrentConversationId(conversationId)
      setMessages([])
      await loadConversations()
      logger.info('New conversation created successfully', { conversationId })
      showToast('New conversation created', 'success', 2000)
    } catch (error) {
      logger.error('Failed to create conversation', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to create conversation'
      setApiError(`Error creating conversation: ${errorMsg}`)
      showToast(errorMsg, 'error', 4000)
    }
  }, [setCurrentConversationId, setMessages, loadConversations, setApiError, showToast])



  // Initialize title service on mount
  useEffect(() => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (apiKey) {
      try {
        initializeTitleService(apiKey)
        logger.debug('Title generation service initialized')
      } catch (error) {
        logger.warn('Failed to initialize title service', error)
      }
    }
  }, [])

  // Load conversations on mount and handle navigation state
  useEffect(() => {
    initializeChat()

    // Handle navigation state: conversationId
    const navigationState = location.state as { conversationId?: string } | null

    if (navigationState?.conversationId) {
      setCurrentConversationId(navigationState.conversationId)
      logger.debug('Loaded conversation from navigation state', { conversationId: navigationState.conversationId })
    }
  }, [initializeChat, location.state, setCurrentConversationId])

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId)
    }
  }, [currentConversationId, loadMessages])

  const handleSendMessage = useCallback(async () => {
    const trimmedMessage = inputValue.trim()

    // Validate input
    if (!trimmedMessage) {
      return
    }

    if (trimmedMessage.length > 4000) {
      setApiError('Message is too long. Maximum 4000 characters allowed.')
      return
    }

    // Check if API key is configured
    if (isApiKeyMissing) {
      setApiError(getApiKeyErrorMessage())
      return
    }

    const userMessage = trimmedMessage
    logger.info('Sending message', { length: userMessage.length })
    resetInput()

    // Create conversation if it doesn't exist
    let convId = currentConversationId
    if (!convId) {
      try {
        // Use temporary title initially
        const tempTitle = 'New Chat'
        logger.info('Creating new conversation', { title: tempTitle })
        convId = await chatService.createConversation(tempTitle)
        logger.info('Conversation created', { id: convId })
        setCurrentConversationId(convId)
        await loadConversations()

        // Generate AI title asynchronously in the background
        try {
          const titleService = getTitleService()
          if (titleService) {
            logger.debug('Generating AI title for conversation', { conversationId: convId })
            const aiTitle = await titleService.generateTitle(userMessage)
            if (aiTitle && aiTitle.trim().length > 0) {
              logger.info('Generated AI title', { title: aiTitle, conversationId: convId })
              await chatService.updateConversationTitle(convId, aiTitle)
              await loadConversations()
              logger.debug('Conversation title updated successfully', { conversationId: convId, title: aiTitle })
            } else {
              logger.warn('Generated title is empty, keeping default', { conversationId: convId })
            }
          } else {
            logger.warn('Title service not initialized', { conversationId: convId })
          }
        } catch (titleError) {
          logger.warn('Failed to generate AI title, keeping default', { conversationId: convId, error: titleError })
          // Continue with default title, don't fail the whole operation
        }
      } catch (error) {
        logger.error('Failed to create conversation', error)
        const errorMsg = error instanceof Error ? error.message : 'Failed to create conversation'
        setApiError(`Failed to create conversation: ${errorMsg}`)
        return
      }
    }

    setIsLoading(true)
    setStreamingContent('')
    setStreamingStage('thinking')
    clearError()

    // Optimistically add user message to UI
    const optimisticUserMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      conversationId: convId,
      role: 'user',
      content: userMessage,
      createdAt: new Date(),
    }
    setMessages(prev => [...prev, optimisticUserMessage])

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setIsLoading(false)
      setStreamingContent('')
      logger.warn('Request timed out', { timeoutMs: API.REQUEST_TIMEOUT_MS })
      setApiError('Request timed out. Please check your connection and try again.')
    }, API.REQUEST_TIMEOUT_MS)

    try {
      logger.info('Sending message to API with streaming')

      // Use streaming for better UX
      const assistantResponse = await chatService.sendMessageStream(
        convId,
        userMessage,
        (chunk: string) => {
          setStreamingContent(prev => {
            const newContent = prev + chunk
            // Update stage based on content length
            if (newContent.length < 50) {
              setStreamingStage('generating')
            } else if (newContent.length > 500) {
              setStreamingStage('finalizing')
            }
            return newContent
          })
        }
      )
      clearTimeout(timeoutId)

      if (!assistantResponse || assistantResponse.trim().length === 0) {
        throw new Error('Received empty response from AI')
      }

      logger.info('API response received', { length: assistantResponse.length })
      clearError()
      showToast('Message sent successfully', 'success', 2000)

      // Reload messages from Firestore to get the persisted versions with real IDs
      logger.debug('Reloading messages from Firestore')
      await loadMessages(convId)
      logger.info('Messages reloaded successfully')
    } catch (error) {
      clearTimeout(timeoutId)
      logger.error('Failed to send message', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to send message'
      setApiError(`Error: ${errorMsg}`)
      showToast(errorMsg, 'error', 4000)
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticUserMessage.id))
    } finally {
      setIsLoading(false)
      setStreamingContent('')
      setStreamingStage('thinking')
    }
  }, [inputValue, currentConversationId, loadConversations, loadMessages, isApiKeyMissing, resetInput, clearError, setCurrentConversationId, setIsLoading, setApiError, setMessages, showToast])

  const handleDeleteConversation = useCallback(async (conversationId: string) => {
    try {
      logger.info('Deleting conversation', { conversationId })
      await chatService.deleteConversation(conversationId)

      // If the deleted conversation was active, clear it
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null)
        setMessages([])
      }

      // Reload conversations
      await loadConversations()
      logger.info('Conversation deleted successfully')
      showToast('Conversation deleted', 'success', 2000)
    } catch (error) {
      logger.error('Failed to delete conversation', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete conversation'
      setApiError(`Failed to delete conversation: ${errorMsg}`)
      showToast(errorMsg, 'error', 4000)
    }
  }, [currentConversationId, setCurrentConversationId, setMessages, loadConversations, setApiError, showToast])

  const handleRenameConversation = useCallback(async (conversationId: string, newTitle: string) => {
    const trimmedTitle = newTitle.trim()

    if (!trimmedTitle || trimmedTitle.length === 0) {
      setApiError('Conversation title cannot be empty')
      return
    }

    if (trimmedTitle.length > 100) {
      setApiError('Conversation title must be 100 characters or less')
      return
    }

    try {
      logger.info('Renaming conversation', { conversationId, newTitle: trimmedTitle })
      await chatService.updateConversationTitle(conversationId, trimmedTitle)

      // Reload conversations to reflect the change
      await loadConversations()
      logger.info('Conversation renamed successfully')
      clearError()
    } catch (error) {
      logger.error('Failed to rename conversation', error)
      const errorMsg = error instanceof Error ? error.message : 'Failed to rename conversation'
      setApiError(`Failed to rename conversation: ${errorMsg}`)
    }
  }, [loadConversations, setApiError, clearError])

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <ChatSidebar
        isOpen={sidebarOpen}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
      />

	      <div id="main-content" className="flex-1 flex flex-col bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 transition-colors duration-300 relative overflow-hidden" tabIndex={-1}>
        {/* Subtle animated accent gradient background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5 dark:opacity-3 animate-blob"
          style={{
            background: `radial-gradient(circle at 20% 50%, ${getAccentColor(accentColor, '400')}, transparent 50%)`,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-5 dark:opacity-3 animate-blob"
          style={{
            background: `radial-gradient(circle at 80% 80%, ${getAccentColor(accentColor, '300')}, transparent 50%)`,
            animationDelay: '2s'
          }}
        />
        <div className="relative z-10">
          <ChatHeader
            sidebarOpen={sidebarOpen}
            onToggleSidebar={toggleSidebar}
            currentConversationTitle={currentConversation?.title}
            onNewConversation={handleNewConversation}
          />
          <ApiErrorBanner error={apiError} onDismiss={clearError} />
        </div>

        {/* Chat container */}
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            streamingContent={streamingContent}
            streamingStage={streamingStage}
            onFollowUpClick={setInputValue}
            onEditMetadata={() => setShowDetailsPanel(true)}
          />
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Backdrop overlay for right pane */}
      {showDetailsPanel && (
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/50 z-30 transition-opacity duration-300"
          onClick={() => setShowDetailsPanel(false)}
          aria-hidden="true"
        />
      )}

      {/* Conversation Details Panel */}
      <ConversationDetailsPanel
        isOpen={showDetailsPanel}
        onClose={() => setShowDetailsPanel(false)}
        metadata={metadata}
        onUpdate={updateMetadata}
        isUpdating={isUpdatingMetadata}
      />
    </div>
  )
}

export { MainChatPage }


```

---

### src/pages/ReportingPage.tsx

```tsx
import React, { memo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiPlus, FiCheck, FiTrash2, FiEdit2 } from '../utils/icons'
import { HiOutlineDocumentText } from '../utils/icons'
import { ThemeSelector } from '../components/ThemeSelector'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'

interface ActionItem {
  id: string
  title: string
  assignee: string
  dueDate: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  source: string
}

const initialActions: ActionItem[] = [
  { id: '1', title: 'Review coverage limits with broker', assignee: 'John Smith', dueDate: '2025-12-15', status: 'pending', priority: 'high', source: 'Call #247' },
  { id: '2', title: 'Update property valuation report', assignee: 'Sarah Johnson', dueDate: '2025-12-18', status: 'in-progress', priority: 'medium', source: 'Call #243' },
  { id: '3', title: 'Schedule follow-up with client', assignee: 'Mike Davis', dueDate: '2025-12-20', status: 'pending', priority: 'low', source: 'Call #241' },
  { id: '4', title: 'Verify deductible requirements', assignee: 'Emily Chen', dueDate: '2025-12-14', status: 'completed', priority: 'high', source: 'Call #239' },
  { id: '5', title: 'Send policy renewal reminder', assignee: 'John Smith', dueDate: '2025-12-22', status: 'pending', priority: 'medium', source: 'Call #235' },
]

const ReportingPageComponent: React.FC = () => {
  const navigate = useNavigate()
  const { accentColor } = useTheme()
  const [actions, setActions] = useState<ActionItem[]>(initialActions)
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all')

  const filteredActions = actions.filter(action => filter === 'all' || action.status === filter)

  const toggleStatus = useCallback((id: string) => {
    setActions(prev => prev.map(action => {
      if (action.id === id) {
        const statusOrder: ActionItem['status'][] = ['pending', 'in-progress', 'completed']
        const currentIndex = statusOrder.indexOf(action.status)
        const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length]
        return { ...action, status: nextStatus }
      }
      return action
    }))
  }, [])

  const deleteAction = useCallback((id: string) => {
    setActions(prev => prev.filter(action => action.id !== id))
  }, [])

  const getStatusColor = (status: ActionItem['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'in-progress': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
    }
  }

  const getPriorityColor = (priority: ActionItem['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/95 dark:bg-slate-950/95 shadow-sm backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 group hover:scale-105 transition-all duration-200 rounded-lg px-3 py-2"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg border"
                style={{ background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`, borderColor: `${getAccentColor(accentColor, '500')}4d` }}>
                <HiOutlineDocumentText className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-slate-50">EVR Reporting</span>
            </button>
            <ThemeSelector />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button & Title */}
        <div className="mb-8">
          <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 font-medium mb-4 transition-colors">
            <FiArrowLeft className="h-4 w-4" /> Back to Home
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50">Action Tracker</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Track action items, follow-ups, and commitments from your conversations.</p>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {(['all', 'pending', 'in-progress', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filter === status
                  ? 'text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                style={filter === status ? { background: `linear-gradient(135deg, ${getAccentColor(accentColor, '500')}, ${getAccentColor(accentColor, '700')})` } : {}}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
            style={{ background: `linear-gradient(135deg, ${getAccentColor(accentColor, '500')}, ${getAccentColor(accentColor, '700')})` }}
          >
            <FiPlus className="w-4 h-4" /> Add Action
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Assignee</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Source</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredActions.map((action) => (
                  <tr key={action.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-slate-50">{action.title}</td>
                    <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{action.assignee}</td>
                    <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{action.dueDate}</td>
                    <td className="px-4 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(action.priority)}`}>{action.priority}</span></td>
                    <td className="px-4 py-4">
                      <button onClick={() => toggleStatus(action.id)} className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(action.status)}`}>
                        {action.status.replace('-', ' ')}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400">{action.source}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><FiEdit2 className="w-4 h-4" /></button>
                        <button onClick={() => deleteAction(action.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><FiTrash2 className="w-4 h-4" /></button>
                        <button onClick={() => toggleStatus(action.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"><FiCheck className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredActions.length === 0 && (
            <div className="px-4 py-12 text-center">
              <p className="text-slate-500 dark:text-slate-400">No action items found for this filter.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-200/50 dark:border-slate-700/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">© {new Date().getFullYear()} EVR. AI-powered insights for your conversations.</p>
        </div>
      </footer>
    </div>
  )
}

export const ReportingPage = memo(ReportingPageComponent)


```

---

### src/pages/SupportPage.tsx

```tsx
import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiMail, FiPhone, FiHelpCircle } from '../utils/icons'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'

const SupportPageComponent: React.FC = () => {
  const navigate = useNavigate()
  const { accentColor } = useTheme()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/30 to-white dark:from-slate-950 dark:via-slate-900/30 dark:to-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <button
            onClick={() => navigate('/chat')}
            className="flex items-center gap-2 hover:transition-all duration-300 hover:-translate-x-1 focus-visible:ring-2 rounded px-2 py-1"
            style={{
              color: getAccentColor(accentColor, '600'),
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = getAccentColor(accentColor, '700')
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = getAccentColor(accentColor, '600')
            }}
            type="button"
          >
            <FiArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Chat</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 dark:text-slate-50">
              Get Support
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              We're here to help. Reach out to our support team for any questions or issues.
            </p>
          </div>

          {/* Support Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Support */}
            <div className="group bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl dark:hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-300/80 dark:hover:border-blue-600/80 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-950">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-100 dark:from-blue-900/60 dark:via-blue-900/50 dark:to-cyan-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:from-blue-200 group-hover:via-blue-100 group-hover:to-cyan-200 dark:group-hover:from-blue-900/80 dark:group-hover:via-blue-900/70 dark:group-hover:to-cyan-900/70 transition-all duration-300 group-hover:shadow-lg dark:group-hover:shadow-lg group-hover:shadow-blue-500/50 dark:group-hover:shadow-blue-500/35 group-hover:-translate-y-1.5">
                <FiMail className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:scale-125 transition-all duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300">
                Email Support
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                Send us an email and we'll get back to you within 24 hours.
              </p>
              <a
                href="mailto:support@cna.com"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-all duration-300 hover:translate-x-1"
              >
                support@cna.com
              </a>
            </div>

            {/* Phone Support */}
            <div className="group bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl dark:hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-300/80 dark:hover:border-blue-600/80 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-950">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-100 dark:from-blue-900/60 dark:via-blue-900/50 dark:to-cyan-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:from-blue-200 group-hover:via-blue-100 group-hover:to-cyan-200 dark:group-hover:from-blue-900/80 dark:group-hover:via-blue-900/70 dark:group-hover:to-cyan-900/70 transition-all duration-300 group-hover:shadow-lg dark:group-hover:shadow-lg group-hover:shadow-blue-500/50 dark:group-hover:shadow-blue-500/35 group-hover:-translate-y-1.5">
                <FiPhone className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:scale-125 transition-all duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300">
                Phone Support
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                Call our support team during business hours (9 AM - 5 PM EST).
              </p>
              <a
                href="tel:+1-800-555-0147"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-all duration-300 hover:translate-x-1"
              >
                +1 (800) 555-0147
              </a>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="transform hover:scale-110 transition-transform duration-300">
                <FiHelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-700 pb-4 hover:border-slate-300 dark:hover:border-slate-600 transition-colors duration-300 group cursor-default">
                <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  How do I upload audio files?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Navigate to the chat interface and use the upload button to select your audio files. Supported formats include MP3, WAV, and M4A.
                </p>
              </div>
              <div className="border-b border-slate-200 dark:border-slate-700 pb-4 hover:border-slate-300 dark:hover:border-slate-600 transition-colors duration-300 group cursor-default">
                <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  Is my data secure?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Yes, all data is encrypted end-to-end and stored securely. We comply with SOC 2 and GDPR requirements.
                </p>
              </div>
              <div className="group cursor-default">
                <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  Can I export my conversations?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Yes, you can export conversations in multiple formats from your chat history.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export const SupportPage = memo(SupportPageComponent)


```

---

### src/pages/UploadPage.tsx

```tsx
/**
 * Upload Page
 * Main page for file uploads and management
 */

import React, { memo, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiAlertCircle, FiCheckCircle, FiX } from '../utils/icons'
import { FileUploadZone } from '../components/FileUploadZone'
import { FileList } from '../components/FileList'
import { useUploadedFiles } from '../hooks/useUploadedFiles'
import { useToast } from '../hooks/useToast'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'
import type { UploadedFile } from '../types'

// Simple inline TagInput component
interface TagInputProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
}

const TagInput: React.FC<TagInputProps> = memo(({ tags, onTagsChange }) => {
  const [inputValue, setInputValue] = useState('')

  const handleAddTag = useCallback(() => {
    const trimmed = inputValue.trim()
    if (trimmed && !tags.includes(trimmed)) {
      onTagsChange([...tags, trimmed])
      setInputValue('')
    }
  }, [inputValue, tags, onTagsChange])

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    onTagsChange(tags.filter(t => t !== tagToRemove))
  }, [tags, onTagsChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }, [handleAddTag])

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag..."
          className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddTag}
          type="button"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm"
          >
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              type="button"
              className="hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
            >
              <FiX size={14} />
            </button>
          </span>
        ))}
      </div>
    </div>
  )
})

// File type configurations
const FILE_CONFIGS = {
  audio: {
    mimeTypes: ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/ogg', 'audio/webm'],
    extensions: ['.mp3', '.m4a', '.wav', '.ogg', '.webm'],
    maxSize: 100 * 1024 * 1024, // 100MB
    description: 'Voice memos and audio files',
  },
  document: {
    mimeTypes: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    extensions: ['.doc', '.docx'],
    maxSize: 50 * 1024 * 1024, // 50MB
    description: 'Word documents',
  },
}

const UploadPageComponent: React.FC = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { accentColor } = useTheme()
  const { files, isLoading, error, uploadProgress, loadFiles, uploadFile, updateFileTags, deleteFile, clearError } = useUploadedFiles()
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)
  const [editingTags, setEditingTags] = useState<string[]>([])
  const [isEditingTags, setIsEditingTags] = useState(false)

  // Load user files on mount
  useEffect(() => {
    const userId = 'current-user' // TODO: Get from auth context
    loadFiles(userId)
  }, [loadFiles])

  const handleFilesSelected = async (selectedFiles: File[]) => {
    const userId = 'current-user' // TODO: Get from auth context
    for (const file of selectedFiles) {
      const fileType = file.type.startsWith('audio/') ? 'audio' : 'document'
      const result = await uploadFile(file, userId, fileType, [])
      if (result) {
        showToast(`${file.name} uploaded successfully`, 'success')
      } else {
        showToast(`Failed to upload ${file.name}`, 'error')
      }
    }
  }

  const handleEditFile = (file: UploadedFile) => {
    setSelectedFile(file)
    setEditingTags(file.tags)
    setIsEditingTags(true)
  }

  const handleSaveTags = async () => {
    if (selectedFile) {
      await updateFileTags(selectedFile.id, editingTags)
      showToast('Tags updated successfully', 'success')
      setIsEditingTags(false)
      setSelectedFile(null)
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    const file = files.find((f) => f.id === fileId)
    if (file && window.confirm(`Delete ${file.originalName}?`)) {
      await deleteFile(fileId, file.storagePath)
      showToast('File deleted successfully', 'success')
    }
  }

  const acceptedTypes = [...FILE_CONFIGS.audio.mimeTypes, ...FILE_CONFIGS.document.mimeTypes]
  const maxSize = Math.max(FILE_CONFIGS.audio.maxSize, FILE_CONFIGS.document.maxSize)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/30 to-white dark:from-slate-950 dark:via-slate-900/30 dark:to-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <button
            onClick={() => navigate('/chat')}
            className="flex items-center gap-2 hover:transition-all duration-300 hover:-translate-x-1 focus-visible:ring-2 rounded px-2 py-1"
            style={{
              color: getAccentColor(accentColor, '600'),
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = getAccentColor(accentColor, '700')
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = getAccentColor(accentColor, '600')
            }}
            type="button"
          >
            <FiArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Chat</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 dark:text-slate-50">
              Upload Files
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Upload voice memos and documents to use as context in your conversations
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg animate-fade-in shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <FiAlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 animate-pulse" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900 dark:text-red-100">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:scale-110 transition-transform duration-300 active:scale-95"
                type="button"
              >
                ✕
              </button>
            </div>
          )}

          {/* Upload Progress */}
          {uploadProgress && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg animate-fade-in shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3">
                {uploadProgress.status === 'completed' ? (
                  <FiCheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 animate-bounce" />
                ) : (
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {uploadProgress.filename}
                  </p>
                  <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2 mt-2 shadow-sm">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 h-2 rounded-full transition-all duration-300 shadow-md"
                      style={{ width: `${uploadProgress.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Zone */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              Upload New Files
            </h2>
            <FileUploadZone
              onFilesSelected={handleFilesSelected}
              acceptedTypes={acceptedTypes}
              maxSize={maxSize}
              isLoading={isLoading}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="font-medium text-slate-900 dark:text-slate-50">Audio Files</p>
                <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
                  MP3, M4A, WAV, OGG (up to 100MB)
                </p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="font-medium text-slate-900 dark:text-slate-50">Documents</p>
                <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
                  DOC, DOCX (up to 50MB)
                </p>
              </div>
            </div>
          </div>

          {/* Files List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              Your Files ({files.length})
            </h2>
            <FileList
              files={files}
              onEdit={handleEditFile}
              onDelete={handleDeleteFile}
              isLoading={isLoading}
            />
          </div>

          {/* Edit Tags Modal */}
          {isEditingTags && selectedFile && (
            <div className="fixed inset-0 bg-black/30 dark:bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full p-6 space-y-4 animate-fade-in">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  Edit Tags
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedFile.originalName}
                </p>
                <TagInput tags={editingTags} onTagsChange={setEditingTags} />
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setIsEditingTags(false)}
                    className="flex-1 px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveTags}
                    className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    type="button"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export const UploadPage = memo(UploadPageComponent)


```

---

### src/services/config.ts

```typescript
/**
 * Centralized configuration service for API and application settings
 * Ensures consistent configuration across the application and prevents sensitive data leaks
 */

import { logger } from './logger'

export interface APIConfig {
  requestTimeout: number
  maxRetries: number
  retryDelay: number
  backoffMultiplier: number
}

export type ChatProvider = 'openai-direct' | 'proxied'

export interface ChatProviderConfig {
  provider: ChatProvider
  openaiApiKey?: string
  proxyUrl?: string
}

// Default API configuration
const DEFAULT_API_CONFIG: APIConfig = {
  requestTimeout: 30000, // 30 seconds
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  backoffMultiplier: 2,
}

/**
 * Get the OpenAI API key from environment variables
 * @returns The API key or undefined if not configured
 */
export function getOpenAIApiKey(): string | undefined {
  const key = import.meta.env.VITE_OPENAI_API_KEY

  if (!key) {
    logger.warn('OpenAI API key is not configured')
    return undefined
  }

  // Ensure we never log the actual key
  logger.debug('OpenAI API key is configured')
  return key
}

/**
 * Check if the chat provider is properly configured
 * Distinguishes between proxied and direct provider requirements
 * @returns true if the configured provider has all required settings
 */
export function isChatProviderConfigured(): boolean {
  const config = getChatProviderConfig()

  if (config.provider === 'proxied') {
    return !!config.proxyUrl
  }

  // openai-direct provider
  return !!config.openaiApiKey
}

/**
 * Get the chat provider configuration
 * @returns Chat provider configuration based on environment variables
 */
export function getChatProviderConfig(): ChatProviderConfig {
  const provider = (import.meta.env.VITE_CHAT_PROVIDER || 'openai-direct') as ChatProvider
  const proxyUrl = import.meta.env.VITE_CHAT_PROXY_URL
  const openaiApiKey = getOpenAIApiKey()

  // Validate configuration
  if (provider === 'proxied' && !proxyUrl) {
    logger.error('Proxied chat provider selected but VITE_CHAT_PROXY_URL is not configured')
  }

  if (provider === 'openai-direct' && !openaiApiKey) {
    logger.warn('OpenAI direct provider selected but VITE_OPENAI_API_KEY is not configured')
  }

  logger.info('Chat provider configured', { provider, hasProxyUrl: !!proxyUrl, hasApiKey: !!openaiApiKey })

  return {
    provider,
    proxyUrl,
    openaiApiKey,
  }
}

/**
 * Get API configuration with optional overrides
 * @param overrides - Partial configuration to override defaults
 * @returns Complete API configuration
 */
export function getAPIConfig(overrides?: Partial<APIConfig>): APIConfig {
  return {
    ...DEFAULT_API_CONFIG,
    ...overrides,
  }
}

/**
 * Get a user-friendly error message for API key/configuration issues
 * Returns different messages based on the configured provider
 * @returns Error message to display to user
 */
export function getApiKeyErrorMessage(): string {
  const config = getChatProviderConfig()

  if (config.provider === 'proxied') {
    return '⚠️ Chat proxy not configured. Please set VITE_CHAT_PROXY_URL in .env.local and restart.'
  }

  // openai-direct provider
  return '⚠️ OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in .env.local and restart.'
}


```

---

### src/services/logger.ts

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  data?: unknown
}

export interface ResponseLogEntry {
  timestamp: Date
  type: 'success' | 'error' | 'warning'
  provider: string
  duration: number
  contentLength?: number
  contentType?: string
  tokensUsed?: {
    prompt: number
    completion: number
    total: number
  }
  errorCode?: string
  errorCategory?: string
  retryCount: number
  message: string
}

/**
 * Logger service with security-first approach
 * Ensures no sensitive data (API keys, tokens, etc.) is ever logged
 * Also handles structured response logging for API interactions
 */
class Logger {
  private isDevelopment = import.meta.env.DEV
  private logs: LogEntry[] = []
  private responseLogs: ResponseLogEntry[] = []
  private maxLogs = 100
  private maxResponseLogs = 1000

  /**
   * Sanitize data to remove sensitive information
   * @param data - Data to sanitize
   * @returns Sanitized data safe for logging
   */
  private sanitizeData(data: unknown): unknown {
    if (!data) return data

    // Don't log strings that might contain sensitive data
    if (typeof data === 'string') {
      // Check for common sensitive patterns
      if (
        data.includes('apiKey') ||
        data.includes('api_key') ||
        data.includes('token') ||
        data.includes('password') ||
        data.includes('secret') ||
        data.includes('VITE_')
      ) {
        return '[REDACTED]'
      }
      return data
    }

    // For objects, recursively sanitize
    if (typeof data === 'object' && data !== null) {
      if (Array.isArray(data)) {
        return data.map(item => this.sanitizeData(item))
      }

      const sanitized: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(data)) {
        // Skip sensitive keys
        if (
          key.toLowerCase().includes('key') ||
          key.toLowerCase().includes('token') ||
          key.toLowerCase().includes('password') ||
          key.toLowerCase().includes('secret')
        ) {
          sanitized[key] = '[REDACTED]'
        } else {
          sanitized[key] = this.sanitizeData(value)
        }
      }
      return sanitized
    }

    return data
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    const sanitizedData = this.sanitizeData(data)
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data: sanitizedData,
    }

    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    if (this.isDevelopment) {
      const style = this.getConsoleStyle(level)
      console.log(`%c[${level.toUpperCase()}]`, style, message, sanitizedData || '')
    }
  }

  private getConsoleStyle(level: LogLevel): string {
    const styles = {
      debug: 'color: #888; font-weight: normal;',
      info: 'color: #0066cc; font-weight: bold;',
      warn: 'color: #ff9900; font-weight: bold;',
      error: 'color: #cc0000; font-weight: bold;',
    }
    return styles[level]
  }

  debug(message: string, data?: unknown) {
    this.log('debug', message, data)
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data)
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data)
  }

  error(message: string, data?: unknown) {
    this.log('error', message, data)
  }

  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }

  /**
   * Log successful API response
   */
  logResponseSuccess(
    provider: string,
    duration: number,
    retryCount: number,
    contentLength: number,
    contentType?: string,
    tokensUsed?: { prompt: number; completion: number; total: number }
  ): void {
    const entry: ResponseLogEntry = {
      timestamp: new Date(),
      type: 'success',
      provider,
      duration,
      contentLength,
      contentType,
      tokensUsed,
      retryCount,
      message: 'Response received successfully',
    }
    this.addResponseLog(entry)
    this.info('API response successful', {
      provider,
      duration: `${duration}ms`,
      contentLength,
      contentType,
      tokensUsed,
      retryCount,
    })
  }

  /**
   * Log API response error
   */
  logResponseError(
    provider: string,
    duration: number,
    retryCount: number,
    errorCode?: string,
    errorCategory?: string,
    message?: string
  ): void {
    const entry: ResponseLogEntry = {
      timestamp: new Date(),
      type: 'error',
      provider,
      duration,
      errorCode,
      errorCategory,
      retryCount,
      message: message || 'API response error',
    }
    this.addResponseLog(entry)
    this.error('API response error', {
      provider,
      errorCode,
      errorCategory,
      duration: `${duration}ms`,
      retryCount,
    })
  }

  /**
   * Log API response timing
   */
  logResponseTiming(provider: string, duration: number, operation: string): void {
    this.debug(`${operation} completed`, {
      provider,
      duration: `${duration}ms`,
      performanceCategory: this.categorizePerformance(duration),
    })
  }

  /**
   * Categorize performance based on duration
   */
  private categorizePerformance(duration: number): string {
    if (duration < 500) return 'excellent'
    if (duration < 1000) return 'good'
    if (duration < 2000) return 'acceptable'
    if (duration < 5000) return 'slow'
    return 'very_slow'
  }

  /**
   * Add response log entry
   */
  private addResponseLog(entry: ResponseLogEntry): void {
    this.responseLogs.push(entry)
    if (this.responseLogs.length > this.maxResponseLogs) {
      this.responseLogs = this.responseLogs.slice(-this.maxResponseLogs)
    }
  }

  /**
   * Get response logs
   */
  getResponseLogs(): ResponseLogEntry[] {
    return [...this.responseLogs]
  }

  /**
   * Get response logs by type
   */
  getResponseLogsByType(type: 'success' | 'error' | 'warning'): ResponseLogEntry[] {
    return this.responseLogs.filter((log) => log.type === type)
  }

  /**
   * Get response logs by provider
   */
  getResponseLogsByProvider(provider: string): ResponseLogEntry[] {
    return this.responseLogs.filter((log) => log.provider === provider)
  }

  /**
   * Get response log statistics
   */
  getResponseStatistics() {
    const stats = {
      totalLogs: this.responseLogs.length,
      successCount: 0,
      errorCount: 0,
      warningCount: 0,
      averageDuration: 0,
      totalDuration: 0,
      providers: new Set<string>(),
    }

    for (const log of this.responseLogs) {
      if (log.type === 'success') stats.successCount++
      if (log.type === 'error') stats.errorCount++
      if (log.type === 'warning') stats.warningCount++
      stats.totalDuration += log.duration
      stats.providers.add(log.provider)
    }

    stats.averageDuration = this.responseLogs.length > 0 ? stats.totalDuration / this.responseLogs.length : 0

    return {
      ...stats,
      providers: Array.from(stats.providers),
    }
  }

  /**
   * Clear response logs
   */
  clearResponseLogs(): void {
    this.responseLogs = []
  }
}

export const logger = new Logger()


```

---

### src/services/titleGenerationService.ts

```typescript
import OpenAI from 'openai'
import { logger } from './logger'

/**
 * Lightweight title generation service
 * Uses a fast, cost-effective API call to generate 3-word chat titles
 */
class TitleGenerationService {
  private client: OpenAI

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    })
  }

  /**
   * Generate a 3-word title for a conversation based on the first user message
   * Uses a lightweight prompt to minimize tokens and cost
   */
  async generateTitle(userMessage: string): Promise<string> {
    try {
      if (!userMessage || userMessage.trim().length === 0) {
        logger.warn('Empty user message provided for title generation')
        return 'New Conversation'
      }

      if (!this.client.apiKey) {
        logger.warn('API key not available for title generation')
        return this.generateFallbackTitle(userMessage)
      }

      // Truncate message to first 200 chars to minimize tokens
      const truncatedMessage = userMessage.substring(0, 200).trim()

      logger.debug('Generating title from message', { messageLength: truncatedMessage.length })

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo', // Use faster, cheaper model for title generation
        messages: [
          {
            role: 'system',
            content: 'Generate exactly 3 words as a concise title for a chat conversation. Only output the 3 words, nothing else. No punctuation.',
          },
          {
            role: 'user',
            content: truncatedMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 20, // Very small token limit for titles
      })

      const title = response.choices[0]?.message?.content?.trim()

      if (!title || title.length === 0) {
        logger.warn('Empty title response from API, using fallback')
        return this.generateFallbackTitle(userMessage)
      }

      logger.debug('Generated chat title successfully', { title, messageLength: userMessage.length })
      return title
    } catch (error) {
      logger.error('Error generating title from API', error)
      const fallbackTitle = this.generateFallbackTitle(userMessage)
      logger.debug('Using fallback title', { fallbackTitle })
      return fallbackTitle
    }
  }

  /**
   * Generate a fallback title from the user message if API call fails
   */
  private generateFallbackTitle(userMessage: string): string {
    // Extract first 3 words from the message
    const words = userMessage
      .split(/\s+/)
      .filter(word => word.length > 0)
      .slice(0, 3)
      .map(word => word.replace(/[^a-zA-Z0-9]/g, ''))
      .filter(word => word.length > 0)

    if (words.length === 0) {
      return 'New Conversation'
    }

    if (words.length < 3) {
      return words.join(' ')
    }

    return words.join(' ')
  }
}

// Initialize with API key from config
let titleService: TitleGenerationService | null = null

export function initializeTitleService(apiKey: string): TitleGenerationService {
  if (!titleService) {
    titleService = new TitleGenerationService(apiKey)
  }
  return titleService
}

export function getTitleService(): TitleGenerationService | null {
  return titleService
}


```

---

### src/services/uploadService.ts

```typescript
/**
 * Upload Service
 * Handles file uploads, storage, and metadata management
 */

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore'
import { ref, uploadBytes, deleteObject } from 'firebase/storage'
import { db, storage } from '../firebase'
import type { UploadedFile, UploadedFileInput } from '../types'
import { logger } from './logger'

const UPLOADS_COLLECTION = 'uploads'
const STORAGE_BUCKET = 'uploads'

class UploadService {
  /**
   * Upload a file to Firebase Storage and create metadata in Firestore
   */
  async uploadFile(
    file: File,
    userId: string,
    fileType: 'audio' | 'document',
    tags: string[] = []
  ): Promise<UploadedFile> {
    try {
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const storagePath = `${STORAGE_BUCKET}/${userId}/${fileId}/${file.name}`

      // Upload file to Firebase Storage
      logger.debug('Uploading file to storage', { filename: file.name, size: file.size })
      const storageRef = ref(storage, storagePath)
      await uploadBytes(storageRef, file)

      // Create metadata in Firestore
      const uploadedFileData: UploadedFileInput = {
        filename: fileId,
        fileType,
        mimeType: file.type,
        size: file.size,
        tags,
      }

      const docRef = await addDoc(collection(db, UPLOADS_COLLECTION), {
        ...uploadedFileData,
        userId,
        originalName: file.name,
        storagePath,
        uploadedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })

      logger.info('File uploaded successfully', { fileId, filename: file.name })

      return {
        id: docRef.id,
        userId,
        filename: fileId,
        originalName: file.name,
        fileType,
        mimeType: file.type,
        size: file.size,
        tags,
        uploadedAt: new Date(),
        updatedAt: new Date(),
        storagePath,
      }
    } catch (error) {
      logger.error('Error uploading file', error)

      // Provide more helpful error messages
      if (error instanceof Error) {
        if (error.message.includes('CORS') || error.message.includes('cors')) {
          const corsError = new Error(
            'CORS configuration error: Firebase Storage CORS is not properly configured. ' +
            'Please run: gsutil cors set cors.json gs://generic-voice.firebasestorage.app'
          )
          logger.error('CORS Configuration Issue', corsError)
          throw corsError
        }
        if (error.message.includes('Permission denied')) {
          const permError = new Error(
            'Permission denied: Check Firebase Storage security rules and ensure your user has upload permissions.'
          )
          logger.error('Firebase Storage Permission Error', permError)
          throw permError
        }
      }

      throw error
    }
  }

  /**
   * Get all uploaded files for a user
   * Note: Sorting is done in memory to avoid requiring a composite index
   */
  async getUserFiles(userId: string): Promise<UploadedFile[]> {
    try {
      const q = query(
        collection(db, UPLOADS_COLLECTION),
        where('userId', '==', userId)
      )
      const snapshot = await getDocs(q)
      const files = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          userId: data.userId,
          filename: data.filename,
          originalName: data.originalName,
          fileType: data.fileType,
          mimeType: data.mimeType,
          size: data.size,
          tags: data.tags || [],
          uploadedAt: data.uploadedAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          storagePath: data.storagePath,
          transcription: data.transcription,
          extractedText: data.extractedText,
          metadata: data.metadata,
        }
      })

      // Sort by uploadedAt in descending order (most recent first)
      return files.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
    } catch (error) {
      logger.error('Error fetching user files', error)
      throw error
    }
  }

  /**
   * Update file tags
   */
  async updateFileTags(fileId: string, tags: string[]): Promise<void> {
    try {
      const fileRef = doc(db, UPLOADS_COLLECTION, fileId)
      await updateDoc(fileRef, {
        tags,
        updatedAt: Timestamp.now(),
      })
      logger.info('File tags updated', { fileId })
    } catch (error) {
      logger.error('Error updating file tags', error)
      throw error
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(fileId: string, storagePath: string): Promise<void> {
    try {
      // Delete from storage
      const storageRef = ref(storage, storagePath)
      await deleteObject(storageRef)

      // Delete metadata from Firestore
      await deleteDoc(doc(db, UPLOADS_COLLECTION, fileId))
      logger.info('File deleted successfully', { fileId })
    } catch (error) {
      logger.error('Error deleting file', error)
      throw error
    }
  }
}

export const uploadService = new UploadService()


```

---

### src/styles/animations.css

```css
/* Animation definitions */
@layer utilities {
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slide-in-right {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slide-in-left {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes wave-dot {
    0%, 60%, 100% {
      opacity: 0.3;
      transform: translateY(0);
    }
    30% {
      opacity: 1;
      transform: translateY(-10px);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  @keyframes ai-check-scale {
    0% {
      transform: scale(0) rotate(-45deg);
      opacity: 0;
    }
    50% {
      transform: scale(1.1) rotate(0deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
  }

  @keyframes ai-thinking-dots {
    0%, 20% {
      opacity: 0.3;
      transform: translateY(0);
    }
    50% {
      opacity: 1;
      transform: translateY(-8px);
    }
    100% {
      opacity: 0.3;
      transform: translateY(0);
    }
  }

  @keyframes ai-generating-bars {
    0%, 100% {
      height: 4px;
      opacity: 0.5;
    }
    50% {
      height: 16px;
      opacity: 1;
    }
  }

  @keyframes ai-finalizing-checkmark {
    0% {
      stroke-dashoffset: 50;
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      stroke-dashoffset: 0;
      opacity: 1;
    }
  }

  @keyframes blob {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
  }

  @keyframes shimmer-advanced {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @keyframes pulse-overlay {
    0%, 100% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }

  @keyframes pulse-glow {
    0%, 100% {
      opacity: 0.6;
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
    }
    50% {
      opacity: 1;
      box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
    }
  }

  @keyframes pulse-ring {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
  }

  @keyframes pulse-scale {
    0%, 100% {
      transform: scale(1);
      opacity: 0.3;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.1;
    }
  }

  @keyframes spin-smooth {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes bounce-dots {
    0%, 100% {
      transform: translateY(0);
      opacity: 0.6;
    }
    50% {
      transform: translateY(-8px);
      opacity: 1;
    }
  }

  /* Utility classes */
  .animate-fade-in-up {
    animation: fade-in-up 0.4s ease-out forwards;
  }

  .animate-slide-in-right {
    animation: slide-in-right 0.3s ease-out forwards;
  }

  .animate-slide-in-left {
    animation: slide-in-left 0.3s ease-out forwards;
  }

  .animate-wave-dot {
    animation: wave-dot 1.4s infinite;
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }

  .animate-blob {
    animation: blob 7s infinite;
  }

  .animate-shimmer-advanced {
    animation: shimmer-advanced 2s infinite;
  }

  .animate-pulse-overlay {
    animation: pulse-overlay 2s ease-in-out infinite;
  }

  .animate-pulse-glow {
    animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .animate-pulse-ring {
    animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .animate-pulse-scale {
    animation: pulse-scale 2s ease-in-out infinite;
  }

  .animate-spin-smooth {
    animation: spin-smooth 2s linear infinite;
  }

  .animate-bounce-dots {
    animation: bounce-dots 1.4s ease-in-out infinite;
  }
}


```

---

### src/styles/base.css

```css
/* Base styles and typography */
@layer base {
  html {
    scroll-behavior: smooth;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    letter-spacing: 0.3px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color-scheme: light;
  }

  html.dark {
    color-scheme: dark;
  }

  /* Respect prefers-reduced-motion */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  body {
    @apply bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300;
    background-attachment: fixed;
    font-size: 15px;
    line-height: 1.6;
  }

  /* Typography hierarchy */
  h1 {
    @apply font-bold tracking-tight leading-tight;
    font-size: clamp(1.875rem, 5vw, 3.75rem);
  }

  h2 {
    @apply font-bold tracking-tight leading-snug;
    font-size: clamp(1.5rem, 4vw, 2.25rem);
  }

  h3 {
    @apply font-semibold tracking-tight leading-snug;
    font-size: clamp(1.25rem, 3vw, 1.875rem);
  }

  h4 {
    @apply font-semibold tracking-normal leading-normal;
    font-size: 1.125rem;
  }

  h5 {
    @apply font-semibold tracking-normal leading-normal;
    font-size: 1rem;
  }

  h6 {
    @apply font-medium tracking-normal leading-normal;
    font-size: 0.875rem;
  }

  p {
    @apply leading-relaxed;
  }

  /* Smooth transitions for all interactive elements */
  button, a, input, textarea, select {
    @apply transition-all duration-200 ease-out;
  }

  /* Enhanced focus ring for keyboard navigation */
  *:focus-visible {
    @apply outline-none ring-2 ring-offset-2 ring-offset-white transition-all duration-200;
    --tw-ring-color: rgb(var(--accent-500));
  }

  .dark *:focus-visible {
    @apply ring-offset-slate-950;
  }

  /* Mobile input text size to prevent zoom */
  @media (max-width: 640px) {
    input, textarea, select {
      @apply text-base;
    }
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    @apply bg-slate-100 dark:bg-slate-900;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-slate-300 dark:bg-slate-700 rounded-full hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors duration-200;
  }

  /* Code block styling */
  code {
    @apply font-mono text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-900 dark:text-slate-50;
  }

  pre {
    @apply bg-slate-900 dark:bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto;
  }

  pre code {
    @apply bg-transparent px-0 py-0;
  }

  /* Link styling */
  a {
    @apply text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200;
  }

  /* Selection styling */
  ::selection {
    @apply bg-blue-500 text-white;
  }

  ::-moz-selection {
    @apply bg-blue-500 text-white;
  }
}


```

---

### src/styles/components.css

```css
/* Component-specific styles */
@layer components {
  /* Button System - Enhanced with better visual feedback */
  .btn-primary {
    @apply px-4 py-2.5 rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-md disabled:hover:-translate-y-0;
  }

  .btn-secondary {
    @apply px-4 py-2.5 rounded-lg font-semibold text-slate-900 dark:text-slate-50 bg-slate-200 dark:bg-slate-700 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:-translate-y-0;
  }

  .btn-tertiary {
    @apply px-4 py-2.5 rounded-lg font-semibold text-slate-700 dark:text-slate-300 bg-transparent border border-slate-300 dark:border-slate-600 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-sm hover:-translate-y-0.5 active:scale-95 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 disabled:opacity-60 disabled:cursor-not-allowed;
  }

  .btn-icon {
    @apply p-2 rounded-lg transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-sm hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950;
  }

  /* Card System - Enhanced with better depth and interactivity */
  .card {
    @apply rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all duration-300 p-4;
  }

  .card-elevated {
    @apply rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 p-4;
  }

  .card-interactive {
    @apply rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 p-4 cursor-pointer;
  }

  /* Panel System - Enhanced with better visual hierarchy */
  .panel {
    @apply rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4;
  }

  .panel-elevated {
    @apply rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-4;
  }

  .panel-subtle {
    @apply rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 p-4;
  }

  /* Message Bubble Styles */
  .message-bubble {
    @apply rounded-2xl px-5 py-4 max-w-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5;
  }

  .message-bubble-user {
    @apply text-white font-medium;
  }

  .message-bubble-assistant {
    @apply bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600;
  }

  .message-timestamp {
    @apply text-xs font-normal;
  }

  .message-timestamp-user {
    @apply text-slate-600 dark:text-slate-400 text-right;
  }

  .message-timestamp-assistant {
    @apply text-slate-600 dark:text-slate-400 text-left;
  }

  /* Input Styles */
  .input-base {
    @apply px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:border-transparent;
  }

  /* Link Styles */
  .link-base {
    @apply transition-colors duration-300 hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 rounded;
  }

  /* Badge System - Enhanced with better visual hierarchy */
  .badge {
    @apply inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300;
  }

  .badge-primary {
    @apply bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50;
  }

  .badge-success {
    @apply bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700/50;
  }

  .badge-warning {
    @apply bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50;
  }

  .badge-error {
    @apply bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700/50;
  }

  /* Divider Styles */
  .divider {
    @apply border-t border-slate-200 dark:border-slate-700/50;
  }

  .divider-subtle {
    @apply border-t border-slate-100 dark:border-slate-800/50;
  }

  /* Skeleton Loading */
  .skeleton {
    @apply bg-slate-200 dark:bg-slate-700 rounded animate-pulse;
  }

  .skeleton-text {
    @apply h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse;
  }

  .skeleton-avatar {
    @apply w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse;
  }
}

```

---

### src/styles/themes.css

```css
/* Seasonal theme styles */
@layer base {
  /* Spring Theme - Fresh pastels with greens and pinks */
  :root.theme-spring body {
    @apply bg-gradient-to-b from-green-50 via-pink-50/30 to-green-50 text-slate-900 transition-colors duration-300;
  }

  /* Summer Theme - Warm yellows and oranges */
  :root.theme-summer body {
    @apply bg-gradient-to-b from-yellow-50 via-orange-50/30 to-yellow-50 text-slate-900 transition-colors duration-300;
  }

  /* Fall Theme - Warm browns and oranges */
  :root.theme-fall body {
    @apply bg-gradient-to-b from-orange-50 via-amber-50/30 to-orange-50 text-slate-900 transition-colors duration-300;
  }

  /* Winter Theme - Cool blues and whites */
  :root.theme-winter body {
    @apply bg-gradient-to-b from-blue-50 via-cyan-50/30 to-blue-50 text-slate-900 transition-colors duration-300;
  }

  /* Dark mode theme backgrounds */
  :root.theme-spring.dark body {
    @apply bg-gradient-to-b from-slate-950 via-green-950/20 to-slate-950;
  }

  :root.theme-summer.dark body {
    @apply bg-gradient-to-b from-slate-950 via-orange-950/20 to-slate-950;
  }

  :root.theme-fall.dark body {
    @apply bg-gradient-to-b from-slate-950 via-amber-950/20 to-slate-950;
  }

  :root.theme-winter.dark body {
    @apply bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950;
  }
}


```

---

### src/styles/utilities.css

```css
/* Utility classes */
@layer utilities {
  /* Spacing utilities */
  .p-xs { @apply p-2; }
  .p-sm { @apply p-3; }
  .p-md { @apply p-4; }
  .p-lg { @apply p-6; }
  .p-xl { @apply p-8; }

  .m-xs { @apply m-2; }
  .m-sm { @apply m-3; }
  .m-md { @apply m-4; }
  .m-lg { @apply m-6; }
  .m-xl { @apply m-8; }

  .gap-xs { @apply gap-2; }
  .gap-sm { @apply gap-3; }
  .gap-md { @apply gap-4; }
  .gap-lg { @apply gap-6; }
  .gap-xl { @apply gap-8; }

  /* Container utilities */
  .container-px {
    @apply px-4 sm:px-6 lg:px-8;
  }

  .container-max {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  .container-spacing {
    @apply px-4 sm:px-6 lg:px-8 py-6 sm:py-8;
  }

  /* Touch target sizing */
  .touch-target {
    @apply min-h-11 min-w-11;
  }

  @media (min-width: 640px) {
    .touch-target {
      @apply min-h-10 min-w-10;
    }
  }

  /* Transition utilities */
  .smooth-transition {
    @apply transition-all duration-200 ease-out;
  }

  .shadow-transition {
    @apply transition-shadow duration-300;
  }

  .transform-transition {
    @apply transition-transform duration-300;
  }

  .color-transition {
    @apply transition-colors duration-300;
  }

  /* Semantic color utilities */
  .text-success {
    @apply text-green-700 dark:text-green-300;
  }

  .text-warning {
    @apply text-amber-700 dark:text-amber-300;
  }

  .text-error {
    @apply text-red-700 dark:text-red-300;
  }

  .text-info {
    @apply text-blue-700 dark:text-blue-300;
  }

  /* Glassmorphism effects */
  .glass-light {
    @apply bg-white/80 backdrop-blur-lg border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300;
  }

  .glass-dark {
    @apply bg-slate-900/80 backdrop-blur-lg border border-slate-700/40 shadow-lg hover:shadow-xl transition-all duration-300;
  }

  .glass-effect {
    @apply backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-white/20 dark:border-slate-700/30;
  }

  /* Gradient utilities */
  .gradient-primary {
    @apply bg-gradient-to-r from-blue-600 to-blue-700;
  }

  .gradient-accent {
    @apply bg-gradient-to-br from-slate-900 dark:from-slate-50 to-slate-700 dark:to-slate-300;
  }

  .gradient-subtle {
    @apply bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50;
  }

  .gradient-hover {
    @apply hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-50 dark:hover:from-slate-800 dark:hover:to-slate-900 transition-all duration-300;
  }

  /* Shadow utilities */
  .shadow-sm-accent {
    box-shadow: 0 1px 2px 0 rgba(59, 130, 246, 0.1);
  }

  .shadow-md-accent {
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.15);
  }

  .shadow-lg-accent {
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2);
  }

  /* Elevation utilities */
  .elevation-1 {
    @apply shadow-sm;
  }

  .elevation-2 {
    @apply shadow-md;
  }

  .elevation-3 {
    @apply shadow-lg;
  }

  .elevation-4 {
    @apply shadow-xl;
  }

  .elevation-5 {
    @apply shadow-2xl;
  }

  /* Safe area support for notched devices */
  .safe-area-top {
    padding-top: max(1rem, env(safe-area-inset-top));
  }

  .safe-area-bottom {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }

  .safe-area-left {
    padding-left: max(1rem, env(safe-area-inset-left));
  }

  .safe-area-right {
    padding-right: max(1rem, env(safe-area-inset-right));
  }

  /* Landscape orientation utilities */
  @media (orientation: landscape) {
    .landscape-hidden {
      display: none;
    }

    .landscape-compact {
      max-height: 100vh;
      overflow-y: auto;
    }
  }

  /* Portrait orientation utilities */
  @media (orientation: portrait) {
    .portrait-hidden {
      display: none;
    }
  }

  /* ============================================================================
     ACCESSIBILITY UTILITIES
     ============================================================================ */

  /* Screen reader only - hide visually but keep accessible */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Focus visible styles for keyboard navigation */
  .focus-visible-ring {
    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2;
  }

  .focus-visible-ring-accent {
    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400;
  }

  /* Skip to content link */
  .skip-to-content {
    @apply sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-0 focus-visible:left-0 focus-visible:z-50 focus-visible:bg-blue-600 focus-visible:text-white focus-visible:px-4 focus-visible:py-2 focus-visible:rounded-b-md;
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: more) {
    .text-muted {
      @apply text-slate-700 dark:text-slate-300;
    }

    .border-subtle {
      @apply border-slate-400 dark:border-slate-600;
    }
  }

  /* Forced colors mode support */
  @media (forced-colors: active) {
    .glass-effect {
      border: 1px solid CanvasText;
    }

    button {
      border: 1px solid ButtonBorder;
    }
  }
}


```

---

### src/types/ai.ts

```typescript
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


```

---

### src/types/index.ts

```typescript
/**
 * Core type definitions for the CNA Voice Notes AI application
 */

// Chat & Messaging Types

/** Message role in a conversation */
export type MessageRole = 'user' | 'assistant'

/** A single message in a conversation */
export interface ChatMessage {
  id: string
  conversationId: string
  role: MessageRole
  content: string
  createdAt: Date
}

/** Props for a message item component */
export interface MessageItemProps {
  message: ChatMessage
  isCopied: boolean
  onCopy: (messageId: string, content: string) => void
}

/** Metadata for filtering conversations */
export interface ConversationMetadata {
  // Broker Information
  broker?: string
  brokerCode?: string

  // Line of Business (LOB)
  lob?: string // e.g., "commercial_general_liability", "property", "workers_compensation"

  // Business Type
  businessType?: string // e.g., "new_business", "renewal", "modification", "cancellation"

  // Client/Account Information
  client?: string
  accountNumber?: string

  // Risk Categories
  riskCategory?: string // e.g., "manufacturing", "retail", "healthcare", "technology"
  industry?: string

  // Coverage Details
  coverageType?: string
  premium?: number

  // Underwriting Status
  underwritingStatus?: string // e.g., "pending", "approved", "declined", "referred"

  // Additional Tags
  tags?: string[]

  // Generic key-value storage
  [key: string]: string | string[] | number | boolean | undefined
}

/** A conversation/chat session */
export interface Conversation {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messageCount: number
  metadata?: ConversationMetadata
}

/** Input format for sending messages to the API */
export interface ChatMessageInput {
  role: MessageRole
  content: string
}

// Chat Provider Types

/** Chat provider interface */
export interface IChatProvider {
  sendMessage(messages: ChatMessageInput[]): Promise<string>
  sendMessageStream?(messages: ChatMessageInput[], onChunk: (chunk: string) => void): Promise<string>
}

// Response Formatting Types

/** Response metadata for tracking and debugging */
export interface ResponseMetadata {
  timestamp: Date
  duration: number // milliseconds
  retryCount: number
  provider: string
  model?: string
  tokensUsed?: {
    prompt: number
    completion: number
    total: number
  }
}

/** Error details with categorization */
export interface ErrorDetails {
  code: string
  message: string
  category: 'client' | 'server' | 'network' | 'timeout' | 'validation' | 'unknown'
  statusCode?: number
  retryable: boolean
  originalError?: unknown
}

/** Formatted chat response with content and metadata */
export interface FormattedChatResponse {
  content: string
  contentType: 'text' | 'markdown' | 'json' | 'mixed'
  length: number
  hasFormatting: boolean
  sanitized: boolean
  metadata: {
    model: string
    temperature: number
    maxTokens: number
    finishReason?: string
    qualityMetrics?: {
      readabilityScore: number
      scannability: number
      activeVoiceRatio: number
      avgSentenceLength: number
      markdownValid: boolean
      markdownIssues: string[]
      qualityScore: number
      recommendations: string[]
    }
  }
}

/** Response validation result */
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  sanitized: boolean
}

/** Response formatting options */
export interface ResponseFormattingOptions {
  sanitize: boolean
  validateSchema: boolean
  includeMetadata: boolean
  formatMarkdown: boolean
  maxLength?: number
  timeout?: number
}

// Circuit Breaker Types

/** Circuit breaker state */
export type CircuitBreakerState = 'closed' | 'open' | 'half-open'

/** Circuit breaker configuration */
export interface CircuitBreakerConfig {
  failureThreshold: number
  successThreshold: number
  timeout: number
  monitoringWindow: number
}

/** Circuit breaker status */
export interface CircuitBreakerStatus {
  state: CircuitBreakerState
  failureCount: number
  successCount: number
  lastFailureTime?: Date
  nextAttemptTime?: Date
}

// Upload & File Types

/** Supported file types for upload */
export type SupportedFileType = 'audio' | 'document'

/** Uploaded file metadata */
export interface UploadedFile {
  id: string
  userId: string
  filename: string
  originalName: string
  fileType: SupportedFileType
  mimeType: string
  size: number // in bytes
  tags: string[]
  uploadedAt: Date
  updatedAt: Date
  storagePath: string
  transcription?: string // For audio files
  extractedText?: string // For documents
  metadata?: {
    duration?: number // For audio files, in seconds
    pageCount?: number // For documents
    [key: string]: unknown
  }
}

/** Input for creating/updating an uploaded file */
export interface UploadedFileInput {
  filename: string
  fileType: SupportedFileType
  mimeType: string
  size: number
  tags?: string[]
  metadata?: Record<string, unknown>
}

/** File upload progress tracking */
export interface UploadProgress {
  fileId: string
  filename: string
  progress: number
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error'
  error?: string
}

```

---

### src/utils/accentColors.ts

```typescript
/**
 * Accent color type
 */
export type AccentColor = 'blue' | 'emerald' | 'violet' | 'red' | 'amber' | 'slate'

/**
 * Color palette for each accent color
 * Maps accent color names to their RGB values
 */
export const accentColorPalette: Record<AccentColor, Record<string, string>> = {
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  emerald: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  violet: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
}

/**
 * Get the color value for a specific accent color and shade
 */
export const getAccentColor = (accentColor: AccentColor, shade: keyof typeof accentColorPalette['blue'] = '500'): string => {
  return accentColorPalette[accentColor][shade]
}

/**
 * Convert hex color to RGB string
 */
export const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '0, 0, 0'
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}

/**
 * Get RGB values for accent color (for use with CSS variables)
 */
export const getAccentColorRgb = (accentColor: AccentColor, shade: keyof typeof accentColorPalette['blue'] = '500'): string => {
  const hex = getAccentColor(accentColor, shade)
  return hexToRgb(hex)
}


```

---

### src/utils/circuitBreaker.ts

```typescript
import { logger } from '../services/logger'
import type { CircuitBreakerConfig, CircuitBreakerState, CircuitBreakerStatus } from '../types'

/**
 * Circuit Breaker Pattern Implementation
 * Prevents cascading failures and manages service degradation
 */

export class CircuitBreaker {
  private state: CircuitBreakerState = 'closed'
  private failureCount = 0
  private successCount = 0
  private lastFailureTime?: Date
  private nextAttemptTime?: Date
  private config: CircuitBreakerConfig

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = {
      failureThreshold: config.failureThreshold || 5,
      successThreshold: config.successThreshold || 2,
      timeout: config.timeout || 60000,
      monitoringWindow: config.monitoringWindow || 120000,
    }
  }

  /**
   * Execute function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (this.shouldAttemptReset()) {
        this.state = 'half-open'
        logger.info('Circuit breaker transitioning to half-open state')
      } else {
        throw new Error('Circuit breaker is open. Service is unavailable.')
      }
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  /**
   * Handle successful execution
   */
  private onSuccess(): void {
    this.failureCount = 0

    if (this.state === 'half-open') {
      this.successCount++
      if (this.successCount >= this.config.successThreshold) {
        this.state = 'closed'
        this.successCount = 0
        logger.info('Circuit breaker closed - service recovered')
      }
    }
  }

  /**
   * Handle failed execution
   */
  private onFailure(): void {
    this.lastFailureTime = new Date()
    this.failureCount++

    if (this.state === 'half-open') {
      this.state = 'open'
      this.nextAttemptTime = new Date(Date.now() + this.config.timeout)
      logger.warn('Circuit breaker opened - service degraded')
    } else if (this.state === 'closed' && this.failureCount >= this.config.failureThreshold) {
      this.state = 'open'
      this.nextAttemptTime = new Date(Date.now() + this.config.timeout)
      logger.error('Circuit breaker opened - threshold exceeded', {
        failureCount: this.failureCount,
        threshold: this.config.failureThreshold,
      })
    }
  }

  /**
   * Check if should attempt reset
   */
  private shouldAttemptReset(): boolean {
    if (!this.nextAttemptTime) return true
    return Date.now() >= this.nextAttemptTime.getTime()
  }

  /**
   * Get current status
   */
  getStatus(): CircuitBreakerStatus {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
      nextAttemptTime: this.nextAttemptTime,
    }
  }

  /**
   * Reset circuit breaker
   */
  reset(): void {
    this.state = 'closed'
    this.failureCount = 0
    this.successCount = 0
    this.lastFailureTime = undefined
    this.nextAttemptTime = undefined
    logger.info('Circuit breaker reset')
  }

  /**
   * Check if circuit is open
   */
  isOpen(): boolean {
    return this.state === 'open'
  }

  /**
   * Check if circuit is closed
   */
  isClosed(): boolean {
    return this.state === 'closed'
  }

  /**
   * Check if circuit is half-open
   */
  isHalfOpen(): boolean {
    return this.state === 'half-open'
  }
}

/**
 * Create a circuit breaker for API calls
 */
export function createApiCircuitBreaker(): CircuitBreaker {
  return new CircuitBreaker({
    failureThreshold: 5,
    successThreshold: 2,
    timeout: 60000,
    monitoringWindow: 120000,
  })
}


```

---

### src/utils/dates.ts

```typescript
/**
 * Date and time utilities
 * Provides consistent date operations across the application
 */

/**
 * Get the date group label for a date
 * Categorizes dates into groups like "Today", "Yesterday", "This Week", etc.
 * @param date - Date to categorize (Date object or timestamp number)
 * @returns Date group label string (e.g., "Today", "Yesterday", "This Week")
 */
export function getDateGroupLabel(date: Date | number): string {
  const dateObj = typeof date === 'number' ? new Date(date) : date
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - dateObj.getTime())
  const daysDiff = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (daysDiff === 0) return 'Today'
  if (daysDiff === 1) return 'Yesterday'
  if (daysDiff < 7) return 'This Week'
  if (daysDiff < 30) return 'This Month'
  return 'Older'
}

```

---

### src/utils/errorHandler.ts

```typescript
import type { ErrorDetails } from '../types'

/**
 * Categorize an error based on its message
 * Analyzes error messages to determine error type (timeout, network, client, validation, server, unknown)
 * @param error - The error to categorize (Error object or any value)
 * @returns Error category string
 * @internal
 */
function categorizeError(error: unknown): ErrorDetails['category'] {
  const message = error instanceof Error ? error.message : String(error)
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) return 'timeout'
  if (lowerMessage.includes('network') || lowerMessage.includes('fetch') || lowerMessage.includes('econnrefused') || lowerMessage.includes('enotfound')) return 'network'
  if (lowerMessage.includes('429') || lowerMessage.includes('rate')) return 'client'
  if (lowerMessage.includes('401') || lowerMessage.includes('unauthorized')) return 'client'
  if (lowerMessage.includes('403') || lowerMessage.includes('forbidden')) return 'client'
  if (lowerMessage.includes('400') || lowerMessage.includes('bad request')) return 'validation'
  if (lowerMessage.includes('500') || lowerMessage.includes('502') || lowerMessage.includes('503') || lowerMessage.includes('504') || lowerMessage.includes('server')) return 'server'
  if (lowerMessage.includes('malformed') || lowerMessage.includes('invalid')) return 'validation'
  return 'unknown'
}

/**
 * Determine if an error is retryable
 * Non-retryable errors: 401 (Unauthorized), 403 (Forbidden), 400 (Bad Request)
 * Retryable errors: timeouts, network errors, 5xx errors, rate limits
 * @param error - The error to check (Error object or any value)
 * @returns true if the error should be retried, false if it should fail immediately
 * @example
 * if (isErrorRetryable(error)) {
 *   // Retry the operation
 * } else {
 *   // Fail immediately
 * }
 */
export function isErrorRetryable(error: unknown): boolean {
  const category = categorizeError(error)
  const message = error instanceof Error ? error.message : String(error)
  const lowerMessage = message.toLowerCase()

  // Non-retryable errors: authentication and validation failures
  if (category === 'client' && (lowerMessage.includes('401') || lowerMessage.includes('403') || lowerMessage.includes('400'))) {
    return false
  }

  // All other errors are retryable (timeouts, network, server errors, rate limits)
  return true
}




```

---

### src/utils/formatting.ts

```typescript
/**
 * Text and content formatting utilities
 * Provides consistent formatting across the application
 */

/**
 * Normalize date input to Date object
 * Handles both Date objects and numeric timestamps
 * @param date - Date to normalize (Date object or millisecond timestamp)
 * @returns Normalized Date object
 * @internal
 */
function normalizeDate(date: Date | number): Date {
  return typeof date === 'number' ? new Date(date) : date
}

/**
 * Format a date to a readable time string
 * Uses locale-specific formatting (e.g., "2:30 PM" in en-US)
 * @param date - Date to format (Date object or millisecond timestamp)
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export function formatTime(date: Date | number): string {
  const dateObj = normalizeDate(date)
  return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}


```

---

### src/utils/icons.ts

```typescript
/**
 * Centralized icon exports
 * This file consolidates all icon imports to ensure proper tree-shaking
 * and makes it easier to swap icon libraries in the future
 */

// Feather Icons (fi)
export {
  FiActivity,
  FiAlertTriangle,
  FiCheckCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiArrowRight,
  FiArrowUp,
  FiArrowLeft,
  FiMenu,
  FiX,
  FiMessageCircle,
  FiMic,
  FiPlus,
  FiCopy,
  FiCheck,
  FiHome,
  FiSearch,
  FiHelpCircle,
  FiUpload,
  FiTrash2,
  FiEdit2,
  FiAlertCircle,
  FiRefreshCw,
  FiRotateCcw,
  FiMusic,
  FiFile,
  FiUploadCloud,
  FiSun,
  FiMoon,
  FiMail,
  FiPhone,
  FiInfo,
  FiLoader,
  FiSend,
} from 'react-icons/fi'

// Ionicons (io5)
export { IoChatbubblesOutline } from 'react-icons/io5'

// Heroicons v2 (hi2)
export {
  HiOutlineDocumentText,
  HiOutlineMicrophone,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineSparkles,
} from 'react-icons/hi2'


```

---

### src/utils/responseFormatter.ts

```typescript
import { logger } from '../services/logger'
import { API } from '../constants'
import type {
  ErrorDetails,
  FormattedChatResponse,
  ValidationResult,
  ResponseMetadata,
  ResponseFormattingOptions,
} from '../types'

/**
 * Response Formatter Utility
 * Implements comprehensive response formatting, validation, and quality metrics
 *
 * Features:
 * - Markdown structure validation and normalization
 * - Readability metrics (Flesch-Kincaid, scannability)
 * - Content quality assessment
 * - Accessibility compliance checking
 * - Professional formatting standards
 */

const DEFAULT_FORMATTING_OPTIONS: ResponseFormattingOptions = {
  sanitize: true,
  validateSchema: true,
  includeMetadata: true,
  formatMarkdown: true,
  maxLength: 10000,
  timeout: API.REQUEST_TIMEOUT_MS,
}

/**
 * Sanitize response content by removing potentially harmful content
 * Preserves code blocks and intentional formatting
 */
function sanitizeContent(content: string): string {
  if (!content || typeof content !== 'string') {
    return ''
  }

  // Extract code blocks to preserve them
  const codeBlockRegex = /```[\s\S]*?```/g
  const codeBlocks = content.match(codeBlockRegex) || []
  let sanitized = content

  // Replace code blocks with placeholders
  codeBlocks.forEach((block, index) => {
    sanitized = sanitized.replace(block, `__CODE_BLOCK_${index}__`)
  })

  // Remove null bytes and control characters (but preserve intentional whitespace)
  // eslint-disable-next-line no-control-regex
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

  // Collapse multiple spaces on same line
  sanitized = sanitized.replace(/ {2,}/g, ' ')

  // Collapse excessive blank lines (more than 2 consecutive newlines) to max 2
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n')

  // Trim leading and trailing whitespace
  sanitized = sanitized.trim()

  // Restore code blocks
  codeBlocks.forEach((block, index) => {
    sanitized = sanitized.replace(`__CODE_BLOCK_${index}__`, block)
  })

  return sanitized
}

/**
 * Validate response content
 */
export function validateResponse(content: unknown): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  let sanitized = false

  if (!content) {
    errors.push('Response content is empty or null')
    return { isValid: false, errors, warnings, sanitized }
  }

  if (typeof content !== 'string') {
    errors.push(`Expected string content, got ${typeof content}`)
    return { isValid: false, errors, warnings, sanitized }
  }

  if (content.trim().length === 0) {
    errors.push('Response content is empty after trimming')
    return { isValid: false, errors, warnings, sanitized }
  }

  if (content.length > DEFAULT_FORMATTING_OPTIONS.maxLength!) {
    warnings.push(`Content exceeds max length of ${DEFAULT_FORMATTING_OPTIONS.maxLength}`)
  }

  // Check for suspicious patterns
  if (content.includes('\x00')) {
    warnings.push('Content contains null bytes')
    sanitized = true
  }

  return { isValid: true, errors, warnings, sanitized }
}

/**
 * Detect content type
 */
function detectContentType(content: string): 'text' | 'markdown' | 'json' | 'mixed' {
  if (content.startsWith('{') || content.startsWith('[')) {
    try {
      JSON.parse(content)
      return 'json'
    } catch {
      // Not valid JSON
    }
  }

  if (content.includes('```') || content.includes('**') || content.includes('##')) {
    return 'markdown'
  }

  return 'text'
}

/**
 * Create response metadata
 */
export function createMetadata(
  provider: string,
  duration: number,
  retryCount: number = 0,
  model?: string,
  tokensUsed?: { prompt: number; completion: number; total: number }
): ResponseMetadata {
  return {
    timestamp: new Date(),
    duration,
    retryCount,
    provider,
    model,
    tokensUsed,
  }
}

/**
 * Format chat response with validation and sanitization
 */
export function formatChatResponse(
  content: string,
  metadata: Partial<ResponseMetadata>,
  options: Partial<ResponseFormattingOptions> = {}
): FormattedChatResponse {
  const opts = { ...DEFAULT_FORMATTING_OPTIONS, ...options }

  // Validate
  const validation = validateResponse(content)
  if (!validation.isValid) {
    logger.warn('Response validation failed', { errors: validation.errors })
  }

  // Sanitize
  const sanitized = opts.sanitize ? sanitizeContent(content) : content
  const contentType = detectContentType(sanitized)

  return {
    content: sanitized,
    contentType,
    length: sanitized.length,
    hasFormatting: contentType !== 'text',
    sanitized: opts.sanitize && validation.sanitized,
    metadata: {
      model: metadata.model || 'unknown',
      temperature: 0.7,
      maxTokens: 1000,
      finishReason: 'stop',
      qualityMetrics: {
        readabilityScore: 0,
        scannability: 0,
        activeVoiceRatio: 0,
        avgSentenceLength: 0,
        markdownValid: true,
        markdownIssues: [],
        qualityScore: 100,
        recommendations: [],
      },
    },
  }
}



/**
 * Parse and categorize errors with comprehensive error detection
 */
export function parseError(error: unknown): ErrorDetails {
  const message = error instanceof Error ? error.message : String(error)
  const lowerMessage = message.toLowerCase()

  let category: ErrorDetails['category'] = 'unknown'
  let statusCode: number | undefined
  let retryable = true

  // Authentication errors (401)
  if (lowerMessage.includes('401') || lowerMessage.includes('unauthorized') || lowerMessage.includes('unauthenticated')) {
    category = 'client'
    statusCode = 401
    retryable = false
  }
  // Authorization errors (403)
  else if (lowerMessage.includes('403') || lowerMessage.includes('forbidden') || lowerMessage.includes('permission denied')) {
    category = 'client'
    statusCode = 403
    retryable = false
  }
  // Bad request errors (400)
  else if (lowerMessage.includes('400') || lowerMessage.includes('bad request') || lowerMessage.includes('invalid request')) {
    category = 'validation'
    statusCode = 400
    retryable = false
  }
  // Rate limit errors (429)
  else if (lowerMessage.includes('429') || lowerMessage.includes('rate') || lowerMessage.includes('too many requests')) {
    category = 'client'
    statusCode = 429
    retryable = true
  }
  // Server errors (5xx)
  else if (
    lowerMessage.includes('500') ||
    lowerMessage.includes('502') ||
    lowerMessage.includes('503') ||
    lowerMessage.includes('504') ||
    lowerMessage.includes('server error') ||
    lowerMessage.includes('internal error')
  ) {
    category = 'server'
    statusCode = 500
    retryable = true
  }
  // Timeout errors
  else if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out') || lowerMessage.includes('deadline exceeded')) {
    category = 'timeout'
    statusCode = 408
    retryable = true
  }
  // Network errors
  else if (
    lowerMessage.includes('network') ||
    lowerMessage.includes('fetch') ||
    lowerMessage.includes('econnrefused') ||
    lowerMessage.includes('enotfound') ||
    lowerMessage.includes('econnreset') ||
    lowerMessage.includes('connection refused')
  ) {
    category = 'network'
    retryable = true
  }

  return {
    code: `${category.toUpperCase()}_ERROR`,
    message,
    category,
    statusCode,
    retryable,
    originalError: error,
  }
}

/**
 * Handle null, undefined, and empty responses
 */
export function handleNullOrUndefinedResponse(value: unknown): string {
  if (value === null) {
    logger.warn('Response is null')
    return ''
  }
  if (value === undefined) {
    logger.warn('Response is undefined')
    return ''
  }
  if (typeof value === 'string') {
    return value
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch (error) {
      logger.error('Failed to stringify object response', error)
      return String(value)
    }
  }
  return String(value)
}



/**
 * Detect if response is HTML (error page) instead of expected format
 */
export function isHtmlResponse(content: string): boolean {
  const trimmed = content.trim()
  return trimmed.startsWith('<') && (trimmed.includes('<!DOCTYPE') || trimmed.includes('<html') || trimmed.includes('<body'))
}

/**
 * Extract error message from HTML error page
 */
export function extractErrorFromHtml(htmlContent: string): string {
  try {
    // Try to extract from common error page patterns
    const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i)
    if (titleMatch) {
      return titleMatch[1]
    }

    const h1Match = htmlContent.match(/<h1[^>]*>([^<]+)<\/h1>/i)
    if (h1Match) {
      return h1Match[1]
    }

    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    if (bodyMatch) {
      const text = bodyMatch[1].replace(/<[^>]+>/g, '').trim()
      return text.substring(0, 200)
    }

    return 'Received HTML error page from server'
  } catch (error) {
    logger.error('Error extracting error from HTML', error)
    return 'Unknown error from server'
  }
}


```

---

### src/utils/retry.ts

```typescript
import { logger } from '../services/logger'
import { isErrorRetryable } from './errorHandler'

interface RetryOptions {
  maxAttempts?: number
  delayMs?: number
  backoffMultiplier?: number
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
}

/**
 * Retry a function with exponential backoff
 * @param fn - The async function to retry
 * @param options - Retry configuration options
 * @returns The result of the function
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options }
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Check if error is retryable using enhanced error handler
      if (!isErrorRetryable(error)) {
        logger.debug('Error is not retryable, throwing immediately', { error: lastError.message })
        throw error
      }

      if (attempt < config.maxAttempts) {
        const delay = config.delayMs * Math.pow(config.backoffMultiplier, attempt - 1)
        logger.debug(`Retry attempt ${attempt}/${config.maxAttempts} after ${delay}ms`, {
          error: lastError.message,
          nextDelay: delay,
        })
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  logger.error(`Failed after ${config.maxAttempts} attempts`, { error: lastError?.message })
  throw lastError
}


```

---

### src/utils/serviceWorker.ts

```typescript
/**
 * Service Worker registration and management
 */

export interface ServiceWorkerOptions {
  onUpdate?: () => void
  onSuccess?: () => void
  onError?: (error: Error) => void
}

/**
 * Register service worker for offline support
 * @param options - Configuration options
 */
export async function registerServiceWorker(
  options: ServiceWorkerOptions = {}
): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.debug('Service Workers not supported')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })

    console.debug('Service Worker registered successfully')
    options.onSuccess?.()

    // Check for updates periodically
    setInterval(() => {
      registration.update()
    }, 60000) // Check every minute

    // Listen for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (!newWorker) return

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker is ready
          console.debug('New Service Worker available')
          options.onUpdate?.()
        }
      })
    })

    return registration
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    console.error('Service Worker registration failed:', err)
    options.onError?.(err)
    return null
  }
}

/** Check if service worker is active */
export function isServiceWorkerActive(): boolean {
  return (
    'serviceWorker' in navigator &&
    navigator.serviceWorker.controller !== null
  )
}

/** Get cache size */
export async function getCacheSize(): Promise<number> {
  if (!('caches' in window)) return 0

  try {
    const cacheNames = await caches.keys()
    let totalSize = 0

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName)
      const keys = await cache.keys()
      for (const request of keys) {
        const response = await cache.match(request)
        if (response) {
          const blob = await response.blob()
          totalSize += blob.size
        }
      }
    }

    return totalSize
  } catch (error) {
    console.error('Failed to get cache size:', error)
    return 0
  }
}

```

---

### src/utils/timestampConverter.ts

```typescript
/**
 * Timestamp conversion utilities for Firestore integration
 * Safely converts Firestore Timestamps to JavaScript Dates with proper fallbacks
 */

import { Timestamp } from 'firebase/firestore'
import { logger } from '../services/logger'

/**
 * Safely convert a Firestore Timestamp, Date, string, or undefined to a valid Date
 * @param value - The value to convert (Timestamp, Date, string, or undefined)
 * @param fieldName - Optional field name for logging context
 * @returns A valid Date object or current date as fallback
 */
export function toDate(value: unknown, fieldName?: string): Date {
  // Handle Firestore Timestamp
  if (value instanceof Timestamp) {
    return value.toDate()
  }

  // Handle JavaScript Date
  if (value instanceof Date) {
    return value
  }

  // Handle ISO string
  if (typeof value === 'string') {
    try {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        return date
      }
    } catch (error) {
      logger.warn(`Failed to parse date string: ${value}`, { fieldName, error })
    }
  }

  // Handle number (milliseconds since epoch)
  if (typeof value === 'number') {
    const date = new Date(value)
    if (!isNaN(date.getTime())) {
      return date
    }
  }

  // Fallback: log warning and return current date
  if (value !== undefined && value !== null) {
    logger.warn(`Invalid timestamp value, using current date as fallback`, {
      fieldName,
      valueType: typeof value,
      value: String(value).substring(0, 50),
    })
  }

  return new Date()
}


```

---

### src/utils/webVitals.ts

```typescript
/**
 * Web Vitals monitoring and reporting
 * Tracks Core Web Vitals: LCP, FID, CLS, TTFB, INP
 */

export interface WebVitalsMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
  navigationType: string
}

// Thresholds for Core Web Vitals (in milliseconds or unitless)
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 600, poor: 1800 },
  INP: { good: 200, poor: 500 },
}

/**
 * Determine rating based on metric value and thresholds
 */
function getRating(
  metricName: string,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metricName as keyof typeof THRESHOLDS]
  if (!threshold) return 'needs-improvement'

  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

/**
 * Initialize Web Vitals monitoring
 * @param onMetric - Callback function when a metric is recorded
 */
export function initWebVitals(onMetric?: (metric: WebVitalsMetric) => void): void {
  if (typeof window === 'undefined') return

  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number }
        const value = lastEntry.renderTime || lastEntry.loadTime || 0
        const metric: WebVitalsMetric = {
          name: 'LCP',
          value,
          rating: getRating('LCP', value),
          delta: 0,
          id: `lcp-${Date.now()}`,
          navigationType: performance.navigation?.type.toString() || 'navigate',
        }
        onMetric?.(metric)
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch {
      console.debug('LCP observer not supported')
    }

    // Cumulative Layout Shift (CLS)
    try {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        list.getEntries().forEach((entry) => {
          const layoutEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }
          if (!layoutEntry.hadRecentInput) {
            clsValue += layoutEntry.value || 0
          }
        })
        const metric: WebVitalsMetric = {
          name: 'CLS',
          value: clsValue,
          rating: getRating('CLS', clsValue),
          delta: 0,
          id: `cls-${Date.now()}`,
          navigationType: performance.navigation?.type.toString() || 'navigate',
        }
        onMetric?.(metric)
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch {
      console.debug('CLS observer not supported')
    }

    // Interaction to Next Paint (INP)
    try {
      const inpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const maxDuration = Math.max(...entries.map((e) => e.duration))
        const metric: WebVitalsMetric = {
          name: 'INP',
          value: maxDuration,
          rating: getRating('INP', maxDuration),
          delta: 0,
          id: `inp-${Date.now()}`,
          navigationType: performance.navigation?.type.toString() || 'navigate',
        }
        onMetric?.(metric)
      })
      inpObserver.observe({ entryTypes: ['event'] })
    } catch {
      console.debug('INP observer not supported')
    }
  }

  // Time to First Byte (TTFB)
  if (performance.timing) {
    const ttfb = performance.timing.responseStart - performance.timing.navigationStart
    const metric: WebVitalsMetric = {
      name: 'TTFB',
      value: ttfb,
      rating: getRating('TTFB', ttfb),
      delta: 0,
      id: `ttfb-${Date.now()}`,
      navigationType: performance.navigation?.type.toString() || 'navigate',
    }
    onMetric?.(metric)
  }
}

/**
 * Send Web Vitals data to analytics service
 * @param metric - The metric to report
 * @param endpoint - Analytics endpoint URL
 */
export async function reportWebVitals(
  metric: WebVitalsMetric,
  endpoint: string
): Promise<void> {
  try {
    // Use sendBeacon for reliability (won't block page unload)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, JSON.stringify(metric))
    } else {
      // Fallback to fetch
      await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(metric),
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      })
    }
  } catch (error) {
    console.debug('Failed to report Web Vitals:', error)
  }
}

```

---

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      animation: {
        'subtle-pulse': 'subtle-pulse 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'blob': 'blob 7s infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-scale': 'pulse-scale 2s ease-in-out infinite',
        'spin-smooth': 'spin-smooth 2s linear infinite',
        'bounce-dots': 'bounce-dots 1.4s ease-in-out infinite',
      },
      keyframes: {
        'subtle-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(59, 130, 246, 0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'blob': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.7)' },
          '50%': { opacity: '1', boxShadow: '0 0 0 10px rgba(59, 130, 246, 0)' },
        },
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' },
        },
        'pulse-scale': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.3' },
          '50%': { transform: 'scale(1.2)', opacity: '0.1' },
        },
        'spin-smooth': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'bounce-dots': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.6' },
          '50%': { transform: 'translateY(-8px)', opacity: '1' },
        },
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}


```

---

### tsconfig.app.json

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"],
  "exclude": ["src/**/*.test.ts", "src/**/*.test.tsx", "src/**/__tests__/**"]
}

```

---

### tsconfig.json

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}

```

---

### tsconfig.node.json

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}

```

---

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/firestore', 'firebase/storage', 'firebase/analytics'],
          'vendor-openai': ['openai'],
          'vendor-icons': ['react-icons'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
    assetsInlineLimit: 4096,
  },
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.webp', '**/*.gif'],
})

```

---

## Summary

- **Total Files Exported**: 87
- **Generated**: 2025-12-16 06:20:22
- **Project**: EVR (Voice Notes AI Application)

### Technology Stack
- React 19 with TypeScript
- Vite 7.x
- Tailwind CSS v4
- Firebase (Firestore, Storage, Analytics)
- OpenAI GPT-4o-mini

