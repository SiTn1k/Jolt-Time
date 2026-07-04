/**
 * AuditCategory Interface
 *
 * Interface defining the contract for AuditCategory entity.
 */

import type { AuditCategoryId } from '../value-objects/AuditCategoryId';
import type { AuditMetadata } from '../types/AuditMetadata';

/**
 * AuditCategory entity interface.
 * Represents an audit category for grouping audit records.
 */
export interface IAuditCategory {
  /** Unique category identifier */
  readonly categoryId: AuditCategoryId;

  /** Category name */
  readonly name: string;

  /** Category description */
  readonly description: string;

  /** Category metadata */
  readonly metadata: AuditMetadata;
}
