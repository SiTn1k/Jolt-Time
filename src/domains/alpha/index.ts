/**
 * Alpha Domain Index
 *
 * Main entry point for the Alpha domain module.
 * Exports all public-facing entities, interfaces, types, and utilities.
 */

// Value Objects
export { ChecklistId } from './value-objects/ChecklistId';
export { MilestoneId } from './value-objects/MilestoneId';
export { SnapshotId } from './value-objects/SnapshotId';

// Types
export type {
  ChecklistMetadata,
  MilestoneMetadata,
  SnapshotMetadata,
} from './types/AlphaMetadata';
export {
  createDefaultChecklistMetadata,
  createDefaultMilestoneMetadata,
  createDefaultSnapshotMetadata,
} from './types/AlphaMetadata';

export {
  ChecklistStatus,
  CHECKLIST_STATUS_DISPLAY,
  isActiveChecklistStatus,
  isCompletedChecklistStatus,
} from './types/ChecklistStatus';

export {
  MilestoneStatus,
  MILESTONE_STATUS_DISPLAY,
  isActiveMilestoneStatus,
  isCompletedMilestoneStatus,
} from './types/MilestoneStatus';

export {
  ReleaseStage,
  RELEASE_STAGE_DISPLAY,
  RELEASE_STAGE_DESCRIPTIONS,
  isPreReleaseStage,
  isProductionStage,
} from './types/ReleaseStage';

// Entities
export {
  AlphaChecklist,
  type AlphaChecklistProps,
  type AlphaChecklistRecord,
  type AlphaChecklistJSON,
} from './entities/AlphaChecklist';

export {
  AlphaMilestone,
  type AlphaMilestoneProps,
  type AlphaMilestoneRecord,
  type AlphaMilestoneJSON,
} from './entities/AlphaMilestone';

export {
  AlphaSnapshot,
  type AlphaSnapshotProps,
  type AlphaSnapshotRecord,
  type AlphaSnapshotJSON,
} from './entities/AlphaSnapshot';

// Interfaces
export type { IAlphaChecklist } from './interfaces/IAlphaChecklist';
export type { IAlphaMilestone } from './interfaces/IAlphaMilestone';
export type { IAlphaSnapshot } from './interfaces/IAlphaSnapshot';
export type {
  IAlphaRepository,
  AlphaChecklistFilterParams,
  AlphaMilestoneFilterParams,
} from './interfaces/IAlphaRepository';

// DTOs
export type {
  ChecklistDto,
  ChecklistResponseDto,
  ChecklistListResponseDto,
} from './dto/Checklist.dto';
export { CREATE_CHECKLIST_VALIDATION } from './dto/Checklist.dto';

export type {
  MilestoneDto,
  MilestoneResponseDto,
  MilestoneListResponseDto,
} from './dto/Milestone.dto';
export { CREATE_MILESTONE_VALIDATION } from './dto/Milestone.dto';

export type {
  SnapshotDto,
  SnapshotResponseDto,
  SnapshotListResponseDto,
} from './dto/Snapshot.dto';

export type {
  AlphaStatusResponseDto,
  AlphaOverviewResponseDto,
} from './dto/AlphaResponse.dto';

// Validators
export { ChecklistValidator, type ChecklistValidationResult } from './validators/ChecklistValidator';
export { MilestoneValidator, type MilestoneValidationResult } from './validators/MilestoneValidator';
export { SnapshotValidator, type SnapshotValidationResult } from './validators/SnapshotValidator';

// Events
export type {
  ChecklistCompletedEvent,
  ChecklistCompletedEventData,
} from './events/ChecklistCompleted.event';
export { createChecklistCompletedEvent } from './events/ChecklistCompleted.event';

export type {
  MilestoneReachedEvent,
  MilestoneReachedEventData,
} from './events/MilestoneReached.event';
export { createMilestoneReachedEvent } from './events/MilestoneReached.event';

export type {
  AlphaSnapshotCreatedEvent,
  AlphaSnapshotCreatedEventData,
} from './events/AlphaSnapshotCreated.event';
export { createAlphaSnapshotCreatedEvent } from './events/AlphaSnapshotCreated.event';

// Mappers
export { ChecklistMapper } from './mappers/ChecklistMapper';
export { MilestoneMapper } from './mappers/MilestoneMapper';
export { SnapshotMapper } from './mappers/SnapshotMapper';
export { AlphaMapper } from './mappers/AlphaMapper';

// Services
export { AlphaService } from './services/AlphaService';
export type {
  AlphaServiceConfig,
  ModuleValidationResult,
  AlphaReadinessResult,
  AlphaSummary,
  AlphaValidationReport,
} from './services/AlphaService';

// Repositories
export { SupabaseAlphaRepository } from './repositories/SupabaseAlphaRepository';

// DI
export { ALPHA_TOKENS, registerAlphaDependencies, setupAlphaDomain } from './di';
