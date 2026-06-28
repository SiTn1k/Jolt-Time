/**
 * RewardRequestValidator
 *
 * Validates reward request data.
 */

import type { RewardRequest } from '../entities/RewardRequest';
import type { RewardSource } from '../types/RewardSource';
import type { RewardStatus } from '../types/RewardStatus';
import { isValidRewardSource } from '../types/RewardSource';
import { isTerminalStatus, isPendingStatus } from '../types/RewardStatus';

/**
 * Validation result for request validation.
 */
export interface RequestValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * RewardRequestValidator class for validating reward requests.
 */
export class RewardRequestValidator {
  /**
   * Validates request data.
   */
  public validate(params: {
    playerProfileId?: string;
    sourceModule?: RewardSource;
    sourceId?: string;
    packageId?: string;
    status?: RewardStatus;
  }): RequestValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate player profile ID
    if (params.playerProfileId !== undefined) {
      if (!this.isValidId(params.playerProfileId)) {
        errors.push('Invalid player profile ID.');
      }
    }

    // Validate source module
    if (params.sourceModule !== undefined) {
      if (!isValidRewardSource(params.sourceModule)) {
        errors.push(`Invalid source module: ${params.sourceModule}`);
      }
    }

    // Validate source ID
    if (params.sourceId !== undefined) {
      if (!params.sourceId.trim()) {
        errors.push('Source ID cannot be empty.');
      }
    }

    // Validate package ID
    if (params.packageId !== undefined) {
      if (!this.isValidId(params.packageId)) {
        errors.push('Invalid package ID.');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validates a reward request entity.
   */
  public validateEntity(request: RewardRequest): RequestValidationResult {
    return this.validate({
      playerProfileId: request.playerProfileId.value,
      sourceModule: request.sourceModule,
      sourceId: request.sourceId,
      packageId: request.packageId,
      status: request.status,
    });
  }

  /**
   * Checks if a status transition is valid.
   */
  public isValidStatusTransition(
    currentStatus: RewardStatus,
    newStatus: RewardStatus
  ): boolean {
    // Can't change terminal states
    if (isTerminalStatus(currentStatus)) {
      return false;
    }

    // Valid transitions from pending/processing
    if (currentStatus === 'pending' || currentStatus === 'processing') {
      return ['processing', 'granted', 'rejected', 'expired', 'failed'].includes(newStatus);
    }

    // Can only transition to terminal states
    return isTerminalStatus(newStatus);
  }

  /**
   * Checks if ID is valid format.
   */
  private isValidId(id: string): boolean {
    return typeof id === 'string' && id.length > 0 && id.length <= 100;
  }
}