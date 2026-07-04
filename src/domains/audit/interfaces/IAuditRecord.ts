/**
 * AuditRecord Interface
 *
 * Interface defining the contract for AuditRecord entity.
 */

import type { AuditId } from '../value-objects/AuditId';
import type { AuditActorId } from '../value-objects/AuditActorId';
import type { AuditCategoryId } from '../value-objects/AuditCategoryId';
import type { AuditAction } from '../types/AuditAction';
import type { AuditResult } from '../types/AuditResult';
import type { AuditActorType } from '../types/AuditActorType';
import type { AuditMetadata } from '../types/AuditMetadata';

/**
 * AuditRecord entity interface.
 * Represents an immutable audit log entry.
 */
export interface IAuditRecord {
  /** Unique audit record identifier */
  readonly auditId: AuditId;

  /** ID of the actor who performed the action */
  readonly actorId: AuditActorId;

  /** Type of actor */
  readonly actorType: AuditActorType;

  /** Action that was performed */
  readonly action: AuditAction;

  /** Type of target entity */
  readonly targetType: string;

  /** ID of the target entity */
  readonly targetId: string;

  /** Category ID for grouping */
  readonly categoryId: AuditCategoryId | null;

  /** Result of the action */
  readonly result: AuditResult;

  /** Timestamp when the action occurred */
  readonly createdAt: Date;

  /** Additional metadata */
  readonly metadata: AuditMetadata;
}
