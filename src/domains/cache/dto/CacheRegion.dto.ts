/**
 * CacheRegion DTO
 *
 * Data Transfer Objects for cache region operations.
 */

import type { CacheRegionType } from '../types/CacheRegionType';
import type { CacheRegionMetadata } from '../types/CacheMetadata';

/**
 * Cache region DTO for API responses.
 */
export interface CacheRegionDto {
  regionId: string;
  regionName: string;
  regionType: CacheRegionType;
  description: string;
  enabled: boolean;
  metadata: CacheRegionMetadata;
}

/**
 * DTO for creating a new cache region.
 */
export interface CreateCacheRegionDto {
  regionName: string;
  regionType: CacheRegionType;
  description?: string;
  enabled?: boolean;
  metadata?: CacheRegionMetadata;
}

/**
 * DTO for updating a cache region.
 */
export interface UpdateCacheRegionDto {
  regionName?: string;
  description?: string;
  enabled?: boolean;
  metadata?: CacheRegionMetadata;
}

/**
 * DTO for cache region list responses.
 */
export interface CacheRegionListDto {
  regions: CacheRegionDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
