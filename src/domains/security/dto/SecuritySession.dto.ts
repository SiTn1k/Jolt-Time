/**
 * Security Session DTO
 *
 * Data Transfer Object for security session requests and responses.
 */

import type { SessionStatus } from '../types/SessionStatus';
import type { SessionMetadata } from '../types/SecurityMetadata';

/**
 * DTO for creating a new security session.
 */
export interface CreateSecuritySessionDto {
  /** ID of the actor */
  actorId: string;

  /** Initial status */
  status: SessionStatus;

  /** IP address */
  ipAddress: string;

  /** Device information */
  device: string;

  /** Expiration timestamp */
  expiresAt: string;

  /** Metadata */
  metadata?: SessionMetadata;
}

/**
 * DTO for updating a security session.
 */
export interface UpdateSecuritySessionDto {
  /** Status */
  status?: SessionStatus;

  /** Expiration timestamp */
  expiresAt?: string;

  /** Metadata */
  metadata?: SessionMetadata;
}

/**
 * DTO for security session response.
 */
export interface SecuritySessionResponseDto {
  /** Session ID */
  sessionId: string;

  /** ID of the actor */
  actorId: string;

  /** Current status */
  status: SessionStatus;

  /** IP address */
  ipAddress: string;

  /** Device information */
  device: string;

  /** Creation timestamp */
  createdAt: string;

  /** Expiration timestamp */
  expiresAt: string;

  /** Metadata */
  metadata: SessionMetadata;
}
