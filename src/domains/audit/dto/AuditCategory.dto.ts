/**
 * Audit Category DTO
 *
 * Data Transfer Object for audit category requests and responses.
 */

import type { AuditMetadata } from '../types/AuditMetadata';

/**
 * DTO for creating a new audit category.
 */
export interface CreateAuditCategoryDto {
  /** Category name */
  name: string;

  /** Category description */
  description: string;

  /** Metadata */
  metadata?: AuditMetadata;
}

/**
 * DTO for audit category response.
 */
export interface AuditCategoryResponseDto {
  /** Category ID */
  categoryId: string;

  /** Category name */
  name: string;

  /** Category description */
  description: string;

  /** Metadata */
  metadata: AuditMetadata;
}
