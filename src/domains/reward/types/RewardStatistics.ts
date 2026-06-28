/**
 * RewardStatistics Type
 *
 * Statistics for reward-related metrics.
 */

import type { RewardType } from './RewardType';
import type { RewardSource } from './RewardSource';

/**
 * Reward statistics for a player.
 */
export interface RewardStatistics {
  /** Total rewards received */
  totalRewardsReceived: number;
  
  /** Total reward value received (sum of all amounts) */
  totalRewardValue: number;
  
  /** Count of rewards by type */
  rewardsByType: Partial<Record<RewardType, number>>;
  
  /** Count of rewards by source */
  rewardsBySource: Partial<Record<RewardSource, number>>;
  
  /** Total pending rewards */
  pendingRewards: number;
  
  /** Total granted rewards */
  grantedRewards: number;
  
  /** Total rejected rewards */
  rejectedRewards: number;
  
  /** Largest single reward received */
  largestReward: number;
  
  /** Average reward value */
  averageReward: number;
  
  /** Last reward received timestamp */
  lastRewardAt?: string;
}

/**
 * Initial reward statistics.
 */
export const INITIAL_REWARD_STATISTICS: RewardStatistics = {
  totalRewardsReceived: 0,
  totalRewardValue: 0,
  rewardsByType: {},
  rewardsBySource: {},
  pendingRewards: 0,
  grantedRewards: 0,
  rejectedRewards: 0,
  largestReward: 0,
  averageReward: 0,
};