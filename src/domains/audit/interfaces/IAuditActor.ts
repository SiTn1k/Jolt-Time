/**
 * AuditActor Interface
 *
 * Interface defining the contract for AuditActor entity.
 */

import type { AuditActorId } from '../value-objects/AuditActorId';
import type { AuditActorType } from '../types/AuditActorType';
import type { AuditMetadata } from '../types/AuditMetadata';

/**
 * AuditActor entity interface.
 * Represents an actor in the audit system.
 */
export interface IAuditActor {
  /** Unique actor identifier */
  readonly actorId: AuditActorId;

  /** Type of actor */
  readonly actorType: AuditActorType;

  /** Display name for the actor */
  readonly displayName: string;

  /** Actor metadata */
  readonly metadata: AuditMetadata;
}
