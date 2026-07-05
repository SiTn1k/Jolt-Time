/**
 * Rule Validator
 *
 * Validates optimization rule data.
 */

/**
 * Constraints for rule validation.
 */
export const RULE_CONSTRAINTS = {
  MAX_RULE_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_PRIORITY: 0,
  MAX_PRIORITY: 100,
} as const;

/**
 * Result of rule validation.
 */
export interface RuleValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for optimization rules.
 */
export class RuleValidator {
  /**
   * Validates a rule name.
   * @param ruleName The rule name to validate
   * @returns Validation result with any error message
   */
  public static validateRuleName(ruleName: string | null | undefined): RuleValidationResult {
    if (ruleName === null || ruleName === undefined) {
      return {
        isValid: false,
        error: 'Rule name is required',
      };
    }

    if (ruleName.trim().length === 0) {
      return {
        isValid: false,
        error: 'Rule name cannot be empty',
      };
    }

    if (ruleName.length > RULE_CONSTRAINTS.MAX_RULE_NAME_LENGTH) {
      return {
        isValid: false,
        error: `Rule name must be at most ${RULE_CONSTRAINTS.MAX_RULE_NAME_LENGTH} characters`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a rule description.
   * @param description The description to validate
   * @returns Validation result with any error message
   */
  public static validateDescription(description: string | null | undefined): RuleValidationResult {
    if (description === null || description === undefined) {
      return {
        isValid: false,
        error: 'Description is required',
      };
    }

    if (description.length > RULE_CONSTRAINTS.MAX_DESCRIPTION_LENGTH) {
      return {
        isValid: false,
        error: `Description must be at most ${RULE_CONSTRAINTS.MAX_DESCRIPTION_LENGTH} characters`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a rule priority.
   * @param priority The priority to validate
   * @returns Validation result with any error message
   */
  public static validatePriority(priority: number | null | undefined): RuleValidationResult {
    if (priority === null || priority === undefined) {
      return {
        isValid: false,
        error: 'Priority is required',
      };
    }

    if (!Number.isFinite(priority)) {
      return {
        isValid: false,
        error: 'Priority must be a finite number',
      };
    }

    if (!Number.isInteger(priority)) {
      return {
        isValid: false,
        error: 'Priority must be an integer',
      };
    }

    if (priority < RULE_CONSTRAINTS.MIN_PRIORITY) {
      return {
        isValid: false,
        error: `Priority must be at least ${RULE_CONSTRAINTS.MIN_PRIORITY}`,
      };
    }

    if (priority > RULE_CONSTRAINTS.MAX_PRIORITY) {
      return {
        isValid: false,
        error: `Priority must be at most ${RULE_CONSTRAINTS.MAX_PRIORITY}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an enabled state.
   * @param enabled The enabled state to validate
   * @returns Validation result with any error message
   */
  public static validateEnabled(enabled: boolean | null | undefined): RuleValidationResult {
    if (enabled === null || enabled === undefined) {
      return {
        isValid: false,
        error: 'Enabled state is required',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates all rule fields together.
   * @param params Rule fields to validate
   * @returns Validation result with any error message
   */
  public static validateRule(params: {
    ruleName?: string;
    enabled?: boolean;
    priority?: number;
    description?: string;
  }): RuleValidationResult {
    const nameResult = this.validateRuleName(params.ruleName);
    if (!nameResult.isValid) return nameResult;

    const enabledResult = this.validateEnabled(params.enabled);
    if (!enabledResult.isValid) return enabledResult;

    const priorityResult = this.validatePriority(params.priority);
    if (!priorityResult.isValid) return priorityResult;

    const descriptionResult = this.validateDescription(params.description);
    if (!descriptionResult.isValid) return descriptionResult;

    return { isValid: true };
  }

  /**
   * Validates a rule and throws if invalid.
   * @param params Rule fields to validate
   * @throws Error with validation details if invalid
   */
  public static validateRuleOrThrow(params: {
    ruleName?: string;
    enabled?: boolean;
    priority?: number;
    description?: string;
  }): void {
    const result = this.validateRule(params);
    if (!result.isValid) {
      throw new Error(`Rule validation failed: ${result.error}`);
    }
  }
}
