/**
 * Progress Validator
 *
 * Validates achievement progress data according to game rules.
 */

import { AchievementStatus } from '../types/AchievementStatus';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Result of progress validation.
 */
export interface ProgressValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for achievement progress data.
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
   * Validates an achievement ID format.
   */
  public static isValidAchievementId(achievementId: string | null | undefined): boolean {
    if (!achievementId || achievementId.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(achievementId);
  }

  /**
   * Validates a current value.
   */
  public static isValidCurrentValue(value: number | null | undefined): boolean {
    if (value === null || value === undefined) {
      return false;
    }
    return Number.isInteger(value) && value >= 0;
  }

  /**
   * Validates a status.
   */
  public static isValidStatus(status: string | null | undefined): boolean {
    if (!status) {
      return false;
    }
    const validStatuses: AchievementStatus[] = [
      AchievementStatus.LOCKED,
      AchievementStatus.IN_PROGRESS,
      AchievementStatus.COMPLETED,
      AchievementStatus.CLAIMED,
    ];
    return validStatuses.includes(status as AchievementStatus);
  }

  /**
   * Validates a complete progress.
   */
  public static validate(data: {
    progressId?: string;
    playerProfileId?: string;
    achievementId?: string;
    status?: AchievementStatus;
    currentValue?: number;
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

    if (data.achievementId !== undefined) {
      if (!data.achievementId || data.achievementId.trim().length === 0) {
        errors.push('Achievement ID is required');
      } else if (!UUID_REGEX.test(data.achievementId)) {
        errors.push('Achievement ID must be a valid UUID');
      }
    }

    if (data.status !== undefined) {
      if (!data.status) {
        errors.push('Status is required');
      } else if (!this.isValidStatus(data.status)) {
        errors.push('Status must be one of: locked, in_progress, completed, claimed');
      }
    }

    if (data.currentValue !== undefined) {
      if (data.currentValue === null || data.currentValue === undefined) {
        errors.push('Current value is required');
      } else if (!Number.isInteger(data.currentValue) || data.currentValue < 0) {
        errors.push('Current value must be a non-negative integer');
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
    achievementId?: string;
    status?: AchievementStatus;
    currentValue?: number;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Progress validation failed: ${result.errors.join('; ')}`);
    }
  }
}
