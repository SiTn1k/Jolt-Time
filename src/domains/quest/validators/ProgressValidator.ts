/**
 * Progress Validator
 *
 * Validates quest progress data according to game rules.
 */

import { QuestStatus } from '../types/QuestStatus';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Result of progress validation.
 */
export interface ProgressValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for quest progress data.
 */
export class ProgressValidator {
  /**
   * Validates a progress ID format.
   */
  public static isValidProgressId(progressId: string | null | undefined): boolean {
    if (!progressId || progressId.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(progressId);
  }

  /**
   * Validates a player profile ID format.
   */
  public static isValidPlayerProfileId(playerProfileId: string | null | undefined): boolean {
    if (!playerProfileId || playerProfileId.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(playerProfileId);
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
   * Validates a progress value.
   */
  public static isValidProgressValue(value: number | null | undefined): boolean {
    if (value === null || value === undefined) {
      return true; // Optional for updates
    }
    return typeof value === 'number' && !isNaN(value) && value >= 0;
  }

  /**
   * Validates a status value.
   */
  public static isValidStatus(status: QuestStatus | null | undefined): boolean {
    if (status === null || status === undefined) {
      return false;
    }
    return Object.values(QuestStatus).includes(status);
  }

  /**
   * Validates ownership of progress.
   */
  public static validateOwnership(
    progressOwnerId: string | null | undefined,
    requesterId: string | null | undefined
  ): boolean {
    if (!progressOwnerId || !requesterId) {
      return false;
    }
    return progressOwnerId === requesterId;
  }

  /**
   * Validates a complete progress record.
   */
  public static validate(data: {
    progressId?: string;
    playerProfileId?: string;
    questId?: string;
    currentValue?: number;
    status?: QuestStatus;
  }): ProgressValidationResult {
    const errors: string[] = [];

    if (data.progressId !== undefined) {
      if (!data.progressId || data.progressId.trim().length === 0) {
        errors.push('Progress ID is required');
      } else if (!UUID_REGEX.test(data.progressId)) {
        errors.push('Progress ID must be a valid UUID');
      }
    }

    if (data.playerProfileId !== undefined) {
      if (!data.playerProfileId || data.playerProfileId.trim().length === 0) {
        errors.push('Player profile ID is required');
      } else if (!UUID_REGEX.test(data.playerProfileId)) {
        errors.push('Player profile ID must be a valid UUID');
      }
    }

    if (data.questId !== undefined) {
      if (!data.questId || data.questId.trim().length === 0) {
        errors.push('Quest ID is required');
      } else if (!UUID_REGEX.test(data.questId)) {
        errors.push('Quest ID must be a valid UUID');
      }
    }

    if (data.currentValue !== undefined) {
      if (data.currentValue !== null && data.currentValue !== undefined) {
        if (typeof data.currentValue !== 'number' || isNaN(data.currentValue)) {
          errors.push('Current value must be a valid number');
        } else if (data.currentValue < 0) {
          errors.push('Current value cannot be negative');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates progress data and throws if invalid.
   */
  public static validateOrThrow(data: {
    progressId?: string;
    playerProfileId?: string;
    questId?: string;
    currentValue?: number;
    status?: QuestStatus;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Progress validation failed: ${result.errors.join('; ')}`);
    }
  }

  /**
   * Validates ownership and throws if invalid.
   */
  public static validateOwnershipOrThrow(
    progressOwnerId: string | null | undefined,
    requesterId: string | null | undefined
  ): void {
    if (!this.validateOwnership(progressOwnerId, requesterId)) {
      throw new Error('Progress ownership validation failed: requester does not own this progress');
    }
  }
}
