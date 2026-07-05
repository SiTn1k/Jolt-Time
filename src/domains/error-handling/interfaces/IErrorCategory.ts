/**
 * Error Category Interface
 *
 * Interface defining the contract for ErrorCategory entities.
 */

import type { CategoryId } from '../value-objects/CategoryId';
import type { ErrorCategoryType } from '../types/ErrorCategoryType';

/**
 * ErrorCategory interface.
 * Defines the contract for error category entities.
 */
export interface IErrorCategory {
  /** Unique category identifier */
  readonly categoryId: CategoryId;

  /** Category name */
  readonly name: string;

  /** Category description */
  readonly description: string;

  /** Category type */
  readonly categoryType: ErrorCategoryType;

  /** Category metadata */
  readonly metadata: Record<string, unknown>;

  /** Whether the category is active */
  readonly isActive: boolean;

  /** Timestamp when category was created */
  readonly createdAt: Date;

  /** Timestamp when category was last updated */
  readonly updatedAt: Date;
}
