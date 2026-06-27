/**
 * Quest Validator
 *
 * Validates quest data according to game rules.
 */

import type { QuestCategory } from '../types/QuestCategory';
import type { QuestDifficulty } from '../types/QuestDifficulty';
import type { RepeatType } from '../types/RepeatType';
import { QuestSlug } from '../value-objects/QuestSlug';
import { QuestId } from '../value-objects/QuestId';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Result of quest validation.
 */
export interface QuestValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for quest data.
 */
export class QuestValidator {
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
   * Validates a quest slug format.
   */
  public static isValidSlug(slug: string | null | undefined): boolean {
    return QuestSlug.isValid(slug);
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
   * Validates a required level.
   */
  public static isValidRequiredLevel(level: number | null | undefined): boolean {
    if (level === null || level === undefined) {
      return true; // Optional
    }
    return Number.isInteger(level) && level >= 1 && level <= 100;
  }

  /**
   * Validates a complete quest.
   */
  public static validate(data: {
    questId?: string;
    slug?: string;
    title?: string;
    description?: string;
    category?: QuestCategory;
    difficulty?: QuestDifficulty;
    repeatType?: RepeatType;
    requiredLevel?: number;
  }): QuestValidationResult {
    const errors: string[] = [];

    if (data.questId !== undefined) {
      if (!data.questId || data.questId.trim().length === 0) {
        errors.push('Quest ID is required');
      } else if (!UUID_REGEX.test(data.questId)) {
        errors.push('Quest ID must be a valid UUID');
      }
    }

    if (data.slug !== undefined) {
      if (!data.slug || data.slug.trim().length === 0) {
        errors.push('Slug is required');
      } else if (!QuestSlug.isValid(data.slug)) {
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

    if (data.requiredLevel !== undefined) {
      if (data.requiredLevel !== null && data.requiredLevel !== undefined) {
        if (!Number.isInteger(data.requiredLevel)) {
          errors.push('Required level must be an integer');
        } else if (data.requiredLevel < 1 || data.requiredLevel > 100) {
          errors.push('Required level must be between 1 and 100');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates quest data and throws if invalid.
   */
  public static validateOrThrow(data: {
    questId?: string;
    slug?: string;
    title?: string;
    description?: string;
    category?: QuestCategory;
    difficulty?: QuestDifficulty;
    repeatType?: RepeatType;
    requiredLevel?: number;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Quest validation failed: ${result.errors.join('; ')}`);
    }
  }
}
