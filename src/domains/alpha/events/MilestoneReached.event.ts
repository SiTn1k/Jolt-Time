/**
 * MilestoneReached Event
 *
 * Domain event emitted when a milestone is reached.
 */

import type { MilestoneStatus } from '../types/MilestoneStatus';

/**
 * Event data for milestone achievement.
 */
export interface MilestoneReachedEventData {
  /** Milestone ID */
  milestoneId: string;
  /** Milestone title */
  title: string;
  /** Previous status */
  previousStatus: MilestoneStatus;
  /** Completion timestamp */
  occurredAt: Date;
}

/**
 * Domain event for milestone achievement.
 */
export interface MilestoneReachedEvent {
  /** Event type identifier */
  readonly eventType: 'MilestoneReached';
  /** Event data */
  readonly data: MilestoneReachedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a MilestoneReachedEvent.
 */
export function createMilestoneReachedEvent(params: {
  milestoneId: string;
  title: string;
  previousStatus: MilestoneStatus;
}): MilestoneReachedEvent {
  return {
    eventType: 'MilestoneReached',
    version: 1,
    data: {
      milestoneId: params.milestoneId,
      title: params.title,
      previousStatus: params.previousStatus,
      occurredAt: new Date(),
    },
  };
}
