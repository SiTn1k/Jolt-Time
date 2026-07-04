/**
 * Audit Exported Event
 *
 * Domain event emitted when audit records are exported.
 */

import type { AuditId } from '../value-objects/AuditId';

/**
 * Event data for audit export.
 */
export interface AuditExportedEventData {
  /** List of exported audit IDs */
  auditIds: string[];

  /** Export format */
  format: 'json' | 'csv' | 'xml';

  /** Number of records exported */
  recordCount: number;

  /** Export initiated by */
  exportedBy: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for audit export.
 */
export interface AuditExportedEvent {
  /** Event type identifier */
  readonly eventType: 'AuditExported';

  /** Event data */
  readonly data: AuditExportedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an AuditExportedEvent.
 */
export function createAuditExportedEvent(params: {
  auditIds: AuditId[];
  format: 'json' | 'csv' | 'xml';
  recordCount: number;
  exportedBy: string;
}): AuditExportedEvent {
  return {
    eventType: 'AuditExported',
    version: 1,
    data: {
      auditIds: params.auditIds.map((id) => id.value),
      format: params.format,
      recordCount: params.recordCount,
      exportedBy: params.exportedBy,
      occurredAt: new Date(),
    },
  };
}
