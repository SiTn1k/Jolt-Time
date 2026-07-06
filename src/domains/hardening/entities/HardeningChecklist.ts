/**
 * HardeningChecklist Entity
 *
 * Domain entity representing a hardening checklist item.
 */

import type { IHardeningChecklist } from '../interfaces/IHardeningChecklist';
import { ChecklistId } from '../value-objects/ChecklistId';
import { ChecklistStatus } from '../types/ChecklistStatus';
import type { ChecklistMetadata } from '../types/HardeningMetadata';

/**
 * HardeningChecklist entity props for constructor.
 */
export interface HardeningChecklistProps {
  checklistId: ChecklistId;
  title: string;
  status: ChecklistStatus;
  completedAt: Date | null;
  owner: string;
  metadata: ChecklistMetadata;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of HardeningChecklist.
 */
export interface HardeningChecklistRecord {
  checklistId: string;
  title: string;
  status: ChecklistStatus;
  completedAt: string | null;
  owner: string;
  metadata: ChecklistMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * JSON serialization representation of HardeningChecklist.
 */
export interface HardeningChecklistJSON {
  checklistId: string;
  title: string;
  status: ChecklistStatus;
  completedAt: string | null;
  owner: string;
  metadata: ChecklistMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * HardeningChecklist entity class.
 * Immutable domain entity representing a hardening checklist item.
 */
export class HardeningChecklist implements IHardeningChecklist {
  public readonly checklistId: ChecklistId;
  public readonly title: string;
  public readonly status: ChecklistStatus;
  public readonly completedAt: Date | null;
  public readonly owner: string;
  public readonly metadata: ChecklistMetadata;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  /**
   * Creates a new HardeningChecklist instance.
   */
  constructor(props: HardeningChecklistProps) {
    this.checklistId = props.checklistId;
    this.title = props.title;
    this.status = props.status;
    this.completedAt = props.completedAt;
    this.owner = props.owner;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new HardeningChecklist entity.
   */
  public static create(params: {
    checklistId?: ChecklistId;
    title: string;
    status?: ChecklistStatus;
    owner?: string;
    metadata?: ChecklistMetadata;
  }): HardeningChecklist {
    const now = new Date();
    return new HardeningChecklist({
      checklistId: params.checklistId ?? ChecklistId.create(),
      title: params.title,
      status: params.status ?? ChecklistStatus.PENDING,
      completedAt: null,
      owner: params.owner ?? '',
      metadata: params.metadata ?? { category: 'general', priority: 3, owner: '' },
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs a HardeningChecklist from stored data.
   */
  public static fromStorage(record: HardeningChecklistRecord): HardeningChecklist {
    return new HardeningChecklist({
      checklistId: ChecklistId.reconstruct(record.checklistId),
      title: record.title,
      status: record.status,
      completedAt: record.completedAt ? new Date(record.completedAt) : null,
      owner: record.owner,
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
    params: Partial<Omit<HardeningChecklistProps, 'checklistId' | 'createdAt'>>
  ): HardeningChecklist {
    return new HardeningChecklist({
      checklistId: this.checklistId,
      title: params.title ?? this.title,
      status: params.status ?? this.status,
      completedAt: params.completedAt !== undefined ? params.completedAt : this.completedAt,
      owner: params.owner ?? this.owner,
      metadata: params.metadata ?? this.metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Creates a copy marked as completed.
   */
  public markCompleted(): HardeningChecklist {
    return this.copyWith({
      status: ChecklistStatus.COMPLETED,
      completedAt: new Date(),
    });
  }

  /**
   * Creates a copy marked as in progress.
   */
  public markInProgress(): HardeningChecklist {
    return this.copyWith({
      status: ChecklistStatus.IN_PROGRESS,
    });
  }

  /**
   * Creates a copy marked as blocked.
   */
  public markBlocked(): HardeningChecklist {
    return this.copyWith({
      status: ChecklistStatus.BLOCKED,
    });
  }

  /**
   * Creates a copy marked as skipped.
   */
  public markSkipped(): HardeningChecklist {
    return this.copyWith({
      status: ChecklistStatus.SKIPPED,
      completedAt: new Date(),
    });
  }

  /**
   * Serializes the HardeningChecklist to a plain object.
   */
  public toJSON(): HardeningChecklistJSON {
    return {
      checklistId: this.checklistId.value,
      title: this.title,
      status: this.status,
      completedAt: this.completedAt?.toISOString() ?? null,
      owner: this.owner,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): HardeningChecklistRecord {
    return {
      checklistId: this.checklistId.value,
      title: this.title,
      status: this.status,
      completedAt: this.completedAt?.toISOString() ?? null,
      owner: this.owner,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
