/**
 * RuleValidator
 *
 * Validates hardening rule data according to hardening rules.
 */

import { HardeningStatus } from '../types/HardeningStatus';
import { RulePriority } from '../types/RulePriority';
import { RuleId } from '../value-objects/RuleId';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Result of rule validation.
 */
export interface RuleValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for hardening rule data.
 */
export class RuleValidator {
  /**
   * Validates a rule ID format.
   */
  public static isValidRuleId(ruleId: string | null | undefined): boolean {
    if (!ruleId || ruleId.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(ruleId);
  }

  /**
   * Validates a rule name.
   */
  public static isValidName(name: string | null | undefined): boolean {
    if (!name || name.trim().length === 0) {
      return false;
    }
    return name.trim().length >= 3 && name.trim().length <= 100;
  }

  /**
   * Validates a rule description.
   */
  public static isValidDescription(description: string | null | undefined): boolean {
    if (description === null || description === undefined) {
      return true; // Optional
    }
    return description.length <= 1000;
  }

  /**
   * Validates a hardening status.
   */
  public static isValidStatus(status: HardeningStatus | null | undefined): boolean {
    if (status === null || status === undefined) {
      return true; // Optional
    }
    const validStatuses: HardeningStatus[] = [
      HardeningStatus.PENDING,
      HardeningStatus.IN_PROGRESS,
      HardeningStatus.ACTIVE,
      HardeningStatus.DISABLED,
      HardeningStatus.DEPRECATED,
    ];
    return validStatuses.includes(status);
  }

  /**
   * Validates a rule priority.
   */
  public static isValidPriority(priority: RulePriority | null | undefined): boolean {
    if (priority === null || priority === undefined) {
      return true; // Optional
    }
    const validPriorities: RulePriority[] = [
      RulePriority.CRITICAL,
      RulePriority.HIGH,
      RulePriority.MEDIUM,
      RulePriority.LOW,
    ];
    return validPriorities.includes(priority);
  }

  /**
   * Validates a complete rule.
   */
  public static validate(data: {
    ruleId?: string;
    name?: string;
    status?: HardeningStatus;
    priority?: RulePriority;
    description?: string;
  }): RuleValidationResult {
    const errors: string[] = [];

    if (data.ruleId !== undefined) {
      if (!data.ruleId || data.ruleId.trim().length === 0) {
        errors.push('Rule ID is required');
      } else if (!RuleId.isValid(data.ruleId)) {
        errors.push('Rule ID must be a valid UUID');
      }
    }

    if (data.name !== undefined) {
      if (!data.name || data.name.trim().length === 0) {
        errors.push('Name is required');
      } else if (!this.isValidName(data.name)) {
        errors.push('Name must be between 3 and 100 characters');
      }
    }

    if (data.status !== undefined && !this.isValidStatus(data.status)) {
      errors.push('Status must be one of: pending, in_progress, active, disabled, deprecated');
    }

    if (data.priority !== undefined && !this.isValidPriority(data.priority)) {
      errors.push('Priority must be one of: 1 (Critical), 2 (High), 3 (Medium), 4 (Low)');
    }

    if (data.description !== undefined && !this.isValidDescription(data.description)) {
      errors.push('Description must not exceed 1000 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates rule data and throws if invalid.
   */
  public static validateOrThrow(data: {
    ruleId?: string;
    name?: string;
    status?: HardeningStatus;
    priority?: RulePriority;
    description?: string;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Rule validation failed: ${result.errors.join('; ')}`);
    }
  }
}
