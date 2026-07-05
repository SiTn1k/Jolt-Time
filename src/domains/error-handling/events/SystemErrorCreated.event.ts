/**
 * System Error Created Event
 *
 * Domain event emitted when a new system error is created.
 */

import type { ErrorId } from '../value-objects/ErrorId';
import type { ErrorSeverity } from '../types/ErrorSeverity';
import type { ErrorCategoryType } from '../types/ErrorCategoryType';

/**
 * Event data for system error creation.
 */
export interface SystemErrorCreatedEventData {
  /** Error ID */
  errorId: string;

  /** Error code */
  errorCode: string;

  /** Error category */
  category: ErrorCategoryType;

  /** Error severity */
  severity: ErrorSeverity;

  /** Error message */
  message: string;

  /** Context ID if available */
  contextId?: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for system error creation.
 */
export interface SystemErrorCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'SystemErrorCreated';

  /** Event data */
  readonly data: SystemErrorCreatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a SystemErrorCreatedEvent.
 */
export function createSystemErrorCreatedEvent(params: {
  errorId: ErrorId;
  errorCode: string;
  category: ErrorCategoryType;
  severity: ErrorSeverity;
  message: string;
  contextId?: string;
}): SystemErrorCreatedEvent {
  return {
    eventType: 'SystemErrorCreated',
    version: 1,
    data: {
      errorId: params.errorId.value,
      errorCode: params.errorCode,
      category: params.category,
      severity: params.severity,
      message: params.message,
      contextId: params.contextId,
      occurredAt: new Date(),
    },
  };
}
