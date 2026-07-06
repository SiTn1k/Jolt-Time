/**
 * QA Check Completed Event
 *
 * Domain event emitted when a QA check is completed.
 */

import type { CheckId } from '../value-objects/CheckId';
import type { QAStatus } from '../types/QAStatus';
import type { CheckSeverity } from '../types/CheckSeverity';

/**
 * Event data for QA check completion.
 */
export interface QACheckCompletedEventData {
  /** Check ID */
  checkId: string;

  /** Title of the check */
  title: string;

  /** Status of the check */
  status: QAStatus;

  /** Severity of the check */
  severity: CheckSeverity;

  /** Completion timestamp */
  completedAt: Date;
}

/**
 * Domain event for QA check completion.
 */
export interface QACheckCompletedEvent {
  /** Event type identifier */
  readonly eventType: 'QACheckCompleted';

  /** Event data */
  readonly data: QACheckCompletedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a QACheckCompletedEvent.
 */
export function createQACheckCompletedEvent(params: {
  checkId: CheckId;
  title: string;
  status: QAStatus;
  severity: CheckSeverity;
  completedAt?: Date;
}): QACheckCompletedEvent {
  return {
    eventType: 'QACheckCompleted',
    version: 1,
    data: {
      checkId: params.checkId.value,
      title: params.title,
      status: params.status,
      severity: params.severity,
      completedAt: params.completedAt ?? new Date(),
    },
  };
}
