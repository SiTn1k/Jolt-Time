/**
 * Security Incident Created Event
 *
 * Domain event emitted when a security incident is created.
 */

import type { IncidentId } from '../value-objects/IncidentId';
import type { IncidentSeverity } from '../types/IncidentSeverity';
import type { IncidentStatus } from '../types/IncidentStatus';

/**
 * Event data for incident creation.
 */
export interface SecurityIncidentCreatedEventData {
  /** Incident ID */
  incidentId: string;

  /** Incident type */
  incidentType: string;

  /** Severity */
  severity: IncidentSeverity;

  /** Status */
  status: IncidentStatus;

  /** Actor ID */
  actorId: string;

  /** Source */
  source: string;

  /** Description */
  description: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for incident creation.
 */
export interface SecurityIncidentCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'SecurityIncidentCreated';

  /** Event data */
  readonly data: SecurityIncidentCreatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a SecurityIncidentCreatedEvent.
 */
export function createSecurityIncidentCreatedEvent(params: {
  incidentId: IncidentId;
  incidentType: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  actorId: string;
  source: string;
  description: string;
}): SecurityIncidentCreatedEvent {
  return {
    eventType: 'SecurityIncidentCreated',
    version: 1,
    data: {
      incidentId: params.incidentId.value,
      incidentType: params.incidentType,
      severity: params.severity,
      status: params.status,
      actorId: params.actorId,
      source: params.source,
      description: params.description,
      occurredAt: new Date(),
    },
  };
}
