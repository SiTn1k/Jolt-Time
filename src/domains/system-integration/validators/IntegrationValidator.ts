/**
 * Integration Validator
 *
 * Validation specific to integration state.
 */

import type { IntegrationMetadata } from '../types/IntegrationMetadata';

/**
 * Validation result for integration validation.
 */
export interface IntegrationValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for integration state.
 */
export class IntegrationValidator {
  /**
   * Validates an integration status.
   * @param status The status to validate
   * @param validStatuses List of valid statuses
   * @returns Validation result
   */
  public static validateStatus(status: string, validStatuses: string[]): IntegrationValidationResult {
    const errors: string[] = [];

    if (!status) {
      errors.push('Integration status is required');
    } else if (!validStatuses.includes(status)) {
      errors.push(`Integration status must be one of: ${validStatuses.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a module ID format.
   * @param moduleId The module ID to validate
   * @returns Validation result
   */
  public static validateModuleId(moduleId: string): IntegrationValidationResult {
    const errors: string[] = [];

    if (!moduleId || moduleId.trim().length === 0) {
      errors.push('Module ID is required');
    }

    // UUID format check
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (moduleId && !uuidRegex.test(moduleId)) {
      errors.push('Module ID must be a valid UUID');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates integration metadata.
   * @param metadata The metadata to validate
   * @returns Validation result
   */
  public static validateMetadata(metadata: IntegrationMetadata): IntegrationValidationResult {
    const errors: string[] = [];

    if (metadata === null || metadata === undefined) {
      return { isValid: true, errors: [] };
    }

    if (typeof metadata !== 'object') {
      errors.push('Metadata must be an object');
      return { isValid: false, errors };
    }

    // Validate lastSnapshotAt if present
    if (metadata.lastSnapshotAt) {
      const date = new Date(metadata.lastSnapshotAt);
      if (isNaN(date.getTime())) {
        errors.push('Metadata lastSnapshotAt must be a valid ISO date string');
      }
    }

    // Validate numeric counts if present
    if (metadata.registeredModulesCount !== undefined && typeof metadata.registeredModulesCount !== 'number') {
      errors.push('Metadata registeredModulesCount must be a number');
    }

    if (metadata.healthyModulesCount !== undefined && typeof metadata.healthyModulesCount !== 'number') {
      errors.push('Metadata healthyModulesCount must be a number');
    }

    if (metadata.failedModulesCount !== undefined && typeof metadata.failedModulesCount !== 'number') {
      errors.push('Metadata failedModulesCount must be a number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a complete integration state creation request.
   * @param data The state data to validate
   * @returns Validation result
   */
  public static validateCreate(data: { moduleId: string; status?: string }): IntegrationValidationResult {
    const errors: string[] = [];

    const moduleIdResult = this.validateModuleId(data.moduleId);
    errors.push(...moduleIdResult.errors);

    if (data.status) {
      const validStatuses = ['unknown', 'initializing', 'healthy', 'degraded', 'partial_failure', 'critical_failure'];
      const statusResult = this.validateStatus(data.status, validStatuses);
      errors.push(...statusResult.errors);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
