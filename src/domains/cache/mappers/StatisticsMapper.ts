/**
 * StatisticsMapper
 *
 * Maps between CacheStatistics entity and DTOs.
 * No cache logic - pure transformation only.
 */

import type { CacheStatisticsRecord } from '../entities/CacheStatistics';
import { CacheStatistics } from '../entities/CacheStatistics';
import type {
  CacheStatisticsDto,
  CreateCacheStatisticsDto,
  UpdateCacheStatisticsDto,
  CacheStatisticsListDto,
} from '../dto/CacheStatistics.dto';

/**
 * Mapper for converting between CacheStatistics entity and DTOs.
 */
export class StatisticsMapper {
  /**
   * Converts a CacheStatistics entity to CacheStatisticsDto.
   */
  public static toDto(statistics: CacheStatistics): CacheStatisticsDto {
    return {
      statisticsId: statistics.statisticsId.value,
      hits: statistics.hits,
      misses: statistics.misses,
      evictions: statistics.evictions,
      entries: statistics.entries,
      memoryUsage: statistics.memoryUsage,
      hitRatePercent: statistics.hitRatePercent,
      totalRequests: statistics.totalRequests,
      updatedAt: statistics.updatedAt.toISOString(),
      metadata: statistics.metadata,
    };
  }

  /**
   * Converts a CacheStatistics entity to a database record format.
   */
  public static toRecord(statistics: CacheStatistics): CacheStatisticsRecord {
    return statistics.toRecord();
  }

  /**
   * Converts a database record to CacheStatisticsDto.
   */
  public static fromRecordToDto(record: CacheStatisticsRecord): CacheStatisticsDto {
    const totalRequests = record.hits + record.misses;
    const hitRatePercent = totalRequests > 0 ? (record.hits / totalRequests) * 100 : 0;

    return {
      statisticsId: record.statistics_id,
      hits: record.hits,
      misses: record.misses,
      evictions: record.evictions,
      entries: record.entries,
      memoryUsage: record.memory_usage,
      hitRatePercent: Math.round(hitRatePercent * 100) / 100,
      totalRequests,
      updatedAt: record.updated_at,
      metadata: record.metadata,
    };
  }

  /**
   * Converts a database record to CacheStatistics entity.
   */
  public static fromRecord(record: CacheStatisticsRecord): CacheStatistics {
    return CacheStatistics.fromDatabase(record);
  }

  /**
   * Converts an array of CacheStatistics entities to CacheStatisticsListDto.
   */
  public static toListDto(
    statisticsList: CacheStatistics[],
    total: number,
    page: number,
    pageSize: number
  ): CacheStatisticsListDto {
    return {
      statistics: statisticsList.map((s) => this.toDto(s)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Converts a CreateCacheStatisticsDto to partial statistics props for entity creation.
   */
  public static fromCreateDto(dto: CreateCacheStatisticsDto): {
    hits?: number;
    misses?: number;
    evictions?: number;
    entries?: number;
    memoryUsage?: number;
    metadata?: CreateCacheStatisticsDto['metadata'];
  } {
    return {
      hits: dto.hits,
      misses: dto.misses,
      evictions: dto.evictions,
      entries: dto.entries,
      memoryUsage: dto.memoryUsage,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an UpdateCacheStatisticsDto to partial statistics props for entity updates.
   */
  public static fromUpdateDto(dto: UpdateCacheStatisticsDto): {
    hits?: number;
    misses?: number;
    evictions?: number;
    entries?: number;
    memoryUsage?: number;
    metadata?: UpdateCacheStatisticsDto['metadata'];
  } {
    return {
      hits: dto.hits,
      misses: dto.misses,
      evictions: dto.evictions,
      entries: dto.entries,
      memoryUsage: dto.memoryUsage,
      metadata: dto.metadata,
    };
  }
}
