/**
 * Quest Types Index
 *
 * Exports all quest domain types.
 */

export {
  QuestCategory,
  QUEST_CATEGORY_DISPLAY,
  isRepeatingCategory,
} from './QuestCategory';

export {
  QuestDifficulty,
  QUEST_DIFFICULTY_DISPLAY,
  QUEST_DIFFICULTY_COLORS,
  QUEST_DIFFICULTY_MULTIPLIERS,
  getRecommendedLevel,
} from './QuestDifficulty';

export {
  QuestStatus,
  QUEST_STATUS_DISPLAY,
  QUEST_STATUS_COLORS,
  isActiveStatus,
  isCompletedStatus,
} from './QuestStatus';

export {
  ObjectiveType,
  OBJECTIVE_TYPE_DISPLAY,
  requiresTargetIdentifier,
} from './ObjectiveType';

export {
  RepeatType,
  REPEAT_TYPE_DISPLAY,
  isRepeating,
} from './RepeatType';

export type {
  QuestMetadata,
  QuestRewardDefinition,
  QuestRequirement,
  QuestTracking,
  QuestLimit,
} from './QuestMetadata';
export { createDefaultQuestMetadata } from './QuestMetadata';

export type { QuestStatistics } from './QuestStatistics';
export { INITIAL_QUEST_STATISTICS } from './QuestStatistics';
