/**
 * Reward Domain Index
 *
 * Main entry point for the Reward domain module.
 * Exports all public-facing entities, interfaces, types, and utilities.
 */

// Value Objects
export {
  RewardId,
  PackageId,
  RequestId,
  RewardSlug,
  RewardValue,
} from './value-objects';

// Types
export {
  RewardType,
  REWARD_TYPE_DISPLAY,
  isValidRewardType,
  requiresTargetIdentifier,
  RewardStatus,
  REWARD_STATUS_DISPLAY,
  isTerminalStatus,
  isPendingStatus,
  RewardSource,
  REWARD_SOURCE_DISPLAY,
  isValidRewardSource,
} from './types';
export type {
  RewardTarget,
  RewardTargetType,
  PlayerRewardTarget,
  GuildRewardTarget,
  SharedRewardTarget,
} from './types';
export {
  createPlayerTarget,
  createGuildTarget,
  createSharedTarget,
} from './types';

export type {
  RewardDefinitionMetadata,
  RewardPackageMetadata,
  RewardRequestMetadata,
  RewardMetadata,
} from './types';
export {
  createDefaultDefinitionMetadata,
  createDefaultPackageMetadata,
  createDefaultRequestMetadata,
} from './types';

export type { RewardStatistics } from './types';
export { INITIAL_REWARD_STATISTICS } from './types';

// Entities
export {
  RewardDefinition,
  type RewardDefinitionProps,
  type RewardDefinitionRecord,
  type RewardDefinitionJSON,
  RewardPackage,
  type RewardPackageProps,
  type RewardPackageRecord,
  type RewardPackageJSON,
  RewardRequest,
  type RewardRequestProps,
  type RewardRequestRecord,
  type RewardRequestJSON,
} from './entities';

// Interfaces
export type {
  IRewardDefinition,
  IRewardPackage,
  IRewardRequest,
  IRewardRepository,
  RewardDefinitionFilterParams,
  RewardPackageFilterParams,
  RewardRequestFilterParams,
} from './interfaces';

// DTOs
export type {
  CreateRewardDefinitionDto,
  UpdateRewardDefinitionDto,
  RewardDefinitionResponseDto,
  CreateRewardPackageDto,
  UpdateRewardPackageDto,
  RewardPackageResponseDto,
  CreateRewardRequestDto,
  UpdateRewardRequestDto,
  RewardRequestResponseDto,
  RewardRequestListItemDto,
  RewardGrantResponseDto,
  RewardStatisticsResponseDto,
  RewardResponseDto,
  RewardListResponseDto,
} from './dto';
export {
  CREATE_REWARD_DEFINITION_VALIDATION,
  CREATE_REWARD_PACKAGE_VALIDATION,
  CREATE_REWARD_REQUEST_VALIDATION,
} from './dto';

// Validators
export {
  RewardValidator,
  RewardPackageValidator,
  RewardRequestValidator,
} from './validators';
export type {
  RewardValidationResult,
  PackageValidationResult,
  RequestValidationResult,
} from './validators';

// Events
export type {
  RewardRequestedEvent,
  RewardRequestedEventData,
  RewardGrantedEvent,
  RewardGrantedEventData,
  RewardRejectedEvent,
  RewardRejectedEventData,
  RewardExpiredEvent,
  RewardExpiredEventData,
} from './events';
export {
  createRewardRequestedEvent,
  createRewardGrantedEvent,
  createRewardRejectedEvent,
  createRewardExpiredEvent,
} from './events';

// Mappers
export { RewardMapper, PackageMapper, RequestMapper } from './mappers';

// Repositories
export { SupabaseRewardRepository, NotImplementedError } from './repositories';

// DI
export {
  REWARD_TOKENS,
  registerRewardDependencies,
  setupRewardDomain,
} from './di';