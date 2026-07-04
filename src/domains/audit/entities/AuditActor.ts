/**
 * AuditActor Entity
 *
 * Domain entity representing an actor in the audit system.
 * Actors are the originators of auditable actions.
 *
 * AuditActor Entity Responsibilities:
 * - Represent an actor identity
 * - Track actor type and display information
 *
 * AuditActor Entity is NOT:
 * - A gameplay modifier
 * - Any state-changing entity
 */

import type { IAuditActor } from '../interfaces/IAuditActor';
import { AuditActorId } from '../value-objects/AuditActorId';
import { AuditActorType, AUDIT_ACTOR_TYPE_CONSTRAINTS } from '../types/AuditActorType';
import { AuditMetadata, INITIAL_AUDIT_METADATA } from '../types/AuditMetadata';

/**
 * AuditActor entity class.
 * Immutable domain entity representing an audit actor.
 */
export class AuditActor implements IAuditActor {
  /** Unique actor identifier */
  public readonly actorId: AuditActorId;

  /** Type of actor */
  public readonly actorType: AuditActorType;

  /** Display name for the actor */
  public readonly displayName: string;

  /** Actor metadata */
  public readonly metadata: AuditMetadata;

  /**
   * Creates a new AuditActor instance.
   * @param props AuditActor properties
   */
  constructor(props: AuditActorProps) {
    this.actorId = props.actorId;
    this.actorType = props.actorType;
    this.displayName = props.displayName;
    this.metadata = props.metadata ?? { ...INITIAL_AUDIT_METADATA };
  }

  /**
   * Creates a new AuditActor.
   * Factory method for new actor creation.
   */
  public static create(params: {
    actorId: AuditActorId;
    actorType: AuditActorType;
    displayName: string;
    metadata?: AuditMetadata;
  }): AuditActor {
    return new AuditActor({
      actorId: params.actorId,
      actorType: params.actorType,
      displayName: params.displayName,
      metadata: params.metadata ?? { ...INITIAL_AUDIT_METADATA },
    });
  }

  /**
   * Creates an AuditActor from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: AuditActorRecord): AuditActor {
    return new AuditActor({
      actorId: AuditActorId.reconstruct(record.actor_id),
      actorType: record.actor_type as AuditActorType,
      displayName: record.display_name,
      metadata: record.metadata ?? { ...INITIAL_AUDIT_METADATA },
    });
  }

  /**
   * Serializes the AuditActor to a plain object.
   */
  public toJSON(): AuditActorJSON {
    return {
      actorId: this.actorId.value,
      actorType: this.actorType,
      displayName: this.displayName,
      metadata: this.metadata,
    };
  }
}

/**
 * AuditActor properties interface for constructor.
 */
export interface AuditActorProps {
  actorId: AuditActorId;
  actorType: AuditActorType;
  displayName: string;
  metadata?: AuditMetadata;
}

/**
 * Database record representation of AuditActor.
 */
export interface AuditActorRecord {
  actor_id: string;
  actor_type: string;
  display_name: string;
  metadata?: AuditMetadata;
}

/**
 * JSON serialization representation of AuditActor.
 */
export interface AuditActorJSON {
  actorId: string;
  actorType: AuditActorType;
  displayName: string;
  metadata: AuditMetadata;
}
