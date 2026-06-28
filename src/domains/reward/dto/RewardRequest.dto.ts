/**
 * RewardRequestDto
 *
 * Data Transfer Objects for RewardRequest.
 */

import type { RewardStatus } from '../types/RewardStatus';
import type { RewardSource } from '../types/RewardSource';
import type { RewardRequestMetadata } from '../types/RewardMetadata';

/**
 * DTO for creating a reward request.
 */
export interface CreateRewardRequestDto {
  playerProfileId: string;
  sourceModule: RewardSource;
  sourceId: string;
  packageId: string;
  metadata?: RewardRequestMetadata;
}

/**
 * DTO for updating a reward request.
 */
export interface UpdateRewardRequestDto {
  status?: RewardStatus;
  metadata?: RewardRequestMetadata;
}

/**
 * DTO for reward request response.
 */
export interface RewardRequestResponseDto {
  requestId: string;
  playerProfileId: string;
  sourceModule: RewardSource;
  sourceId: string;
  packageId: string;
  status: RewardStatus;
  requestedAt: string;
  processedAt?: string;
  metadata: RewardRequestMetadata;
}

/**
 * DTO for reward request list item.
 */
export interface RewardRequestListItemDto {
  requestId: string;
  playerProfileId: string;
  sourceModule: RewardSource;
  packageId: string;
  status: RewardStatus;
  requestedAt: string;
}

/**
 * Validation rules for CreateRewardRequestDto.
 */
export const CREATE_REWARD_REQUEST_VALIDATION = {
  playerProfileId: {
    required: true,
  },
  sourceModule: {
    required: true,
  },
  sourceId: {
    required: true,
  },
  packageId: {
    required: true,
  },
} as const;