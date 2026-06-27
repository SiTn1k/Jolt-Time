/**
 * Objective Validator
 *
 * Validates quest objective data according to game rules.
 */

import type { ObjectiveType } from '../types/ObjectiveType';
import { ObjectiveId } from '../value-objects/ObjectiveId';
import { QuestId } from '../value-objects/QuestId';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Result of objective validation.
 */
export interface ObjectiveValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for quest objective data.
 */
export class ObjectiveValidator {
  /**
   * Validates an objective ID format.
   */
  public static isValidObjectiveId(objectiveId: string | null | undefined): boolean {
    if (!objectiveId || objectiveId.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(objectiveId);
  }

  /**
   * Validates a quest ID format.
   */
  public static isValidQuestId(questId: string | null | undefined): boolean {
    if (!questId || questId.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(questId);
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
   * Validates an order value.
   */
  public static isValidOrder(order: number | null | undefined): boolean {
    if (order === null || order === undefined) {
      return true; // Optional
    }
    return Number.isInteger(order) && order >= 0;
  }

  /**
   * Validates a complete objective.
   */
  public static validate(data: {
    objectiveId?: string;
    questId?: string;
    objectiveType?: ObjectiveType;
    target?: string | null;
    requiredValue?: number;
    order?: number;
  }): ObjectiveValidationResult {
    const errors: string[] = [];

    if (data.objectiveId !== undefined) {
      if (!data.objectiveId || data.objectiveId.trim().length === 0) {
        errors.push('Objective ID is required');
      } else if (!UUID_REGEX.test(data.objectiveId)) {
        errors.push('Objective ID must be a valid UUID');
      }
    }

    if (data.questId !== undefined) {
      if (!data.questId || data.questId.trim().length === 0) {
        errors.push('Quest ID is required');
      } else if (!UUID_REGEX.test(data.questId)) {
        errors.push('Quest ID must be a valid UUID');
      }
    }

    if (data.requiredValue !== undefined) {
      if (data.requiredValue === null || data.requiredValue === undefined) {
        errors.push('Required value is required');
      } else if (!Number.isInteger(data.requiredValue)) {
        errors.push('Required value must be an integer');
      } else if (data.requiredValue <= 0) {
        errors.push('Required value must be greater than 0');
      }
    }

    if (data.order !== undefined) {
      if (data.order !== null && data.order !== undefined) {
        if (!Number.isInteger(data.order)) {
          errors.push('Order must be an integer');
        } else if (data.order < 0) {
          errors.push('Order must be non-negative');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates objective data and throws if invalid.
   */
  public static validateOrThrow(data: {
    objectiveId?: string;
    questId?: string;
    objectiveType?: ObjectiveType;
    target?: string | null;
    requiredValue?: number;
    order?: number;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Objective validation failed: ${result.errors.join('; ')}`);
    }
  }
}
