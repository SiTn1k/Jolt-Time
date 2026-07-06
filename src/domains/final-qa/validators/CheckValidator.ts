/**
 * Check Validator
 *
 * Validates QA check data according to domain rules.
 */

import { QAStatus, QA_STATUS_CONSTRAINTS } from '../types/QAStatus';
import { CheckSeverity, CHECK_SEVERITY_CONSTRAINTS } from '../types/CheckSeverity';
import { QA_METADATA_CONSTRAINTS } from '../types/QAMetadata';

/**
 * Result of QA check validation.
 */
export interface CheckValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for QA checks.
 */
export class CheckValidator {
  /**
   * Validates a QA status type.
   * @param status The status to validate
   * @returns Validation result with any error message
   */
  public static validateStatus(status: string | null | undefined): CheckValidationResult {
    if (status === null || status === undefined) {
      return {
        isValid: false,
        error: 'Status is required',
      };
    }

    const validStatuses = Object.values(QAStatus);
    if (!validStatuses.includes(status as QAStatus)) {
      return {
        isValid: false,
        error: `Invalid status type. Must be one of: ${validStatuses.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a check severity type.
   * @param severity The severity to validate
   * @returns Validation result with any error message
   */
  public static validateSeverity(severity: string | null | undefined): CheckValidationResult {
    if (severity === null || severity === undefined) {
      return {
        isValid: false,
        error: 'Severity is required',
      };
    }

    const validSeverities = Object.values(CheckSeverity);
    if (!validSeverities.includes(severity as CheckSeverity)) {
      return {
        isValid: false,
        error: `Invalid severity type. Must be one of: ${validSeverities.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a check title.
   * @param title The title to validate
   * @returns Validation result with any error message
   */
  public static validateTitle(title: string | null | undefined): CheckValidationResult {
    if (title === null || title === undefined) {
      return {
        isValid: false,
        error: 'Title is required',
      };
    }

    if (title.trim().length === 0) {
      return {
        isValid: false,
        error: 'Title cannot be empty',
      };
    }

    if (title.length > 256) {
      return {
        isValid: false,
        error: 'Title must be at most 256 characters',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a completion timestamp.
   * @param completedAt The timestamp to validate
   * @returns Validation result with any error message
   */
  public static validateCompletedAt(completedAt: string | Date | null | undefined): CheckValidationResult {
    if (completedAt === null || completedAt === undefined) {
      return { isValid: true }; // Optional field
    }

    const date = typeof completedAt === 'string' ? new Date(completedAt) : completedAt;

    if (isNaN(date.getTime())) {
      return {
        isValid: false,
        error: 'Invalid date format',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates metadata fields.
   * @param metadata The metadata to validate
   * @returns Validation result with any error message
   */
  public static validateMetadata(metadata: Record<string, unknown> | null | undefined): CheckValidationResult {
    if (metadata === null || metadata === undefined) {
      return { isValid: true }; // Metadata is optional
    }

    if (metadata.checkType && typeof metadata.checkType === 'string') {
      if (metadata.checkType.length > QA_METADATA_CONSTRAINTS.MAX_CHECK_TYPE_LENGTH) {
        return {
          isValid: false,
          error: `Check type must be at most ${QA_METADATA_CONSTRAINTS.MAX_CHECK_TYPE_LENGTH} characters`,
        };
      }
    }

    if (metadata.moduleName && typeof metadata.moduleName === 'string') {
      if (metadata.moduleName.length > QA_METADATA_CONSTRAINTS.MAX_MODULE_NAME_LENGTH) {
        return {
          isValid: false,
          error: `Module name must be at most ${QA_METADATA_CONSTRAINTS.MAX_MODULE_NAME_LENGTH} characters`,
        };
      }
    }

    if (metadata.errorMessage && typeof metadata.errorMessage === 'string') {
      if (metadata.errorMessage.length > QA_METADATA_CONSTRAINTS.MAX_ERROR_MESSAGE_LENGTH) {
        return {
          isValid: false,
          error: `Error message must be at most ${QA_METADATA_CONSTRAINTS.MAX_ERROR_MESSAGE_LENGTH} characters`,
        };
      }
    }

    if (metadata.notes && typeof metadata.notes === 'string') {
      if (metadata.notes.length > QA_METADATA_CONSTRAINTS.MAX_NOTES_LENGTH) {
        return {
          isValid: false,
          error: `Notes must be at most ${QA_METADATA_CONSTRAINTS.MAX_NOTES_LENGTH} characters`,
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Validates all QA check fields together.
   * @param params QA check fields to validate
   * @returns Validation result with any error message
   */
  public static validateCheck(params: {
    title?: string;
    status?: string;
    severity?: string;
    completedAt?: string | Date | null;
    metadata?: Record<string, unknown>;
  }): CheckValidationResult {
    const titleResult = this.validateTitle(params.title);
    if (!titleResult.isValid) return titleResult;

    const statusResult = this.validateStatus(params.status);
    if (!statusResult.isValid) return statusResult;

    const severityResult = this.validateSeverity(params.severity);
    if (!severityResult.isValid) return severityResult;

    const completedAtResult = this.validateCompletedAt(params.completedAt);
    if (!completedAtResult.isValid) return completedAtResult;

    const metadataResult = this.validateMetadata(params.metadata);
    if (!metadataResult.isValid) return metadataResult;

    return { isValid: true };
  }

  /**
   * Validates a check and throws if invalid.
   * @param params Check fields to validate
   * @throws Error with validation details if invalid
   */
  public static validateCheckOrThrow(params: {
    title?: string;
    status?: string;
    severity?: string;
    completedAt?: string | Date | null;
    metadata?: Record<string, unknown>;
  }): void {
    const result = this.validateCheck(params);
    if (!result.isValid) {
      throw new Error(`QA check validation failed: ${result.error}`);
    }
  }
}
