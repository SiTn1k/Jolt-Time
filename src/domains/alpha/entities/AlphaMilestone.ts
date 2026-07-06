/**
 * AlphaMilestone Entity
 *
 * Domain entity representing an alpha testing milestone.
 */

import type { IAlphaMilestone } from '../interfaces/IAlphaMilestone';
import { MilestoneId } from '../value-objects/MilestoneId';
import { MilestoneStatus } from '../types/MilestoneStatus';
import type { MilestoneMetadata } from '../types/AlphaMetadata';

/**
 * AlphaMilestone entity props for constructor.
 */
export interface AlphaMilestoneProps {
  milestoneId: MilestoneId;
  title: string;
  status: MilestoneStatus;
  targetDate: Date | null;
  completedAt: Date | null;
  metadata: MilestoneMetadata;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of AlphaMilestone.
 */
export interface AlphaMilestoneRecord {
  milestoneId: string;
  title: string;
  status: MilestoneStatus;
  targetDate: string | null;
  completedAt: string | null;
  metadata: MilestoneMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * JSON serialization representation of AlphaMilestone.
 */
export interface AlphaMilestoneJSON {
  milestoneId: string;
  title: string;
  status: MilestoneStatus;
  targetDate: string | null;
  completedAt: string | null;
  metadata: MilestoneMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * AlphaMilestone entity class.
 * Immutable domain entity representing an alpha testing milestone.
 */
export class AlphaMilestone implements IAlphaMilestone {
  public readonly milestoneId: MilestoneId;
  public readonly title: string;
  public readonly status: MilestoneStatus;
  public readonly targetDate: Date | null;
  public readonly completedAt: Date | null;
  public readonly metadata: MilestoneMetadata;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  /**
   * Creates a new AlphaMilestone instance.
   */
  constructor(props: AlphaMilestoneProps) {
    this.milestoneId = props.milestoneId;
    this.title = props.title;
    this.status = props.status;
    this.targetDate = props.targetDate;
    this.completedAt = props.completedAt;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new AlphaMilestone entity.
   */
  public static create(params: {
    milestoneId?: MilestoneId;
    title: string;
    status?: MilestoneStatus;
    targetDate?: Date | null;
    metadata?: MilestoneMetadata;
  }): AlphaMilestone {
    const now = new Date();
    return new AlphaMilestone({
      milestoneId: params.milestoneId ?? MilestoneId.create(),
      title: params.title,
      status: params.status ?? MilestoneStatus.PLANNED,
      targetDate: params.targetDate ?? null,
      completedAt: null,
      metadata: params.metadata ?? { category: 'general', goals: [], criteria: [] },
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs an AlphaMilestone from stored data.
   */
  public static fromStorage(record: AlphaMilestoneRecord): AlphaMilestone {
    return new AlphaMilestone({
      milestoneId: MilestoneId.reconstruct(record.milestoneId),
      title: record.title,
      status: record.status,
      targetDate: record.targetDate ? new Date(record.targetDate) : null,
      completedAt: record.completedAt ? new Date(record.completedAt) : null,
      metadata: record.metadata,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    });
  }

  /**
   * Checks if the milestone is completed.
   */
  public get isCompleted(): boolean {
    return this.status === MilestoneStatus.COMPLETED;
  }

  /**
   * Checks if the milestone is active.
   */
  public get isActive(): boolean {
    return this.status === MilestoneStatus.PLANNED || this.status === MilestoneStatus.IN_PROGRESS;
  }

  /**
   * Checks if the milestone is overdue.
   */
  public get isOverdue(): boolean {
    if (!this.targetDate || this.isCompleted) {
      return false;
    }
    return new Date() > this.targetDate;
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<AlphaMilestoneProps, 'milestoneId' | 'createdAt'>>): AlphaMilestone {
    return new AlphaMilestone({
      milestoneId: this.milestoneId,
      title: params.title ?? this.title,
      status: params.status ?? this.status,
      targetDate: params.targetDate !== undefined ? params.targetDate : this.targetDate,
      completedAt: params.completedAt !== undefined ? params.completedAt : this.completedAt,
      metadata: params.metadata ?? this.metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Creates a copy marked as completed.
   */
  public markCompleted(): AlphaMilestone {
    return this.copyWith({
      status: MilestoneStatus.COMPLETED,
      completedAt: new Date(),
    });
  }

  /**
   * Serializes the AlphaMilestone to a plain object.
   */
  public toJSON(): AlphaMilestoneJSON {
    return {
      milestoneId: this.milestoneId.value,
      title: this.title,
      status: this.status,
      targetDate: this.targetDate?.toISOString() ?? null,
      completedAt: this.completedAt?.toISOString() ?? null,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): AlphaMilestoneRecord {
    return {
      milestoneId: this.milestoneId.value,
      title: this.title,
      status: this.status,
      targetDate: this.targetDate?.toISOString() ?? null,
      completedAt: this.completedAt?.toISOString() ?? null,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
