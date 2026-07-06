/**
 * Release Domain Types Index
 *
 * Exports all type definitions for the release domain.
 */

export {
  ReleaseStage,
  RELEASE_STAGE_DISPLAY,
  RELEASE_STAGE_DESCRIPTIONS,
  isPreReleaseStage,
  isProductionStage,
} from './ReleaseStage';

export {
  ReleaseStatus,
  RELEASE_STATUS_DISPLAY,
  isActiveReleaseStatus,
  isTerminalReleaseStatus,
} from './ReleaseStatus';

export {
  ChecklistStatus,
  CHECKLIST_STATUS_DISPLAY,
  isActiveChecklistStatus,
  isCompletedChecklistStatus,
} from './ChecklistStatus';

export type {
  ReleaseMetadata,
  ChecklistMetadata,
  SnapshotMetadata,
  ReleaseStatistics,
} from './ReleaseMetadata';

export {
  createDefaultReleaseMetadata,
  createDefaultChecklistMetadata,
  createDefaultSnapshotMetadata,
} from './ReleaseMetadata';
