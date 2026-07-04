/**
 * Security Session Interface
 *
 * Interface defining the contract for SecuritySession entity.
 */

import type { SecuritySessionId } from '../value-objects/SecuritySessionId';
import type { SessionStatus } from '../types/SessionStatus';
import type { SessionMetadata } from '../types/SecurityMetadata';

/**
 * Security session entity interface.
 */
export interface ISecuritySession {
  /** Unique session identifier */
  readonly sessionId: SecuritySessionId;

  /** ID of the actor */
  readonly actorId: string;

  /** Current status */
  readonly status: SessionStatus;

  /** IP address */
  readonly ipAddress: string;

  /** Device information */
  readonly device: string;

  /** Timestamp when the session was created */
  readonly createdAt: Date;

  /** Timestamp when the session expires */
  readonly expiresAt: Date;

  /** Additional metadata */
  readonly metadata: SessionMetadata;

  /**
   * Serializes the session to a plain object.
   */
  toJSON(): SecuritySessionJSON;
}

/**
 * JSON serialization representation.
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
