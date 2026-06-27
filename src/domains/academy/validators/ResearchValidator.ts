/**
 * Research Validator
 *
 * Validates research-related data according to game rules.
 */

import type { ResearchCategory } from '../types/ResearchCategory';
import type { ResearchTier } from '../types/ResearchTier';
import type { UnlockType } from '../types/UnlockType';
import { isValidResearchTier } from '../types/ResearchTier';

/**
 * Result of research validation.
 */
export interface ResearchValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for research data.
 */
export class ResearchValidator {
  /**
   * Validates that a slug is valid.
   * @param slug The slug to validate
   * @returns true if valid
   */
  public static isValidSlug(slug: string | null | undefined): boolean {
    if (!slug || typeof slug !== 'string') {
      return false;
    }
    // Slug should be lowercase alphanumeric with hyphens, 3-50 chars
    const slugRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
    return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 50;
  }

  /**
   * Validates that a title is valid.
   * @param title The title to validate
   * @returns true if valid
   */
  public static isValidTitle(title: string | null | undefined): boolean {
    if (!title || typeof title !== 'string') {
      return false;
    }
    return title.length >= 3 && title.length <= 100;
  }

  /**
   * Validates that a description is valid.
   * @param description The description to validate
   * @returns true if valid
   */
  public static isValidDescription(description: string | null | undefined): boolean {
    if (!description || typeof description !== 'string') {
      return false;
    }
    return description.length >= 10 && description.length <= 1000;
  }

  /**
   * Validates research cost.
   * @param cost The cost to validate
   * @returns true if valid
   */
  public static isValidResearchCost(cost: number | null | undefined): boolean {
    if (cost === null || cost === undefined) {
      return false;
    }
    return typeof cost === 'number' && Number.isInteger(cost) && cost >= 0 && cost <= 999999999;
  }

  /**
   * Validates required nodes array.
   * @param requiredNodes The required nodes to validate
   * @returns true if valid
   */
  public static isValidRequiredNodes(requiredNodes: unknown | null | undefined): boolean {
    if (!requiredNodes) {
      return true; // Empty array is valid
    }
    if (!Array.isArray(requiredNodes)) {
      return false;
    }
    // Each item should be a valid UUID string
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return requiredNodes.every((id) => typeof id === 'string' && uuidRegex.test(id));
  }

  /**
   * Validates complete research data.
   * @param data The data to validate
   * @returns Validation result with all errors
   */
  public static validateResearchNode(data: {
    slug?: string;
    title?: string;
    description?: string;
    category?: ResearchCategory;
    tier?: number;
    requiredNodes?: string[];
    researchCost?: number;
    unlockType?: UnlockType;
  }): ResearchValidationResult {
    const errors: string[] = [];

    // Validate slug
    if (data.slug !== undefined) {
      if (!this.isValidSlug(data.slug)) {
        errors.push('Slug must be 3-50 lowercase alphanumeric characters with hyphens');
      }
    }

    // Validate title
    if (data.title !== undefined) {
      if (!this.isValidTitle(data.title)) {
        errors.push('Title must be 3-100 characters');
      }
    }

    // Validate description
    if (data.description !== undefined) {
      if (!this.isValidDescription(data.description)) {
        errors.push('Description must be 10-1000 characters');
      }
    }

    // Validate category
    if (data.category !== undefined) {
      const validCategories = [
        'history', 'science', 'culture', 'economics', 'military',
        'exploration', 'philosophy', 'religion', 'architecture', 'language',
      ];
      if (!validCategories.includes(data.category)) {
        errors.push(`Category must be one of: ${validCategories.join(', ')}`);
      }
    }

    // Validate tier
    if (data.tier !== undefined) {
      if (!isValidResearchTier(data.tier)) {
        errors.push('Tier must be a number between 1 and 5');
      }
    }

    // Validate required nodes
    if (data.requiredNodes !== undefined) {
      if (!this.isValidRequiredNodes(data.requiredNodes)) {
        errors.push('Required nodes must be an array of valid UUIDs');
      }
    }

    // Validate research cost
    if (data.researchCost !== undefined) {
      if (!this.isValidResearchCost(data.researchCost)) {
        errors.push('Research cost must be a non-negative integer up to 999999999');
      }
    }

    // Validate unlock type
    if (data.unlockType !== undefined) {
      const validUnlockTypes = [
        'default', 'research_completion', 'level_requirement',
        'research_points', 'quest_completion', 'artifact_collection', 'event',
      ];
      if (!validUnlockTypes.includes(data.unlockType)) {
        errors.push(`Unlock type must be one of: ${validUnlockTypes.join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates research data and throws if invalid.
   * @param data The data to validate
   * @throws Error with validation details if invalid
   */
  public static validateResearchNodeOrThrow(data: {
    slug?: string;
    title?: string;
    description?: string;
    category?: ResearchCategory;
    tier?: number;
    requiredNodes?: string[];
    researchCost?: number;
    unlockType?: UnlockType;
  }): void {
    const result = this.validateResearchNode(data);
    if (!result.isValid) {
      throw new Error(`Research validation failed: ${result.errors.join('; ')}`);
    }
  }
}