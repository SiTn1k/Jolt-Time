/**
 * Issue Validator
 *
 * Validates stabilization issue data.
 */

import { IssueSeverity, ISSUE_SEVERITY_CONSTRAINTS } from '../types/IssueSeverity';
import { IssueStatus, ISSUE_STATUS_CONSTRAINTS } from '../types/IssueStatus';

/**
 * Result of issue validation.
 */
export interface IssueValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Constraints for issue fields.
 */
const ISSUE_CONSTRAINTS = {
  MAX_MODULE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 2000,
} as const;

/**
 * Validator for stabilization issues.
 */
export class IssueValidator {
  /**
   * Validates a module name.
   * @param module The module to validate
   * @returns Validation result
   */
  public static validateModule(module: string | null | undefined): IssueValidationResult {
    if (module === null || module === undefined) {
      return {
        isValid: false,
        error: 'Module is required',
      };
    }

    if (module.trim().length === 0) {
      return {
        isValid: false,
        error: 'Module cannot be empty',
      };
    }

    if (module.length > ISSUE_CONSTRAINTS.MAX_MODULE_LENGTH) {
      return {
        isValid: false,
        error: `Module must be at most ${ISSUE_CONSTRAINTS.MAX_MODULE_LENGTH} characters`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an issue severity.
   * @param severity The severity to validate
   * @returns Validation result
   */
  public static validateSeverity(severity: string | null | undefined): IssueValidationResult {
    if (severity === null || severity === undefined) {
      return {
        isValid: false,
        error: 'Severity is required',
      };
    }

    const validSeverities = ISSUE_SEVERITY_CONSTRAINTS.VALID_SEVERITIES;
    if (!validSeverities.includes(severity as IssueSeverity)) {
      return {
        isValid: false,
        error: `Invalid severity. Must be one of: ${validSeverities.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an issue status.
   * @param status The status to validate
   * @returns Validation result
   */
  public static validateStatus(status: string | null | undefined): IssueValidationResult {
    if (status === null || status === undefined) {
      return {
        isValid: false,
        error: 'Status is required',
      };
    }

    const validStatuses = ISSUE_STATUS_CONSTRAINTS.VALID_STATUSES;
    if (!validStatuses.includes(status as IssueStatus)) {
      return {
        isValid: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an issue description.
   * @param description The description to validate
   * @returns Validation result
   */
  public static validateDescription(description: string | null | undefined): IssueValidationResult {
    if (description === null || description === undefined) {
      return {
        isValid: false,
        error: 'Description is required',
      };
    }

    if (description.trim().length === 0) {
      return {
        isValid: false,
        error: 'Description cannot be empty',
      };
    }

    if (description.length > ISSUE_CONSTRAINTS.MAX_DESCRIPTION_LENGTH) {
      return {
        isValid: false,
        error: `Description must be at most ${ISSUE_CONSTRAINTS.MAX_DESCRIPTION_LENGTH} characters`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates all issue fields together.
   * @param params Issue fields to validate
   * @returns Validation result
   */
  public static validateIssue(params: {
    module?: string;
    severity?: string;
    description?: string;
    status?: string;
  }): IssueValidationResult {
    const moduleResult = this.validateModule(params.module);
    if (!moduleResult.isValid) return moduleResult;

    const severityResult = this.validateSeverity(params.severity);
    if (!severityResult.isValid) return severityResult;

    const descriptionResult = this.validateDescription(params.description);
    if (!descriptionResult.isValid) return descriptionResult;

    const statusResult = this.validateStatus(params.status);
    if (!statusResult.isValid) return statusResult;

    return { isValid: true };
  }

  /**
   * Validates an issue and throws if invalid.
   * @param params Issue fields to validate
   * @throws Error with validation details if invalid
   */
  public static validateIssueOrThrow(params: {
    module?: string;
    severity?: string;
    description?: string;
    status?: string;
  }): void {
    const result = this.validateIssue(params);
    if (!result.isValid) {
      throw new Error(`Issue validation failed: ${result.error}`);
    }
  }
}
