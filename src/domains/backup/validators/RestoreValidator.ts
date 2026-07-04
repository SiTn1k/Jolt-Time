/**
 * RestoreValidator
 *
 * Validator for restore point operations.
 * Validates restore point creation, queries, and metadata.
 */

import type { RestorePoint } from '../entities/RestorePoint';
import type { RestorePointId } from '../value-objects/RestorePointId';
import type { SnapshotId } from '../value-objects/SnapshotId';
import type { RestoreMetadata } from '../types/BackupMetadata';

/**
 * Validation result type.
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * RestoreValidator class.
 * Provides validation methods for restore point operations.
 */
export class RestoreValidator {
  /**
   * Validates a restore point ID.
   */
  public validateRestorePointId(id: string): ValidationResult {
    const errors: string[] = [];
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!id || id.trim().length === 0) {
      errors.push('Restore point ID cannot be empty');
    } else if (!uuidRegex.test(id)) {
      errors.push('Restore point ID must be a valid UUID');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates a snapshot ID.
   */
  public validateSnapshotId(id: string): ValidationResult {
    const errors: string[] = [];
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!id || id.trim().length === 0) {
      errors.push('Snapshot ID cannot be empty');
    } else if (!uuidRegex.test(id)) {
      errors.push('Snapshot ID must be a valid UUID');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates restore point creation parameters.
   */
  public validateCreateRestorePoint(params: {
    snapshotId: string;
    description?: string;
  }): ValidationResult {
    const errors: string[] = [];

    if (!params.snapshotId || params.snapshotId.trim().length === 0) {
      errors.push('Snapshot ID is required');
    } else {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(params.snapshotId)) {
        errors.push('Snapshot ID must be a valid UUID');
      }
    }

    if (params.description && params.description.length > 500) {
      errors.push('Description must be 500 characters or less');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates a restore point entity.
   */
  public validateRestorePoint(restorePoint: RestorePoint): ValidationResult {
    const errors: string[] = [];

    if (!restorePoint.restorePointId) {
      errors.push('Restore point ID is required');
    }

    if (!restorePoint.snapshotId) {
      errors.push('Snapshot ID is required');
    }

    if (!restorePoint.createdAt) {
      errors.push('Created at timestamp is required');
    }

    if (restorePoint.description && restorePoint.description.length > 500) {
      errors.push('Description must be 500 characters or less');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates restore metadata.
   */
  public validateRestoreMetadata(metadata: RestoreMetadata): ValidationResult {
    const errors: string[] = [];

    if (!metadata.originalBackupType || metadata.originalBackupType.trim().length === 0) {
      errors.push('Original backup type is required');
    }

    if (!metadata.originalSnapshotId || metadata.originalSnapshotId.trim().length === 0) {
      errors.push('Original snapshot ID is required');
    }

    if (metadata.tablesRestored && !Array.isArray(metadata.tablesRestored)) {
      errors.push('Tables restored must be an array');
    }

    if (metadata.recordsRestored !== undefined && metadata.recordsRestored < 0) {
      errors.push('Records restored cannot be negative');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates pagination parameters.
   */
  public validatePagination(params: { page?: number; pageSize?: number }): ValidationResult {
    const errors: string[] = [];

    if (params.page !== undefined) {
      if (params.page < 1) {
        errors.push('Page must be at least 1');
      }
    }

    if (params.pageSize !== undefined) {
      if (params.pageSize < 1) {
        errors.push('Page size must be at least 1');
      }
      if (params.pageSize > 100) {
        errors.push('Page size must be 100 or less');
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates a date range for filtering.
   */
  public validateDateRange(params: { startDate?: Date; endDate?: Date }): ValidationResult {
    const errors: string[] = [];

    if (params.startDate && params.endDate) {
      if (params.startDate > params.endDate) {
        errors.push('Start date must be before end date');
      }
    }

    return { isValid: errors.length === 0, errors };
  }
}
