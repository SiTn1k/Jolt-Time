/**
 * Health Snapshot DTO
 *
 * Data Transfer Object for health snapshots.
 */

import type { HealthStatus } from '../types/HealthStatus';
import type { StabilizationMetadata } from '../types/StabilizationMetadata';

/**
 * DTO for creating a new health snapshot.
 */
export interface CreateHealthSnapshotDto {
  /** Memory health status */
  memory: HealthStatus;

  /** CPU health status */
  cpu: HealthStatus;

  /** Database health status */
  database: HealthStatus;

  /** Cache health status */
  cache: HealthStatus;

  /** API health status */
  api: HealthStatus;

  /** Additional metadata */
  metadata?: StabilizationMetadata;
}

/**
 * DTO for health snapshot response.
 */
export interface HealthSnapshotResponseDto {
  /** Unique snapshot identifier */
  snapshotId: string;

  /** Timestamp when the snapshot was created */
  createdAt: string;

  /** Memory health status */
  memory: HealthStatus;

  /** CPU health status */
  cpu: HealthStatus;

  /** Database health status */
  database: HealthStatus;

  /** Cache health status */
  cache: HealthStatus;

  /** API health status */
  api: HealthStatus;

  /** Overall health status */
  overallStatus: HealthStatus;

  /** Additional metadata */
  metadata: StabilizationMetadata;
}

/**
 * DTO for health snapshot query parameters.
 */
export interface HealthSnapshotQueryDto {
  /** Filter by created date after */
  createdAfter?: string;

  /** Filter by created date before */
  createdBefore?: string;

  /** Filter by overall status */
  overallStatus?: HealthStatus;

  /** Page number */
  page?: number;

  /** Page size */
  pageSize?: number;
}
