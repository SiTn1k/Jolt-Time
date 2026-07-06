/**
 * Production Domain Index
 *
 * Main entry point for the Production domain module.
 * Exports all public-facing entities, interfaces, types, and utilities.
 */

// Value Objects
export { CertificateId } from './value-objects/CertificateId';
export { ChecklistId } from './value-objects/ChecklistId';
export { SnapshotId } from './value-objects/SnapshotId';

// Types
export type {
  CertificateMetadata,
  ChecklistMetadata,
  SnapshotMetadata,
  SystemHealth,
} from './types/ProductionMetadata';

export {
  createDefaultCertificateMetadata,
  createDefaultChecklistMetadata,
  createDefaultSnapshotMetadata,
} from './types/ProductionMetadata';

export {
  ProductionStatus,
  PRODUCTION_STATUS_DISPLAY,
  isActiveProductionStatus,
  isCompletedProductionStatus,
} from './types/ProductionStatus';

export {
  CertificationStatus,
  CERTIFICATION_STATUS_DISPLAY,
  isValidCertification,
  isActiveCertification,
} from './types/CertificationStatus';

export {
  ChecklistStatus,
  CHECKLIST_STATUS_DISPLAY,
  isActiveChecklistStatus,
  isCompletedChecklistStatus,
} from './types/ChecklistStatus';

export type {
  ProductionStatistics,
  CertificationStatistics,
  SnapshotComparison,
  ProductionReadinessReport,
} from './types/ProductionStatistics';

// Entities
export {
  ProductionCertificate,
  type ProductionCertificateProps,
  type ProductionCertificateRecord,
  type ProductionCertificateJSON,
} from './entities/ProductionCertificate';

export {
  ProductionChecklist,
  type ProductionChecklistProps,
  type ProductionChecklistRecord,
  type ProductionChecklistJSON,
} from './entities/ProductionChecklist';

export {
  ProductionSnapshot,
  type ProductionSnapshotProps,
  type ProductionSnapshotRecord,
  type ProductionSnapshotJSON,
} from './entities/ProductionSnapshot';

// Interfaces
export type { IProductionCertificate } from './interfaces/IProductionCertificate';
export type { IProductionChecklist } from './interfaces/IProductionChecklist';
export type { IProductionSnapshot } from './interfaces/IProductionSnapshot';
export type {
  IProductionRepository,
  ProductionCertificateFilterParams,
  ProductionChecklistFilterParams,
} from './interfaces/IProductionRepository';

// DTOs
export type {
  CertificateDto,
  CertificateResponseDto,
  CertificateListResponseDto,
  CreateCertificateDto,
  UpdateCertificateDto,
} from './dto/Certificate.dto';

export { CREATE_CERTIFICATE_VALIDATION } from './dto/Certificate.dto';

export type {
  ChecklistDto,
  ChecklistResponseDto,
  ChecklistListResponseDto,
  CreateChecklistDto,
  UpdateChecklistDto,
} from './dto/Checklist.dto';

export { CREATE_CHECKLIST_VALIDATION } from './dto/Checklist.dto';

export type {
  SnapshotDto,
  SnapshotResponseDto,
  SnapshotListResponseDto,
} from './dto/Snapshot.dto';

export type {
  ProductionStatusResponseDto,
  ProductionOverviewResponseDto,
  ProductionReadinessResponseDto,
} from './dto/ProductionResponse.dto';

// Validators
export {
  CertificateValidator,
  type CertificateValidationResult,
} from './validators/CertificateValidator';

export {
  ChecklistValidator,
  type ChecklistValidationResult,
} from './validators/ChecklistValidator';

export {
  SnapshotValidator,
  type SnapshotValidationResult,
} from './validators/SnapshotValidator';

// Events
export type {
  ProductionCertificationStartedEvent,
  ProductionCertificationStartedEventData,
} from './events/ProductionCertificationStarted.event';

export { createProductionCertificationStartedEvent } from './events/ProductionCertificationStarted.event';

export type {
  ChecklistCompletedEvent,
  ChecklistCompletedEventData,
} from './events/ChecklistCompleted.event';

export { createChecklistCompletedEvent } from './events/ChecklistCompleted.event';

export type {
  ProductionSnapshotCreatedEvent,
  ProductionSnapshotCreatedEventData,
} from './events/ProductionSnapshotCreated.event';

export { createProductionSnapshotCreatedEvent } from './events/ProductionSnapshotCreated.event';

// Mappers
export { CertificateMapper } from './mappers/CertificateMapper';
export { ChecklistMapper } from './mappers/ChecklistMapper';
export { SnapshotMapper } from './mappers/SnapshotMapper';
export { ProductionMapper } from './mappers/ProductionMapper';

// Services
export { ProductionService } from './services/ProductionService';
export type {
  ProductionServiceConfig,
  ModuleValidationResult,
  ProductionReadinessResult,
  ProductionSummary,
  ProductionValidationReport,
  BackendSystemSummary,
} from './services/ProductionService';

// Repositories
export { SupabaseProductionRepository } from './repositories/SupabaseProductionRepository';

// DI
export {
  PRODUCTION_TOKENS,
  registerProductionDependencies,
  setupProductionDomain,
} from './di';
