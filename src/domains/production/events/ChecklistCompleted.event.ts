/**
 * ChecklistCompleted Event
 *
 * Domain event emitted when a production checklist item is completed.
 */

/**
 * Event data for checklist completion.
 */
export interface ChecklistCompletedEventData {
  /** Checklist ID */
  checklistId: string;
  /** Title of the checklist item */
  title: string;
  /** Who completed it */
  completedBy: string;
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
  completedBy: string;
}): ChecklistCompletedEvent {
  return {
    eventType: 'ChecklistCompleted',
    version: 1,
    data: {
      checklistId: params.checklistId,
      title: params.title,
      completedBy: params.completedBy,
      occurredAt: new Date(),
    },
  };
}
