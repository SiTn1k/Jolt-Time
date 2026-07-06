/**
 * SnapshotValidator
 *
 * Validates hardening snapshot data.
 */

import { SnapshotId } from '../value-objects/SnapshotId';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SEMVER_REGEX = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?(\+[a-zA-Z0-9.]+)?$/;

/**
 * Result of snapshot validation.
 */
export interface SnapshotValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for hardening snapshot data.
 */
export class SnapshotValidator {
  /**
   * Validates a snapshot ID format.
   */
  public static isValidSnapshotId(snapshotId: string | null | undefined): boolean {
    if (!snapshotId || snapshotId.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(snapshotId);
  }

  /**
   * Validates a system version string.
   */
  public static isValidSystemVersion(version: string | null | undefined): boolean {
    if (!version || version.trim().length === 0) {
      return false;
    }
    return SEMVER_REGEX.test(version);
  }

  /**
   * Validates a module count.
   */
  public static isValidModuleCount(count: number | null | undefined): boolean {
    if (count === null || count === undefined) {
      return false;
    }
    return Number.isInteger(count) && count >= 0;
  }

  /**
   * Validates a health status.
   */
  public static isValidHealthStatus(status: string | null | undefined): boolean {
    if (!status || status.trim().length === 0) {
      return false;
    }
    const validStatuses = ['healthy', 'degraded', 'unhealthy', 'unknown'];
    return validStatuses.includes(status.toLowerCase());
  }

  /**
   * Validates a complete snapshot.
   */
  public static validate(data: {
    snapshotId?: string;
    systemVersion?: string;
    moduleCount?: number;
    healthStatus?: string;
  }): SnapshotValidationResult {
    const errors: string[] = [];

    if (data.snapshotId !== undefined) {
      if (!data.snapshotId || data.snapshotId.trim().length === 0) {
        errors.push('Snapshot ID is required');
      } else if (!SnapshotId.isValid(data.snapshotId)) {
        errors.push('Snapshot ID must be a valid UUID');
      }
    }

    if (data.systemVersion !== undefined) {
      if (!data.systemVersion || data.systemVersion.trim().length === 0) {
        errors.push('System version is required');
      } else if (!this.isValidSystemVersion(data.systemVersion)) {
        errors.push('System version must be a valid semantic version (e.g., 1.0.0)');
      }
    }

    if (data.moduleCount !== undefined && !this.isValidModuleCount(data.moduleCount)) {
      errors.push('Module count must be a non-negative integer');
    }

    if (data.healthStatus !== undefined && !this.isValidHealthStatus(data.healthStatus)) {
      errors.push('Health status must be one of: healthy, degraded, unhealthy, unknown');
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
    systemVersion?: string;
    moduleCount?: number;
    healthStatus?: string;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Snapshot validation failed: ${result.errors.join('; ')}`);
    }
  }
}
