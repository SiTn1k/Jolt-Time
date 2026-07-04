/**
 * Audit Record DTO
 *
 * Data Transfer Object for audit record requests and responses.
 */

import type { AuditAction } from '../types/AuditAction';
import type { AuditResult } from '../types/AuditResult';
import type { AuditActorType } from '../types/AuditActorType';
import type { AuditMetadata } from '../types/AuditMetadata';

/**
 * DTO for creating a new audit record.
 */
export interface CreateAuditRecordDto {
  /** Actor ID */
  actorId: string;

  /** Actor type */
  actorType: AuditActorType;

  /** Action performed */
  action: AuditAction;

  /** Target type */
  targetType: string;

  /** Target ID */
  targetId: string;

  /** Category ID (optional) */
  categoryId?: string;

  /** Result of the action */
  result: AuditResult;

  /** Metadata */
  metadata?: AuditMetadata;
}

/**
 * DTO for audit record response.
 */
export interface AuditRecordResponseDto {
  /** Audit ID */
  auditId: string;

  /** Actor ID */
  actorId: string;

  /** Actor type */
  actorType: AuditActorType;

  /** Action performed */
  action: AuditAction;

  /** Target type */
  targetType: string;

  /** Target ID */
  targetId: string;

  /** Category ID */
  categoryId: string | null;

  /** Result of the action */
  result: AuditResult;

  /** Creation timestamp */
  createdAt: string;

  /** Metadata */
  metadata: AuditMetadata;
}
