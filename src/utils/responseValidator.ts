import { logger } from '../services/logger'

/**
 * Response Validation Schema
 * Validates responses against expected schemas
 */

export interface ValidationSchema {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  properties?: Record<string, ValidationSchema>
  items?: ValidationSchema
  enum?: unknown[]
}

export interface ValidationError {
  path: string
  message: string
  value?: unknown
}

/**
 * Validate value against schema
 */
export function validateAgainstSchema(
  value: unknown,
  schema: ValidationSchema,
  path: string = 'root'
): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = []

  // Check type
  const actualType = Array.isArray(value) ? 'array' : typeof value
  if (actualType !== schema.type) {
    errors.push({
      path,
      message: `Expected type ${schema.type}, got ${actualType}`,
      value,
    })
    return { valid: false, errors }
  }

  // Check required
  if (schema.required && (value === null || value === undefined)) {
    errors.push({
      path,
      message: 'Value is required',
      value,
    })
    return { valid: false, errors }
  }

  // String validations
  if (schema.type === 'string' && typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push({
        path,
        message: `String length ${value.length} is less than minimum ${schema.minLength}`,
        value,
      })
    }
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      errors.push({
        path,
        message: `String length ${value.length} exceeds maximum ${schema.maxLength}`,
        value,
      })
    }
    if (schema.pattern && !schema.pattern.test(value)) {
      errors.push({
        path,
        message: `String does not match pattern ${schema.pattern}`,
        value,
      })
    }
  }

  // Enum validation
  if (schema.enum && !schema.enum.includes(value)) {
    errors.push({
      path,
      message: `Value must be one of: ${schema.enum.join(', ')}`,
      value,
    })
  }

  // Object validations
  if (schema.type === 'object' && typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>
    if (schema.properties) {
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        const propValue = obj[key]
        const propPath = `${path}.${key}`
        const result = validateAgainstSchema(propValue, propSchema, propPath)
        errors.push(...result.errors)
      }
    }
  }

  // Array validations
  if (schema.type === 'array' && Array.isArray(value)) {
    if (schema.items) {
      for (let i = 0; i < value.length; i++) {
        const itemPath = `${path}[${i}]`
        const result = validateAgainstSchema(value[i], schema.items, itemPath)
        errors.push(...result.errors)
      }
    }
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Create schema for OpenAI chat response
 */
export function createOpenAIResponseSchema(): ValidationSchema {
  return {
    type: 'object',
    required: true,
    properties: {
      id: { type: 'string', required: true },
      object: { type: 'string', required: true, enum: ['chat.completion'] },
      created: { type: 'number', required: true },
      model: { type: 'string', required: true },
      choices: {
        type: 'array',
        required: true,
        items: {
          type: 'object',
          properties: {
            index: { type: 'number' },
            message: {
              type: 'object',
              properties: {
                role: { type: 'string', enum: ['assistant'] },
                content: { type: 'string', required: true },
              },
            },
            finish_reason: { type: 'string' },
          },
        },
      },
      usage: {
        type: 'object',
        properties: {
          prompt_tokens: { type: 'number' },
          completion_tokens: { type: 'number' },
          total_tokens: { type: 'number' },
        },
      },
    },
  }
}

/**
 * Create schema for generic chat response
 */
export function createGenericChatResponseSchema(): ValidationSchema {
  return {
    type: 'object',
    required: true,
    properties: {
      content: { type: 'string', required: true, minLength: 1 },
      model: { type: 'string' },
      tokensUsed: {
        type: 'object',
        properties: {
          prompt: { type: 'number' },
          completion: { type: 'number' },
          total: { type: 'number' },
        },
      },
    },
  }
}

/**
 * Log validation errors
 */
export function logValidationErrors(errors: ValidationError[], context: string): void {
  if (errors.length === 0) return

  logger.error(`Validation errors in ${context}`, {
    errorCount: errors.length,
    errors: errors.map((e) => ({
      path: e.path,
      message: e.message,
    })),
  })
}

