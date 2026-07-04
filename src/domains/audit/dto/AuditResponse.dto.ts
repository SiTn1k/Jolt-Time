/**
 * Audit Response DTO
 *
 * Data Transfer Object for aggregated audit responses.
 */

import type { AuditRecordResponseDto } from './AuditRecord.dto';
import type { AuditCategoryResponseDto } from './AuditCategory.dto';
import type { AuditActorResponseDto } from './AuditActor.dto';
import type { AuditStatistics } from '../types/AuditStatistics';

/**
 * Paginated response for audit records.
 */
export interface AuditRecordPaginatedResponseDto {
  /** List of audit records */
  items: AuditRecordResponseDto[];

  /** Total count */
  total: number;

  /** Current page */
  page: number;

  /** Page size */
  pageSize: number;

  /** Total pages */
  totalPages: number;

  /** Has next page */
  hasNextPage: boolean;

  /** Has previous page */
  hasPreviousPage: boolean;
}

/**
 * Paginated response for audit categories.
 */
export interface AuditCategoryPaginatedResponseDto {
  /** List of audit categories */
  items: AuditCategoryResponseDto[];

  /** Total count */
  total: number;

  /** Current page */
  page: number;

  /** Page size */
  pageSize: number;

  /** Total pages */
  totalPages: number;

  /** Has next page */
  hasNextPage: boolean;

  /** Has previous page */
  hasPreviousPage: boolean;
}

/**
 * Paginated response for audit actors.
 */
export interface AuditActorPaginatedResponseDto {
  /** List of audit actors */
  items: AuditActorResponseDto[];

  /** Total count */
  total: number;

  /** Current page */
  page: number;

  /** Page size */
  pageSize: number;

  /** Total pages */
  totalPages: number;

  /** Has next page */
  hasNextPage: boolean;

  /** Has previous page */
  hasPreviousPage: boolean;
}

/**
 * Response containing audit statistics.
 */
export interface AuditStatisticsResponseDto extends AuditStatistics {}
