/**
 * Health Validator
 *
 * Validates health snapshot data.
 */

import { HealthStatus, HEALTH_STATUS_CONSTRAINTS } from '../types/HealthStatus';

/**
 * Result of health validation.
 */
export interface HealthValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for health snapshots.
 */
export class HealthValidator {
  /**
   * Validates a health status value.
   * @param status The status to validate
   * @param fieldName The name of the field being validated
   * @returns Validation result
   */
  public static validateStatus(status: string | null | undefined, fieldName = 'Status'): HealthValidationResult {
    if (status === null || status === undefined) {
      return {
        isValid: false,
        error: `${fieldName} is required`,
      };
    }

    const validStatuses = HEALTH_STATUS_CONSTRAINTS.VALID_STATUSES;
    if (!validStatuses.includes(status as HealthStatus)) {
      return {
        isValid: false,
        error: `Invalid ${fieldName.toLowerCase()}. Must be one of: ${validStatuses.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates memory health status.
   * @param memory The memory status to validate
   * @returns Validation result
   */
  public static validateMemory(memory: string | null | undefined): HealthValidationResult {
    return this.validateStatus(memory, 'Memory');
  }

  /**
   * Validates CPU health status.
   * @param cpu The CPU status to validate
   * @returns Validation result
   */
  public static validateCpu(cpu: string | null | undefined): HealthValidationResult {
    return this.validateStatus(cpu, 'CPU');
  }

  /**
   * Validates database health status.
   * @param database The database status to validate
   * @returns Validation result
   */
  public static validateDatabase(database: string | null | undefined): HealthValidationResult {
    return this.validateStatus(database, 'Database');
  }

  /**
   * Validates cache health status.
   * @param cache The cache status to validate
   * @returns Validation result
   */
  public static validateCache(cache: string | null | undefined): HealthValidationResult {
    return this.validateStatus(cache, 'Cache');
  }

  /**
   * Validates API health status.
   * @param api The API status to validate
   * @returns Validation result
   */
  public static validateApi(api: string | null | undefined): HealthValidationResult {
    return this.validateStatus(api, 'API');
  }

  /**
   * Validates all health snapshot fields together.
   * @param params Health snapshot fields to validate
   * @returns Validation result
   */
  public static validateHealthSnapshot(params: {
    memory?: string;
    cpu?: string;
    database?: string;
    cache?: string;
    api?: string;
  }): HealthValidationResult {
    const memoryResult = this.validateMemory(params.memory);
    if (!memoryResult.isValid) return memoryResult;

    const cpuResult = this.validateCpu(params.cpu);
    if (!cpuResult.isValid) return cpuResult;

    const databaseResult = this.validateDatabase(params.database);
    if (!databaseResult.isValid) return databaseResult;

    const cacheResult = this.validateCache(params.cache);
    if (!cacheResult.isValid) return cacheResult;

    const apiResult = this.validateApi(params.api);
    if (!apiResult.isValid) return apiResult;

    return { isValid: true };
  }

  /**
   * Validates a health snapshot and throws if invalid.
   * @param params Health snapshot fields to validate
   * @throws Error with validation details if invalid
   */
  public static validateHealthSnapshotOrThrow(params: {
    memory?: string;
    cpu?: string;
    database?: string;
    cache?: string;
    api?: string;
  }): void {
    const result = this.validateHealthSnapshot(params);
    if (!result.isValid) {
      throw new Error(`Health validation failed: ${result.error}`);
    }
  }
}
