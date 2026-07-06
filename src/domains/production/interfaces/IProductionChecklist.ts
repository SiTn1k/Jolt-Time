/**
 * IProductionChecklist Interface
 *
 * Interface for ProductionChecklist domain entity.
 */

import type { ChecklistId } from '../value-objects/ChecklistId';
import type { ChecklistStatus } from '../types/ChecklistStatus';
import type { ChecklistMetadata } from '../types/ProductionMetadata';

/**
 * ProductionChecklist entity interface.
 */
export interface IProductionChecklist {
  /** Unique checklist identifier */
  readonly checklistId: ChecklistId;
  /** Title of the checklist item */
  readonly title: string;
  /** Current status */
  readonly status: ChecklistStatus;
  /** Completion timestamp if completed */
  readonly completedAt: Date | null;
  /** Owner of this checklist item */
  readonly owner: string;
  /** Additional metadata */
  readonly metadata: ChecklistMetadata;
  /** Creation timestamp */
  readonly createdAt: Date;
  /** Last update timestamp */
  readonly updatedAt: Date;

  /** Whether the checklist is completed */
  readonly isCompleted: boolean;
  /** Whether the checklist is active */
  readonly isActive: boolean;

  /**
   * Creates a copy with updated fields.
   */
  copyWith(params: Partial<{
    title: string;
    status: ChecklistStatus;
    completedAt: Date | null;
    owner: string;
    metadata: ChecklistMetadata;
  }>): IProductionChecklist;
}
