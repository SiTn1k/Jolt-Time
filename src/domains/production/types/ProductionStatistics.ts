/**
 * Production Statistics Types
 *
 * Type definitions for production statistics and metrics.
 */

/**
 * Production readiness statistics.
 */
export interface ProductionStatistics {
  /** Total number of checklists */
  totalChecklists: number;
  /** Number of completed checklists */
  completedChecklists: number;
  /** Number of pending checklists */
  pendingChecklists: number;
  /** Number of blocked checklists */
  blockedChecklists: number;
  /** Overall completion percentage (0-100) */
  completionPercentage: number;
  /** Number of certificates issued */
  totalCertificates: number;
  /** Number of active certificates */
  activeCertificates: number;
  /** Number of expired certificates */
  expiredCertificates: number;
  /** Number of snapshots taken */
  totalSnapshots: number;
  /** Latest snapshot ID */
  latestSnapshotId?: string;
  /** Timestamp of last activity */
  lastActivityAt?: Date;
}

/**
 * Certification statistics by category.
 */
export interface CertificationStatistics {
  /** Category name */
  category: string;
  /** Total items in category */
  totalItems: number;
  /** Completed items in category */
  completedItems: number;
  /** Completion percentage */
  completionPercentage: number;
}

/**
 * Snapshot comparison statistics.
 */
export interface SnapshotComparison {
  /** Previous snapshot ID */
  previousSnapshotId?: string;
  /** Current snapshot ID */
  currentSnapshotId?: string;
  /** Backend version change */
  backendVersionChange?: {
    previous: string;
    current: string;
    changed: boolean;
  };
  /** Database version change */
  databaseVersionChange?: {
    previous: string;
    current: string;
    changed: boolean;
  };
  /** System health change */
  healthChange?: {
    previous: string;
    current: string;
    improved: boolean;
  };
}

/**
 * Production readiness report.
 */
export interface ProductionReadinessReport {
  /** Whether production is ready */
  isReady: boolean;
  /** Overall readiness percentage (0-100) */
  readinessPercentage: number;
  /** Critical blockers */
  criticalBlockers: string[];
  /** Warnings */
  warnings: string[];
  /** Recommendations */
  recommendations: string[];
  /** Statistics summary */
  statistics: ProductionStatistics;
  /** Generated at */
  generatedAt: Date;
}
