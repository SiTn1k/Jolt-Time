/**
 * Snapshot Validator
 *
 * Validation specific to integration snapshots.
 */

import type { IntegrationMetadata } from '../types/IntegrationMetadata';

/**
 * Validation result for snapshot validation.
 */
export interface SnapshotValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for integration snapshots.
 */
export class SnapshotValidator {
  /**
   * Validates a module ID array.
   * @param moduleIds The module IDs to validate
   * @param fieldName The field name for error messages
   * @returns Validation result
   */
  private static validateModuleIdArray(moduleIds: string[], fieldName: string): SnapshotValidationResult {
    const errors: string[] = [];

    if (!Array.isArray(moduleIds)) {
      errors.push(`${fieldName} must be an array`);
      return { isValid: false, errors };
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    for (let i = 0; i < moduleIds.length; i++) {
      if (typeof moduleIds[i] !== 'string') {
        errors.push(`${fieldName}[${i}] must be a string`);
      } else if (!uuidRegex.test(moduleIds[i])) {
        errors.push(`${fieldName}[${i}] must be a valid UUID`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates registered modules array.
   * @param moduleIds The registered module IDs to validate
   * @returns Validation result
   */
  public static validateRegisteredModules(moduleIds: string[]): SnapshotValidationResult {
    return this.validateModuleIdArray(moduleIds, 'registeredModules');
  }

  /**
   * Validates healthy modules array.
   * @param moduleIds The healthy module IDs to validate
   * @returns Validation result
   */
  public static validateHealthyModules(moduleIds: string[]): SnapshotValidationResult {
    const result = this.validateModuleIdArray(moduleIds, 'healthyModules');
    
    // Additional check: healthy modules should be a subset of registered modules
    if (result.isValid && moduleIds) {
      // This validation would need registered modules context
      // It's handled at the service level
    }

    return result;
  }

  /**
   * Validates failed modules array.
   * @param moduleIds The failed module IDs to validate
   * @returns Validation result
   */
  public static validateFailedModules(moduleIds: string[]): SnapshotValidationResult {
    return this.validateModuleIdArray(moduleIds, 'failedModules');
  }

  /**
   * Validates snapshot metadata.
   * @param metadata The metadata to validate
   * @returns Validation result
   */
  public static validateMetadata(metadata: IntegrationMetadata): SnapshotValidationResult {
    const errors: string[] = [];

    if (metadata === null || metadata === undefined) {
      return { isValid: true, errors: [] };
    }

    if (typeof metadata !== 'object') {
      errors.push('Metadata must be an object');
      return { isValid: false, errors };
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates that healthy and failed modules don't overlap.
   * @param healthyModules List of healthy module IDs
   * @param failedModules List of failed module IDs
   * @returns Validation result
   */
  public static validateModuleExclusivity(healthyModules: string[], failedModules: string[]): SnapshotValidationResult {
    const errors: string[] = [];

    if (!Array.isArray(healthyModules) || !Array.isArray(failedModules)) {
      return { isValid: true, errors: [] };
    }

    const overlap = healthyModules.filter((id) => failedModules.includes(id));
    if (overlap.length > 0) {
      errors.push(`Module IDs cannot be in both healthy and failed: ${overlap.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a complete snapshot creation request.
   * @param data The snapshot data to validate
   * @returns Validation result
   */
  public static validateCreate(data: {
    registeredModules?: string[];
    healthyModules?: string[];
    failedModules?: string[];
    metadata?: IntegrationMetadata;
  }): SnapshotValidationResult {
    const errors: string[] = [];

    if (data.registeredModules) {
      const regResult = this.validateRegisteredModules(data.registeredModules);
      errors.push(...regResult.errors);
    }

    if (data.healthyModules) {
      const healthyResult = this.validateHealthyModules(data.healthyModules);
      errors.push(...healthyResult.errors);
    }

    if (data.failedModules) {
      const failedResult = this.validateFailedModules(data.failedModules);
      errors.push(...failedResult.errors);
    }

    if (data.metadata) {
      const metaResult = this.validateMetadata(data.metadata);
      errors.push(...metaResult.errors);
    }

    // Validate exclusivity
    if (data.healthyModules && data.failedModules) {
      const exclResult = this.validateModuleExclusivity(data.healthyModules, data.failedModules);
      errors.push(...exclResult.errors);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates the keep count for cleanup operations.
   * @param keepCount The count to validate
   * @returns Validation result
   */
  public static validateKeepCount(keepCount: number): SnapshotValidationResult {
    const errors: string[] = [];

    if (typeof keepCount !== 'number' || !Number.isInteger(keepCount)) {
      errors.push('Keep count must be an integer');
    } else if (keepCount < 1) {
      errors.push('Keep count must be at least 1');
    } else if (keepCount > 1000) {
      errors.push('Keep count must be at most 1000');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
