/**
 * IReleaseCandidate Interface
 *
 * Interface for ReleaseCandidate domain entity.
 */

import type { ReleaseId } from '../value-objects/ReleaseId';
import type { ReleaseStatus } from '../types/ReleaseStatus';
import type { ReleaseStage } from '../types/ReleaseStage';
import type { ReleaseMetadata } from '../types/ReleaseMetadata';

/**
 * ReleaseCandidate entity interface.
 */
export interface IReleaseCandidate {
  /** Unique release identifier */
  readonly releaseId: ReleaseId;
  /** Semantic version string */
  readonly version: string;
  /** Current status */
  readonly status: ReleaseStatus;
  /** Release stage */
  readonly stage: ReleaseStage;
  /** Creation timestamp */
  readonly createdAt: Date;
  /** Approval timestamp if approved */
  readonly approvedAt: Date | null;
  /** Additional metadata */
  readonly metadata: ReleaseMetadata;
  /** Last update timestamp */
  readonly updatedAt: Date;

  /**
   * Checks if the release is approved.
   */
  isApproved: boolean;

  /**
   * Checks if the release is draft.
   */
  isDraft: boolean;

  /**
   * Checks if the release is pending approval.
   */
  isPendingApproval: boolean;

  /**
   * Checks if the release is published.
   */
  isPublished: boolean;

  /**
   * Checks if the release is in a terminal state.
   */
  isTerminal: boolean;
}
