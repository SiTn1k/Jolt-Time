/**
 * ChecklistCompleted Event
 *
 * Domain event emitted when a checklist item is completed.
 */

import type { ChecklistStatus } from '../types/ChecklistStatus';

/**
 * Event data for checklist completion.
 */
export interface ChecklistCompletedEventData {
  /** Checklist ID */
  checklistId: string;
  /** Checklist title */
  title: string;
  /** Previous status */
  previousStatus: ChecklistStatus;
  /** Completion timestamp */
  occurredAt: Date;
}

/**
 * Domain event for checklist completion.
 */
export interface ChecklistCompletedEvent {
  /** Event type identifier */
  readonly eventType: 'ChecklistCompleted';
  /** Event data */
  readonly data: ChecklistCompletedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a ChecklistCompletedEvent.
 */
export function createChecklistCompletedEvent(params: {
  checklistId: string;
  title: string;
  previousStatus: ChecklistStatus;
}): ChecklistCompletedEvent {
  return {
    eventType: 'ChecklistCompleted',
    version: 1,
    data: {
      checklistId: params.checklistId,
      title: params.title,
      previousStatus: params.previousStatus,
      occurredAt: new Date(),
    },
  };
}
