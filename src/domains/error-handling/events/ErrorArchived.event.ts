/**
 * Error Archived Event
 *
 * Domain event emitted when an error is archived.
 */

import type { ErrorId } from '../value-objects/ErrorId';
import type { ErrorStatus } from '../types/ErrorStatus';

/**
 * Event data for error archival.
 */
export interface ErrorArchivedEventData {
  /** Error ID */
  errorId: string;

  /** Previous status before archival */
  previousStatus: ErrorStatus;

  /** Error code */
  errorCode: string;

  /** Severity */
  severity: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for error archival.
 */
export interface ErrorArchivedEvent {
  /** Event type identifier */
  readonly eventType: 'ErrorArchived';

  /** Event data */
  readonly data: ErrorArchivedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an ErrorArchivedEvent.
 */
export function createErrorArchivedEvent(params: {
  errorId: ErrorId;
  previousStatus: ErrorStatus;
  errorCode: string;
  severity: string;
}): ErrorArchivedEvent {
  return {
    eventType: 'ErrorArchived',
    version: 1,
    data: {
      errorId: params.errorId.value,
      previousStatus: params.previousStatus,
      errorCode: params.errorCode,
      severity: params.severity,
      occurredAt: new Date(),
    },
  };
}
