/**
 * IReleaseChecklist Interface
 *
 * Interface for ReleaseChecklist domain entity.
 */

import type { ChecklistId } from '../value-objects/ChecklistId';
import type { ChecklistStatus } from '../types/ChecklistStatus';
import type { ChecklistMetadata } from '../types/ReleaseMetadata';

/**
 * ReleaseChecklist entity interface.
 */
export interface IReleaseChecklist {
  /** Unique checklist identifier */
  readonly checklistId: ChecklistId;
  /** Checklist item title */
  readonly title: string;
  /** Current status */
  readonly status: ChecklistStatus;
  /** Owner of this checklist item */
  readonly owner: string;
  /** Completion timestamp if completed */
  readonly completedAt: Date | null;
  /** Additional metadata */
  readonly metadata: ChecklistMetadata;
  /** Creation timestamp */
  readonly createdAt: Date;
  /** Last update timestamp */
  readonly updatedAt: Date;

  /**
   * Checks if the checklist item is completed.
   */
  isCompleted: boolean;

  /**
   * Checks if the checklist item is active.
   */
  isActive: boolean;
}
