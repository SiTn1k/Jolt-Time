/**
 * RewardValidator
 *
 * Validates reward definition data.
 */

import type { RewardDefinition } from '../entities/RewardDefinition';
import type { RewardType } from '../types/RewardType';
import type { RewardDefinitionMetadata } from '../types/RewardMetadata';
import { isValidRewardType, requiresTargetIdentifier } from '../types/RewardType';

/**
 * Validation result for reward validation.
 */
export interface RewardValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * RewardValidator class for validating reward definitions.
 */
export class RewardValidator {
  /**
   * Validates reward data.
   */
  public validate(params: {
    slug?: string;
    title?: string;
    description?: string;
    rewardType?: RewardType;
    amount?: number;
    metadata?: RewardDefinitionMetadata;
  }): RewardValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate slug
    if (params.slug !== undefined) {
      if (!this.isValidSlug(params.slug)) {
        errors.push('Invalid slug format. Must be lowercase alphanumeric with hyphens.');
      }
    }

    // Validate title
    if (params.title !== undefined) {
      if (!this.isValidTitle(params.title)) {
        errors.push('Title must be between 1 and 100 characters.');
      }
    }

    // Validate description
    if (params.description !== undefined) {
      if (!this.isValidDescription(params.description)) {
        errors.push('Description must be between 1 and 500 characters.');
      }
    }

    // Validate reward type
    if (params.rewardType !== undefined) {
      if (!isValidRewardType(params.rewardType)) {
        errors.push(`Invalid reward type: ${params.rewardType}`);
      }
    }

    // Validate amount
    if (params.amount !== undefined) {
      if (!this.isValidAmount(params.amount)) {
        errors.push('Amount must be a positive number greater than 0.');
      }
    }

    // Warnings
    if (params.metadata?.expiresAt) {
      const expiresAt = new Date(params.metadata.expiresAt);
      if (expiresAt < new Date()) {
        warnings.push('Reward has already expired.');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validates a reward definition entity.
   */
  public validateEntity(definition: RewardDefinition): RewardValidationResult {
    return this.validate({
      slug: definition.slug.value,
      title: definition.title,
      description: definition.description,
      rewardType: definition.rewardType,
      amount: definition.rewardValue.amount,
      metadata: definition.metadata,
    });
  }

  /**
   * Checks if slug is valid.
   */
  private isValidSlug(slug: string): boolean {
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugPattern.test(slug) && slug.length >= 3 && slug.length <= 50;
  }

  /**
   * Checks if title is valid.
   */
  private isValidTitle(title: string): boolean {
    return title.length >= 1 && title.length <= 100;
  }

  /**
   * Checks if description is valid.
   */
  private isValidDescription(description: string): boolean {
    return description.length >= 1 && description.length <= 500;
  }

  /**
   * Checks if amount is valid.
   */
  private isValidAmount(amount: number): boolean {
    return typeof amount === 'number' && amount > 0 && Number.isFinite(amount);
  }
}