import React, { memo } from 'react'

interface MessageRendererProps {
  content: string
}

const MessageRendererComponent: React.FC<MessageRendererProps> = ({ content }) => {
  return (
    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-900 dark:text-slate-50">
      {content}
    </p>
  )
}

export const MessageRenderer = memo(MessageRendererComponent)

