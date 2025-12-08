/**
 * Timestamp conversion utilities for Firestore integration
 * Safely converts Firestore Timestamps to JavaScript Dates with proper fallbacks
 */

import { Timestamp } from 'firebase/firestore'
import { logger } from '../services/logger'

/**
 * Safely convert a Firestore Timestamp, Date, string, or undefined to a valid Date
 * @param value - The value to convert (Timestamp, Date, string, or undefined)
 * @param fieldName - Optional field name for logging context
 * @returns A valid Date object or current date as fallback
 */
export function toDate(value: unknown, fieldName?: string): Date {
  // Handle Firestore Timestamp
  if (value instanceof Timestamp) {
    return value.toDate()
  }

  // Handle JavaScript Date
  if (value instanceof Date) {
    return value
  }

  // Handle ISO string
  if (typeof value === 'string') {
    try {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        return date
      }
    } catch (error) {
      logger.warn(`Failed to parse date string: ${value}`, { fieldName, error })
    }
  }

  // Handle number (milliseconds since epoch)
  if (typeof value === 'number') {
    const date = new Date(value)
    if (!isNaN(date.getTime())) {
      return date
    }
  }

  // Fallback: log warning and return current date
  if (value !== undefined && value !== null) {
    logger.warn(`Invalid timestamp value, using current date as fallback`, {
      fieldName,
      valueType: typeof value,
      value: String(value).substring(0, 50),
    })
  }

  return new Date()
}

