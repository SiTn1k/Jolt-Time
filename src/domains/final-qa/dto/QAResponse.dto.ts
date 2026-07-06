/**
 * QA Response DTO
 *
 * General response DTOs for QA domain operations.
 */

import type { PaginatedResult } from '../../../shared/types/base.types';
import type { QACheckResponseDto } from './QACheck.dto';
import type { QASnapshotResponseDto } from './QASnapshot.dto';
import type { QAReportResponseDto } from './QAReport.dto';

/**
 * Response for listing QA checks.
 */
export interface QACheckListResponseDto {
  /** List of QA checks */
  items: QACheckResponseDto[];

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
 * Response for listing QA snapshots.
 */
export interface QASnapshotListResponseDto {
  /** List of QA snapshots */
  items: QASnapshotResponseDto[];

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
 * Response for listing QA reports.
 */
export interface QAReportListResponseDto {
  /** List of QA reports */
  items: QAReportResponseDto[];

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
 * Generic QA summary response.
 */
export interface QASummaryResponseDto {
  /** Total checks */
  totalChecks: number;

  /** Passed checks */
  passedChecks: number;

  /** Failed checks */
  failedChecks: number;

  /** Warnings */
  warnings: number;

  /** Pass rate percentage */
  passRate: number;
}
