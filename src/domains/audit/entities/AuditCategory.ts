/**
 * AuditCategory Entity
 *
 * Domain entity representing an audit category.
 * Categories are used to group and classify audit records.
 *
 * AuditCategory Entity Responsibilities:
 * - Represent a category for grouping audit records
 * - Store category metadata
 *
 * AuditCategory Entity is NOT:
 * - A gameplay modifier
 * - Any state-changing entity
 */

import type { IAuditCategory } from '../interfaces/IAuditCategory';
import { AuditCategoryId } from '../value-objects/AuditCategoryId';
import { AuditMetadata, INITIAL_AUDIT_METADATA } from '../types/AuditMetadata';

/**
 * AuditCategory entity class.
 * Immutable domain entity representing an audit category.
 */
export class AuditCategory implements IAuditCategory {
  /** Unique category identifier */
  public readonly categoryId: AuditCategoryId;

  /** Category name */
  public readonly name: string;

  /** Category description */
  public readonly description: string;

  /** Category metadata */
  public readonly metadata: AuditMetadata;

  /**
   * Creates a new AuditCategory instance.
   * @param props AuditCategory properties
   */
  constructor(props: AuditCategoryProps) {
    this.categoryId = props.categoryId;
    this.name = props.name;
    this.description = props.description;
    this.metadata = props.metadata ?? { ...INITIAL_AUDIT_METADATA };
  }

  /**
   * Creates a new AuditCategory.
   * Factory method for new category creation.
   */
  public static create(params: {
    categoryId?: AuditCategoryId;
    name: string;
    description: string;
    metadata?: AuditMetadata;
  }): AuditCategory {
    return new AuditCategory({
      categoryId: params.categoryId ?? AuditCategoryId.create(params.name.toLowerCase().replace(/\s+/g, '_')),
      name: params.name,
      description: params.description,
      metadata: params.metadata ?? { ...INITIAL_AUDIT_METADATA },
    });
  }

  /**
   * Creates an AuditCategory from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: AuditCategoryRecord): AuditCategory {
    return new AuditCategory({
      categoryId: AuditCategoryId.reconstruct(record.category_id),
      name: record.name,
      description: record.description,
      metadata: record.metadata ?? { ...INITIAL_AUDIT_METADATA },
    });
  }

  /**
   * Serializes the AuditCategory to a plain object.
   */
  public toJSON(): AuditCategoryJSON {
    return {
      categoryId: this.categoryId.value,
      name: this.name,
      description: this.description,
      metadata: this.metadata,
    };
  }
}

/**
 * AuditCategory properties interface for constructor.
 */
export interface AuditCategoryProps {
  categoryId: AuditCategoryId;
  name: string;
  description: string;
  metadata?: AuditMetadata;
}

/**
 * Database record representation of AuditCategory.
 */
export interface AuditCategoryRecord {
  category_id: string;
  name: string;
  description: string;
  metadata?: AuditMetadata;
}

/**
 * JSON serialization representation of AuditCategory.
 */
export interface AuditCategoryJSON {
  categoryId: string;
  name: string;
  description: string;
  metadata: AuditMetadata;
}
