/**
 * CacheStatistics DTO
 *
 * Data Transfer Objects for cache statistics operations.
 */

import type { CacheStatisticsMetadata } from '../types/CacheMetadata';

/**
 * Cache statistics DTO for API responses.
 */
export interface CacheStatisticsDto {
  statisticsId: string;
  hits: number;
  misses: number;
  evictions: number;
  entries: number;
  memoryUsage: number;
  hitRatePercent: number;
  totalRequests: number;
  updatedAt: string;
  metadata: CacheStatisticsMetadata;
}

/**
 * DTO for creating a new cache statistics record.
 */
export interface CreateCacheStatisticsDto {
  hits?: number;
  misses?: number;
  evictions?: number;
  entries?: number;
  memoryUsage?: number;
  metadata?: CacheStatisticsMetadata;
}

/**
 * DTO for updating cache statistics.
 */
export interface UpdateCacheStatisticsDto {
  hits?: number;
  misses?: number;
  evictions?: number;
  entries?: number;
  memoryUsage?: number;
  metadata?: CacheStatisticsMetadata;
}

/**
 * DTO for cache statistics list responses.
 */
export interface CacheStatisticsListDto {
  statistics: CacheStatisticsDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
