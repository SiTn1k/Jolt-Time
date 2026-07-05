/**
 * CacheType
 *
 * Type definitions for cache entry types.
 * Defines what categories of data can be cached.
 */

/**
 * Supported cache types.
 * Each type represents a category of data that can be cached.
 */
export type CacheType =
  | 'memory'
  | 'configuration'
  | 'player'
  | 'museum'
  | 'quest'
  | 'guild'
  | 'analytics'
  | 'temporary';

/**
 * Display names for cache types.
 */
export const CACHE_TYPE_DISPLAY: Record<CacheType, string> = {
  memory: 'Memory',
  configuration: 'Configuration',
  player: 'Player',
  museum: 'Museum',
  quest: 'Quest',
  guild: 'Guild',
  analytics: 'Analytics',
  temporary: 'Temporary',
} as const;

/**
 * Descriptions for cache types.
 */
export const CACHE_TYPE_DESCRIPTIONS: Record<CacheType, string> = {
  memory: 'In-memory session cache',
  configuration: 'Application configuration cache',
  player: 'Player-specific data cache',
  museum: 'Museum-related data cache',
  quest: 'Quest data cache',
  guild: 'Guild data cache',
  analytics: 'Analytics data cache',
  temporary: 'Temporary transient cache',
} as const;

/**
 * Checks if a cache type is a persistent type (stored in database).
 */
export function isPersistentCacheType(type: CacheType): boolean {
  return ['player', 'museum', 'quest', 'guild'].includes(type);
}

/**
 * Checks if a cache type is a session type (short-lived).
 */
export function isSessionCacheType(type: CacheType): boolean {
  return ['memory', 'temporary'].includes(type);
}

/**
 * Checks if a cache type is a configuration type.
 */
export function isConfigurationCacheType(type: CacheType): boolean {
  return type === 'configuration';
}

/**
 * Gets all cache types that should be persisted.
 */
export function getPersistentCacheTypes(): CacheType[] {
  return ['player', 'museum', 'quest', 'guild', 'analytics', 'configuration'];
}

/**
 * Gets all cache types that are typically short-lived.
 */
export function getSessionCacheTypes(): CacheType[] {
  return ['memory', 'temporary'];
}
