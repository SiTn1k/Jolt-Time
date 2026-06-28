/**
 * Reward Types Index
 *
 * Exports all reward domain types.
 */

export { RewardType, REWARD_TYPE_DISPLAY, isValidRewardType, requiresTargetIdentifier } from './RewardType';
export { RewardStatus, REWARD_STATUS_DISPLAY, isTerminalStatus, isPendingStatus } from './RewardStatus';
export { RewardSource, REWARD_SOURCE_DISPLAY, isValidRewardSource } from './RewardSource';
export type { RewardTarget, RewardTargetType, PlayerRewardTarget, GuildRewardTarget, SharedRewardTarget } from './RewardTarget';
export { createPlayerTarget, createGuildTarget, createSharedTarget } from './RewardTarget';

export type { RewardDefinitionMetadata, RewardPackageMetadata, RewardRequestMetadata, RewardMetadata } from './RewardMetadata';
export { createDefaultDefinitionMetadata, createDefaultPackageMetadata, createDefaultRequestMetadata } from './RewardMetadata';

export type { RewardStatistics } from './RewardStatistics';
export { INITIAL_REWARD_STATISTICS } from './RewardStatistics';