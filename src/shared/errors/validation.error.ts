/**
 * Validation Error
 *
 * Error class for validation failures.
 */

import { ApplicationError } from './application.error';
import { ErrorCategory, ErrorSeverity } from '../constants';
import { ValidationErrorCodes, ValidationErrorItem } from '../types';

/**
 * Validation error for input validation failures.
 */
export class ValidationError extends ApplicationError {
  public readonly field?: string;
  public readonly errors: ValidationErrorItem[];

  constructor(params: {
    message: string;
    field?: string;
    errors?: ValidationErrorItem[];
    details?: Record<string, unknown>;
    context?: Record<string, unknown>;
    cause?: Error;
  }) {
    super({
      message: params.message,
      code: ValidationErrorCodes.REQUIRED_FIELD,
      category: ErrorCategory.VALIDATION,
      severity: ErrorSeverity.LOW,
      details: params.details,
      recoverable: false,
      context: params.context as Record<string, unknown> | undefined,
      cause: params.cause,
    });
    this.name = 'ValidationError';
    this.field = params.field;
    this.errors = params.errors || [];
  }

  /**
   * Add an error item.
   */
  addError(item: ValidationErrorItem): ValidationError {
    return new ValidationError({
      message: this.message,
      field: this.field,
      errors: [...this.errors, item],
      details: this.details,
      context: this.context as Record<string, unknown> | undefined,
      cause: this.cause as Error | undefined,
    });
  }

  /**
   * Create a required field error.
   */
  static required(field: string): ValidationError {
    return new ValidationError({
      message: `${field} is required`,
      field,
    });
  }

  /**
   * Create an invalid type error.
   */
  static invalidType(field: string, expectedType: string, actualType: string): ValidationError {
    return new ValidationError({
      message: `${field} must be of type ${expectedType}, got ${actualType}`,
      field,
      details: { expectedType, actualType },
    });
  }

  /**
   * Create an out of range error.
   */
  static outOfRange(
    field: string,
    min: number,
    max: number,
    actual: number
  ): ValidationError {
    return new ValidationError({
      message: `${field} must be between ${min} and ${max}, got ${actual}`,
      field,
      details: { min, max, actual },
    });
  }

  /**
   * Create a too short error.
   */
  static tooShort(field: string, minLength: number, actualLength: number): ValidationError {
    return new ValidationError({
      message: `${field} must be at least ${minLength} characters, got ${actualLength}`,
      field,
      details: { minLength, actualLength },
    });
  }

  /**
   * Create a too long error.
   */
  static tooLong(field: string, maxLength: number, actualLength: number): ValidationError {
    return new ValidationError({
      message: `${field} must be at most ${maxLength} characters, got ${actualLength}`,
      field,
      details: { maxLength, actualLength },
    });
  }

  /**
   * Create an invalid format error.
   */
  static invalidFormat(field: string, format: string): ValidationError {
    return new ValidationError({
      message: `${field} has invalid format. Expected: ${format}`,
      field,
      details: { format },
    });
  }

  /**
   * Create an invalid enum error.
   */
  static invalidEnum(field: string, allowedValues: string[], actualValue: unknown): ValidationError {
    return new ValidationError({
      message: `${field} must be one of: ${allowedValues.join(', ')}`,
      field,
      details: { allowedValues, actualValue },
    });
  }

  /**
   * Create a duplicate entry error.
   */
  static duplicateEntry(field: string, value: unknown): ValidationError {
    return new ValidationError({
      message: `${field} already exists: ${value}`,
      field,
      details: { value },
    });
  }
}

/**
 * Check if value is a ValidationError.
 */
export function isValidationError(value: unknown): value is ValidationError {
  return value instanceof ValidationError;
}
