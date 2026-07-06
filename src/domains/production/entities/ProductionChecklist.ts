/**
 * ProductionChecklist Entity
 *
 * Domain entity representing a production readiness checklist item.
 */

import type { IProductionChecklist } from '../interfaces/IProductionChecklist';
import { ChecklistId } from '../value-objects/ChecklistId';
import { ChecklistStatus } from '../types/ChecklistStatus';
import type { ChecklistMetadata } from '../types/ProductionMetadata';

/**
 * ProductionChecklist entity props for constructor.
 */
export interface ProductionChecklistProps {
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
 * Database record representation of ProductionChecklist.
 */
export interface ProductionChecklistRecord {
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
 * JSON serialization representation of ProductionChecklist.
 */
export interface ProductionChecklistJSON {
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
 * ProductionChecklist entity class.
 * Immutable domain entity representing a production readiness checklist item.
 */
export class ProductionChecklist implements IProductionChecklist {
  public readonly checklistId: ChecklistId;
  public readonly title: string;
  public readonly status: ChecklistStatus;
  public readonly completedAt: Date | null;
  public readonly owner: string;
  public readonly metadata: ChecklistMetadata;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  /**
   * Creates a new ProductionChecklist instance.
   */
  constructor(props: ProductionChecklistProps) {
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
   * Creates a new ProductionChecklist entity.
   */
  public static create(params: {
    checklistId?: ChecklistId;
    title: string;
    status?: ChecklistStatus;
    owner?: string;
    metadata?: ChecklistMetadata;
  }): ProductionChecklist {
    const now = new Date();
    return new ProductionChecklist({
      checklistId: params.checklistId ?? ChecklistId.create(),
      title: params.title,
      status: params.status ?? ChecklistStatus.PENDING,
      completedAt: null,
      owner: params.owner ?? '',
      metadata: params.metadata ?? { category: 'general', priority: 3 },
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs a ProductionChecklist from stored data.
   */
  public static fromStorage(record: ProductionChecklistRecord): ProductionChecklist {
    return new ProductionChecklist({
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
  public copyWith(params: Partial<Omit<ProductionChecklistProps, 'checklistId' | 'createdAt'>>): ProductionChecklist {
    return new ProductionChecklist({
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
  public markCompleted(): ProductionChecklist {
    return this.copyWith({
      status: ChecklistStatus.COMPLETED,
      completedAt: new Date(),
    });
  }

  /**
   * Serializes the ProductionChecklist to a plain object.
   */
  public toJSON(): ProductionChecklistJSON {
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
  public toRecord(): ProductionChecklistRecord {
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
