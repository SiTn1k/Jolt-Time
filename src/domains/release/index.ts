/**
 * Release Domain Index
 *
 * Main entry point for the Release domain module.
 * Exports all public-facing entities, interfaces, types, and utilities.
 */

// Value Objects
export { ReleaseId } from './value-objects/ReleaseId';
export { ChecklistId } from './value-objects/ChecklistId';
export { SnapshotId } from './value-objects/SnapshotId';

// Types
export type {
  ReleaseMetadata,
  ChecklistMetadata,
  SnapshotMetadata,
  ReleaseStatistics,
} from './types/ReleaseMetadata';

export {
  createDefaultReleaseMetadata,
  createDefaultChecklistMetadata,
  createDefaultSnapshotMetadata,
} from './types/ReleaseMetadata';

export {
  ChecklistStatus,
  CHECKLIST_STATUS_DISPLAY,
  isActiveChecklistStatus,
  isCompletedChecklistStatus,
} from './types/ChecklistStatus';

export {
  ReleaseStatus,
  RELEASE_STATUS_DISPLAY,
  isActiveReleaseStatus,
  isTerminalReleaseStatus,
} from './types/ReleaseStatus';

export {
  ReleaseStage,
  RELEASE_STAGE_DISPLAY,
  RELEASE_STAGE_DESCRIPTIONS,
  isPreReleaseStage,
  isProductionStage,
} from './types/ReleaseStage';

// Entities
export {
  ReleaseCandidate,
  type ReleaseCandidateProps,
  type ReleaseCandidateRecord,
  type ReleaseCandidateJSON,
} from './entities/ReleaseCandidate';

export {
  ReleaseChecklist,
  type ReleaseChecklistProps,
  type ReleaseChecklistRecord,
  type ReleaseChecklistJSON,
} from './entities/ReleaseChecklist';

export {
  ReleaseSnapshot,
  type ReleaseSnapshotProps,
  type ReleaseSnapshotRecord,
  type ReleaseSnapshotJSON,
} from './entities/ReleaseSnapshot';

// Interfaces
export type { IReleaseCandidate } from './interfaces/IReleaseCandidate';
export type { IReleaseChecklist } from './interfaces/IReleaseChecklist';
export type { IReleaseSnapshot } from './interfaces/IReleaseSnapshot';
export type { IReleaseRepository, ReleaseFilterParams, ChecklistFilterParams } from './interfaces/IReleaseRepository';

// DTOs
export type {
  ReleaseCandidateDto,
  ReleaseResponseDto,
  ReleaseListResponseDto,
} from './dto/Release.dto';
export { CREATE_RELEASE_VALIDATION } from './dto/Release.dto';

export type {
  ReleaseChecklistDto,
  ChecklistResponseDto,
  ChecklistListResponseDto,
} from './dto/Checklist.dto';
export { CREATE_CHECKLIST_VALIDATION } from './dto/Checklist.dto';

export type {
  ReleaseSnapshotDto,
  SnapshotResponseDto,
  SnapshotListResponseDto,
} from './dto/Snapshot.dto';

export type {
  ReleaseOverviewResponseDto,
  ReleaseStatisticsResponseDto,
} from './dto/ReleaseResponse.dto';

// Validators
export { ReleaseValidator, type ReleaseValidationResult } from './validators/ReleaseValidator';
export { ChecklistValidator, type ChecklistValidationResult } from './validators/ChecklistValidator';
export { SnapshotValidator, type SnapshotValidationResult } from './validators/SnapshotValidator';

// Events
export type {
  ReleaseCreatedEvent,
  ReleaseCreatedEventData,
} from './events/ReleaseCreated.event';
export { createReleaseCreatedEvent } from './events/ReleaseCreated.event';

export type {
  ChecklistCompletedEvent,
  ChecklistCompletedEventData,
} from './events/ChecklistCompleted.event';
export { createChecklistCompletedEvent } from './events/ChecklistCompleted.event';

export type {
  ReleaseSnapshotCreatedEvent,
  ReleaseSnapshotCreatedEventData,
} from './events/ReleaseSnapshotCreated.event';
export { createReleaseSnapshotCreatedEvent } from './events/ReleaseSnapshotCreated.event';

// Mappers
export { ReleaseMapper } from './mappers/ReleaseMapper';
export { CandidateMapper } from './mappers/CandidateMapper';
export { ChecklistMapper } from './mappers/ChecklistMapper';
export { SnapshotMapper } from './mappers/SnapshotMapper';

// Repositories
export { SupabaseReleaseRepository } from './repositories/SupabaseReleaseRepository';

// DI
export { RELEASE_TOKENS, registerReleaseDependencies, setupReleaseDomain } from './di';
