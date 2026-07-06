/**
 * ReleaseMetadata Type
 *
 * Defines metadata structures for release domain entities.
 */

/**
 * Metadata for a release candidate.
 */
export interface ReleaseMetadata {
  /** Build identifier */
  buildId?: string;
  /** Release notes summary */
  releaseNotes?: string;
  /** Git branch name */
  branch?: string;
  /** CI/CD pipeline ID */
  pipelineId?: string;
  /** Approved by */
  approvedBy?: string;
  /** Notes or additional information */
  notes?: string;
  /** Tags associated with the release */
  tags?: string[];
}

/**
 * Metadata for a checklist item.
 */
export interface ChecklistMetadata {
  /** Category of the checklist item */
  category: string;
  /** Priority level (1-5, 5 being highest) */
  priority: number;
  /** Associated release ID if applicable */
  releaseId?: string;
  /** Notes or additional information */
  notes?: string;
  /** Last verified timestamp */
  verifiedAt?: string;
}

/**
 * Metadata for a snapshot.
 */
export interface SnapshotMetadata {
  /** Build identifier */
  buildId?: string;
  /** Git commit hash */
  commitHash?: string;
  /** Branch name */
  branch?: string;
  /** Environment */
  environment: string;
  /** Any notable changes in this snapshot */
  changes?: string[];
  /** Test coverage percentage if available */
  testCoverage?: number;
  /** Performance metrics summary */
  performanceMetrics?: Record<string, number>;
}

/**
 * Statistics for a release.
 */
export interface ReleaseStatistics {
  /** Total number of checklists */
  totalChecklists: number;
  /** Number of completed checklists */
  completedChecklists: number;
  /** Number of pending checklists */
  pendingChecklists: number;
  /** Number of blocked checklists */
  blockedChecklists: number;
  /** Number of associated snapshots */
  snapshotCount: number;
  /** Completion percentage */
  completionPercentage: number;
}

/**
 * Creates default release metadata.
 */
export function createDefaultReleaseMetadata(): ReleaseMetadata {
  return {
    notes: '',
    tags: [],
  };
}

/**
 * Creates default checklist metadata.
 */
export function createDefaultChecklistMetadata(category: string): ChecklistMetadata {
  return {
    category,
    priority: 3,
    notes: '',
  };
}

/**
 * Creates default snapshot metadata.
 */
export function createDefaultSnapshotMetadata(environment: string): SnapshotMetadata {
  return {
    environment,
  };
}
