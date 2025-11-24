import React from 'react'

interface MarkdownContentProps {
  content: string
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  const lines = content.split('\n')

  return (
    <div className="space-y-2 text-sm">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) {
          return (
            <h3 key={i} className="font-semibold text-base mt-3 mb-2">
              {line.substring(3)}
            </h3>
          )
        }
        if (line.startsWith('- ')) {
          return (
            <li key={i} className="ml-4">
              {line.substring(2)}
            </li>
          )
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <p key={i} className="font-semibold">
              {line.substring(2, line.length - 2)}
            </p>
          )
        }
        if (line.trim()) {
          return (
            <p key={i}>{line}</p>
          )
        }
        return null
      })}
    </div>
  )
}

