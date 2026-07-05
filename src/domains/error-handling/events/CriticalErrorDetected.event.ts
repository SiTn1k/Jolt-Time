/**
 * Critical Error Detected Event
 *
 * Domain event emitted when a critical or fatal error is detected.
 */

import type { ErrorId } from '../value-objects/ErrorId';
import type { ErrorSeverity } from '../types/ErrorSeverity';
import type { ErrorCategoryType } from '../types/ErrorCategoryType';

/**
 * Event data for critical error detection.
 */
export interface CriticalErrorDetectedEventData {
  /** Error ID */
  errorId: string;

  /** Error code */
  errorCode: string;

  /** Error category */
  category: ErrorCategoryType;

  /** Error severity (Critical or Fatal) */
  severity: ErrorSeverity;

  /** Error message */
  message: string;

  /** Context ID if available */
  contextId?: string;

  /** Stack trace if available */
  stackTrace?: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for critical error detection.
 */
export interface CriticalErrorDetectedEvent {
  /** Event type identifier */
  readonly eventType: 'CriticalErrorDetected';

  /** Event data */
  readonly data: CriticalErrorDetectedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a CriticalErrorDetectedEvent.
 */
export function createCriticalErrorDetectedEvent(params: {
  errorId: ErrorId;
  errorCode: string;
  category: ErrorCategoryType;
  severity: ErrorSeverity;
  message: string;
  contextId?: string;
  stackTrace?: string;
}): CriticalErrorDetectedEvent {
  return {
    eventType: 'CriticalErrorDetected',
    version: 1,
    data: {
      errorId: params.errorId.value,
      errorCode: params.errorCode,
      category: params.category,
      severity: params.severity,
      message: params.message,
      contextId: params.contextId,
      stackTrace: params.stackTrace,
      occurredAt: new Date(),
    },
  };
}
