/**
 * RewardResponseDto
 *
 * Data Transfer Objects for reward responses.
 */

import type { RewardDefinitionResponseDto } from './RewardDefinition.dto';
import type { RewardPackageResponseDto } from './RewardPackage.dto';
import type { RewardRequestResponseDto } from './RewardRequest.dto';

/**
 * DTO for reward grant response.
 */
export interface RewardGrantResponseDto {
  success: boolean;
  requestId: string;
  status: string;
  rewards?: RewardDefinitionResponseDto[];
  grantedAt: string;
  message?: string;
}

/**
 * DTO for reward statistics response.
 */
export interface RewardStatisticsResponseDto {
  totalRewardsReceived: number;
  totalRewardValue: number;
  pendingRewards: number;
  grantedRewards: number;
  rejectedRewards: number;
  largestReward: number;
  averageReward: number;
  lastRewardAt?: string;
}

/**
 * Combined reward response DTO.
 */
export interface RewardResponseDto {
  definition?: RewardDefinitionResponseDto;
  package?: RewardPackageResponseDto;
  request?: RewardRequestResponseDto;
}

/**
 * Reward list response DTO.
 */
export interface RewardListResponseDto {
  definitions: RewardDefinitionResponseDto[];
  packages: RewardPackageResponseDto[];
  requests: RewardRequestResponseDto[];
  total: number;
}