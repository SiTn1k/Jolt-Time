/**
 * CacheResponse DTO
 *
 * General response DTOs for cache operations.
 */

import type { CacheEntryDto } from './CacheEntry.dto';
import type { CacheRegionDto } from './CacheRegion.dto';
import type { CacheStatisticsDto } from './CacheStatistics.dto';

/**
 * Generic cache response DTO.
 */
export interface CacheResponseDto<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

/**
 * Cache entry operation response DTO.
 */
export interface CacheEntryResponseDto extends CacheResponseDto<CacheEntryDto> {
  data?: CacheEntryDto;
}

/**
 * Cache region operation response DTO.
 */
export interface CacheRegionResponseDto extends CacheResponseDto<CacheRegionDto> {
  data?: CacheRegionDto;
}

/**
 * Cache statistics operation response DTO.
 */
export interface CacheStatisticsResponseDto extends CacheResponseDto<CacheStatisticsDto> {
  data?: CacheStatisticsDto;
}

/**
 * Cache hit/miss response DTO.
 */
export interface CacheHitResponseDto {
  hit: boolean;
  cacheKey: string;
  cacheValue?: unknown;
  version?: number;
  expiresAt?: string | null;
}

/**
 * Cache batch operation response DTO.
 */
export interface CacheBatchResponseDto {
  success: boolean;
  processed: number;
  succeeded: number;
  failed: number;
  errors?: Array<{ cacheKey: string; error: string }>;
  timestamp: string;
}

/**
 * Cache health status DTO.
 */
export interface CacheHealthDto {
  healthy: boolean;
  totalEntries: number;
  totalMemoryUsage: number;
  hitRatePercent: number;
  activeRegions: number;
  timestamp: string;
}
