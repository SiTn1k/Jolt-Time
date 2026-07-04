/**
 * BackupValidator
 *
 * Validator for backup-related operations.
 * Validates backup metadata, configuration, and operations.
 */

import type { BackupType } from '../types/BackupType';
import type { BackupStatus } from '../types/BackupStatus';
import type { StorageProvider } from '../types/StorageProvider';
import type { BackupMetadata, JobMetadata } from '../types/BackupMetadata';

/**
 * Validation result type.
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * BackupValidator class.
 * Provides validation methods for backup operations.
 */
export class BackupValidator {
  /**
   * Validates a backup type.
   */
  public validateBackupType(type: BackupType): ValidationResult {
    const errors: string[] = [];
    const validTypes: BackupType[] = ['full', 'incremental', 'configuration', 'database', 'analytics', 'audit'];

    if (!validTypes.includes(type)) {
      errors.push(`Invalid backup type: ${type}. Valid types are: ${validTypes.join(', ')}`);
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates a backup status.
   */
  public validateBackupStatus(status: BackupStatus): ValidationResult {
    const errors: string[] = [];
    const validStatuses: BackupStatus[] = ['pending', 'in_progress', 'completed', 'failed', 'cancelled', 'verified'];

    if (!validStatuses.includes(status)) {
      errors.push(`Invalid backup status: ${status}. Valid statuses are: ${validStatuses.join(', ')}`);
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates a storage provider.
   */
  public validateStorageProvider(provider: StorageProvider): ValidationResult {
    const errors: string[] = [];
    const validProviders: StorageProvider[] = ['local', 'supabase', 's3', 'gcs', 'azure', 'custom'];

    if (!validProviders.includes(provider)) {
      errors.push(`Invalid storage provider: ${provider}. Valid providers are: ${validProviders.join(', ')}`);
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates backup metadata.
   */
  public validateBackupMetadata(metadata: BackupMetadata): ValidationResult {
    const errors: string[] = [];

    if (!metadata.name || metadata.name.trim().length === 0) {
      errors.push('Backup name is required');
    }

    if (metadata.name && metadata.name.length > 255) {
      errors.push('Backup name must be 255 characters or less');
    }

    if (metadata.description && metadata.description.length > 1000) {
      errors.push('Backup description must be 1000 characters or less');
    }

    if (metadata.tags && !Array.isArray(metadata.tags)) {
      errors.push('Tags must be an array');
    }

    if (metadata.tags) {
      for (const tag of metadata.tags) {
        if (typeof tag !== 'string') {
          errors.push('Each tag must be a string');
          break;
        }
        if (tag.length > 50) {
          errors.push('Each tag must be 50 characters or less');
          break;
        }
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates job metadata.
   */
  public validateJobMetadata(metadata: JobMetadata): ValidationResult {
    const errors: string[] = [];

    if (!metadata.jobType || metadata.jobType.trim().length === 0) {
      errors.push('Job type is required');
    }

    if (metadata.retentionDays !== undefined) {
      if (metadata.retentionDays < 1) {
        errors.push('Retention days must be at least 1');
      }
      if (metadata.retentionDays > 3650) {
        errors.push('Retention days must be 3650 or less');
      }
    }

    if (metadata.intervalMs !== null && metadata.intervalMs !== undefined) {
      if (metadata.intervalMs < 60000) {
        errors.push('Interval must be at least 60000ms (1 minute)');
      }
      if (metadata.intervalMs > 604800000) {
        errors.push('Interval must be 604800000ms (1 week) or less');
      }
    }

    if (metadata.cronExpression !== null && metadata.cronExpression !== undefined) {
      if (typeof metadata.cronExpression !== 'string' || metadata.cronExpression.trim().length === 0) {
        errors.push('Cron expression must be a non-empty string');
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates storage location.
   */
  public validateStorageLocation(location: string): ValidationResult {
    const errors: string[] = [];

    if (!location || location.trim().length === 0) {
      errors.push('Storage location is required');
    }

    if (location && location.length > 500) {
      errors.push('Storage location must be 500 characters or less');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates snapshot name.
   */
  public validateSnapshotName(name: string): ValidationResult {
    const errors: string[] = [];

    if (!name || name.trim().length === 0) {
      errors.push('Snapshot name is required');
    }

    if (name && name.length > 255) {
      errors.push('Snapshot name must be 255 characters or less');
    }

    // Check for valid characters (alphanumeric, spaces, hyphens, underscores)
    const validNameRegex = /^[a-zA-Z0-9\s\-_]+$/;
    if (name && !validNameRegex.test(name)) {
      errors.push('Snapshot name can only contain alphanumeric characters, spaces, hyphens, and underscores');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates job name.
   */
  public validateJobName(name: string): ValidationResult {
    const errors: string[] = [];

    if (!name || name.trim().length === 0) {
      errors.push('Job name is required');
    }

    if (name && name.length > 255) {
      errors.push('Job name must be 255 characters or less');
    }

    // Check for valid characters (alphanumeric, spaces, hyphens, underscores)
    const validNameRegex = /^[a-zA-Z0-9\s\-_]+$/;
    if (name && !validNameRegex.test(name)) {
      errors.push('Job name can only contain alphanumeric characters, spaces, hyphens, and underscores');
    }

    return { isValid: errors.length === 0, errors };
  }
}
