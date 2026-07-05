/**
 * ErrorCategory Entity
 *
 * Domain entity representing an error category in the error handling foundation.
 * This entity ONLY stores category definitions - it never modifies gameplay.
 *
 * ErrorCategory Entity Responsibilities:
 * - Store category definition data
 * - Provide immutable category record
 *
 * ErrorCategory Entity is NOT:
 * - A gameplay modifier
 * - A reward distributor
 * - A state changer
 */

import type { IErrorCategory } from '../interfaces/IErrorCategory';
import { CategoryId } from '../value-objects/CategoryId';
import { ErrorCategoryType } from '../types/ErrorCategoryType';

/**
 * ErrorCategory properties interface for constructor.
 */
export interface ErrorCategoryProps {
  categoryId: CategoryId;
  name: string;
  description: string;
  categoryType: ErrorCategoryType;
  metadata?: Record<string, unknown>;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Database record representation of ErrorCategory.
 */
export interface ErrorCategoryRecord {
  category_id: string;
  name: string;
  description: string;
  category_type: string;
  metadata?: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * JSON serialization representation of ErrorCategory.
 */
export interface ErrorCategoryJSON {
  categoryId: string;
  name: string;
  description: string;
  categoryType: ErrorCategoryType;
  metadata: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * ErrorCategory entity class.
 * Immutable domain entity representing an error category.
 */
export class ErrorCategory implements IErrorCategory {
  /** Unique category identifier */
  public readonly categoryId: CategoryId;

  /** Category name */
  public readonly name: string;

  /** Category description */
  public readonly description: string;

  /** Category type */
  public readonly categoryType: ErrorCategoryType;

  /** Category metadata */
  public readonly metadata: Record<string, unknown>;

  /** Whether the category is active */
  public readonly isActive: boolean;

  /** Timestamp when category was created */
  public readonly createdAt: Date;

  /** Timestamp when category was last updated */
  public readonly updatedAt: Date;

  /**
   * Creates a new ErrorCategory instance.
   * @param props ErrorCategory properties
   */
  constructor(props: ErrorCategoryProps) {
    this.categoryId = props.categoryId;
    this.name = props.name;
    this.description = props.description;
    this.categoryType = props.categoryType;
    this.metadata = props.metadata ?? {};
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  /**
   * Creates a new ErrorCategory.
   * Factory method for new category creation.
   */
  public static create(params: {
    categoryId: CategoryId;
    name: string;
    description: string;
    categoryType: ErrorCategoryType;
    metadata?: Record<string, unknown>;
  }): ErrorCategory {
    const now = new Date();
    return new ErrorCategory({
      categoryId: params.categoryId,
      name: params.name,
      description: params.description,
      categoryType: params.categoryType,
      metadata: params.metadata ?? {},
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Creates an ErrorCategory from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: ErrorCategoryRecord): ErrorCategory {
    return new ErrorCategory({
      categoryId: CategoryId.reconstruct(record.category_id),
      name: record.name,
      description: record.description,
      categoryType: record.category_type as ErrorCategoryType,
      metadata: record.metadata ?? {},
      isActive: record.is_active,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
    });
  }

  /**
   * Creates a copy of the ErrorCategory with optional modifications.
   * @param modifications Optional property modifications
   * @returns A new ErrorCategory instance with the modifications
   */
  public copyWith(modifications: Partial<ErrorCategoryProps>): ErrorCategory {
    return new ErrorCategory({
      categoryId: modifications.categoryId ?? this.categoryId,
      name: modifications.name ?? this.name,
      description: modifications.description ?? this.description,
      categoryType: modifications.categoryType ?? this.categoryType,
      metadata: modifications.metadata ?? this.metadata,
      isActive: modifications.isActive ?? this.isActive,
      createdAt: modifications.createdAt ?? this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Serializes the ErrorCategory to a plain object.
   */
  public toJSON(): ErrorCategoryJSON {
    return {
      categoryId: this.categoryId.value,
      name: this.name,
      description: this.description,
      categoryType: this.categoryType,
      metadata: this.metadata,
      isActive: this.isActive,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
