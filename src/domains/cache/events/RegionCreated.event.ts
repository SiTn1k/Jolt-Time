/**
 * RegionCreated Event
 *
 * Event emitted when a new cache region is created.
 */

import type { RegionId } from '../value-objects/RegionId';
import type { CacheRegionType } from '../types/CacheRegionType';

/**
 * RegionCreated event class.
 * Emitted when a new cache region is created.
 */
export class RegionCreated {
  public readonly eventType = 'RegionCreated';
  public readonly regionId: string;
  public readonly regionName: string;
  public readonly regionType: CacheRegionType;
  public readonly timestamp: Date;

  /**
   * Creates a new RegionCreated event.
   */
  constructor(params: {
    regionId: RegionId;
    regionName: string;
    regionType: CacheRegionType;
    timestamp?: Date;
  }) {
    this.regionId = params.regionId.value;
    this.regionName = params.regionName;
    this.regionType = params.regionType;
    this.timestamp = params.timestamp ?? new Date();
  }

  /**
   * Serializes the event to a plain object.
   */
  public toJSON(): RegionCreatedJSON {
    return {
      eventType: this.eventType,
      regionId: this.regionId,
      regionName: this.regionName,
      regionType: this.regionType,
      timestamp: this.timestamp.toISOString(),
    };
  }
}

/**
 * JSON representation of RegionCreated event.
 */
export interface RegionCreatedJSON {
  eventType: string;
  regionId: string;
  regionName: string;
  regionType: CacheRegionType;
  timestamp: string;
}
