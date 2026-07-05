/**
 * Error Validator
 *
 * Validates system error data according to game rules.
 * Error Handling Foundation ONLY stores errors - it never modifies gameplay.
 */

import { ErrorSeverity, ERROR_SEVERITY_CONSTRAINTS } from '../types/ErrorSeverity';
import { ErrorStatus, ERROR_STATUS_CONSTRAINTS } from '../types/ErrorStatus';
import { ErrorCategoryType, ERROR_CATEGORY_TYPE_CONSTRAINTS } from '../types/ErrorCategoryType';
import { ERROR_METADATA_CONSTRAINTS } from '../types/ErrorMetadata';

/**
 * Result of error validation.
 */
export interface ErrorValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for system errors.
 */
export class ErrorValidator {
  /**
   * Validates an error code.
   * @param errorCode The error code to validate
   * @returns Validation result with any error message
   */
  public static validateErrorCode(errorCode: string | null | undefined): ErrorValidationResult {
    if (errorCode === null || errorCode === undefined) {
      return {
        isValid: false,
        error: 'Error code is required',
      };
    }

    if (typeof errorCode !== 'string') {
      return {
        isValid: false,
        error: 'Error code must be a string',
      };
    }

    if (errorCode.trim().length === 0) {
      return {
        isValid: false,
        error: 'Error code cannot be empty',
      };
    }

    if (errorCode.length > ERROR_SEVERITY_CONSTRAINTS.MAX_SEVERITY_LENGTH * 4) {
      return {
        isValid: false,
        error: `Error code must be at most ${ERROR_SEVERITY_CONSTRAINTS.MAX_SEVERITY_LENGTH * 4} characters`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an error severity.
   * @param severity The severity to validate
   * @returns Validation result with any error message
   */
  public static validateSeverity(severity: string | null | undefined): ErrorValidationResult {
    if (severity === null || severity === undefined) {
      return {
        isValid: false,
        error: 'Severity is required',
      };
    }

    const validSeverities = Object.values(ErrorSeverity);
    if (!validSeverities.includes(severity as ErrorSeverity)) {
      return {
        isValid: false,
        error: `Invalid severity. Must be one of: ${validSeverities.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an error status.
   * @param status The status to validate
   * @returns Validation result with any error message
   */
  public static validateStatus(status: string | null | undefined): ErrorValidationResult {
    if (status === null || status === undefined) {
      return {
        isValid: false,
        error: 'Status is required',
      };
    }

    const validStatuses = Object.values(ErrorStatus);
    if (!validStatuses.includes(status as ErrorStatus)) {
      return {
        isValid: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an error category type.
   * @param category The category to validate
   * @returns Validation result with any error message
   */
  public static validateCategory(category: string | null | undefined): ErrorValidationResult {
    if (category === null || category === undefined) {
      return {
        isValid: false,
        error: 'Category is required',
      };
    }

    const validCategories = Object.values(ErrorCategoryType);
    if (!validCategories.includes(category as ErrorCategoryType)) {
      return {
        isValid: false,
        error: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an error message.
   * @param message The message to validate
   * @returns Validation result with any error message
   */
  public static validateMessage(message: string | null | undefined): ErrorValidationResult {
    if (message === null || message === undefined) {
      return {
        isValid: false,
        error: 'Message is required',
      };
    }

    if (typeof message !== 'string') {
      return {
        isValid: false,
        error: 'Message must be a string',
      };
    }

    if (message.trim().length === 0) {
      return {
        isValid: false,
        error: 'Message cannot be empty',
      };
    }

    if (message.length > 2048) {
      return {
        isValid: false,
        error: 'Message must be at most 2048 characters',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an error context ID.
   * @param contextId The context ID to validate
   * @returns Validation result with any error message
   */
  public static validateContextId(contextId: string | null | undefined): ErrorValidationResult {
    if (contextId === null || contextId === undefined) {
      return { isValid: true }; // Optional field
    }

    if (typeof contextId !== 'string') {
      return {
        isValid: false,
        error: 'Context ID must be a string',
      };
    }

    if (contextId.trim().length === 0) {
      return {
        isValid: false,
        error: 'Context ID cannot be empty',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a stack trace.
   * @param stackTrace The stack trace to validate
   * @returns Validation result with any error message
   */
  public static validateStackTrace(stackTrace: string | null | undefined): ErrorValidationResult {
    if (stackTrace === null || stackTrace === undefined) {
      return { isValid: true }; // Optional field
    }

    if (typeof stackTrace !== 'string') {
      return {
        isValid: false,
        error: 'Stack trace must be a string',
      };
    }

    if (stackTrace.length > 10000) {
      return {
        isValid: false,
        error: 'Stack trace must be at most 10000 characters',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates all error fields together.
   * @param params Error fields to validate
   * @returns Validation result with any error message
   */
  public static validateError(params: {
    errorCode?: string;
    category?: string;
    severity?: string;
    message?: string;
    stackTrace?: string;
    contextId?: string;
  }): ErrorValidationResult {
    const codeResult = this.validateErrorCode(params.errorCode);
    if (!codeResult.isValid) return codeResult;

    const categoryResult = this.validateCategory(params.category);
    if (!categoryResult.isValid) return categoryResult;

    const severityResult = this.validateSeverity(params.severity);
    if (!severityResult.isValid) return severityResult;

    const messageResult = this.validateMessage(params.message);
    if (!messageResult.isValid) return messageResult;

    const stackResult = this.validateStackTrace(params.stackTrace);
    if (!stackResult.isValid) return stackResult;

    const contextResult = this.validateContextId(params.contextId);
    if (!contextResult.isValid) return contextResult;

    return { isValid: true };
  }

  /**
   * Validates an error and throws if invalid.
   * @param params Error fields to validate
   * @throws Error with validation details if invalid
   */
  public static validateErrorOrThrow(params: {
    errorCode?: string;
    category?: string;
    severity?: string;
    message?: string;
    stackTrace?: string;
    contextId?: string;
  }): void {
    const result = this.validateError(params);
    if (!result.isValid) {
      throw new Error(`System error validation failed: ${result.error}`);
    }
  }
}
