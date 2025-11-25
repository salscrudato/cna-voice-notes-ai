import React, { type ReactNode } from 'react'
import { FiAlertTriangle, FiRefreshCw, FiRotateCcw } from 'react-icons/fi'
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
        <div className="h-screen flex items-center justify-center bg-gradient-to-b from-white via-slate-50/50 to-slate-50 dark:from-slate-900 dark:via-slate-900/50 dark:to-slate-950 p-4 animate-fade-in">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center mb-6 shadow-lg dark:shadow-xl hover:shadow-xl hover:scale-110 transition-all duration-300 animate-bounce-in">
              <FiAlertTriangle size={32} className="text-red-600 dark:text-red-400" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-3">Something went wrong</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-2 text-sm">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-8">
              Please try one of the options below to recover.
            </p>
            <div className="flex flex-col gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 active:scale-95"
                aria-label="Try again"
                type="button"
              >
                <FiRefreshCw size={18} />
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 font-medium"
                aria-label="Reload page"
                type="button"
              >
                <FiRotateCcw size={18} />
                Reload Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 font-medium"
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

