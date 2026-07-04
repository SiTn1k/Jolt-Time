/**
 * SecuritySession Entity
 *
 * Domain entity representing a security session.
 * This entity ONLY stores session records - it never manages authentication.
 *
 * SecuritySession Entity Responsibilities:
 * - Store security session data
 * - Track session status
 * - Record session metadata
 *
 * SecuritySession Entity is NOT:
 * - An authentication manager
 * - A session enforcer
 * - A gameplay modifier
 */

import type { ISecuritySession } from '../interfaces/ISecuritySession';
import { SecuritySessionId } from '../value-objects/SecuritySessionId';
import type { SessionStatus } from '../types/SessionStatus';
import type { SessionMetadata } from '../types/SecurityMetadata';

/**
 * SecuritySession entity class.
 * Immutable domain entity representing a security session record.
 */
export class SecuritySession implements ISecuritySession {
  /** Unique session identifier */
  public readonly sessionId: SecuritySessionId;

  /** ID of the actor */
  public readonly actorId: string;

  /** Current status */
  public readonly status: SessionStatus;

  /** IP address */
  public readonly ipAddress: string;

  /** Device information */
  public readonly device: string;

  /** Timestamp when the session was created */
  public readonly createdAt: Date;

  /** Timestamp when the session expires */
  public readonly expiresAt: Date;

  /** Additional metadata */
  public readonly metadata: SessionMetadata;

  /**
   * Creates a new SecuritySession instance.
   * @param props SecuritySession properties
   */
  constructor(props: SecuritySessionProps) {
    this.sessionId = props.sessionId;
    this.actorId = props.actorId;
    this.status = props.status;
    this.ipAddress = props.ipAddress;
    this.device = props.device;
    this.createdAt = props.createdAt;
    this.expiresAt = props.expiresAt;
    this.metadata = props.metadata ?? {};
  }

  /**
   * Creates a new SecuritySession for storing.
   * Factory method for new session creation.
   */
  public static create(params: {
    sessionId?: SecuritySessionId;
    actorId: string;
    status: SessionStatus;
    ipAddress: string;
    device: string;
    expiresAt: Date;
    metadata?: SessionMetadata;
  }): SecuritySession {
    return new SecuritySession({
      sessionId: params.sessionId ?? SecuritySessionId.generate(),
      actorId: params.actorId,
      status: params.status,
      ipAddress: params.ipAddress,
      device: params.device,
      createdAt: new Date(),
      expiresAt: params.expiresAt,
      metadata: params.metadata ?? {},
    });
  }

  /**
   * Creates a SecuritySession from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: SecuritySessionRecord): SecuritySession {
    return new SecuritySession({
      sessionId: SecuritySessionId.reconstruct(record.session_id),
      actorId: record.actor_id,
      status: record.status as SessionStatus,
      ipAddress: record.ip_address,
      device: record.device,
      createdAt: new Date(record.created_at),
      expiresAt: new Date(record.expires_at),
      metadata: record.metadata ?? {},
    });
  }

  /**
   * Serializes the SecuritySession to a plain object.
   */
  public toJSON(): SecuritySessionJSON {
    return {
      sessionId: this.sessionId.value,
      actorId: this.actorId,
      status: this.status,
      ipAddress: this.ipAddress,
      device: this.device,
      createdAt: this.createdAt.toISOString(),
      expiresAt: this.expiresAt.toISOString(),
      metadata: this.metadata,
    };
  }
}

/**
 * SecuritySession properties interface for constructor.
 */
export interface SecuritySessionProps {
  sessionId: SecuritySessionId;
  actorId: string;
  status: SessionStatus;
  ipAddress: string;
  device: string;
  createdAt: Date;
  expiresAt: Date;
  metadata?: SessionMetadata;
}

/**
 * Database record representation of SecuritySession.
 */
export interface SecuritySessionRecord {
  session_id: string;
  actor_id: string;
  status: string;
  ip_address: string;
  device: string;
  created_at: string;
  expires_at: string;
  metadata?: SessionMetadata;
}

/**
 * JSON serialization representation of SecuritySession.
 */
export interface SecuritySessionJSON {
  sessionId: string;
  actorId: string;
  status: SessionStatus;
  ipAddress: string;
  device: string;
  createdAt: string;
  expiresAt: string;
  metadata: SessionMetadata;
}
