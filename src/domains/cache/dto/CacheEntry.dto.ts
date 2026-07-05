/**
 * CacheEntry DTO
 *
 * Data Transfer Objects for cache entry operations.
 */

import type { CacheType } from '../types/CacheType';
import type { CacheStatus } from '../types/CacheStatus';
import type { CacheEntryMetadata } from '../types/CacheMetadata';

/**
 * Cache entry DTO for API responses.
 */
export interface CacheEntryDto {
  cacheKey: string;
  cacheValue: unknown;
  cacheType: CacheType;
  status: CacheStatus;
  createdAt: string;
  expiresAt: string | null;
  version: number;
  metadata: CacheEntryMetadata;
}

/**
 * DTO for creating a new cache entry.
 */
export interface CreateCacheEntryDto {
  cacheKey: string;
  cacheValue: unknown;
  cacheType: CacheType;
  expiresAt?: string | null;
  metadata?: CacheEntryMetadata;
}

/**
 * DTO for updating a cache entry.
 */
export interface UpdateCacheEntryDto {
  cacheValue?: unknown;
  status?: CacheStatus;
  expiresAt?: string | null;
  metadata?: CacheEntryMetadata;
}

/**
 * DTO for cache entry list responses.
 */
export interface CacheEntryListDto {
  entries: CacheEntryDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
