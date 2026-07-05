/**
 * Performance Snapshot DTO
 *
 * Data Transfer Object for performance snapshot requests.
 */

import type { OptimizationMetadata } from '../types/OptimizationMetadata';

/**
 * DTO for creating a new performance snapshot.
 */
export interface CreatePerformanceSnapshotDto {
  /** Execution time in milliseconds */
  executionTime: number;

  /** Memory usage in bytes */
  memoryUsage: number;

  /** Cache hit rate percentage (0-100) */
  cacheHitRate: number;

  /** Number of database queries */
  databaseQueries: number;

  /** Snapshot metadata */
  metadata?: OptimizationMetadata;
}

/**
 * DTO for performance snapshot response.
 */
export interface PerformanceSnapshotResponseDto {
  /** Snapshot ID */
  snapshotId: string;

  /** Creation timestamp */
  createdAt: string;

  /** Execution time in milliseconds */
  executionTime: number;

  /** Memory usage in bytes */
  memoryUsage: number;

  /** Cache hit rate percentage */
  cacheHitRate: number;

  /** Number of database queries */
  databaseQueries: number;

  /** Snapshot metadata */
  metadata: OptimizationMetadata;
}
