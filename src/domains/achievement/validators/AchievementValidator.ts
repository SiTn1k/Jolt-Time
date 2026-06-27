/**
 * Achievement Validator
 *
 * Validates achievement data according to game rules.
 */

import type { AchievementCategory } from '../types/AchievementCategory';
import type { AchievementRarity } from '../types/AchievementRarity';
import { AchievementSlug } from '../value-objects/AchievementSlug';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Result of achievement validation.
 */
export interface AchievementValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for achievement data.
 */
export class AchievementValidator {
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
   * Validates an achievement slug format.
   */
  public static isValidSlug(slug: string | null | undefined): boolean {
    return AchievementSlug.isValid(slug);
  }

  /**
   * Validates a title.
   */
  public static isValidTitle(title: string | null | undefined): boolean {
    if (!title || title.trim().length === 0) {
      return false;
    }
    return title.length >= 1 && title.length <= 200;
  }

  /**
   * Validates a description.
   */
  public static isValidDescription(description: string | null | undefined): boolean {
    if (!description || description.trim().length === 0) {
      return false;
    }
    return description.length >= 1 && description.length <= 2000;
  }

  /**
   * Validates points value.
   */
  public static isValidPoints(points: number | null | undefined): boolean {
    if (points === null || points === undefined) {
      return false;
    }
    return Number.isInteger(points) && points >= 0 && points <= 10000;
  }

  /**
   * Validates a complete achievement.
   */
  public static validate(data: {
    achievementId?: string;
    slug?: string;
    title?: string;
    description?: string;
    category?: AchievementCategory;
    rarity?: AchievementRarity;
    points?: number;
  }): AchievementValidationResult {
    const errors: string[] = [];

    if (data.achievementId !== undefined) {
      if (!data.achievementId || data.achievementId.trim().length === 0) {
        errors.push('Achievement ID is required');
      } else if (!UUID_REGEX.test(data.achievementId)) {
        errors.push('Achievement ID must be a valid UUID');
      }
    }

    if (data.slug !== undefined) {
      if (!data.slug || data.slug.trim().length === 0) {
        errors.push('Slug is required');
      } else if (!AchievementSlug.isValid(data.slug)) {
        errors.push('Slug must be a valid slug format (lowercase alphanumeric with hyphens)');
      }
    }

    if (data.title !== undefined) {
      if (!data.title || data.title.trim().length === 0) {
        errors.push('Title is required');
      } else if (data.title.length < 1 || data.title.length > 200) {
        errors.push('Title must be between 1 and 200 characters');
      }
    }

    if (data.description !== undefined) {
      if (!data.description || data.description.trim().length === 0) {
        errors.push('Description is required');
      } else if (data.description.length < 1 || data.description.length > 2000) {
        errors.push('Description must be between 1 and 2000 characters');
      }
    }

    if (data.points !== undefined) {
      if (data.points === null || data.points === undefined) {
        errors.push('Points is required');
      } else if (!Number.isInteger(data.points)) {
        errors.push('Points must be an integer');
      } else if (data.points < 0 || data.points > 10000) {
        errors.push('Points must be between 0 and 10000');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates achievement data and throws if invalid.
   */
  public static validateOrThrow(data: {
    achievementId?: string;
    slug?: string;
    title?: string;
    description?: string;
    category?: AchievementCategory;
    rarity?: AchievementRarity;
    points?: number;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Achievement validation failed: ${result.errors.join('; ')}`);
    }
  }
}
