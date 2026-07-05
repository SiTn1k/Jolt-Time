/**
 * Report DTO
 *
 * Data Transfer Object for stabilization reports.
 */

import type { StabilizationMetadata } from '../types/StabilizationMetadata';

/**
 * DTO for creating a new stabilization report.
 */
export interface CreateReportDto {
  /** List of modules that are healthy */
  healthyModules?: string[];

  /** List of modules with warnings */
  warningModules?: string[];

  /** List of modules that failed */
  failedModules?: string[];

  /** Additional metadata */
  metadata?: StabilizationMetadata;
}

/**
 * DTO for report response.
 */
export interface ReportResponseDto {
  /** Unique report identifier */
  reportId: string;

  /** Timestamp when the report was created */
  createdAt: string;

  /** List of modules that are healthy */
  healthyModules: string[];

  /** List of modules with warnings */
  warningModules: string[];

  /** List of modules that failed */
  failedModules: string[];

  /** Additional metadata */
  metadata: StabilizationMetadata;

  /** Total count of modules */
  totalModules: number;

  /** Health percentage */
  healthPercentage: number;
}

/**
 * DTO for report query parameters.
 */
export interface ReportQueryDto {
  /** Filter by created date after */
  createdAfter?: string;

  /** Filter by created date before */
  createdBefore?: string;

  /** Filter by module health status */
  moduleStatus?: 'healthy' | 'warning' | 'failed';

  /** Page number */
  page?: number;

  /** Page size */
  pageSize?: number;
}
