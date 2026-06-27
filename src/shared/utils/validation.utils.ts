/**
 * Validation Utilities
 *
 * Reusable validation helper functions.
 */

import type { ValidationErrorItem } from '../types';

/**
 * Validate that a value is not null or undefined.
 */
export function validateIsDefined<T>(
  value: T | null | undefined,
  field: string
): ValidationErrorItem | null {
  if (value === null || value === undefined) {
    return {
      field,
      code: 'VALIDATION_REQUIRED_FIELD',
      message: `${field} is required`,
      value,
    };
  }
  return null;
}

/**
 * Validate that a string is not empty.
 */
export function validateNonEmptyString(
  value: unknown,
  field: string
): ValidationErrorItem | null {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return {
      field,
      code: 'VALIDATION_REQUIRED_FIELD',
      message: `${field} must be a non-empty string`,
      value,
    };
  }
  return null;
}

/**
 * Validate string length.
 */
export function validateStringLength(
  value: unknown,
  field: string,
  minLength: number,
  maxLength: number
): ValidationErrorItem | null {
  if (typeof value !== 'string') {
    return {
      field,
      code: 'VALIDATION_INVALID_TYPE',
      message: `${field} must be a string`,
      value,
    };
  }

  if (value.length < minLength) {
    return {
      field,
      code: 'VALIDATION_TOO_SHORT',
      message: `${field} must be at least ${minLength} characters`,
      value,
    };
  }

  if (value.length > maxLength) {
    return {
      field,
      code: 'VALIDATION_TOO_LONG',
      message: `${field} must be at most ${maxLength} characters`,
      value,
    };
  }

  return null;
}

/**
 * Validate that a number is within range.
 */
export function validateNumberRange(
  value: unknown,
  field: string,
  min: number,
  max: number
): ValidationErrorItem | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return {
      field,
      code: 'VALIDATION_INVALID_TYPE',
      message: `${field} must be a number`,
      value,
    };
  }

  if (value < min || value > max) {
    return {
      field,
      code: 'VALIDATION_OUT_OF_RANGE',
      message: `${field} must be between ${min} and ${max}`,
      value,
    };
  }

  return null;
}

/**
 * Validate that a number is positive.
 */
export function validatePositiveNumber(
  value: unknown,
  field: string
): ValidationErrorItem | null {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return {
      field,
      code: 'VALIDATION_OUT_OF_RANGE',
      message: `${field} must be a positive number`,
      value,
    };
  }
  return null;
}

/**
 * Validate that a number is an integer.
 */
export function validateInteger(
  value: unknown,
  field: string
): ValidationErrorItem | null {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    return {
      field,
      code: 'VALIDATION_INVALID_TYPE',
      message: `${field} must be an integer`,
      value,
    };
  }
  return null;
}

/**
 * Validate email format.
 */
export function validateEmail(value: unknown, field: string): ValidationErrorItem | null {
  if (typeof value !== 'string') {
    return {
      field,
      code: 'VALIDATION_INVALID_TYPE',
      message: `${field} must be a string`,
      value,
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return {
      field,
      code: 'VALIDATION_INVALID_FORMAT',
      message: `${field} must be a valid email address`,
      value,
    };
  }

  return null;
}

/**
 * Validate URL format.
 */
export function validateUrl(value: unknown, field: string): ValidationErrorItem | null {
  if (typeof value !== 'string') {
    return {
      field,
      code: 'VALIDATION_INVALID_TYPE',
      message: `${field} must be a string`,
      value,
    };
  }

  try {
    new URL(value);
    return null;
  } catch {
    return {
      field,
      code: 'VALIDATION_INVALID_FORMAT',
      message: `${field} must be a valid URL`,
      value,
    };
  }
}

/**
 * Validate enum value.
 */
export function validateEnum<T extends string>(
  value: unknown,
  field: string,
  allowedValues: readonly T[]
): ValidationErrorItem | null {
  if (typeof value !== 'string' || !allowedValues.includes(value as T)) {
    return {
      field,
      code: 'VALIDATION_INVALID_ENUM',
      message: `${field} must be one of: ${allowedValues.join(', ')}`,
      value,
    };
  }
  return null;
}

/**
 * Validate that an array has items.
 */
export function validateNonEmptyArray(
  value: unknown,
  field: string
): ValidationErrorItem | null {
  if (!Array.isArray(value) || value.length === 0) {
    return {
      field,
      code: 'VALIDATION_REQUIRED_FIELD',
      message: `${field} must be a non-empty array`,
      value,
    };
  }
  return null;
}

/**
 * Validate array item count.
 */
export function validateArrayLength(
  value: unknown,
  field: string,
  minLength: number,
  maxLength: number
): ValidationErrorItem | null {
  if (!Array.isArray(value)) {
    return {
      field,
      code: 'VALIDATION_INVALID_TYPE',
      message: `${field} must be an array`,
      value,
    };
  }

  if (value.length < minLength) {
    return {
      field,
      code: 'VALIDATION_TOO_SHORT',
      message: `${field} must have at least ${minLength} items`,
      value,
    };
  }

  if (value.length > maxLength) {
    return {
      field,
      code: 'VALIDATION_TOO_LONG',
      message: `${field} must have at most ${maxLength} items`,
      value,
    };
  }

  return null;
}

/**
 * Validate object shape.
 */
export function validateObject(
  value: unknown,
  field: string
): ValidationErrorItem | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return {
      field,
      code: 'VALIDATION_INVALID_TYPE',
      message: `${field} must be an object`,
      value,
    };
  }
  return null;
}

/**
 * Validate date format.
 */
export function validateDate(value: unknown, field: string): ValidationErrorItem | null {
  if (value instanceof Date) {
    if (isNaN(value.getTime())) {
      return {
        field,
        code: 'VALIDATION_INVALID_FORMAT',
        message: `${field} must be a valid date`,
        value,
      };
    }
    return null;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return {
        field,
        code: 'VALIDATION_INVALID_FORMAT',
        message: `${field} must be a valid date`,
        value,
      };
    }
    return null;
  }

  return {
    field,
    code: 'VALIDATION_INVALID_TYPE',
    message: `${field} must be a date`,
    value,
  };
}

/**
 * Validate UUID format.
 */
export function validateUUID(value: unknown, field: string): ValidationErrorItem | null {
  if (typeof value !== 'string') {
    return {
      field,
      code: 'VALIDATION_INVALID_TYPE',
      message: `${field} must be a string`,
      value,
    };
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(value)) {
    return {
      field,
      code: 'VALIDATION_INVALID_FORMAT',
      message: `${field} must be a valid UUID`,
      value,
    };
  }

  return null;
}

/**
 * Validate Telegram ID is a positive integer.
 */
export function validateTelegramId(value: unknown, field: string): ValidationErrorItem | null {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    return {
      field,
      code: 'VALIDATION_INVALID_TYPE',
      message: `${field} must be a positive integer Telegram ID`,
      value,
    };
  }
  return null;
}
