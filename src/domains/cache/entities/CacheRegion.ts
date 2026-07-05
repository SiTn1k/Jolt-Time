/**
 * CacheRegion Entity
 *
 * Domain entity representing a cache region.
 * A cache region is a logical grouping of cache entries.
 *
 * CacheRegion Entity Responsibilities:
 * - Store region metadata (ID, name, description)
 * - Track region enabled status
 * - Store configuration metadata
 *
 * CacheRegion Entity is NOT:
 * - A cache engine
 * - A cache accessor
 * - A gameplay modifier
 * - A state changer
 */

import type { ICacheRegion } from '../interfaces/ICacheRegion';
import { RegionId } from '../value-objects/RegionId';
import type { CacheRegionType } from '../types/CacheRegionType';
import type { CacheRegionMetadata } from '../types/CacheMetadata';

/**
 * CacheRegion entity props for constructor.
 */
export interface CacheRegionProps {
  regionId: RegionId;
  regionName: string;
  regionType: CacheRegionType;
  description: string;
  enabled: boolean;
  metadata: CacheRegionMetadata;
}

/**
 * Database record representation of CacheRegion.
 */
export interface CacheRegionRecord {
  region_id: string;
  region_name: string;
  region_type: string;
  description: string;
  enabled: boolean;
  metadata: CacheRegionMetadata;
}

/**
 * JSON serialization representation of CacheRegion.
 */
export interface CacheRegionJSON {
  regionId: string;
  regionName: string;
  regionType: CacheRegionType;
  description: string;
  enabled: boolean;
  metadata: CacheRegionMetadata;
}

/**
 * CacheRegion entity class.
 * Immutable domain entity representing a cache region.
 */
export class CacheRegion implements ICacheRegion {
  public readonly regionId: RegionId;
  public readonly regionName: string;
  public readonly regionType: CacheRegionType;
  public readonly description: string;
  public readonly enabled: boolean;
  public readonly metadata: CacheRegionMetadata;

  /**
   * Creates a new CacheRegion instance.
   */
  constructor(props: CacheRegionProps) {
    this.regionId = props.regionId;
    this.regionName = props.regionName;
    this.regionType = props.regionType;
    this.description = props.description;
    this.enabled = props.enabled;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new CacheRegion entity.
   * Factory method for new region creation.
   */
  public static create(params: {
    regionId?: RegionId;
    regionName: string;
    regionType: CacheRegionType;
    description?: string;
    enabled?: boolean;
    metadata?: CacheRegionMetadata;
  }): CacheRegion {
    return new CacheRegion({
      regionId: params.regionId ?? RegionId.generate(),
      regionName: params.regionName,
      regionType: params.regionType,
      description: params.description ?? '',
      enabled: params.enabled ?? true,
      metadata: params.metadata ?? {
        description: params.description ?? '',
        tags: [],
        createdBy: undefined,
        maxEntries: undefined,
        defaultTtlSeconds: undefined,
        compressionEnabled: false,
        customFields: {},
      },
    });
  }

  /**
   * Reconstructs a CacheRegion from stored data.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: CacheRegionRecord): CacheRegion {
    return new CacheRegion({
      regionId: RegionId.reconstruct(record.region_id),
      regionName: record.region_name,
      regionType: record.region_type as CacheRegionType,
      description: record.description,
      enabled: record.enabled,
      metadata: record.metadata,
    });
  }

  /**
   * Creates a CacheRegion for system cache.
   */
  public static createSystemRegion(regionName: string, description?: string): CacheRegion {
    return CacheRegion.create({
      regionName,
      regionType: 'system',
      description: description ?? `System cache region: ${regionName}`,
    });
  }

  /**
   * Creates a CacheRegion for session cache.
   */
  public static createSessionRegion(regionName: string, description?: string): CacheRegion {
    return CacheRegion.create({
      regionName,
      regionType: 'session',
      description: description ?? `Session cache region: ${regionName}`,
    });
  }

  /**
   * Creates a CacheRegion for player-specific cache.
   */
  public static createPlayerRegion(regionName: string, description?: string): CacheRegion {
    return CacheRegion.create({
      regionName,
      regionType: 'player',
      description: description ?? `Player cache region: ${regionName}`,
    });
  }

  /**
   * Creates a CacheRegion for guild-specific cache.
   */
  public static createGuildRegion(regionName: string, description?: string): CacheRegion {
    return CacheRegion.create({
      regionName,
      regionType: 'guild',
      description: description ?? `Guild cache region: ${regionName}`,
    });
  }

  /**
   * Creates a CacheRegion for global cache.
   */
  public static createGlobalRegion(regionName: string, description?: string): CacheRegion {
    return CacheRegion.create({
      regionName,
      regionType: 'global',
      description: description ?? `Global cache region: ${regionName}`,
    });
  }

  /**
   * Checks if this region is enabled.
   */
  public get isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Checks if this region is disabled.
   */
  public get isDisabled(): boolean {
    return !this.enabled;
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<CacheRegionProps, 'regionId'>>): CacheRegion {
    return new CacheRegion({
      regionId: this.regionId,
      regionName: params.regionName ?? this.regionName,
      regionType: params.regionType ?? this.regionType,
      description: params.description ?? this.description,
      enabled: params.enabled ?? this.enabled,
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Creates a copy with enabled status toggled.
   */
  public toggle(): CacheRegion {
    return this.copyWith({ enabled: !this.enabled });
  }

  /**
   * Serializes the CacheRegion to a plain object.
   */
  public toJSON(): CacheRegionJSON {
    return {
      regionId: this.regionId.value,
      regionName: this.regionName,
      regionType: this.regionType,
      description: this.description,
      enabled: this.enabled,
      metadata: this.metadata,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): CacheRegionRecord {
    return {
      region_id: this.regionId.value,
      region_name: this.regionName,
      region_type: this.regionType,
      description: this.description,
      enabled: this.enabled,
      metadata: this.metadata,
    };
  }
}
