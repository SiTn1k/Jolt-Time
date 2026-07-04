/**
 * Audit Stored Event
 *
 * Domain event emitted when an audit record is successfully stored.
 */

import type { AuditId } from '../value-objects/AuditId';

/**
 * Event data for audit storage.
 */
export interface AuditStoredEventData {
  /** Audit ID */
  auditId: string;

  /** Timestamp when stored */
  storedAt: Date;
}

/**
 * Domain event for audit storage.
 */
export interface AuditStoredEvent {
  /** Event type identifier */
  readonly eventType: 'AuditStored';

  /** Event data */
  readonly data: AuditStoredEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an AuditStoredEvent.
 */
export function createAuditStoredEvent(params: {
  auditId: AuditId;
}): AuditStoredEvent {
  return {
    eventType: 'AuditStored',
    version: 1,
    data: {
      auditId: params.auditId.value,
      storedAt: new Date(),
    },
  };
}
