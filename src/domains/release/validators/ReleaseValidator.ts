/**
 * Release Validator
 *
 * Validates release data according to release rules.
 */

import { ReleaseStatus } from '../types/ReleaseStatus';
import { ReleaseStage } from '../types/ReleaseStage';
import { ReleaseId } from '../value-objects/ReleaseId';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SEMVER_REGEX = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?(\+[a-zA-Z0-9.]+)?$/;

/**
 * Result of release validation.
 */
export interface ReleaseValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for release data.
 */
export class ReleaseValidator {
  /**
   * Validates a release ID format.
   */
  public static isValidReleaseId(releaseId: string | null | undefined): boolean {
    if (!releaseId || releaseId.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(releaseId);
  }

  /**
   * Validates a semantic version string.
   */
  public static isValidVersion(version: string | null | undefined): boolean {
    if (!version || version.trim().length === 0) {
      return false;
    }
    return SEMVER_REGEX.test(version);
  }

  /**
   * Validates a release status.
   */
  public static isValidStatus(status: ReleaseStatus | null | undefined): boolean {
    if (status === null || status === undefined) {
      return true; // Optional
    }
    const validStatuses: ReleaseStatus[] = [
      ReleaseStatus.DRAFT,
      ReleaseStatus.PENDING_APPROVAL,
      ReleaseStatus.APPROVED,
      ReleaseStatus.REJECTED,
      ReleaseStatus.PUBLISHED,
      ReleaseStatus.ARCHIVED,
    ];
    return validStatuses.includes(status);
  }

  /**
   * Validates a release stage.
   */
  public static isValidStage(stage: ReleaseStage | null | undefined): boolean {
    if (stage === null || stage === undefined) {
      return true; // Optional
    }
    const validStages: ReleaseStage[] = [
      ReleaseStage.SUPPORT,
      ReleaseStage.INTERNAL_ALPHA,
      ReleaseStage.CLOSED_ALPHA,
      ReleaseStage.OPEN_ALPHA,
      ReleaseStage.RELEASE_CANDIDATE,
      ReleaseStage.PRODUCTION,
    ];
    return validStages.includes(stage);
  }

  /**
   * Validates a complete release.
   */
  public static validate(data: {
    releaseId?: string;
    version?: string;
    status?: ReleaseStatus;
    stage?: ReleaseStage;
  }): ReleaseValidationResult {
    const errors: string[] = [];

    if (data.releaseId !== undefined) {
      if (!data.releaseId || data.releaseId.trim().length === 0) {
        errors.push('Release ID is required');
      } else if (!ReleaseId.isValid(data.releaseId)) {
        errors.push('Release ID must be a valid UUID');
      }
    }

    if (data.version !== undefined) {
      if (!data.version || data.version.trim().length === 0) {
        errors.push('Version is required');
      } else if (!this.isValidVersion(data.version)) {
        errors.push('Version must be a valid semantic version (e.g., 1.0.0, 1.0.0-beta.1)');
      }
    }

    if (data.status !== undefined && !this.isValidStatus(data.status)) {
      errors.push('Status must be one of: draft, pending_approval, approved, rejected, published, archived');
    }

    if (data.stage !== undefined && !this.isValidStage(data.stage)) {
      errors.push('Stage must be one of: support, internal_alpha, closed_alpha, open_alpha, release_candidate, production');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates release data and throws if invalid.
   */
  public static validateOrThrow(data: {
    releaseId?: string;
    version?: string;
    status?: ReleaseStatus;
    stage?: ReleaseStage;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Release validation failed: ${result.errors.join('; ')}`);
    }
  }
}
