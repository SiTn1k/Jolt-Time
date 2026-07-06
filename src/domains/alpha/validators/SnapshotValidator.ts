/**
 * Snapshot Validator
 *
 * Validates snapshot data according to alpha rules.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
    return UUID_REGEX.test(snapshotId);
  }

  /**
   * Validates a version string.
   */
  public static isValidVersion(version: string | null | undefined): boolean {
    if (!version || version.trim().length === 0) {
      return false;
    }
    // Version format: x.y.z or x.y.z-beta/alpha/rc
    const versionRegex = /^\d+\.\d+\.\d+(-[a-zA-Z]+)?$/;
    return versionRegex.test(version);
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
   * Validates a complete snapshot.
   */
  public static validate(data: {
    snapshotId?: string;
    backendVersion?: string;
    databaseVersion?: string;
    moduleCount?: number;
  }): SnapshotValidationResult {
    const errors: string[] = [];

    if (data.snapshotId !== undefined) {
      if (!data.snapshotId || data.snapshotId.trim().length === 0) {
        errors.push('Snapshot ID is required');
      } else if (!UUID_REGEX.test(data.snapshotId)) {
        errors.push('Snapshot ID must be a valid UUID');
      }
    }

    if (data.backendVersion !== undefined) {
      if (!data.backendVersion || data.backendVersion.trim().length === 0) {
        errors.push('Backend version is required');
      } else if (!this.isValidVersion(data.backendVersion)) {
        errors.push('Backend version must be in format x.y.z or x.y.z-suffix');
      }
    }

    if (data.databaseVersion !== undefined) {
      if (!data.databaseVersion || data.databaseVersion.trim().length === 0) {
        errors.push('Database version is required');
      } else if (!this.isValidVersion(data.databaseVersion)) {
        errors.push('Database version must be in format x.y.z or x.y.z-suffix');
      }
    }

    if (data.moduleCount !== undefined) {
      if (!this.isValidModuleCount(data.moduleCount)) {
        errors.push('Module count must be a non-negative integer');
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
    moduleCount?: number;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Snapshot validation failed: ${result.errors.join('; ')}`);
    }
  }
}
