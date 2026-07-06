/**
 * Snapshot Validator
 *
 * Validates snapshot data according to release rules.
 */

import { SnapshotId } from '../value-objects/SnapshotId';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const GIT_COMMIT_REGEX = /^[0-9a-f]{40}$/i;

/**
 * Result of snapshot validation.
 */
export interface SnapshotValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for snapshot data.
 */
export class SnapshotValidator {
  /**
   * Validates a snapshot ID format.
   */
  public static isValidSnapshotId(snapshotId: string | null | undefined): boolean {
    if (!snapshotId || snapshotId.trim().length === 0) {
      return false;
    }
    return SnapshotId.isValid(snapshotId);
  }

  /**
   * Validates a backend version string.
   */
  public static isValidBackendVersion(version: string | null | undefined): boolean {
    if (!version || version.trim().length === 0) {
      return false;
    }
    return version.length >= 1 && version.length <= 50;
  }

  /**
   * Validates a database version string.
   */
  public static isValidDatabaseVersion(version: string | null | undefined): boolean {
    if (!version || version.trim().length === 0) {
      return false;
    }
    return version.length >= 1 && version.length <= 50;
  }

  /**
   * Validates a git commit hash.
   */
  public static isValidGitCommit(commit: string | null | undefined): boolean {
    if (!commit || commit.trim().length === 0) {
      return false;
    }
    // Allow full 40-char hash or short 7-char hash
    if (commit.length === 40) {
      return GIT_COMMIT_REGEX.test(commit);
    }
    if (commit.length === 7) {
      return /^[0-9a-f]{7}$/i.test(commit);
    }
    return false;
  }

  /**
   * Validates a complete snapshot.
   */
  public static validate(data: {
    snapshotId?: string;
    backendVersion?: string;
    databaseVersion?: string;
    gitCommit?: string;
  }): SnapshotValidationResult {
    const errors: string[] = [];

    if (data.snapshotId !== undefined) {
      if (!data.snapshotId || data.snapshotId.trim().length === 0) {
        errors.push('Snapshot ID is required');
      } else if (!this.isValidSnapshotId(data.snapshotId)) {
        errors.push('Snapshot ID must be a valid UUID');
      }
    }

    if (data.backendVersion !== undefined) {
      if (!this.isValidBackendVersion(data.backendVersion)) {
        errors.push('Backend version is required and must be at most 50 characters');
      }
    }

    if (data.databaseVersion !== undefined) {
      if (!this.isValidDatabaseVersion(data.databaseVersion)) {
        errors.push('Database version is required and must be at most 50 characters');
      }
    }

    if (data.gitCommit !== undefined) {
      if (!this.isValidGitCommit(data.gitCommit)) {
        errors.push('Git commit must be a valid 40-character hash or 7-character short hash');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates snapshot data and throws if invalid.
   */
  public static validateOrThrow(data: {
    snapshotId?: string;
    backendVersion?: string;
    databaseVersion?: string;
    gitCommit?: string;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Snapshot validation failed: ${result.errors.join('; ')}`);
    }
  }
}
