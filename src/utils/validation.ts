/**
 * Input validation utilities
 * Provides consistent validation across the application
 */

/**
 * Check if a string is empty or whitespace only
 * @param text - Text to check
 * @returns true if empty or whitespace only
 */
export function isEmpty(text: string): boolean {
  return !text || text.trim().length === 0
}

/**
 * Check if a string is not empty
 * @param text - Text to check
 * @returns true if not empty
 */
export function isNotEmpty(text: string): boolean {
  return !isEmpty(text)
}



/**
 * Validate message content
 * @param message - Message to validate
 * @param maxLength - Maximum allowed length
 * @returns Validation result with errors
 */
export function validateMessage(message: string, maxLength: number = 4000): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (isEmpty(message)) {
    errors.push('Message cannot be empty')
  }

  if (message.length > maxLength) {
    errors.push(`Message cannot exceed ${maxLength} characters`)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate conversation title
 * @param title - Title to validate
 * @returns Validation result with errors
 */
export function validateConversationTitle(title: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (isEmpty(title)) {
    errors.push('Title cannot be empty')
  }

  if (title.length > 100) {
    errors.push('Title cannot exceed 100 characters')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Check if a value is null or undefined
 * @param value - Value to check
 * @returns true if null or undefined
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined
}

/**
 * Check if a value is defined
 * @param value - Value to check
 * @returns true if not null or undefined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return !isNullOrUndefined(value)
}

/**
 * Check if an object is empty
 * @param obj - Object to check
 * @returns true if object has no keys
 */
export function isEmptyObject(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 0
}

/**
 * Check if an array is empty
 * @param arr - Array to check
 * @returns true if array is empty
 */
export function isEmptyArray<T>(arr: T[]): boolean {
  return arr.length === 0
}

/**
 * Check if an array has items
 * @param arr - Array to check
 * @returns true if array has items
 */
export function hasItems<T>(arr: T[]): boolean {
  return arr.length > 0
}

