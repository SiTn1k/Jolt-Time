/**
 * Audit Created Event
 *
 * Domain event emitted when an audit record is created.
 */

import type { AuditId } from '../value-objects/AuditId';
import type { AuditAction } from '../types/AuditAction';
import type { AuditResult } from '../types/AuditResult';
import type { AuditActorType } from '../types/AuditActorType';

/**
 * Event data for audit creation.
 */
export interface AuditCreatedEventData {
  /** Audit ID */
  auditId: string;

  /** Actor ID */
  actorId: string;

  /** Actor type */
  actorType: AuditActorType;

  /** Action performed */
  action: AuditAction;

  /** Target type */
  targetType: string;

  /** Target ID */
  targetId: string;

  /** Result of the action */
  result: AuditResult;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for audit creation.
 */
export interface AuditCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'AuditCreated';

  /** Event data */
  readonly data: AuditCreatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an AuditCreatedEvent.
 */
export function createAuditCreatedEvent(params: {
  auditId: AuditId;
  actorId: string;
  actorType: AuditActorType;
  action: AuditAction;
  targetType: string;
  targetId: string;
  result: AuditResult;
}): AuditCreatedEvent {
  return {
    eventType: 'AuditCreated',
    version: 1,
    data: {
      auditId: params.auditId.value,
      actorId: params.actorId,
      actorType: params.actorType,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      result: params.result,
      occurredAt: new Date(),
    },
  };
}
