/**
 * Production Types Index
 *
 * Exports all types for the production domain.
 */

// Status types
export {
  ProductionStatus,
  PRODUCTION_STATUS_DISPLAY,
  isActiveProductionStatus,
  isCompletedProductionStatus,
} from './ProductionStatus';

export {
  CertificationStatus,
  CERTIFICATION_STATUS_DISPLAY,
  isValidCertification,
  isActiveCertification,
} from './CertificationStatus';

export {
  ChecklistStatus,
  CHECKLIST_STATUS_DISPLAY,
  isActiveChecklistStatus,
  isCompletedChecklistStatus,
} from './ChecklistStatus';

// Metadata types
export type {
  CertificateMetadata,
  ChecklistMetadata,
  SnapshotMetadata,
  SystemHealth,
} from './ProductionMetadata';

export {
  createDefaultCertificateMetadata,
  createDefaultChecklistMetadata,
  createDefaultSnapshotMetadata,
} from './ProductionMetadata';

// Statistics types
export type {
  ProductionStatistics,
  CertificationStatistics,
  SnapshotComparison,
  ProductionReadinessReport,
} from './ProductionStatistics';
