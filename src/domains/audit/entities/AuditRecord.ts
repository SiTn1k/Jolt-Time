/**
 * AuditRecord Entity
 *
 * Domain entity representing an immutable audit log record.
 * This entity ONLY stores audit records - it never modifies gameplay.
 *
 * AuditRecord Entity Responsibilities:
 * - Store immutable audit event data
 * - Track action source and target
 * - Record action outcome
 *
 * AuditRecord Entity is NOT:
 * - A gameplay modifier
 * - A reward distributor
 * - A state changer
 */

import type { IAuditRecord } from '../interfaces/IAuditRecord';
import { AuditId } from '../value-objects/AuditId';
import { AuditActorId } from '../value-objects/AuditActorId';
import { AuditCategoryId } from '../value-objects/AuditCategoryId';
import { AuditAction, AUDIT_ACTION_CONSTRAINTS } from '../types/AuditAction';
import { AuditResult } from '../types/AuditResult';
import { AuditActorType } from '../types/AuditActorType';
import { AuditMetadata, INITIAL_AUDIT_METADATA } from '../types/AuditMetadata';

/**
 * AuditRecord entity class.
 * Immutable domain entity representing an audit log entry.
 */
export class AuditRecord implements IAuditRecord {
  /** Unique audit record identifier */
  public readonly auditId: AuditId;

  /** ID of the actor who performed the action */
  public readonly actorId: AuditActorId;

  /** Type of actor */
  public readonly actorType: AuditActorType;

  /** Action that was performed */
  public readonly action: AuditAction;

  /** Type of target entity */
  public readonly targetType: string;

  /** ID of the target entity */
  public readonly targetId: string;

  /** Category ID for grouping */
  public readonly categoryId: AuditCategoryId | null;

  /** Result of the action */
  public readonly result: AuditResult;

  /** Timestamp when the action occurred */
  public readonly createdAt: Date;

  /** Additional metadata */
  public readonly metadata: AuditMetadata;

  /**
   * Creates a new AuditRecord instance.
   * @param props AuditRecord properties
   */
  constructor(props: AuditRecordProps) {
    this.auditId = props.auditId;
    this.actorId = props.actorId;
    this.actorType = props.actorType;
    this.action = props.action;
    this.targetType = props.targetType;
    this.targetId = props.targetId;
    this.categoryId = props.categoryId ?? null;
    this.result = props.result;
    this.createdAt = props.createdAt;
    this.metadata = props.metadata ?? { ...INITIAL_AUDIT_METADATA };
  }

  /**
   * Creates a new AuditRecord for storing.
   * Factory method for new record creation.
   */
  public static create(params: {
    auditId?: AuditId;
    actorId: AuditActorId;
    actorType: AuditActorType;
    action: AuditAction;
    targetType: string;
    targetId: string;
    categoryId?: AuditCategoryId | null;
    result: AuditResult;
    metadata?: AuditMetadata;
  }): AuditRecord {
    return new AuditRecord({
      auditId: params.auditId ?? AuditId.generate(),
      actorId: params.actorId,
      actorType: params.actorType,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      categoryId: params.categoryId ?? null,
      result: params.result,
      createdAt: new Date(),
      metadata: params.metadata ?? { ...INITIAL_AUDIT_METADATA },
    });
  }

  /**
   * Creates an AuditRecord from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: AuditRecordRecord): AuditRecord {
    return new AuditRecord({
      auditId: AuditId.reconstruct(record.audit_id),
      actorId: AuditActorId.reconstruct(record.actor_id),
      actorType: record.actor_type as AuditActorType,
      action: record.action as AuditAction,
      targetType: record.target_type,
      targetId: record.target_id,
      categoryId: record.category_id ? AuditCategoryId.reconstruct(record.category_id) : null,
      result: record.result as AuditResult,
      createdAt: new Date(record.created_at),
      metadata: record.metadata ?? { ...INITIAL_AUDIT_METADATA },
    });
  }

  /**
   * Serializes the AuditRecord to a plain object.
   */
  public toJSON(): AuditRecordJSON {
    return {
      auditId: this.auditId.value,
      actorId: this.actorId.value,
      actorType: this.actorType,
      action: this.action,
      targetType: this.targetType,
      targetId: this.targetId,
      categoryId: this.categoryId?.value ?? null,
      result: this.result,
      createdAt: this.createdAt.toISOString(),
      metadata: this.metadata,
    };
  }
}

/**
 * AuditRecord properties interface for constructor.
 */
export interface AuditRecordProps {
  auditId: AuditId;
  actorId: AuditActorId;
  actorType: AuditActorType;
  action: AuditAction;
  targetType: string;
  targetId: string;
  categoryId: AuditCategoryId | null;
  result: AuditResult;
  createdAt: Date;
  metadata?: AuditMetadata;
}

/**
 * Database record representation of AuditRecord.
 */
export interface AuditRecordRecord {
  audit_id: string;
  actor_id: string;
  actor_type: string;
  action: string;
  target_type: string;
  target_id: string;
  category_id: string | null;
  result: string;
  created_at: string;
  metadata?: AuditMetadata;
}

/**
 * JSON serialization representation of AuditRecord.
 */
export interface AuditRecordJSON {
  auditId: string;
  actorId: string;
  actorType: AuditActorType;
  action: AuditAction;
  targetType: string;
  targetId: string;
  categoryId: string | null;
  result: AuditResult;
  createdAt: string;
  metadata: AuditMetadata;
}
