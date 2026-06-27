/**
 * Achievement Types Index
 *
 * Exports all achievement domain types.
 */

export {
  AchievementCategory,
  ACHIEVEMENT_CATEGORY_DISPLAY,
  isSpecialCategory,
} from './AchievementCategory';

export {
  AchievementStatus,
  ACHIEVEMENT_STATUS_DISPLAY,
  ACHIEVEMENT_STATUS_COLORS,
  isActiveStatus,
  isCompletedStatus,
  isClaimableStatus,
} from './AchievementStatus';

export {
  AchievementRarity,
  ACHIEVEMENT_RARITY_DISPLAY,
  ACHIEVEMENT_RARITY_COLORS,
  ACHIEVEMENT_RARITY_MULTIPLIERS,
  getRarityOrder,
} from './AchievementRarity';

export {
  ConditionType,
  CONDITION_TYPE_DISPLAY,
  requiresTargetIdentifier,
  isTimeBasedCondition,
} from './ConditionType';

export type {
  AchievementMetadata,
  AchievementRewardDefinition,
  ConditionMetadata,
} from './AchievementMetadata';
export { createDefaultAchievementMetadata } from './AchievementMetadata';

export type { AchievementStatistics } from './AchievementStatistics';
export { INITIAL_ACHIEVEMENT_STATISTICS, calculateCategoryCompletion } from './AchievementStatistics';
