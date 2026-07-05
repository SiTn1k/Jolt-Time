/**
 * Error Category DTO
 *
 * Data Transfer Object for error category data.
 */

import type { ErrorCategoryType } from '../types/ErrorCategoryType';

/**
 * DTO for creating a new error category.
 */
export interface CreateErrorCategoryDto {
  /** Category ID */
  categoryId: string;

  /** Category name */
  name: string;

  /** Category description */
  description: string;

  /** Category type */
  categoryType: ErrorCategoryType;

  /** Category metadata */
  metadata?: Record<string, unknown>;
}

/**
 * DTO for updating an error category.
 */
export interface UpdateErrorCategoryDto {
  /** Category name */
  name?: string;

  /** Category description */
  description?: string;

  /** Category type */
  categoryType?: ErrorCategoryType;

  /** Category metadata */
  metadata?: Record<string, unknown>;

  /** Whether the category is active */
  isActive?: boolean;
}

/**
 * DTO for error category response.
 */
export interface ErrorCategoryResponseDto {
  /** Category ID */
  categoryId: string;

  /** Category name */
  name: string;

  /** Category description */
  description: string;

  /** Category type */
  categoryType: ErrorCategoryType;

  /** Category metadata */
  metadata: Record<string, unknown>;

  /** Whether the category is active */
  isActive: boolean;

  /** Creation timestamp */
  createdAt: string;

  /** Last update timestamp */
  updatedAt: string;
}
