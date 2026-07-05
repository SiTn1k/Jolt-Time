/**
 * Deployment Validator
 *
 * Validates deployment-related data.
 */

import { DeploymentStatus } from '../types/DeploymentStatus';

/**
 * Result of deployment validation.
 */
export interface DeploymentValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for deployment data.
 */
export class DeploymentValidator {
  private static readonly VERSION_REGEX = /^[a-zA-Z0-9._-]+$/;
  private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  /**
   * Validates that a version string is valid.
   */
  public static isValidVersion(version: string | null | undefined): boolean {
    if (!version || typeof version !== 'string') {
      return false;
    }
    return this.VERSION_REGEX.test(version) && version.length >= 1 && version.length <= 100;
  }

  /**
   * Validates that an environment ID is valid.
   */
  public static isValidEnvironmentId(environmentId: string | null | undefined): boolean {
    if (!environmentId || typeof environmentId !== 'string') {
      return false;
    }
    return this.UUID_REGEX.test(environmentId);
  }

  /**
   * Validates that a status is a valid deployment status.
   */
  public static isValidStatus(status: string | null | undefined): boolean {
    if (!status || typeof status !== 'string') {
      return false;
    }
    return Object.values(DeploymentStatus).includes(status as DeploymentStatus);
  }

  /**
   * Validates complete deployment data.
   */
  public static validateDeployment(data: {
    version?: string;
    environmentId?: string;
    status?: string;
  }): DeploymentValidationResult {
    const errors: string[] = [];

    if (data.version !== undefined) {
      if (!this.isValidVersion(data.version)) {
        errors.push('Version must be 1-100 alphanumeric characters, dots, underscores, or hyphens');
      }
    }

    if (data.environmentId !== undefined) {
      if (!this.isValidEnvironmentId(data.environmentId)) {
        errors.push('Environment ID must be a valid UUID');
      }
    }

    if (data.status !== undefined) {
      if (!this.isValidStatus(data.status)) {
        errors.push(`Status must be one of: ${Object.values(DeploymentStatus).join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates deployment data and throws if invalid.
   */
  public static validateDeploymentOrThrow(data: {
    version?: string;
    environmentId?: string;
    status?: string;
  }): void {
    const result = this.validateDeployment(data);
    if (!result.isValid) {
      throw new Error(`Deployment validation failed: ${result.errors.join('; ')}`);
    }
  }
}