import { logger } from '../services/logger'
import type { ValidationResult } from '../types'

/**
 * Response Validator Utility
 * Comprehensive validation for API responses with edge case handling
 */

const VALIDATION_RULES = {
  minLength: 1,
  maxLength: 10000,
  allowedCharacterRanges: [
    [0x0020, 0x007e], // ASCII printable
    [0x00a0, 0x00ff], // Latin-1 Supplement
    [0x0100, 0x017f], // Latin Extended-A
    [0x0180, 0x024f], // Latin Extended-B
    [0x0250, 0x02af], // IPA Extensions
    [0x2000, 0x206f], // General Punctuation
    [0x2070, 0x209f], // Superscripts and Subscripts
    [0x20a0, 0x20cf], // Currency Symbols
    [0x2100, 0x214f], // Letterlike Symbols
    [0x2150, 0x218f], // Number Forms
    [0x2190, 0x27bf], // Arrows and Math Operators
    [0x2800, 0x28ff], // Braille Patterns
    [0x2900, 0x297f], // Supplemental Arrows-B
    [0x2980, 0x29ff], // Miscellaneous Mathematical Symbols-B
    [0x2e00, 0x2e7f], // Supplemental Punctuation
    [0x3000, 0x303f], // CJK Symbols and Punctuation
    [0x3040, 0x309f], // Hiragana
    [0x30a0, 0x30ff], // Katakana
    [0x4e00, 0x9fff], // CJK Unified Ideographs
    [0xac00, 0xd7af], // Hangul Syllables
    [0xd800, 0xf8ff], // Private Use Area
  ],
}

/**
 * Check if character is in allowed ranges
 */
function isAllowedCharacter(charCode: number): boolean {
  return VALIDATION_RULES.allowedCharacterRanges.some(
    ([min, max]) => charCode >= min && charCode <= max
  )
}

/**
 * Validate content length
 */
export function validateLength(content: string): { valid: boolean; warning?: string } {
  if (content.length < VALIDATION_RULES.minLength) {
    return { valid: false, warning: 'Content is too short' }
  }

  if (content.length > VALIDATION_RULES.maxLength) {
    return {
      valid: false,
      warning: `Content exceeds maximum length of ${VALIDATION_RULES.maxLength} characters`,
    }
  }

  return { valid: true }
}

/**
 * Validate character encoding
 */
export function validateCharacterEncoding(content: string): { valid: boolean; issues: string[] } {
  const issues: string[] = []

  for (let i = 0; i < content.length; i++) {
    const charCode = content.charCodeAt(i)

    // Check for surrogate pairs (emoji, etc.)
    if (charCode >= 0xd800 && charCode <= 0xdbff) {
      i++ // Skip next character in surrogate pair
      continue
    }

    if (!isAllowedCharacter(charCode)) {
      issues.push(`Invalid character at position ${i}: U+${charCode.toString(16).toUpperCase()}`)
    }
  }

  return { valid: issues.length === 0, issues }
}

/**
 * Validate JSON structure if content appears to be JSON
 */
export function validateJsonStructure(content: string): { valid: boolean; error?: string } {
  if (!content.trim().startsWith('{') && !content.trim().startsWith('[')) {
    return { valid: true } // Not JSON
  }

  try {
    JSON.parse(content)
    return { valid: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown JSON error'
    return { valid: false, error: `Invalid JSON: ${message}` }
  }
}

/**
 * Check for suspicious patterns
 */
export function checkSuspiciousPatterns(content: string): { suspicious: boolean; patterns: string[] } {
  const patterns: string[] = []

  // Check for excessive repetition
  if (/(.)\1{50,}/.test(content)) {
    patterns.push('Excessive character repetition detected')
  }

  // Check for null bytes
  if (content.includes('\x00')) {
    patterns.push('Null bytes detected')
  }

  // Check for control characters (except common ones)
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(content)) {
    patterns.push('Control characters detected')
  }

  // Check for extremely long lines (potential injection)
  if (content.split('\n').some((line) => line.length > 5000)) {
    patterns.push('Extremely long line detected')
  }

  return { suspicious: patterns.length > 0, patterns }
}

/**
 * Comprehensive response validation
 */
export function validateResponseComprehensive(content: unknown): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  let sanitized = false

  // Type check
  if (typeof content !== 'string') {
    errors.push(`Expected string, got ${typeof content}`)
    return { isValid: false, errors, warnings, sanitized }
  }

  // Empty check
  if (content.trim().length === 0) {
    errors.push('Content is empty after trimming')
    return { isValid: false, errors, warnings, sanitized }
  }

  // Length validation
  const lengthCheck = validateLength(content)
  if (!lengthCheck.valid) {
    errors.push(lengthCheck.warning || 'Length validation failed')
  }

  // Character encoding validation
  const encodingCheck = validateCharacterEncoding(content)
  if (!encodingCheck.valid) {
    warnings.push(...encodingCheck.issues)
    sanitized = true
  }

  // JSON validation if applicable
  const jsonCheck = validateJsonStructure(content)
  if (!jsonCheck.valid) {
    warnings.push(jsonCheck.error || 'JSON validation failed')
  }

  // Suspicious pattern check
  const suspiciousCheck = checkSuspiciousPatterns(content)
  if (suspiciousCheck.suspicious) {
    warnings.push(...suspiciousCheck.patterns)
    sanitized = true
  }

  const isValid = errors.length === 0

  if (!isValid) {
    logger.error('Response validation failed', { errors, warnings })
  } else if (warnings.length > 0) {
    logger.warn('Response validation warnings', { warnings })
  }

  return { isValid, errors, warnings, sanitized }
}

/**
 * Sanitize response by removing problematic content
 */
export function sanitizeResponseContent(content: string): string {
  let sanitized = content

  // Remove null bytes
  sanitized = sanitized.replace(/\x00/g, '')

  // Remove control characters except newlines and tabs
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim()

  // Remove extremely long lines
  const lines = sanitized.split('\n')
  sanitized = lines.map((line) => (line.length > 5000 ? line.substring(0, 5000) : line)).join('\n')

  return sanitized
}

