/**
 * Hook for managing theme - Light theme only
 * Always returns 'light' theme for consistent light-themed UI
 */

import { useCallback } from 'react'

export type Theme = 'light'

/**
 * Hook to manage theme preference
 * @returns Current theme as 'light' and no-op setTheme function
 */
export function useTheme() {
  const theme: Theme = 'light'
  const effectiveTheme: 'light' | 'dark' = 'light'

  const setTheme = useCallback(() => {
    // No-op: theme is always light
  }, [])

  return {
    theme,
    effectiveTheme,
    setTheme,
  }
}

