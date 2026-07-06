/**
 * Snapshot Validator
 *
 * Validates QA snapshot data according to domain rules.
 */

import { HealthStatus } from '../types/HealthStatus';
import { QA_METADATA_CONSTRAINTS } from '../types/QAMetadata';

/**
 * Result of QA snapshot validation.
 */
export interface SnapshotValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for QA snapshots.
 */
export class SnapshotValidator {
  /**
   * Validates a backend version string.
   * @param backendVersion The version to validate
   * @returns Validation result with any error message
   */
  public static validateBackendVersion(backendVersion: string | null | undefined): SnapshotValidationResult {
    if (backendVersion === null || backendVersion === undefined) {
      return {
        isValid: false,
        error: 'Backend version is required',
      };
    }

    if (backendVersion.trim().length === 0) {
      return {
        isValid: false,
        error: 'Backend version cannot be empty',
      };
    }

    if (backendVersion.length > 64) {
      return {
        isValid: false,
        error: 'Backend version must be at most 64 characters',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a module count.
   * @param moduleCount The count to validate
   * @returns Validation result with any error message
   */
  public static validateModuleCount(moduleCount: number | null | undefined): SnapshotValidationResult {
    if (moduleCount === null || moduleCount === undefined) {
      return {
        isValid: false,
        error: 'Module count is required',
      };
    }

    if (!Number.isInteger(moduleCount)) {
      return {
        isValid: false,
        error: 'Module count must be an integer',
      };
    }

    if (moduleCount < 0) {
      return {
        isValid: false,
        error: 'Module count must be non-negative',
      };
    }

    if (moduleCount > 10000) {
      return {
        isValid: false,
        error: 'Module count exceeds maximum allowed value',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a health status.
   * @param healthStatus The status to validate
   * @returns Validation result with any error message
   */
  public static validateHealthStatus(healthStatus: string | null | undefined): SnapshotValidationResult {
    if (healthStatus === null || healthStatus === undefined) {
      return {
        isValid: false,
        error: 'Health status is required',
      };
    }

    const validStatuses = Object.values(HealthStatus);
    if (!validStatuses.includes(healthStatus as HealthStatus)) {
      return {
        isValid: false,
        error: `Invalid health status. Must be one of: ${validStatuses.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a creation timestamp.
   * @param createdAt The timestamp to validate
   * @returns Validation result with any error message
   */
  public static validateCreatedAt(createdAt: string | Date | null | undefined): SnapshotValidationResult {
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
  public static validateMetadata(metadata: Record<string, unknown> | null | undefined): SnapshotValidationResult {
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
   * Validates all QA snapshot fields together.
   * @param params QA snapshot fields to validate
   * @returns Validation result with any error message
   */
  public static validateSnapshot(params: {
    backendVersion?: string;
    moduleCount?: number;
    healthStatus?: string;
    createdAt?: string | Date | null;
    metadata?: Record<string, unknown>;
  }): SnapshotValidationResult {
    const backendVersionResult = this.validateBackendVersion(params.backendVersion);
    if (!backendVersionResult.isValid) return backendVersionResult;

    const moduleCountResult = this.validateModuleCount(params.moduleCount);
    if (!moduleCountResult.isValid) return moduleCountResult;

    const healthStatusResult = this.validateHealthStatus(params.healthStatus);
    if (!healthStatusResult.isValid) return healthStatusResult;

    const createdAtResult = this.validateCreatedAt(params.createdAt);
    if (!createdAtResult.isValid) return createdAtResult;

    const metadataResult = this.validateMetadata(params.metadata);
    if (!metadataResult.isValid) return metadataResult;

    return { isValid: true };
  }

  /**
   * Validates a snapshot and throws if invalid.
   * @param params Snapshot fields to validate
   * @throws Error with validation details if invalid
   */
  public static validateSnapshotOrThrow(params: {
    backendVersion?: string;
    moduleCount?: number;
    healthStatus?: string;
    createdAt?: string | Date | null;
    metadata?: Record<string, unknown>;
  }): void {
    const result = this.validateSnapshot(params);
    if (!result.isValid) {
      throw new Error(`QA snapshot validation failed: ${result.error}`);
    }
  }
}
