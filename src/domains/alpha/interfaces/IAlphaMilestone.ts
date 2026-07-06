/**
 * IAlphaMilestone Interface
 *
 * Interface for AlphaMilestone domain entity.
 */

import type { MilestoneId } from '../value-objects/MilestoneId';
import type { MilestoneStatus } from '../types/MilestoneStatus';
import type { MilestoneMetadata } from '../types/AlphaMetadata';

/**
 * AlphaMilestone entity interface.
 */
export interface IAlphaMilestone {
  /** Unique milestone identifier */
  readonly milestoneId: MilestoneId;
  /** Milestone title */
  readonly title: string;
  /** Current status */
  readonly status: MilestoneStatus;
  /** Target completion date */
  readonly targetDate: Date | null;
  /** Completion timestamp if completed */
  readonly completedAt: Date | null;
  /** Additional metadata */
  readonly metadata: MilestoneMetadata;
  /** Creation timestamp */
  readonly createdAt: Date;
  /** Last update timestamp */
  readonly updatedAt: Date;

  /**
   * Checks if the milestone is completed.
   */
  isCompleted: boolean;

  /**
   * Checks if the milestone is active.
   */
  isActive: boolean;

  /**
   * Checks if the milestone is overdue.
   */
  isOverdue: boolean;
}
