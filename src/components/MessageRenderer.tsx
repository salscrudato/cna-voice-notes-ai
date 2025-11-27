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

