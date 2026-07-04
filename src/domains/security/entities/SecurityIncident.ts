/**
 * SecurityIncident Entity
 *
 * Domain entity representing a security incident.
 * This entity ONLY stores incident records - it never modifies gameplay.
 *
 * SecurityIncident Entity Responsibilities:
 * - Store security incident data
 * - Track incident source and severity
 * - Record incident status and metadata
 *
 * SecurityIncident Entity is NOT:
 * - A gameplay modifier
 * - A reward distributor
 * - A state changer
 * - A ban mechanism
 * - An anti-cheat system
 */

import type { ISecurityIncident } from '../interfaces/ISecurityIncident';
import { IncidentId } from '../value-objects/IncidentId';
import type { IncidentSeverity } from '../types/IncidentSeverity';
import type { IncidentStatus } from '../types/IncidentStatus';
import type { IncidentMetadata } from '../types/SecurityMetadata';

/**
 * SecurityIncident entity class.
 * Immutable domain entity representing a security incident record.
 */
export class SecurityIncident implements ISecurityIncident {
  /** Unique incident identifier */
  public readonly incidentId: IncidentId;

  /** Type of incident */
  public readonly incidentType: string;

  /** Severity level */
  public readonly severity: IncidentSeverity;

  /** Current status */
  public readonly status: IncidentStatus;

  /** ID of the actor involved */
  public readonly actorId: string;

  /** Source of the incident */
  public readonly source: string;

  /** Description of the incident */
  public readonly description: string;

  /** Timestamp when the incident was created */
  public readonly createdAt: Date;

  /** Additional metadata */
  public readonly metadata: IncidentMetadata;

  /**
   * Creates a new SecurityIncident instance.
   * @param props SecurityIncident properties
   */
  constructor(props: SecurityIncidentProps) {
    this.incidentId = props.incidentId;
    this.incidentType = props.incidentType;
    this.severity = props.severity;
    this.status = props.status;
    this.actorId = props.actorId;
    this.source = props.source;
    this.description = props.description;
    this.createdAt = props.createdAt;
    this.metadata = props.metadata ?? {};
  }

  /**
   * Creates a new SecurityIncident for storing.
   * Factory method for new incident creation.
   */
  public static create(params: {
    incidentId?: IncidentId;
    incidentType: string;
    severity: IncidentSeverity;
    status: IncidentStatus;
    actorId: string;
    source: string;
    description: string;
    metadata?: IncidentMetadata;
  }): SecurityIncident {
    return new SecurityIncident({
      incidentId: params.incidentId ?? IncidentId.generate(),
      incidentType: params.incidentType,
      severity: params.severity,
      status: params.status,
      actorId: params.actorId,
      source: params.source,
      description: params.description,
      createdAt: new Date(),
      metadata: params.metadata ?? {},
    });
  }

  /**
   * Creates a SecurityIncident from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: SecurityIncidentRecord): SecurityIncident {
    return new SecurityIncident({
      incidentId: IncidentId.reconstruct(record.incident_id),
      incidentType: record.incident_type,
      severity: record.severity as IncidentSeverity,
      status: record.status as IncidentStatus,
      actorId: record.actor_id,
      source: record.source,
      description: record.description,
      createdAt: new Date(record.created_at),
      metadata: record.metadata ?? {},
    });
  }

  /**
   * Serializes the SecurityIncident to a plain object.
   */
  public toJSON(): SecurityIncidentJSON {
    return {
      incidentId: this.incidentId.value,
      incidentType: this.incidentType,
      severity: this.severity,
      status: this.status,
      actorId: this.actorId,
      source: this.source,
      description: this.description,
      createdAt: this.createdAt.toISOString(),
      metadata: this.metadata,
    };
  }
}

/**
 * SecurityIncident properties interface for constructor.
 */
export interface SecurityIncidentProps {
  incidentId: IncidentId;
  incidentType: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  actorId: string;
  source: string;
  description: string;
  createdAt: Date;
  metadata?: IncidentMetadata;
}

/**
 * Database record representation of SecurityIncident.
 */
export interface SecurityIncidentRecord {
  incident_id: string;
  incident_type: string;
  severity: string;
  status: string;
  actor_id: string;
  source: string;
  description: string;
  created_at: string;
  metadata?: IncidentMetadata;
}

/**
 * JSON serialization representation of SecurityIncident.
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
