/**
 * ICacheRegion Interface
 *
 * Interface defining the contract for CacheRegion entities.
 */

import type { RegionId } from '../value-objects/RegionId';
import type { CacheRegionType } from '../types/CacheRegionType';
import type { CacheRegionMetadata } from '../types/CacheMetadata';

/**
 * CacheRegion interface.
 * Defines the contract for cache region entities.
 */
export interface ICacheRegion {
  /** Unique region identifier */
  readonly regionId: RegionId;

  /** Display name of the region */
  readonly regionName: string;

  /** Type of region */
  readonly regionType: CacheRegionType;

  /** Region description */
  readonly description: string;

  /** Whether the region is enabled */
  readonly enabled: boolean;

  /** Additional metadata */
  readonly metadata: CacheRegionMetadata;

  /** Whether the region is enabled */
  readonly isEnabled: boolean;

  /** Whether the region is disabled */
  readonly isDisabled: boolean;
}
