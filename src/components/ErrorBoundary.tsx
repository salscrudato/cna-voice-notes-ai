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
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-600 to-accent-700 text-white rounded-lg hover:from-accent-700 hover:to-accent-800 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 hover:-translate-y-1 active:scale-95 font-semibold focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
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

