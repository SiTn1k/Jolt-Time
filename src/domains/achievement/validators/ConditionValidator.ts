/**
 * Condition Validator
 *
 * Validates achievement condition data according to game rules.
 */

import { ConditionType } from '../types/ConditionType';
import { ConditionId } from '../value-objects/ConditionId';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Result of condition validation.
 */
export interface ConditionValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for achievement condition data.
 */
export class ConditionValidator {
  /**
   * Validates a condition ID format.
   */
  public static isValidConditionId(conditionId: string | null | undefined): boolean {
    if (!conditionId || conditionId.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(conditionId);
  }

  /**
   * Validates a required value.
   */
  public static isValidRequiredValue(value: number | null | undefined): boolean {
    if (value === null || value === undefined) {
      return false;
    }
    return Number.isInteger(value) && value > 0;
  }

  /**
   * Validates a condition type.
   */
  public static isValidConditionType(conditionType: string | null | undefined): boolean {
    if (!conditionType) {
      return false;
    }
    const validTypes: ConditionType[] = [
      ConditionType.COUNT,
      ConditionType.ACCUMULATE,
      ConditionType.COLLECT_UNIQUE,
      ConditionType.MILESTONE,
      ConditionType.STREAK,
      ConditionType.TIME,
      ConditionType.LEVEL,
      ConditionType.CURRENCY,
      ConditionType.ARTIFACT,
      ConditionType.MUSEUM,
      ConditionType.QUEST,
    ];
    return validTypes.includes(conditionType as ConditionType);
  }

  /**
   * Validates a complete condition.
   */
  public static validate(data: {
    conditionId?: string;
    achievementId?: string;
    conditionType?: ConditionType;
    requiredValue?: number;
    target?: string | null;
  }): ConditionValidationResult {
    const errors: string[] = [];

    if (data.conditionId !== undefined) {
      if (!data.conditionId || data.conditionId.trim().length === 0) {
        errors.push('Condition ID is required');
      } else if (!ConditionId.isValid(data.conditionId)) {
        errors.push('Condition ID must be a valid UUID');
      }
    }

    if (data.achievementId !== undefined) {
      if (!data.achievementId || data.achievementId.trim().length === 0) {
        errors.push('Achievement ID is required');
      } else if (!UUID_REGEX.test(data.achievementId)) {
        errors.push('Achievement ID must be a valid UUID');
      }
    }

    if (data.conditionType !== undefined) {
      if (!data.conditionType) {
        errors.push('Condition type is required');
      } else if (!this.isValidConditionType(data.conditionType)) {
        errors.push('Condition type must be one of: count, accumulate, collect_unique, milestone, streak, time, level, currency, artifact, museum, quest');
      }
    }

    if (data.requiredValue !== undefined) {
      if (data.requiredValue === null || data.requiredValue === undefined) {
        errors.push('Required value is required');
      } else if (!Number.isInteger(data.requiredValue) || data.requiredValue <= 0) {
        errors.push('Required value must be a positive integer');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates condition data and throws if invalid.
   */
  public static validateOrThrow(data: {
    conditionId?: string;
    achievementId?: string;
    conditionType?: ConditionType;
    requiredValue?: number;
    target?: string | null;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Condition validation failed: ${result.errors.join('; ')}`);
    }
  }
}
