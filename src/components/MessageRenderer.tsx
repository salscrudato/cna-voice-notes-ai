import React, { useMemo, memo } from 'react'
import DOMPurify from 'dompurify'
import { detectContentType } from '../utils/responseFormatter'

interface MessageRendererProps {
  content: string
}

/**
 * Enhanced message renderer that handles different content types
 * Supports text, markdown, and JSON formatting
 */
const MessageRendererComponent: React.FC<MessageRendererProps> = ({ content }) => {
  const contentType = useMemo(() => detectContentType(content), [content])

  // Render markdown-like content
  const renderMarkdown = (text: string) => {
    let processedText = text

    // Process code blocks first (to avoid processing markdown inside code)
    processedText = processedText.replace(/```([\s\S]*?)```/g, '<pre><code class="language-text">$1</code></pre>')

    // Process bold
    processedText = processedText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')

    // Process italic
    processedText = processedText.replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>')

    // Process inline code
    processedText = processedText.replace(/`(.*?)`/g, '<code class="bg-slate-100 px-2 py-1 rounded text-sm font-mono text-slate-900">$1</code>')

    // Process headings (h1, h2, h3)
    processedText = processedText.replace(/^### (.*?)$/gm, '<h3 class="text-lg font-semibold text-slate-900 mt-3 mb-2">$1</h3>')
    processedText = processedText.replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold text-slate-900 mt-4 mb-2">$1</h2>')
    processedText = processedText.replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold text-slate-900 mt-4 mb-2">$1</h1>')

    // Process unordered lists
    processedText = processedText.replace(/^\* (.*?)$/gm, '<li class="ml-4 text-slate-800">$1</li>')
    processedText = processedText.replace(/(<li.*?<\/li>)/s, '<ul class="list-disc space-y-1">$1</ul>')

    // Process ordered lists
    processedText = processedText.replace(/^\d+\. (.*?)$/gm, '<li class="ml-4 text-slate-800">$1</li>')

    // Process line breaks
    processedText = processedText.replace(/\n\n/g, '</p><p class="mt-3">')
    processedText = processedText.replace(/\n/g, '<br />')

    // Sanitize HTML to prevent XSS attacks
    const sanitizedHtml = DOMPurify.sanitize(processedText, {
      ALLOWED_TAGS: ['strong', 'em', 'code', 'pre', 'h1', 'h2', 'h3', 'ul', 'li', 'p', 'br'],
      ALLOWED_ATTR: ['class'],
    })

    return (
      <div
        className="space-y-2 text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    )
  }

  // Render JSON content
  const renderJson = (text: string) => {
    try {
      const parsed = JSON.parse(text)
      return (
        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-x-auto font-mono border border-slate-700">
          <code>{JSON.stringify(parsed, null, 2)}</code>
        </pre>
      )
    } catch {
      return <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{text}</p>
    }
  }

  // Render based on content type
  const renderContent = () => {
    switch (contentType) {
      case 'markdown':
        return renderMarkdown(content)
      case 'json':
        return renderJson(content)
      case 'text':
      default:
        return <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{content}</p>
    }
  }

  return (
    <div className={`message-renderer ${contentType}`}>
      {renderContent()}
    </div>
  )
}

export const MessageRenderer = memo(MessageRendererComponent)

