/**
 * MonitoringStatistics Type
 *
 * Type definitions for monitoring statistics and aggregations.
 */

/**
 * Aggregated statistics for monitoring data.
 */
export interface MonitoringStatistics {
  /** Total count of records */
  totalCount: number;

  /** Count of healthy/online records */
  healthyCount: number;

  /** Count of warning/degraded records */
  warningCount: number;

  /** Count of critical/offline records */
  criticalCount: number;

  /** Average response time in milliseconds */
  averageResponseTimeMs: number;

  /** Minimum response time in milliseconds */
  minResponseTimeMs: number;

  /** Maximum response time in milliseconds */
  maxResponseTimeMs: number;

  /** 95th percentile response time in milliseconds */
  p95ResponseTimeMs: number;

  /** 99th percentile response time in milliseconds */
  p99ResponseTimeMs: number;

  /** Timestamp when the statistics were computed */
  computedAt: Date;
}

/**
 * Statistics constraints.
 */
export const MONITORING_STATISTICS_CONSTRAINTS = {
  /** Maximum response time in milliseconds */
  MAX_RESPONSE_TIME_MS: 30000,
  /** Minimum response time in milliseconds */
  MIN_RESPONSE_TIME_MS: 0,
} as const;

/**
 * Helper to create empty statistics.
 */
export function createEmptyMonitoringStatistics(): Omit<MonitoringStatistics, 'computedAt'> & { computedAt?: Date } {
  return {
    totalCount: 0,
    healthyCount: 0,
    warningCount: 0,
    criticalCount: 0,
    averageResponseTimeMs: 0,
    minResponseTimeMs: 0,
    maxResponseTimeMs: 0,
    p95ResponseTimeMs: 0,
    p99ResponseTimeMs: 0,
  };
}
