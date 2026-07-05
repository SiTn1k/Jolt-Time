/**
 * CacheRegionType
 *
 * Type definitions for cache region types.
 * Defines the categories of cache regions.
 */

/**
 * Supported cache region types.
 */
export type CacheRegionType =
  | 'system'
  | 'session'
  | 'player'
  | 'guild'
  | 'global';

/**
 * Display names for cache region types.
 */
export const CACHE_REGION_TYPE_DISPLAY: Record<CacheRegionType, string> = {
  system: 'System',
  session: 'Session',
  player: 'Player',
  guild: 'Guild',
  global: 'Global',
} as const;

/**
 * Descriptions for cache region types.
 */
export const CACHE_REGION_TYPE_DESCRIPTIONS: Record<CacheRegionType, string> = {
  system: 'System-level cache regions',
  session: 'User session cache regions',
  player: 'Player-specific cache regions',
  guild: 'Guild-specific cache regions',
  global: 'Global shared cache regions',
} as const;

/**
 * Checks if a region type is user-scoped.
 */
export function isUserScopedRegionType(type: CacheRegionType): boolean {
  return ['session', 'player'].includes(type);
}

/**
 * Checks if a region type is community-scoped.
 */
export function isCommunityScopedRegionType(type: CacheRegionType): boolean {
  return type === 'guild';
}

/**
 * Checks if a region type is system-scoped.
 */
export function isSystemScopedRegionType(type: CacheRegionType): boolean {
  return type === 'system';
}

/**
 * Checks if a region type is global (shared across all users).
 */
export function isGlobalRegionType(type: CacheRegionType): boolean {
  return type === 'global';
}
