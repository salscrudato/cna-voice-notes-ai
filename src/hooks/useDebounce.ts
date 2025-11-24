/**
 * Custom hook for debouncing values and functions
 * Useful for search inputs, auto-save, and other delayed operations
 */

import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Hook for debouncing a value
 * @param value - Value to debounce
 * @param delay - Debounce delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook for debouncing a callback function
 * @param callback - Callback to debounce
 * @param delay - Debounce delay in milliseconds
 * @returns Debounced callback
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  )

  return debouncedCallback
}

/**
 * Hook for throttling a callback function
 * @param callback - Callback to throttle
 * @param delay - Throttle delay in milliseconds
 * @returns Throttled callback
 */
export function useThrottledCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  const lastRunRef = useRef<number>(0)

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastRunRef.current >= delay) {
        lastRunRef.current = now
        callback(...args)
      }
    },
    [callback, delay]
  )

  return throttledCallback
}

