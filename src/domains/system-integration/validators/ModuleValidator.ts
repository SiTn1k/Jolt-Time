/**
 * Module Validator
 *
 * Validation specific to system modules.
 */

import type { ModuleDependencyDto } from '../dto/SystemModule.dto';

/**
 * Validation result for module validation.
 */
export interface ModuleValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for system modules.
 */
export class ModuleValidator {
  /**
   * Validates that a module name is well-formed.
   * @param name The module name to validate
   * @returns Validation result
   */
  public static validateName(name: string): ModuleValidationResult {
    const errors: string[] = [];

    if (!name || name.trim().length === 0) {
      errors.push('Module name is required');
    }

    if (name.length > 255) {
      errors.push('Module name must be at most 255 characters');
    }

    // Check for valid characters (alphanumeric, spaces, hyphens, underscores)
    const validNameRegex = /^[a-zA-Z0-9\s\-_.]+$/;
    if (name && !validNameRegex.test(name)) {
      errors.push('Module name can only contain letters, numbers, spaces, hyphens, underscores, and periods');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a module version string.
   * @param version The version to validate
   * @returns Validation result
   */
  public static validateVersion(version: string): ModuleValidationResult {
    const errors: string[] = [];

    if (!version || version.trim().length === 0) {
      errors.push('Module version is required');
    }

    // Semantic versioning format (major.minor.patch)
    const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/;
    if (version && !semverRegex.test(version)) {
      errors.push('Module version must follow semantic versioning (e.g., 1.0.0)');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a module status.
   * @param status The status to validate
   * @param validStatuses List of valid statuses
   * @returns Validation result
   */
  public static validateStatus(status: string, validStatuses: string[]): ModuleValidationResult {
    const errors: string[] = [];

    if (!status) {
      errors.push('Module status is required');
    } else if (!validStatuses.includes(status)) {
      errors.push(`Module status must be one of: ${validStatuses.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a module dependency DTO.
   * @param dependency The dependency to validate
   * @returns Validation result
   */
  public static validateDependency(dependency: ModuleDependencyDto): ModuleValidationResult {
    const errors: string[] = [];

    if (!dependency.moduleId) {
      errors.push('Dependency module ID is required');
    }

    if (!dependency.moduleName) {
      errors.push('Dependency module name is required');
    }

    const validStatuses = ['satisfied', 'unsatisfied', 'optional'];
    if (dependency.status && !validStatuses.includes(dependency.status)) {
      errors.push(`Dependency status must be one of: ${validStatuses.join(', ')}`);
    }

    if (typeof dependency.isOptional !== 'boolean') {
      errors.push('Dependency isOptional must be a boolean');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates an array of module dependencies.
   * @param dependencies The dependencies to validate
   * @returns Validation result
   */
  public static validateDependencies(dependencies: ModuleDependencyDto[]): ModuleValidationResult {
    const errors: string[] = [];

    if (!Array.isArray(dependencies)) {
      errors.push('Dependencies must be an array');
      return { isValid: false, errors };
    }

    for (let i = 0; i < dependencies.length; i++) {
      const result = this.validateDependency(dependencies[i]);
      if (!result.isValid) {
        errors.push(...result.errors.map((e) => `Dependency[${i}]: ${e}`));
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a complete module creation request.
   * @param data The module data to validate
   * @returns Validation result
   */
  public static validateCreate(data: { moduleName: string; moduleVersion?: string; dependencies?: ModuleDependencyDto[] }): ModuleValidationResult {
    const errors: string[] = [];

    const nameResult = this.validateName(data.moduleName);
    errors.push(...nameResult.errors);

    if (data.moduleVersion) {
      const versionResult = this.validateVersion(data.moduleVersion);
      errors.push(...versionResult.errors);
    }

    if (data.dependencies) {
      const depsResult = this.validateDependencies(data.dependencies);
      errors.push(...depsResult.errors);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
