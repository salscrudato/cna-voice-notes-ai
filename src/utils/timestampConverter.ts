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

/**
 * Safely convert a Firestore Timestamp to a Date, with optional default
 * @param value - The Firestore Timestamp to convert
 * @param defaultDate - Optional default date if conversion fails
 * @returns A valid Date object
 */
export function timestampToDate(value: Timestamp | undefined, defaultDate?: Date): Date {
  if (!value) {
    return defaultDate || new Date()
  }

  try {
    return value.toDate()
  } catch (error) {
    logger.warn('Failed to convert Firestore Timestamp to Date', { error })
    return defaultDate || new Date()
  }
}

/**
 * Validate that a date is reasonable (not too far in past or future)
 * @param date - The date to validate
 * @param maxAgeMs - Maximum age in milliseconds (default: 100 years)
 * @param maxFutureMs - Maximum future time in milliseconds (default: 1 year)
 * @returns true if date is reasonable, false otherwise
 */
export function isReasonableDate(
  date: Date,
  maxAgeMs: number = 100 * 365 * 24 * 60 * 60 * 1000,
  maxFutureMs: number = 365 * 24 * 60 * 60 * 1000
): boolean {
  const now = Date.now()
  const dateTime = date.getTime()

  return dateTime >= now - maxAgeMs && dateTime <= now + maxFutureMs
}

