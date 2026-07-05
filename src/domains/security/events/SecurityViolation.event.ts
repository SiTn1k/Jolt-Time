/**
 * Security Violation Detected Event
 *
 * Domain event emitted when a security violation is detected.
 */

import type { IncidentSeverity } from '../types/IncidentSeverity';

/**
 * Event data for security violation.
 */
export interface SecurityViolationDetectedEventData {
  /** Violation type */
  violationType: string;

  /** Severity */
  severity: IncidentSeverity;

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
 * Domain event for security violation.
 */
export interface SecurityViolationDetectedEvent {
  /** Event type identifier */
  readonly eventType: 'SecurityViolationDetected';

  /** Event data */
  readonly data: SecurityViolationDetectedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a SecurityViolationDetectedEvent.
 */
export function createSecurityViolationDetectedEvent(params: {
  violationType: string;
  severity: IncidentSeverity;
  actorId: string;
  source: string;
  description: string;
}): SecurityViolationDetectedEvent {
  return {
    eventType: 'SecurityViolationDetected',
    version: 1,
    data: {
      violationType: params.violationType,
      severity: params.severity,
      actorId: params.actorId,
      source: params.source,
      description: params.description,
      occurredAt: new Date(),
    },
  };
}
