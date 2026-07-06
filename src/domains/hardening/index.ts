/**
 * Hardening Domain Index
 *
 * Main entry point for the Hardening domain module.
 * Exports all public-facing entities, interfaces, types, and utilities.
 *
 * P-198.2 — Production Hardening
 *
 * IMPORTANT: This domain is for production hardening infrastructure ONLY.
 * - Stores hardening rules, checklists, and snapshots
 * - Does NOT modify gameplay
 * - Does NOT grant rewards
 * - Does NOT modify inventory
 * - Does NOT execute production changes
 */

// Value Objects
export { RuleId } from './value-objects/RuleId';
export { ChecklistId } from './value-objects/ChecklistId';
export { SnapshotId } from './value-objects/SnapshotId';

// Types
export type {
  RuleMetadata,
  ChecklistMetadata,
  SnapshotMetadata,
  HardeningStatistics,
  SystemHealthSummary,
} from './types/HardeningMetadata';

export {
  createDefaultRuleMetadata,
  createDefaultChecklistMetadata,
  createDefaultSnapshotMetadata,
} from './types/HardeningMetadata';

export {
  HardeningStatus,
  HARDENING_STATUS_DISPLAY,
  isActiveHardeningStatus,
  isCompletedHardeningStatus,
} from './types/HardeningStatus';

export {
  RulePriority,
  RULE_PRIORITY_DISPLAY,
  RULE_PRIORITY_DESCRIPTIONS,
  isHighPriority,
  comparePriority,
} from './types/RulePriority';

export {
  ChecklistStatus,
  CHECKLIST_STATUS_DISPLAY,
  isActiveChecklistStatus,
  isCompletedChecklistStatus,
} from './types/ChecklistStatus';

// Entities
export {
  HardeningRule,
  type HardeningRuleProps,
  type HardeningRuleRecord,
  type HardeningRuleJSON,
} from './entities/HardeningRule';

export {
  HardeningChecklist,
  type HardeningChecklistProps,
  type HardeningChecklistRecord,
  type HardeningChecklistJSON,
} from './entities/HardeningChecklist';

export {
  HardeningSnapshot,
  type HardeningSnapshotProps,
  type HardeningSnapshotRecord,
  type HardeningSnapshotJSON,
} from './entities/HardeningSnapshot';

// Interfaces
export type { IHardeningRule } from './interfaces/IHardeningRule';
export type { IHardeningChecklist } from './interfaces/IHardeningChecklist';
export type { IHardeningSnapshot } from './interfaces/IHardeningSnapshot';
export type { IHardeningRepository, RuleFilterParams, ChecklistFilterParams } from './interfaces/IHardeningRepository';

// DTOs
export type {
  HardeningRuleDto,
  HardeningRuleResponseDto,
  HardeningRuleListResponseDto,
} from './dto/HardeningRule.dto';
export { CREATE_RULE_VALIDATION } from './dto/HardeningRule.dto';

export type {
  HardeningChecklistDto,
  HardeningChecklistResponseDto,
  HardeningChecklistListResponseDto,
} from './dto/HardeningChecklist.dto';
export { CREATE_CHECKLIST_VALIDATION } from './dto/HardeningChecklist.dto';

export type {
  HardeningSnapshotDto,
  HardeningSnapshotResponseDto,
  HardeningSnapshotListResponseDto,
} from './dto/HardeningSnapshot.dto';

export type {
  HardeningOverviewResponseDto,
  HardeningStatisticsResponseDto,
} from './dto/HardeningResponse.dto';

// Validators
export { RuleValidator, type RuleValidationResult } from './validators/RuleValidator';
export { ChecklistValidator, type ChecklistValidationResult } from './validators/ChecklistValidator';
export { SnapshotValidator, type SnapshotValidationResult } from './validators/SnapshotValidator';

// Events
export type {
  HardeningStartedEvent,
  HardeningStartedEventData,
} from './events/HardeningStarted.event';
export { createHardeningStartedEvent } from './events/HardeningStarted.event';

export type {
  ChecklistCompletedEvent,
  ChecklistCompletedEventData,
} from './events/ChecklistCompleted.event';
export { createChecklistCompletedEvent } from './events/ChecklistCompleted.event';

export type {
  HardeningSnapshotCreatedEvent,
  HardeningSnapshotCreatedEventData,
} from './events/HardeningSnapshotCreated.event';
export { createHardeningSnapshotCreatedEvent } from './events/HardeningSnapshotCreated.event';

// Mappers
export { HardeningMapper } from './mappers/HardeningMapper';
export { RuleMapper } from './mappers/RuleMapper';
export { ChecklistMapper } from './mappers/ChecklistMapper';
export { SnapshotMapper } from './mappers/SnapshotMapper';

// Repositories
export { SupabaseHardeningRepository } from './repositories/SupabaseHardeningRepository';

// Services
export { HardeningService } from './services/HardeningService';
export type {
  SystemValidationResult,
  ValidationCheck,
  HardeningReport,
  ModuleInfo,
  DependencyCheckResult,
  ConfigurationCheckResult,
  HardeningServiceConfig,
} from './services/HardeningService';

// DI
export { HARDENING_TOKENS, registerHardeningDependencies, setupHardeningDomain } from './di';
