/**
 * Performance Validator
 *
 * Validates performance profile data.
 */

import { ProfileType, PROFILE_TYPE_CONSTRAINTS } from '../types/ProfileType';

/**
 * Constraints for performance validation.
 */
export const PERFORMANCE_CONSTRAINTS = {
  MAX_MODULE_NAME_LENGTH: 255,
  MAX_EXECUTION_TIME: Number.MAX_SAFE_INTEGER,
  MAX_MEMORY_USAGE: Number.MAX_SAFE_INTEGER,
  MAX_CPU_USAGE: 100,
  MIN_CPU_USAGE: 0,
} as const;

/**
 * Result of performance validation.
 */
export interface PerformanceValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for performance profiles.
 */
export class PerformanceValidator {
  /**
   * Validates a module name.
   * @param moduleName The module name to validate
   * @returns Validation result with any error message
   */
  public static validateModuleName(moduleName: string | null | undefined): PerformanceValidationResult {
    if (moduleName === null || moduleName === undefined) {
      return {
        isValid: false,
        error: 'Module name is required',
      };
    }

    if (moduleName.trim().length === 0) {
      return {
        isValid: false,
        error: 'Module name cannot be empty',
      };
    }

    if (moduleName.length > PERFORMANCE_CONSTRAINTS.MAX_MODULE_NAME_LENGTH) {
      return {
        isValid: false,
        error: `Module name must be at most ${PERFORMANCE_CONSTRAINTS.MAX_MODULE_NAME_LENGTH} characters`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an execution time value.
   * @param executionTime The execution time to validate
   * @returns Validation result with any error message
   */
  public static validateExecutionTime(executionTime: number | null | undefined): PerformanceValidationResult {
    if (executionTime === null || executionTime === undefined) {
      return {
        isValid: false,
        error: 'Execution time is required',
      };
    }

    if (!Number.isFinite(executionTime)) {
      return {
        isValid: false,
        error: 'Execution time must be a finite number',
      };
    }

    if (executionTime < 0) {
      return {
        isValid: false,
        error: 'Execution time cannot be negative',
      };
    }

    if (executionTime > PERFORMANCE_CONSTRAINTS.MAX_EXECUTION_TIME) {
      return {
        isValid: false,
        error: 'Execution time exceeds maximum allowed value',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a memory usage value.
   * @param memoryUsage The memory usage to validate
   * @returns Validation result with any error message
   */
  public static validateMemoryUsage(memoryUsage: number | null | undefined): PerformanceValidationResult {
    if (memoryUsage === null || memoryUsage === undefined) {
      return {
        isValid: false,
        error: 'Memory usage is required',
      };
    }

    if (!Number.isFinite(memoryUsage)) {
      return {
        isValid: false,
        error: 'Memory usage must be a finite number',
      };
    }

    if (memoryUsage < 0) {
      return {
        isValid: false,
        error: 'Memory usage cannot be negative',
      };
    }

    if (memoryUsage > PERFORMANCE_CONSTRAINTS.MAX_MEMORY_USAGE) {
      return {
        isValid: false,
        error: 'Memory usage exceeds maximum allowed value',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a CPU usage percentage.
   * @param cpuUsage The CPU usage to validate
   * @returns Validation result with any error message
   */
  public static validateCpuUsage(cpuUsage: number | null | undefined): PerformanceValidationResult {
    if (cpuUsage === null || cpuUsage === undefined) {
      return {
        isValid: false,
        error: 'CPU usage is required',
      };
    }

    if (!Number.isFinite(cpuUsage)) {
      return {
        isValid: false,
        error: 'CPU usage must be a finite number',
      };
    }

    if (cpuUsage < PERFORMANCE_CONSTRAINTS.MIN_CPU_USAGE) {
      return {
        isValid: false,
        error: `CPU usage cannot be less than ${PERFORMANCE_CONSTRAINTS.MIN_CPU_USAGE}`,
      };
    }

    if (cpuUsage > PERFORMANCE_CONSTRAINTS.MAX_CPU_USAGE) {
      return {
        isValid: false,
        error: `CPU usage cannot be greater than ${PERFORMANCE_CONSTRAINTS.MAX_CPU_USAGE}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a profile type.
   * @param profileType The profile type to validate
   * @returns Validation result with any error message
   */
  public static validateProfileType(profileType: string | null | undefined): PerformanceValidationResult {
    if (profileType === null || profileType === undefined) {
      return {
        isValid: false,
        error: 'Profile type is required',
      };
    }

    const validTypes = Object.values(ProfileType);
    if (!validTypes.includes(profileType as ProfileType)) {
      return {
        isValid: false,
        error: `Invalid profile type. Must be one of: ${validTypes.join(', ')}`,
      };
    }

    if (profileType.length > PROFILE_TYPE_CONSTRAINTS.MAX_TYPE_LENGTH) {
      return {
        isValid: false,
        error: `Profile type must be at most ${PROFILE_TYPE_CONSTRAINTS.MAX_TYPE_LENGTH} characters`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates all performance profile fields together.
   * @param params Profile fields to validate
   * @returns Validation result with any error message
   */
  public static validateProfile(params: {
    moduleName?: string;
    averageExecutionTime?: number;
    peakExecutionTime?: number;
    memoryUsage?: number;
    cpuUsage?: number;
    profileType?: string;
  }): PerformanceValidationResult {
    const moduleNameResult = this.validateModuleName(params.moduleName);
    if (!moduleNameResult.isValid) return moduleNameResult;

    const avgExecResult = this.validateExecutionTime(params.averageExecutionTime);
    if (!avgExecResult.isValid) return avgExecResult;

    const peakExecResult = this.validateExecutionTime(params.peakExecutionTime);
    if (!peakExecResult.isValid) return peakExecResult;

    const memoryResult = this.validateMemoryUsage(params.memoryUsage);
    if (!memoryResult.isValid) return memoryResult;

    const cpuResult = this.validateCpuUsage(params.cpuUsage);
    if (!cpuResult.isValid) return cpuResult;

    const typeResult = this.validateProfileType(params.profileType);
    if (!typeResult.isValid) return typeResult;

    return { isValid: true };
  }

  /**
   * Validates a profile and throws if invalid.
   * @param params Profile fields to validate
   * @throws Error with validation details if invalid
   */
  public static validateProfileOrThrow(params: {
    moduleName?: string;
    averageExecutionTime?: number;
    peakExecutionTime?: number;
    memoryUsage?: number;
    cpuUsage?: number;
    profileType?: string;
  }): void {
    const result = this.validateProfile(params);
    if (!result.isValid) {
      throw new Error(`Performance validation failed: ${result.error}`);
    }
  }
}
