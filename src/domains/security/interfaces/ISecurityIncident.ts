/**
 * Security Incident Interface
 *
 * Interface defining the contract for SecurityIncident entity.
 */

import type { IncidentId } from '../value-objects/IncidentId';
import type { IncidentSeverity } from '../types/IncidentSeverity';
import type { IncidentStatus } from '../types/IncidentStatus';
import type { IncidentMetadata } from '../types/SecurityMetadata';

/**
 * Security incident entity interface.
 */
export interface ISecurityIncident {
  /** Unique incident identifier */
  readonly incidentId: IncidentId;

  /** Type of incident */
  readonly incidentType: string;

  /** Severity level */
  readonly severity: IncidentSeverity;

  /** Current status */
  readonly status: IncidentStatus;

  /** ID of the actor involved */
  readonly actorId: string;

  /** Source of the incident */
  readonly source: string;

  /** Description of the incident */
  readonly description: string;

  /** Timestamp when the incident was created */
  readonly createdAt: Date;

  /** Additional metadata */
  readonly metadata: IncidentMetadata;

  /**
   * Serializes the incident to a plain object.
   */
  toJSON(): SecurityIncidentJSON;
}

/**
 * JSON serialization representation.
 */
export interface SecurityIncidentJSON {
  incidentId: string;
  incidentType: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  actorId: string;
  source: string;
  description: string;
  createdAt: string;
  metadata: IncidentMetadata;
}
