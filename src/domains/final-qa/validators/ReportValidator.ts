/**
 * Report Validator
 *
 * Validates QA report data according to domain rules.
 */

import { QA_METADATA_CONSTRAINTS } from '../types/QAMetadata';

/**
 * Result of QA report validation.
 */
export interface ReportValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for QA reports.
 */
export class ReportValidator {
  /**
   * Validates a passed checks count.
   * @param passedChecks The count to validate
   * @returns Validation result with any error message
   */
  public static validatePassedChecks(passedChecks: number | null | undefined): ReportValidationResult {
    if (passedChecks === null || passedChecks === undefined) {
      return {
        isValid: false,
        error: 'Passed checks count is required',
      };
    }

    if (!Number.isInteger(passedChecks)) {
      return {
        isValid: false,
        error: 'Passed checks count must be an integer',
      };
    }

    if (passedChecks < 0) {
      return {
        isValid: false,
        error: 'Passed checks count must be non-negative',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a failed checks count.
   * @param failedChecks The count to validate
   * @returns Validation result with any error message
   */
  public static validateFailedChecks(failedChecks: number | null | undefined): ReportValidationResult {
    if (failedChecks === null || failedChecks === undefined) {
      return {
        isValid: false,
        error: 'Failed checks count is required',
      };
    }

    if (!Number.isInteger(failedChecks)) {
      return {
        isValid: false,
        error: 'Failed checks count must be an integer',
      };
    }

    if (failedChecks < 0) {
      return {
        isValid: false,
        error: 'Failed checks count must be non-negative',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a warnings count.
   * @param warnings The count to validate
   * @returns Validation result with any error message
   */
  public static validateWarnings(warnings: number | null | undefined): ReportValidationResult {
    if (warnings === null || warnings === undefined) {
      return {
        isValid: false,
        error: 'Warnings count is required',
      };
    }

    if (!Number.isInteger(warnings)) {
      return {
        isValid: false,
        error: 'Warnings count must be an integer',
      };
    }

    if (warnings < 0) {
      return {
        isValid: false,
        error: 'Warnings count must be non-negative',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a creation timestamp.
   * @param createdAt The timestamp to validate
   * @returns Validation result with any error message
   */
  public static validateCreatedAt(createdAt: string | Date | null | undefined): ReportValidationResult {
    if (createdAt === null || createdAt === undefined) {
      return { isValid: true }; // Optional field
    }

    const date = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;

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
  public static validateMetadata(metadata: Record<string, unknown> | null | undefined): ReportValidationResult {
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
   * Validates all QA report fields together.
   * @param params QA report fields to validate
   * @returns Validation result with any error message
   */
  public static validateReport(params: {
    passedChecks?: number;
    failedChecks?: number;
    warnings?: number;
    createdAt?: string | Date | null;
    metadata?: Record<string, unknown>;
  }): ReportValidationResult {
    const passedChecksResult = this.validatePassedChecks(params.passedChecks);
    if (!passedChecksResult.isValid) return passedChecksResult;

    const failedChecksResult = this.validateFailedChecks(params.failedChecks);
    if (!failedChecksResult.isValid) return failedChecksResult;

    const warningsResult = this.validateWarnings(params.warnings);
    if (!warningsResult.isValid) return warningsResult;

    const createdAtResult = this.validateCreatedAt(params.createdAt);
    if (!createdAtResult.isValid) return createdAtResult;

    const metadataResult = this.validateMetadata(params.metadata);
    if (!metadataResult.isValid) return metadataResult;

    return { isValid: true };
  }

  /**
   * Validates a report and throws if invalid.
   * @param params Report fields to validate
   * @throws Error with validation details if invalid
   */
  public static validateReportOrThrow(params: {
    passedChecks?: number;
    failedChecks?: number;
    warnings?: number;
    createdAt?: string | Date | null;
    metadata?: Record<string, unknown>;
  }): void {
    const result = this.validateReport(params);
    if (!result.isValid) {
      throw new Error(`QA report validation failed: ${result.error}`);
    }
  }
}
