/**
 * Optimization Statistics
 *
 * Defines statistics structures for optimization analysis.
 */

/**
 * Performance statistics for optimization.
 */
export interface OptimizationStatistics {
  /** Total number of samples collected */
  sampleCount: number;

  /** Standard deviation of execution time */
  standardDeviation: number;

  /** Minimum execution time */
  minExecutionTime: number;

  /** Maximum execution time */
  maxExecutionTime: number;

  /** Median execution time */
  medianExecutionTime: number;

  /** 95th percentile execution time */
  p95ExecutionTime: number;

  /** 99th percentile execution time */
  p99ExecutionTime: number;

  /** Cache hit rate percentage */
  cacheHitRate: number;

  /** Average memory usage in bytes */
  averageMemoryUsage: number;

  /** Peak memory usage in bytes */
  peakMemoryUsage: number;

  /** Average CPU usage percentage */
  averageCpuUsage: number;
}

/**
 * Initial/default optimization statistics.
 */
export const INITIAL_OPTIMIZATION_STATISTICS: OptimizationStatistics = {
  sampleCount: 0,
  standardDeviation: 0,
  minExecutionTime: 0,
  maxExecutionTime: 0,
  medianExecutionTime: 0,
  p95ExecutionTime: 0,
  p99ExecutionTime: 0,
  cacheHitRate: 0,
  averageMemoryUsage: 0,
  peakMemoryUsage: 0,
  averageCpuUsage: 0,
};
