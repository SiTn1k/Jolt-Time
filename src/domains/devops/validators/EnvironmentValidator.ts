/**
 * Environment Validator
 *
 * Validates environment-related data.
 */

import { EnvironmentType } from '../types/EnvironmentType';

/**
 * Result of environment validation.
 */
export interface EnvironmentValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for environment data.
 */
export class EnvironmentValidator {
  private static readonly NAME_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9-_]*[a-zA-Z0-9]$/;
  private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  /**
   * Validates that a name is valid.
   */
  public static isValidName(name: string | null | undefined): boolean {
    if (!name || typeof name !== 'string') {
      return false;
    }
    return this.NAME_REGEX.test(name) && name.length >= 2 && name.length <= 50;
  }

  /**
   * Validates that an environment type is valid.
   */
  public static isValidType(type: string | null | undefined): boolean {
    if (!type || typeof type !== 'string') {
      return false;
    }
    return Object.values(EnvironmentType).includes(type as EnvironmentType);
  }

  /**
   * Validates that a status is valid.
   */
  public static isValidStatus(status: string | null | undefined): boolean {
    if (!status || typeof status !== 'string') {
      return false;
    }
    return status === 'active' || status === 'inactive';
  }

  /**
   * Validates complete environment data.
   */
  public static validateEnvironment(data: {
    name?: string;
    type?: string;
    status?: string;
  }): EnvironmentValidationResult {
    const errors: string[] = [];

    if (data.name !== undefined) {
      if (!this.isValidName(data.name)) {
        errors.push('Name must be 2-50 alphanumeric characters, starting and ending with alphanumeric');
      }
    }

    if (data.type !== undefined) {
      if (!this.isValidType(data.type)) {
        errors.push(`Type must be one of: ${Object.values(EnvironmentType).join(', ')}`);
      }
    }

    if (data.status !== undefined) {
      if (!this.isValidStatus(data.status)) {
        errors.push('Status must be either "active" or "inactive"');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates environment data and throws if invalid.
   */
  public static validateEnvironmentOrThrow(data: {
    name?: string;
    type?: string;
    status?: string;
  }): void {
    const result = this.validateEnvironment(data);
    if (!result.isValid) {
      throw new Error(`Environment validation failed: ${result.errors.join('; ')}`);
    }
  }
}