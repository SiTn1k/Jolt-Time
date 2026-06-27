/**
 * Quest Domain Index
 *
 * Main entry point for the Quest domain module.
 * Exports all public-facing entities, interfaces, types, and utilities.
 */

// Value Objects
export {
  QuestId,
  ObjectiveId,
  QuestSlug,
  ProgressValue,
} from './value-objects';

// Types
export type {
  QuestMetadata,
  QuestRewardDefinition,
  QuestRequirement,
  QuestTracking,
  QuestLimit,
} from './types';
export {
  QuestCategory,
  QUEST_CATEGORY_DISPLAY,
  isRepeatingCategory,
  QuestDifficulty,
  QUEST_DIFFICULTY_DISPLAY,
  QUEST_DIFFICULTY_COLORS,
  QUEST_DIFFICULTY_MULTIPLIERS,
  getRecommendedLevel,
  QuestStatus,
  QUEST_STATUS_DISPLAY,
  QUEST_STATUS_COLORS,
  isActiveStatus,
  isCompletedStatus,
  ObjectiveType,
  OBJECTIVE_TYPE_DISPLAY,
  requiresTargetIdentifier,
  RepeatType,
  REPEAT_TYPE_DISPLAY,
  isRepeating,
  createDefaultQuestMetadata,
} from './types';

export type { QuestStatistics } from './types';
export { INITIAL_QUEST_STATISTICS } from './types';

// Entities
export {
  Quest,
  QuestObjective,
  QuestProgress,
  QuestProgressId,
} from './entities';
export type {
  QuestProps,
  QuestRecord,
  QuestJSON,
  QuestObjectiveProps,
  QuestObjectiveRecord,
  QuestObjectiveJSON,
  QuestProgressProps,
  QuestProgressRecord,
  QuestProgressJSON,
} from './entities';

// Interfaces
export type {
  IQuest,
  IQuestObjective,
  IQuestProgress,
  IQuestRepository,
  QuestFilterParams,
} from './interfaces';

// DTOs
export type {
  CreateQuestDto,
  QuestObjectiveDto,
  QuestObjectiveResponseDto,
  QuestProgressDto,
  QuestProgressResponseDto,
  QuestResponseDto,
  QuestWithProgressResponseDto,
  QuestListResponseDto,
  QuestListWithProgressResponseDto,
} from './dto';
export { CREATE_QUEST_VALIDATION } from './dto';

// Validators
export {
  QuestValidator,
  ObjectiveValidator,
  ProgressValidator,
} from './validators';
export type {
  QuestValidationResult,
  ObjectiveValidationResult,
  ProgressValidationResult,
} from './validators';

// Events
export type {
  QuestCreatedEvent,
  QuestCreatedEventData,
  QuestStartedEvent,
  QuestStartedEventData,
  QuestCompletedEvent,
  QuestCompletedEventData,
  QuestResetEvent,
  QuestResetEventData,
  RewardClaimedEvent,
  RewardClaimedEventData,
} from './events';
export {
  createQuestCreatedEvent,
  createQuestStartedEvent,
  createQuestCompletedEvent,
  createQuestResetEvent,
  createRewardClaimedEvent,
} from './events';

// Mappers
export { QuestMapper, ObjectiveMapper, ProgressMapper } from './mappers';

// Repositories
export { SupabaseQuestRepository } from './repositories';

// DI
export {
  QUEST_TOKENS,
  registerQuestDependencies,
  setupQuestDomain,
} from './di';
