/**
 * IHardeningChecklist Interface
 *
 * Interface for HardeningChecklist entity.
 */

import type { ChecklistId } from '../value-objects/ChecklistId';
import type { ChecklistStatus } from '../types/ChecklistStatus';
import type { ChecklistMetadata } from '../types/HardeningMetadata';

/**
 * Interface for HardeningChecklist entity.
 * Defines the contract for hardening checklist operations.
 */
export interface IHardeningChecklist {
  /** Unique identifier for the checklist item */
  readonly checklistId: ChecklistId;
  /** Title of the checklist item */
  readonly title: string;
  /** Current status of the checklist item */
  readonly status: ChecklistStatus;
  /** When the checklist item was completed (null if not completed) */
  readonly completedAt: Date | null;
  /** Owner responsible for this checklist item */
  readonly owner: string;
  /** Additional metadata */
  readonly metadata: ChecklistMetadata;
  /** When the checklist item was created */
  readonly createdAt: Date;
  /** When the checklist item was last updated */
  readonly updatedAt: Date;

  /** Checks if the checklist item is completed */
  isCompleted: boolean;
  /** Checks if the checklist item is active */
  isActive: boolean;

  /** Creates a copy with updated fields */
  copyWith(params: Partial<Omit<IHardeningChecklist, 'checklistId' | 'createdAt' | 'isCompleted' | 'isActive'>>): IHardeningChecklist;
  /** Creates a copy marked as completed */
  markCompleted(): IHardeningChecklist;
  /** Creates a copy marked as in progress */
  markInProgress(): IHardeningChecklist;
  /** Creates a copy marked as blocked */
  markBlocked(): IHardeningChecklist;
  /** Creates a copy marked as skipped */
  markSkipped(): IHardeningChecklist;
}
