/**
 * Report Validator
 *
 * Validates stabilization report data.
 */

/**
 * Result of report validation.
 */
export interface ReportValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Constraints for report fields.
 */
const REPORT_CONSTRAINTS = {
  MAX_MODULE_NAME_LENGTH: 100,
  MAX_MODULE_LIST_SIZE: 100,
} as const;

/**
 * Validator for stabilization reports.
 */
export class ReportValidator {
  /**
   * Validates a module list.
   * @param modules The module list to validate
   * @param listName The name of the list (for error messages)
   * @returns Validation result
   */
  public static validateModuleList(
    modules: string[] | null | undefined,
    listName: string
  ): ReportValidationResult {
    if (modules === null || modules === undefined) {
      return { isValid: true }; // Module lists are optional
    }

    if (!Array.isArray(modules)) {
      return {
        isValid: false,
        error: `${listName} must be an array`,
      };
    }

    if (modules.length > REPORT_CONSTRAINTS.MAX_MODULE_LIST_SIZE) {
      return {
        isValid: false,
        error: `${listName} must have at most ${REPORT_CONSTRAINTS.MAX_MODULE_LIST_SIZE} modules`,
      };
    }

    for (const module of modules) {
      if (typeof module !== 'string') {
        return {
          isValid: false,
          error: `${listName} must contain only strings`,
        };
      }

      if (module.trim().length === 0) {
        return {
          isValid: false,
          error: `${listName} cannot contain empty module names`,
        };
      }

      if (module.length > REPORT_CONSTRAINTS.MAX_MODULE_NAME_LENGTH) {
        return {
          isValid: false,
          error: `Module name in ${listName} must be at most ${REPORT_CONSTRAINTS.MAX_MODULE_NAME_LENGTH} characters`,
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Validates healthy modules list.
   * @param modules The healthy modules to validate
   * @returns Validation result
   */
  public static validateHealthyModules(modules: string[] | null | undefined): ReportValidationResult {
    return this.validateModuleList(modules, 'Healthy modules');
  }

  /**
   * Validates warning modules list.
   * @param modules The warning modules to validate
   * @returns Validation result
   */
  public static validateWarningModules(modules: string[] | null | undefined): ReportValidationResult {
    return this.validateModuleList(modules, 'Warning modules');
  }

  /**
   * Validates failed modules list.
   * @param modules The failed modules to validate
   * @returns Validation result
   */
  public static validateFailedModules(modules: string[] | null | undefined): ReportValidationResult {
    return this.validateModuleList(modules, 'Failed modules');
  }

  /**
   * Validates all report fields together.
   * @param params Report fields to validate
   * @returns Validation result
   */
  public static validateReport(params: {
    healthyModules?: string[];
    warningModules?: string[];
    failedModules?: string[];
  }): ReportValidationResult {
    const healthyResult = this.validateHealthyModules(params.healthyModules);
    if (!healthyResult.isValid) return healthyResult;

    const warningResult = this.validateWarningModules(params.warningModules);
    if (!warningResult.isValid) return warningResult;

    const failedResult = this.validateFailedModules(params.failedModules);
    if (!failedResult.isValid) return failedResult;

    return { isValid: true };
  }

  /**
   * Validates a report and throws if invalid.
   * @param params Report fields to validate
   * @throws Error with validation details if invalid
   */
  public static validateReportOrThrow(params: {
    healthyModules?: string[];
    warningModules?: string[];
    failedModules?: string[];
  }): void {
    const result = this.validateReport(params);
    if (!result.isValid) {
      throw new Error(`Report validation failed: ${result.error}`);
    }
  }
}
