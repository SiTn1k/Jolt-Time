/**
 * Audit Actor DTO
 *
 * Data Transfer Object for audit actor requests and responses.
 */

import type { AuditActorType } from '../types/AuditActorType';
import type { AuditMetadata } from '../types/AuditMetadata';

/**
 * DTO for creating or updating an audit actor.
 */
export interface CreateAuditActorDto {
  /** Actor ID */
  actorId: string;

  /** Actor type */
  actorType: AuditActorType;

  /** Display name */
  displayName: string;

  /** Metadata */
  metadata?: AuditMetadata;
}

/**
 * DTO for audit actor response.
 */
export interface AuditActorResponseDto {
  /** Actor ID */
  actorId: string;

  /** Actor type */
  actorType: AuditActorType;

  /** Display name */
  displayName: string;

  /** Metadata */
  metadata: AuditMetadata;
}
