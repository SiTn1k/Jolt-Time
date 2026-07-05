/**
 * Suspicious Activity Detected Event
 *
 * Domain event emitted when suspicious activity is detected.
 */

import type { IncidentSeverity } from '../types/IncidentSeverity';

/**
 * Event data for suspicious activity.
 */
export interface SuspiciousActivityDetectedEventData {
  /** Activity type */
  activityType: string;

  /** Severity */
  severity: IncidentSeverity;

  /** Actor ID */
  actorId: string;

  /** Source */
  source: string;

  /** Description */
  description: string;

  /** Evidence */
  evidence?: Record<string, unknown>;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for suspicious activity.
 */
export interface SuspiciousActivityDetectedEvent {
  /** Event type identifier */
  readonly eventType: 'SuspiciousActivityDetected';

  /** Event data */
  readonly data: SuspiciousActivityDetectedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a SuspiciousActivityDetectedEvent.
 */
export function createSuspiciousActivityDetectedEvent(params: {
  activityType: string;
  severity: IncidentSeverity;
  actorId: string;
  source: string;
  description: string;
  evidence?: Record<string, unknown>;
}): SuspiciousActivityDetectedEvent {
  return {
    eventType: 'SuspiciousActivityDetected',
    version: 1,
    data: {
      activityType: params.activityType,
      severity: params.severity,
      actorId: params.actorId,
      source: params.source,
      description: params.description,
      evidence: params.evidence,
      occurredAt: new Date(),
    },
  };
}
