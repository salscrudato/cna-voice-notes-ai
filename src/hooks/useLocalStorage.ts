/**
 * Custom hook for managing localStorage
 * Provides type-safe access to localStorage with automatic serialization
 */

import { useState, useCallback } from 'react'

/**
 * Hook for managing a value in localStorage
 * @param key - Storage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns Tuple of [value, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

/**
 * Hook for managing multiple localStorage values
 * @param keys - Array of storage keys
 * @param initialValues - Initial values for each key
 * @returns Object with values and setters
 */
export function useLocalStorageMultiple<T extends Record<string, unknown>>(
  keys: (keyof T)[],
  initialValues: T
): {
  values: T
  setValues: (updates: Partial<T>) => void
  clearAll: () => void
} {
  const [values, setValues] = useState<T>(() => {
    const stored: Partial<T> = {}
    keys.forEach(key => {
      try {
        const item = window.localStorage.getItem(String(key))
        if (item) {
          stored[key] = JSON.parse(item)
        } else {
          stored[key] = initialValues[key]
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${String(key)}":`, error)
        stored[key] = initialValues[key]
      }
    })
    return stored as T
  })

  const updateValues = useCallback(
    (updates: Partial<T>) => {
      const newValues = { ...values, ...updates }
      setValues(newValues)
      Object.entries(updates).forEach(([key, value]) => {
        try {
          window.localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
          console.error(`Error setting localStorage key "${key}":`, error)
        }
      })
    },
    [values]
  )

  const clearAll = useCallback(() => {
    keys.forEach(key => {
      try {
        window.localStorage.removeItem(String(key))
      } catch (error) {
        console.error(`Error removing localStorage key "${String(key)}":`, error)
      }
    })
    setValues(initialValues)
  }, [keys, initialValues])

  return {
    values,
    setValues: updateValues,
    clearAll,
  }
}

