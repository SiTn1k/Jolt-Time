/**
 * Security Incident DTO
 *
 * Data Transfer Object for security incident requests and responses.
 */

import type { IncidentSeverity } from '../types/IncidentSeverity';
import type { IncidentStatus } from '../types/IncidentStatus';
import type { IncidentMetadata } from '../types/SecurityMetadata';

/**
 * DTO for creating a new security incident.
 */
export interface CreateSecurityIncidentDto {
  /** Type of incident */
  incidentType: string;

  /** Severity level */
  severity: IncidentSeverity;

  /** Initial status */
  status: IncidentStatus;

  /** ID of the actor involved */
  actorId: string;

  /** Source of the incident */
  source: string;

  /** Description of the incident */
  description: string;

  /** Metadata */
  metadata?: IncidentMetadata;
}

/**
 * DTO for security incident response.
 */
export interface SecurityIncidentResponseDto {
  /** Incident ID */
  incidentId: string;

  /** Type of incident */
  incidentType: string;

  /** Severity level */
  severity: IncidentSeverity;

  /** Current status */
  status: IncidentStatus;

  /** ID of the actor involved */
  actorId: string;

  /** Source of the incident */
  source: string;

  /** Description of the incident */
  description: string;

  /** Creation timestamp */
  createdAt: string;

  /** Metadata */
  metadata: IncidentMetadata;
}
