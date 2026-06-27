/**
 * Reward Claimed Event
 *
 * Domain event emitted when a player claims a quest reward.
 */

import type { QuestCategory } from '../types/QuestCategory';
import type { QuestDifficulty } from '../types/QuestDifficulty';
import type { QuestMetadata } from '../types/QuestMetadata';

/**
 * Event data for reward claim.
 */
export interface RewardClaimedEventData {
  /** Quest ID */
  questId: string;
  /** Player profile ID */
  playerProfileId: string;
  /** Quest slug */
  slug: string;
  /** Quest title */
  title: string;
  /** Quest category */
  category: QuestCategory;
  /** Quest difficulty */
  difficulty: QuestDifficulty;
  /** Progress ID */
  progressId: string;
  /** Rewards claimed */
  rewardDefinition: QuestMetadata['rewardDefinition'];
  /** Coins earned */
  coinsEarned: number;
  /** Gems earned */
  gemsEarned: number;
  /** Fragments earned */
  fragmentsEarned: number;
  /** XP earned */
  xpEarned: number;
  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for reward claim.
 */
export interface RewardClaimedEvent {
  /** Event type identifier */
  readonly eventType: 'RewardClaimed';
  /** Event data */
  readonly data: RewardClaimedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a RewardClaimedEvent.
 */
export function createRewardClaimedEvent(params: {
  questId: string;
  playerProfileId: string;
  slug: string;
  title: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  progressId: string;
  rewardDefinition: QuestMetadata['rewardDefinition'];
}): RewardClaimedEvent {
  const rewardDef = params.rewardDefinition;

  return {
    eventType: 'RewardClaimed',
    version: 1,
    data: {
      questId: params.questId,
      playerProfileId: params.playerProfileId,
      slug: params.slug,
      title: params.title,
      category: params.category,
      difficulty: params.difficulty,
      progressId: params.progressId,
      rewardDefinition: rewardDef,
      coinsEarned: rewardDef.coins ?? 0,
      gemsEarned: rewardDef.gems ?? 0,
      fragmentsEarned: rewardDef.fragments ?? 0,
      xpEarned: rewardDef.xp ?? 0,
      occurredAt: new Date(),
    },
  };
}
