/**
 * RegionMapper
 *
 * Maps between CacheRegion entity and DTOs.
 * No cache logic - pure transformation only.
 */

import type { CacheRegionRecord } from '../entities/CacheRegion';
import { CacheRegion } from '../entities/CacheRegion';
import type {
  CacheRegionDto,
  CreateCacheRegionDto,
  UpdateCacheRegionDto,
  CacheRegionListDto,
} from '../dto/CacheRegion.dto';

/**
 * Mapper for converting between CacheRegion entity and DTOs.
 */
export class RegionMapper {
  /**
   * Converts a CacheRegion entity to CacheRegionDto.
   */
  public static toDto(region: CacheRegion): CacheRegionDto {
    return {
      regionId: region.regionId.value,
      regionName: region.regionName,
      regionType: region.regionType,
      description: region.description,
      enabled: region.enabled,
      metadata: region.metadata,
    };
  }

  /**
   * Converts a CacheRegion entity to a database record format.
   */
  public static toRecord(region: CacheRegion): CacheRegionRecord {
    return region.toRecord();
  }

  /**
   * Converts a database record to CacheRegionDto.
   */
  public static fromRecordToDto(record: CacheRegionRecord): CacheRegionDto {
    return {
      regionId: record.region_id,
      regionName: record.region_name,
      regionType: record.region_type as CacheRegionDto['regionType'],
      description: record.description,
      enabled: record.enabled,
      metadata: record.metadata,
    };
  }

  /**
   * Converts a database record to CacheRegion entity.
   */
  public static fromRecord(record: CacheRegionRecord): CacheRegion {
    return CacheRegion.fromDatabase(record);
  }

  /**
   * Converts an array of CacheRegion entities to CacheRegionListDto.
   */
  public static toListDto(
    regions: CacheRegion[],
    total: number,
    page: number,
    pageSize: number
  ): CacheRegionListDto {
    return {
      regions: regions.map((r) => this.toDto(r)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Converts a CreateCacheRegionDto to partial region props for entity creation.
   */
  public static fromCreateDto(dto: CreateCacheRegionDto): {
    regionName: string;
    regionType: CreateCacheRegionDto['regionType'];
    description?: string;
    enabled?: boolean;
    metadata?: CreateCacheRegionDto['metadata'];
  } {
    return {
      regionName: dto.regionName,
      regionType: dto.regionType,
      description: dto.description,
      enabled: dto.enabled,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an UpdateCacheRegionDto to partial region props for entity updates.
   */
  public static fromUpdateDto(dto: UpdateCacheRegionDto): {
    regionName?: string;
    description?: string;
    enabled?: boolean;
    metadata?: UpdateCacheRegionDto['metadata'];
  } {
    return {
      regionName: dto.regionName,
      description: dto.description,
      enabled: dto.enabled,
      metadata: dto.metadata,
    };
  }
}
