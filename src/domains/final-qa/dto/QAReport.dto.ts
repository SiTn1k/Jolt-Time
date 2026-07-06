/**
 * QA Report DTO
 *
 * Data Transfer Object for QA report requests and responses.
 */

import type { QAMetadata } from '../types/QAMetadata';

/**
 * DTO for creating a new QA report.
 */
export interface CreateQAReportDto {
  /** Report ID */
  reportId?: string;

  /** Number of passed checks */
  passedChecks: number;

  /** Number of failed checks */
  failedChecks: number;

  /** Number of warnings */
  warnings: number;

  /** Metadata */
  metadata?: QAMetadata;
}

/**
 * DTO for QA report response.
 */
export interface QAReportResponseDto {
  /** Report ID */
  reportId: string;

  /** Creation timestamp */
  createdAt: string;

  /** Number of passed checks */
  passedChecks: number;

  /** Number of failed checks */
  failedChecks: number;

  /** Number of warnings */
  warnings: number;

  /** Metadata */
  metadata: QAMetadata;
}

/**
 * DTO for updating a QA report.
 */
export interface UpdateQAReportDto {
  /** Number of passed checks */
  passedChecks?: number;

  /** Number of failed checks */
  failedChecks?: number;

  /** Number of warnings */
  warnings?: number;

  /** Metadata */
  metadata?: QAMetadata;
}
