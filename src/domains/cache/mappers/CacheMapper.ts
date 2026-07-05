/**
 * CacheMapper
 *
 * Maps between CacheEntry entity and DTOs.
 * No cache logic - pure transformation only.
 */

import type { CacheEntryRecord } from '../entities/CacheEntry';
import { CacheEntry } from '../entities/CacheEntry';
import type {
  CacheEntryDto,
  CreateCacheEntryDto,
  UpdateCacheEntryDto,
  CacheEntryListDto,
} from '../dto/CacheEntry.dto';

/**
 * Mapper for converting between CacheEntry entity and DTOs.
 */
export class CacheMapper {
  /**
   * Converts a CacheEntry entity to CacheEntryDto.
   */
  public static toDto(entry: CacheEntry): CacheEntryDto {
    return {
      cacheKey: entry.cacheKey.value,
      cacheValue: entry.cacheValue,
      cacheType: entry.cacheType,
      status: entry.status,
      createdAt: entry.createdAt.toISOString(),
      expiresAt: entry.expiresAt?.toISOString() ?? null,
      version: entry.version,
      metadata: entry.metadata,
    };
  }

  /**
   * Converts a CacheEntry entity to a database record format.
   */
  public static toRecord(entry: CacheEntry): CacheEntryRecord {
    return entry.toRecord();
  }

  /**
   * Converts a database record to CacheEntryDto.
   */
  public static fromRecordToDto(record: CacheEntryRecord): CacheEntryDto {
    return {
      cacheKey: record.cache_key,
      cacheValue: record.cache_value,
      cacheType: record.cache_type as CacheEntryDto['cacheType'],
      status: record.status as CacheEntryDto['status'],
      createdAt: record.created_at,
      expiresAt: record.expires_at,
      version: record.version,
      metadata: record.metadata,
    };
  }

  /**
   * Converts a database record to CacheEntry entity.
   */
  public static fromRecord(record: CacheEntryRecord): CacheEntry {
    return CacheEntry.fromDatabase(record);
  }

  /**
   * Converts an array of CacheEntry entities to CacheEntryListDto.
   */
  public static toListDto(
    entries: CacheEntry[],
    total: number,
    page: number,
    pageSize: number
  ): CacheEntryListDto {
    return {
      entries: entries.map((e) => this.toDto(e)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Converts a CreateCacheEntryDto to partial entry props for entity creation.
   */
  public static fromCreateDto(dto: CreateCacheEntryDto): {
    cacheKey: string;
    cacheValue: unknown;
    cacheType: CreateCacheEntryDto['cacheType'];
    expiresAt: Date | null;
    metadata?: CreateCacheEntryDto['metadata'];
  } {
    return {
      cacheKey: dto.cacheKey,
      cacheValue: dto.cacheValue,
      cacheType: dto.cacheType,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an UpdateCacheEntryDto to partial entry props for entity updates.
   */
  public static fromUpdateDto(dto: UpdateCacheEntryDto): {
    cacheValue?: unknown;
    status?: UpdateCacheEntryDto['status'];
    expiresAt?: Date | null;
    metadata?: UpdateCacheEntryDto['metadata'];
  } {
    return {
      cacheValue: dto.cacheValue,
      status: dto.status,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      metadata: dto.metadata,
    };
  }
}
