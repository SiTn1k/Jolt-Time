/**
 * RewardPackageValidator
 *
 * Validates reward package data.
 */

import type { RewardPackage } from '../entities/RewardPackage';
import type { RewardPackageMetadata } from '../types/RewardMetadata';

/**
 * Validation result for package validation.
 */
export interface PackageValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * RewardPackageValidator class for validating reward packages.
 */
export class RewardPackageValidator {
  /**
   * Validates package data.
   */
  public validate(params: {
    title?: string;
    description?: string;
    rewardCount?: number;
    isRepeatable?: boolean;
    metadata?: RewardPackageMetadata;
  }): PackageValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

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

    // Validate reward count
    if (params.rewardCount !== undefined) {
      if (params.rewardCount < 0) {
        errors.push('Reward count cannot be negative.');
      }
      if (params.rewardCount === 0) {
        warnings.push('Package has no rewards.');
      }
    }

    // Warnings for surprise packages
    if (params.metadata?.isSurprise && params.title && !params.title.includes('surprise') && !params.title.includes('mystery')) {
      warnings.push('Surprise package should have a mysterious title.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validates a reward package entity.
   */
  public validateEntity(pkg: RewardPackage): PackageValidationResult {
    return this.validate({
      title: pkg.title,
      description: pkg.description,
      rewardCount: pkg.rewardCount,
      isRepeatable: pkg.isRepeatable,
      metadata: pkg.metadata,
    });
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
}