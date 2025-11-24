/**
 * Custom hook for handling async operations
 * Manages loading, error, and data states for async functions
 */

import { useState, useCallback, useEffect, useRef } from 'react'

interface UseAsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

interface UseAsyncOptions<T> {
  immediate?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

/**
 * Hook for managing async operations
 * @param asyncFunction - Async function to execute
 * @param options - Configuration options
 * @returns State and execute function
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions<T> = {}
) {
  const { immediate = false, onSuccess, onError } = options

  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null })
    try {
      const result = await asyncFunction()
      setState({ data: result, loading: false, error: null })
      onSuccess?.(result)
      return result
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      setState({ data: null, loading: false, error: err })
      onError?.(err)
      throw err
    }
  }, [asyncFunction, onSuccess, onError])

  const hasExecuted = useRef(false)

  useEffect(() => {
    if (immediate && !hasExecuted.current) {
      hasExecuted.current = true
      // Schedule execution asynchronously to avoid setState in effect
      const timeoutId = setTimeout(() => {
        execute()
      }, 0)
      return () => clearTimeout(timeoutId)
    }
  }, [execute, immediate])

  return {
    ...state,
    execute,
  }
}

/**
 * Hook for managing async operations with dependencies
 * @param asyncFunction - Async function to execute
 * @returns State object
 */
export function useAsyncEffect<T>(
  asyncFunction: () => Promise<T>
) {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const executeAsync = useCallback(async () => {
    try {
      const result = await asyncFunction()
      setState({ data: result, loading: false, error: null })
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      setState({ data: null, loading: false, error: err })
    }
  }, [asyncFunction])

  useEffect(() => {
    let isMounted = true

    const execute = async () => {
      if (isMounted) {
        await executeAsync()
      }
    }

    execute()

    return () => {
      isMounted = false
    }
  }, [executeAsync])

  return state
}

