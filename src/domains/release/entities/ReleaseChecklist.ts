/**
 * ReleaseChecklist Entity
 *
 * Domain entity representing a release checklist item.
 */

import type { IReleaseChecklist } from '../interfaces/IReleaseChecklist';
import { ChecklistId } from '../value-objects/ChecklistId';
import { ChecklistStatus } from '../types/ChecklistStatus';
import type { ChecklistMetadata } from '../types/ReleaseMetadata';

/**
 * ReleaseChecklist entity props for constructor.
 */
export interface ReleaseChecklistProps {
  checklistId: ChecklistId;
  title: string;
  status: ChecklistStatus;
  owner: string;
  completedAt: Date | null;
  metadata: ChecklistMetadata;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of ReleaseChecklist.
 */
export interface ReleaseChecklistRecord {
  checklistId: string;
  title: string;
  status: ChecklistStatus;
  owner: string;
  completedAt: string | null;
  metadata: ChecklistMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * JSON serialization representation of ReleaseChecklist.
 */
export interface ReleaseChecklistJSON {
  checklistId: string;
  title: string;
  status: ChecklistStatus;
  owner: string;
  completedAt: string | null;
  metadata: ChecklistMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * ReleaseChecklist entity class.
 * Immutable domain entity representing a release checklist item.
 */
export class ReleaseChecklist implements IReleaseChecklist {
  public readonly checklistId: ChecklistId;
  public readonly title: string;
  public readonly status: ChecklistStatus;
  public readonly owner: string;
  public readonly completedAt: Date | null;
  public readonly metadata: ChecklistMetadata;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  /**
   * Creates a new ReleaseChecklist instance.
   */
  constructor(props: ReleaseChecklistProps) {
    this.checklistId = props.checklistId;
    this.title = props.title;
    this.status = props.status;
    this.owner = props.owner;
    this.completedAt = props.completedAt;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new ReleaseChecklist entity.
   */
  public static create(params: {
    checklistId?: ChecklistId;
    title: string;
    status?: ChecklistStatus;
    owner?: string;
    metadata?: ChecklistMetadata;
  }): ReleaseChecklist {
    const now = new Date();
    return new ReleaseChecklist({
      checklistId: params.checklistId ?? ChecklistId.create(),
      title: params.title,
      status: params.status ?? ChecklistStatus.PENDING,
      owner: params.owner ?? '',
      completedAt: null,
      metadata: params.metadata ?? { category: 'general', priority: 3 },
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs a ReleaseChecklist from stored data.
   */
  public static fromStorage(record: ReleaseChecklistRecord): ReleaseChecklist {
    return new ReleaseChecklist({
      checklistId: ChecklistId.reconstruct(record.checklistId),
      title: record.title,
      status: record.status,
      owner: record.owner,
      completedAt: record.completedAt ? new Date(record.completedAt) : null,
      metadata: record.metadata,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    });
  }

  /**
   * Checks if the checklist item is completed.
   */
  public get isCompleted(): boolean {
    return this.status === ChecklistStatus.COMPLETED;
  }

  /**
   * Checks if the checklist item is active.
   */
  public get isActive(): boolean {
    return this.status === ChecklistStatus.PENDING || this.status === ChecklistStatus.IN_PROGRESS;
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(
    params: Partial<Omit<ReleaseChecklistProps, 'checklistId' | 'createdAt'>>
  ): ReleaseChecklist {
    return new ReleaseChecklist({
      checklistId: this.checklistId,
      title: params.title ?? this.title,
      status: params.status ?? this.status,
      owner: params.owner ?? this.owner,
      completedAt: params.completedAt !== undefined ? params.completedAt : this.completedAt,
      metadata: params.metadata ?? this.metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Creates a copy marked as completed.
   */
  public markCompleted(): ReleaseChecklist {
    return this.copyWith({
      status: ChecklistStatus.COMPLETED,
      completedAt: new Date(),
    });
  }

  /**
   * Creates a copy marked as in progress.
   */
  public markInProgress(): ReleaseChecklist {
    return this.copyWith({
      status: ChecklistStatus.IN_PROGRESS,
    });
  }

  /**
   * Creates a copy marked as blocked.
   */
  public markBlocked(): ReleaseChecklist {
    return this.copyWith({
      status: ChecklistStatus.BLOCKED,
    });
  }

  /**
   * Creates a copy marked as skipped.
   */
  public markSkipped(): ReleaseChecklist {
    return this.copyWith({
      status: ChecklistStatus.SKIPPED,
      completedAt: new Date(),
    });
  }

  /**
   * Serializes the ReleaseChecklist to a plain object.
   */
  public toJSON(): ReleaseChecklistJSON {
    return {
      checklistId: this.checklistId.value,
      title: this.title,
      status: this.status,
      owner: this.owner,
      completedAt: this.completedAt?.toISOString() ?? null,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): ReleaseChecklistRecord {
    return {
      checklistId: this.checklistId.value,
      title: this.title,
      status: this.status,
      owner: this.owner,
      completedAt: this.completedAt?.toISOString() ?? null,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
