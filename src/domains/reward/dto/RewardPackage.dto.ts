/**
 * RewardPackageDto
 *
 * Data Transfer Objects for RewardPackage.
 */

import type { RewardPackageMetadata } from '../types/RewardMetadata';
import type { RewardDefinitionResponseDto } from './RewardDefinition.dto';

/**
 * DTO for creating a reward package.
 */
export interface CreateRewardPackageDto {
  title: string;
  description: string;
  rewardIds: string[];
  isRepeatable?: boolean;
  metadata?: RewardPackageMetadata;
}

/**
 * DTO for updating a reward package.
 */
export interface UpdateRewardPackageDto {
  title?: string;
  description?: string;
  rewardIds?: string[];
  isRepeatable?: boolean;
  metadata?: RewardPackageMetadata;
}

/**
 * DTO for reward package response.
 */
export interface RewardPackageResponseDto {
  packageId: string;
  title: string;
  description: string;
  rewardIds: string[];
  rewards?: RewardDefinitionResponseDto[];
  isRepeatable: boolean;
  rewardCount: number;
  totalValue: number;
  metadata: RewardPackageMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * Validation rules for CreateRewardPackageDto.
 */
export const CREATE_REWARD_PACKAGE_VALIDATION = {
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
  rewardIds: {
    required: true,
    minLength: 1,
  },
} as const;