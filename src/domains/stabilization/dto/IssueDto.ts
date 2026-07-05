/**
 * Issue DTO
 *
 * Data Transfer Object for stabilization issues.
 */

import type { IssueSeverity } from '../types/IssueSeverity';
import type { IssueStatus } from '../types/IssueStatus';
import type { StabilizationMetadata } from '../types/StabilizationMetadata';

/**
 * DTO for creating a new stabilization issue.
 */
export interface CreateIssueDto {
  /** Module where the issue was detected */
  module: string;

  /** Severity level of the issue */
  severity: IssueSeverity;

  /** Human-readable issue description */
  description: string;

  /** Current status of the issue (defaults to DETECTED) */
  status?: IssueStatus;

  /** Additional metadata */
  metadata?: StabilizationMetadata;
}

/**
 * DTO for updating an existing issue.
 */
export interface UpdateIssueDto {
  /** Updated severity level */
  severity?: IssueSeverity;

  /** Updated description */
  description?: string;

  /** Updated status */
  status?: IssueStatus;

  /** Updated metadata */
  metadata?: StabilizationMetadata;
}

/**
 * DTO for issue response.
 */
export interface IssueResponseDto {
  /** Unique issue identifier */
  issueId: string;

  /** Module where the issue was detected */
  module: string;

  /** Severity level of the issue */
  severity: IssueSeverity;

  /** Human-readable issue description */
  description: string;

  /** Current status of the issue */
  status: IssueStatus;

  /** Timestamp when the issue was created */
  createdAt: string;

  /** Additional metadata */
  metadata: StabilizationMetadata;
}

/**
 * DTO for issue query parameters.
 */
export interface IssueQueryDto {
  /** Filter by module */
  module?: string;

  /** Filter by severity */
  severity?: IssueSeverity;

  /** Filter by status */
  status?: IssueStatus;

  /** Filter by created date after */
  createdAfter?: string;

  /** Filter by created date before */
  createdBefore?: string;

  /** Page number */
  page?: number;

  /** Page size */
  pageSize?: number;
}
