/**
 * Health Response DTO
 *
 * Data Transfer Object for aggregated health responses.
 */

import type { HealthStatus } from '../types/HealthStatus';

/**
 * DTO for current health status response.
 */
export interface HealthResponseDto {
  /** Overall system health status */
  overallStatus: HealthStatus;

  /** Memory component status */
  memory: HealthStatus;

  /** CPU component status */
  cpu: HealthStatus;

  /** Database component status */
  database: HealthStatus;

  /** Cache component status */
  cache: HealthStatus;

  /** API component status */
  api: HealthStatus;

  /** Timestamp of the health check */
  checkedAt: string;

  /** Latest snapshot ID if available */
  latestSnapshotId?: string;
}

/**
 * DTO for health trend data.
 */
export interface HealthTrendDto {
  /** Current status */
  current: HealthStatus;

  /** Previous status */
  previous: HealthStatus;

  /** Status change direction */
  trend: 'improving' | 'stable' | 'degrading';

  /** Number of snapshots analyzed */
  snapshotsAnalyzed: number;
}
