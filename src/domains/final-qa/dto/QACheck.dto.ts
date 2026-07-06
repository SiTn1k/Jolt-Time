/**
 * QA Check DTO
 *
 * Data Transfer Object for QA check requests and responses.
 */

import type { QAStatus } from '../types/QAStatus';
import type { CheckSeverity } from '../types/CheckSeverity';
import type { QAMetadata } from '../types/QAMetadata';

/**
 * DTO for creating a new QA check.
 */
export interface CreateQACheckDto {
  /** Check ID */
  checkId?: string;

  /** Title of the check */
  title: string;

  /** Status of the check */
  status: QAStatus;

  /** Severity of the check */
  severity: CheckSeverity;

  /** Completion timestamp */
  completedAt?: string | null;

  /** Metadata */
  metadata?: QAMetadata;
}

/**
 * DTO for QA check response.
 */
export interface QACheckResponseDto {
  /** Check ID */
  checkId: string;

  /** Title of the check */
  title: string;

  /** Status of the check */
  status: QAStatus;

  /** Severity of the check */
  severity: CheckSeverity;

  /** Completion timestamp */
  completedAt: string | null;

  /** Metadata */
  metadata: QAMetadata;
}

/**
 * DTO for updating a QA check.
 */
export interface UpdateQACheckDto {
  /** Status of the check */
  status?: QAStatus;

  /** Completion timestamp */
  completedAt?: string | null;

  /** Metadata */
  metadata?: QAMetadata;
}
