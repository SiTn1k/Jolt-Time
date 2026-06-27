/**
 * Academy Domain Index
 *
 * Main entry point for the Academy domain module.
 * Exports all public-facing entities, interfaces, types, and utilities.
 *
 * Academy represents the player's historical research and technological progression.
 * Academy does NOT own currency, artifacts, or modify other game state.
 * Academy manages research progression only.
 */

// Value Objects
export { AcademyId } from './value-objects';
export { ResearchNodeId } from './value-objects';
export { ResearchPoints, MAX_RESEARCH_POINTS } from './value-objects';
export { ResearchProgressValue } from './value-objects';

// Types - enums and functions
export {
  ResearchCategory,
  RESEARCH_CATEGORY_INFO,
  getResearchCategoryDisplayName,
  getResearchCategoryDescription,
} from './types';
export {
  ResearchTier,
  RESEARCH_TIER_INFO,
  getResearchTierDisplayName,
  getResearchTierMinLevel,
  isValidResearchTier,
} from './types';
export {
  ResearchStatus,
  isActiveResearchStatus,
  isCompletedResearchStatus,
  isLockedResearchStatus,
  isAvailableResearchStatus,
  canStartResearch,
  canResetResearch,
} from './types';
export { UnlockType, requiresPrerequisites, requiresResources } from './types';

// Types - interfaces and functions
export type { AcademyMetadata, ResearchNodeMetadata, AcademyStatistics } from './types';
export { createDefaultAcademyMetadata, createInitialAcademyStatistics, INITIAL_ACADEMY_STATISTICS } from './types';

// Entities
export {
  Academy,
  ResearchNode,
  ResearchProgress,
} from './entities';
export type {
  AcademyProps,
  AcademyJSON,
  ResearchNodeProps,
  ResearchNodeJSON,
  ResearchProgressProps,
  ResearchProgressJSON,
} from './entities';

// Interfaces
export type {
  IAcademy,
  IResearchNode,
  IResearchProgress,
  IAcademyRepository,
  AcademyFilterParams,
  ResearchProgressFilterParams,
} from './interfaces';

// DTOs
export type {
  CreateAcademyDto,
  ResearchNodeDto,
  ResearchNodeSummaryDto,
  ResearchNodeDetailDto,
  ResearchProgressDto,
  ResearchProgressSummaryDto,
  ActiveResearchDto,
  AcademyResponseDto,
  AcademySummaryDto,
  AcademyDetailDto,
  AcademyStatisticsResponseDto,
} from './dto';
export { CREATE_ACADEMY_VALIDATION } from './dto';

// Validators
export {
  ResearchValidator,
  ResearchPointsValidator,
  ResearchTreeValidator,
} from './validators';
export type {
  ResearchValidationResult,
  ResearchPointsValidationResult,
  ResearchTreeValidationResult,
  ResearchNodeIssue,
} from './validators';

// Events
export type {
  AcademyCreatedEvent,
  AcademyCreatedEventData,
  ResearchStartedEvent,
  ResearchStartedEventData,
  ResearchCompletedEvent,
  ResearchCompletedEventData,
  ResearchResetEvent,
  ResearchResetEventData,
} from './events';
export {
  createAcademyCreatedEvent,
  createResearchStartedEvent,
  createResearchCompletedEvent,
  createResearchResetEvent,
} from './events';

// Mappers
export { AcademyMapper, ResearchMapper } from './mappers';
export type { AcademyRecord, ResearchNodeRecord, ResearchProgressRecord } from './mappers';

// Repositories
export { SupabaseAcademyRepository } from './repositories';

// DI
export {
  ACADEMY_TOKENS,
  registerAcademyDependencies,
  setupAcademyDomain,
} from './di';