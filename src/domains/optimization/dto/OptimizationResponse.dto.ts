/**
 * Optimization Response DTO
 *
 * Data Transfer Object for optimization responses.
 */

import type { OptimizationLevel } from '../types/OptimizationLevel';
import type { OptimizationStatus } from '../types/OptimizationStatus';
import type { OptimizationStatistics } from '../types/OptimizationStatistics';

/**
 * DTO for optimization analysis response.
 */
export interface OptimizationResponseDto {
  /** Optimization ID */
  optimizationId: string;

  /** Optimization status */
  status: OptimizationStatus;

  /** Optimization level */
  level: OptimizationLevel;

  /** Module name analyzed */
  moduleName: string;

  /** Statistics from the analysis */
  statistics: OptimizationStatistics;

  /** Timestamp when optimization was requested */
  requestedAt: string;

  /** Timestamp when optimization completed (if applicable) */
  completedAt?: string;

  /** Recommendations generated (if any) */
  recommendations?: string[];
}

/**
 * DTO for optimization summary response.
 */
export interface OptimizationSummaryResponseDto {
  /** Total profiles analyzed */
  totalProfiles: number;

  /** Total rules configured */
  totalRules: number;

  /** Total snapshots recorded */
  totalSnapshots: number;

  /** Average execution time across all profiles */
  averageExecutionTime: number;

  /** Peak execution time across all profiles */
  peakExecutionTime: number;

  /** Overall cache hit rate */
  overallCacheHitRate: number;

  /** Optimization level distribution */
  levelDistribution: Record<OptimizationLevel, number>;

  /** Timestamp of the summary */
  generatedAt: string;
}
