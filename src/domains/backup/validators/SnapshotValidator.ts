/**
 * SnapshotValidator
 *
 * Validator for backup snapshot operations.
 * Validates snapshot creation, updates, and queries.
 */

import type { BackupSnapshot } from '../entities/BackupSnapshot';
import type { SnapshotId } from '../value-objects/SnapshotId';
import type { BackupType } from '../types/BackupType';
import type { BackupStatus } from '../types/BackupStatus';
import type { SnapshotMetadata } from '../types/BackupMetadata';

/**
 * Validation result type.
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * SnapshotValidator class.
 * Provides validation methods for snapshot operations.
 */
export class SnapshotValidator {
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
   * Validates snapshot creation parameters.
   */
  public validateCreateSnapshot(params: {
    snapshotName: string;
    backupType: BackupType;
    storageLocation: string;
  }): ValidationResult {
    const errors: string[] = [];

    if (!params.snapshotName || params.snapshotName.trim().length === 0) {
      errors.push('Snapshot name is required');
    } else if (params.snapshotName.length > 255) {
      errors.push('Snapshot name must be 255 characters or less');
    }

    const validTypes: BackupType[] = ['full', 'incremental', 'configuration', 'database', 'analytics', 'audit'];
    if (!validTypes.includes(params.backupType)) {
      errors.push(`Invalid backup type. Valid types are: ${validTypes.join(', ')}`);
    }

    if (!params.storageLocation || params.storageLocation.trim().length === 0) {
      errors.push('Storage location is required');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates snapshot update parameters.
   */
  public validateUpdateSnapshot(params: {
    status?: BackupStatus;
    size?: number;
    checksum?: string | null;
  }): ValidationResult {
    const errors: string[] = [];

    if (params.status !== undefined) {
      const validStatuses: BackupStatus[] = ['pending', 'in_progress', 'completed', 'failed', 'cancelled', 'verified'];
      if (!validStatuses.includes(params.status)) {
        errors.push(`Invalid status. Valid statuses are: ${validStatuses.join(', ')}`);
      }
    }

    if (params.size !== undefined && params.size < 0) {
      errors.push('Size cannot be negative');
    }

    if (params.checksum !== undefined && params.checksum !== null) {
      if (typeof params.checksum !== 'string' || params.checksum.trim().length === 0) {
        errors.push('Checksum must be a non-empty string');
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates a snapshot entity.
   */
  public validateSnapshot(snapshot: BackupSnapshot): ValidationResult {
    const errors: string[] = [];

    if (!snapshot.snapshotId) {
      errors.push('Snapshot ID is required');
    }

    if (!snapshot.snapshotName || snapshot.snapshotName.trim().length === 0) {
      errors.push('Snapshot name is required');
    }

    const validTypes: BackupType[] = ['full', 'incremental', 'configuration', 'database', 'analytics', 'audit'];
    if (!validTypes.includes(snapshot.backupType)) {
      errors.push('Valid backup type is required');
    }

    const validStatuses: BackupStatus[] = ['pending', 'in_progress', 'completed', 'failed', 'cancelled', 'verified'];
    if (!validStatuses.includes(snapshot.status)) {
      errors.push('Valid backup status is required');
    }

    if (snapshot.size < 0) {
      errors.push('Size cannot be negative');
    }

    if (!snapshot.storageLocation || snapshot.storageLocation.trim().length === 0) {
      errors.push('Storage location is required');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates snapshot metadata.
   */
  public validateSnapshotMetadata(metadata: SnapshotMetadata): ValidationResult {
    const errors: string[] = [];

    if (!metadata.name || metadata.name.trim().length === 0) {
      errors.push('Metadata name is required');
    }

    if (metadata.tableCount !== undefined && metadata.tableCount < 0) {
      errors.push('Table count cannot be negative');
    }

    if (metadata.recordCount !== undefined && metadata.recordCount < 0) {
      errors.push('Record count cannot be negative');
    }

    if (metadata.compressionRatio !== null && metadata.compressionRatio !== undefined) {
      if (metadata.compressionRatio < 0 || metadata.compressionRatio > 1) {
        errors.push('Compression ratio must be between 0 and 1');
      }
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
}
