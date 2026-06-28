/**
 * RewardTarget Type
 *
 * Defines the target of a reward.
 */

import type { RewardType } from './RewardType';

/**
 * Target type for rewards.
 */
export type RewardTargetType = 'player' | 'guild' | 'shared';

/**
 * Player-specific reward target.
 */
export interface PlayerRewardTarget {
  type: 'player';
  playerProfileId?: string;
}

/**
 * Guild-specific reward target.
 */
export interface GuildRewardTarget {
  type: 'guild';
  guildId?: string;
}

/**
 * Shared reward target (distributed to multiple players).
 */
export interface SharedRewardTarget {
  type: 'shared';
  maxRecipients?: number;
}

/**
 * Union type for all reward targets.
 */
export type RewardTarget = PlayerRewardTarget | GuildRewardTarget | SharedRewardTarget;

/**
 * Creates a player reward target.
 */
export function createPlayerTarget(playerProfileId?: string): PlayerRewardTarget {
  return { type: 'player', playerProfileId };
}

/**
 * Creates a guild reward target.
 */
export function createGuildTarget(guildId?: string): GuildRewardTarget {
  return { type: 'guild', guildId };
}

/**
 * Creates a shared reward target.
 */
export function createSharedTarget(maxRecipients?: number): SharedRewardTarget {
  return { type: 'shared', maxRecipients };
}