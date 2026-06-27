/**
 * Achievement Domain Index
 *
 * Main entry point for the Achievement domain module.
 * Exports all public-facing entities, interfaces, types, and utilities.
 */

// Value Objects
export {
  AchievementId,
  ConditionId,
  AchievementSlug,
  AchievementPoints,
  ProgressValue,
} from './value-objects';

// Types
export type {
  AchievementMetadata,
  AchievementRewardDefinition,
  ConditionMetadata,
} from './types';
export {
  AchievementCategory,
  ACHIEVEMENT_CATEGORY_DISPLAY,
  isSpecialCategory,
  AchievementStatus,
  ACHIEVEMENT_STATUS_DISPLAY,
  ACHIEVEMENT_STATUS_COLORS,
  isActiveStatus,
  isCompletedStatus,
  isClaimableStatus,
  AchievementRarity,
  ACHIEVEMENT_RARITY_DISPLAY,
  ACHIEVEMENT_RARITY_COLORS,
  ACHIEVEMENT_RARITY_MULTIPLIERS,
  getRarityOrder,
  ConditionType,
  CONDITION_TYPE_DISPLAY,
  requiresTargetIdentifier,
  isTimeBasedCondition,
  createDefaultAchievementMetadata,
} from './types';

export type { AchievementStatistics } from './types';
export { INITIAL_ACHIEVEMENT_STATISTICS, calculateCategoryCompletion } from './types';

// Entities
export {
  Achievement,
  AchievementCondition,
  AchievementProgress,
  AchievementProgressId,
} from './entities';
export type {
  AchievementProps,
  AchievementRecord,
  AchievementJSON,
  AchievementConditionProps,
  AchievementConditionRecord,
  AchievementConditionJSON,
  AchievementProgressProps,
  AchievementProgressRecord,
  AchievementProgressJSON,
} from './entities';

// Interfaces
export type {
  IAchievement,
  IAchievementCondition,
  IAchievementProgress,
  IAchievementProgressEntity,
  IAchievementRepository,
  AchievementFilterParams,
  IAchievementProgressRepository,
  AchievementProgressFilterParams,
} from './interfaces';

// DTOs
export type {
  CreateAchievementDto,
  CreateConditionDto,
  ConditionResponseDto,
  CreateProgressDto,
  ProgressResponseDto,
  ProgressWithPercentageDto,
  AchievementResponseDto,
  AchievementWithProgressResponseDto,
  AchievementListResponseDto,
  AchievementListWithProgressResponseDto,
  AchievementStatisticsResponseDto,
} from './dto';
export { CREATE_ACHIEVEMENT_VALIDATION } from './dto';

// Validators
export {
  AchievementValidator,
  ConditionValidator,
  ProgressValidator,
} from './validators';
export type {
  AchievementValidationResult,
  ConditionValidationResult,
  ProgressValidationResult,
} from './validators';

// Events
export type {
  AchievementCreatedEvent,
  AchievementCreatedEventData,
  AchievementUnlockedEvent,
  AchievementUnlockedEventData,
  AchievementCompletedEvent,
  AchievementCompletedEventData,
  AchievementClaimRequestedEvent,
  AchievementClaimRequestedEventData,
} from './events';
export {
  createAchievementCreatedEvent,
  createAchievementUnlockedEvent,
  createAchievementCompletedEvent,
  createAchievementClaimRequestedEvent,
} from './events';

// Mappers
export { AchievementMapper, ConditionMapper, ProgressMapper } from './mappers';

// Repositories
export { SupabaseAchievementRepository, SupabaseAchievementProgressRepository } from './repositories';

// DI
export {
  ACHIEVEMENT_TOKENS,
  registerAchievementDependencies,
  setupAchievementDomain,
} from './di';
