/**
 * RewardDefinitionDto
 *
 * Data Transfer Objects for RewardDefinition.
 */

import type { RewardType } from '../types/RewardType';
import type { RewardTarget } from '../types/RewardTarget';
import type { RewardDefinitionMetadata } from '../types/RewardMetadata';

/**
 * DTO for creating a reward definition.
 */
export interface CreateRewardDefinitionDto {
  slug: string;
  title: string;
  description: string;
  rewardType: RewardType;
  amount: number;
  rewardTarget?: RewardTarget;
  metadata?: RewardDefinitionMetadata;
}

/**
 * DTO for updating a reward definition.
 */
export interface UpdateRewardDefinitionDto {
  title?: string;
  description?: string;
  amount?: number;
  rewardTarget?: RewardTarget;
  metadata?: RewardDefinitionMetadata;
}

/**
 * DTO for reward definition response.
 */
export interface RewardDefinitionResponseDto {
  rewardId: string;
  slug: string;
  title: string;
  description: string;
  rewardType: RewardType;
  amount: number;
  rewardTarget: RewardTarget;
  metadata: RewardDefinitionMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * Validation rules for CreateRewardDefinitionDto.
 */
export const CREATE_REWARD_DEFINITION_VALIDATION = {
  slug: {
    required: true,
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  },
  title: {
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  description: {
    required: true,
    minLength: 1,
    maxLength: 500,
  },
  rewardType: {
    required: true,
  },
  amount: {
    required: true,
    min: 1,
  },
} as const;