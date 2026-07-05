/**
 * Cache Invalidation Service
 *
 * Handles cache invalidation strategies including:
 * - Single Key Invalidation
 * - Whole Region Invalidation
 * - Global Flush
 * - Version Invalidation
 * - Dependency Invalidation
 *
 * IMPORTANT: Cache is a METADATA management layer. It ONLY stores cache entries,
 * regions, and statistics. Cache MUST NEVER modify gameplay, grant rewards,
 * modify balances, modify inventory, or execute business logic.
 */

import type { MemoryCacheEngine } from './MemoryCacheEngine';

/**
 * Invalidation reason.
 */
export type InvalidationReason = 
  | 'manual'
  | 'ttl_expired'
  | 'version_changed'
  | 'dependency_changed'
  | 'memory_pressure'
  | 'region_cleared'
  | 'global_flush';

/**
 * Invalidation result.
 */
export interface InvalidationResult {
  invalidated: number;
  reason: InvalidationReason;
  timestamp: Date;
  details?: string;
}

/**
 * Dependency key mapping.
 */
export interface DependencyMap {
  [key: string]: string[];
}

/**
 * Cache Invalidation Service.
 * Manages various cache invalidation strategies.
 */
export class CacheInvalidation {
  private readonly _cache: MemoryCacheEngine;
  private readonly _dependencyMap: DependencyMap;
  private readonly _versionIndex: Map<number, Set<string>>;

  constructor(cache: MemoryCacheEngine) {
    this._cache = cache;
    this._dependencyMap = {};
    this._versionIndex = new Map();
  }

  /**
   * Invalidate a single key.
   */
  public invalidateKey(key: string, reason: InvalidationReason = 'manual'): InvalidationResult {
    const existed = this._cache.delete(key);

    return {
      invalidated: existed ? 1 : 0,
      reason,
      timestamp: new Date(),
      details: `Key: ${key}`,
    };
  }

  /**
   * Invalidate multiple keys.
   */
  public invalidateKeys(keys: string[], reason: InvalidationReason = 'manual'): InvalidationResult {
    let count = 0;

    for (const key of keys) {
      if (this._cache.delete(key)) {
        count++;
      }
    }

    return {
      invalidated: count,
      reason,
      timestamp: new Date(),
      details: `Keys: ${keys.length}`,
    };
  }

  /**
   * Invalidate all keys matching a pattern.
   */
  public invalidatePattern(pattern: string, reason: InvalidationReason = 'manual'): InvalidationResult {
    const keys = this._cache.keys(pattern);
    let count = 0;

    for (const key of keys) {
      if (this._cache.delete(key)) {
        count++;
      }
    }

    return {
      invalidated: count,
      reason,
      timestamp: new Date(),
      details: `Pattern: ${pattern}`,
    };
  }

  /**
   * Invalidate all entries in a region.
   */
  public invalidateRegion(regionName: string, reason: InvalidationReason = 'region_cleared'): InvalidationResult {
    const count = this._cache.deleteRegion(regionName);

    return {
      invalidated: count,
      reason,
      timestamp: new Date(),
      details: `Region: ${regionName}`,
    };
  }

  /**
   * Invalidate all cache entries (global flush).
   */
  public invalidateAll(reason: InvalidationReason = 'global_flush'): InvalidationResult {
    const stats = this._cache.getStats();
    const totalEntries = stats.totalEntries;

    this._cache.clear();
    // Clear dependency map
    for (const key of Object.keys(this._dependencyMap)) {
      delete this._dependencyMap[key];
    }
    this._versionIndex.clear();

    return {
      invalidated: totalEntries,
      reason,
      timestamp: new Date(),
      details: 'Global flush',
    };
  }

  /**
   * Invalidate by version.
   */
  public invalidateByVersion(version: number, reason: InvalidationReason = 'version_changed'): InvalidationResult {
    const count = this._cache.invalidateByVersion(version);

    return {
      invalidated: count,
      reason,
      timestamp: new Date(),
      details: `Version: ${version}`,
    };
  }

  /**
   * Invalidate by minimum version.
   */
  public invalidateByMinVersion(minVersion: number, reason: InvalidationReason = 'version_changed'): InvalidationResult {
    const count = this._cache.invalidateByMinVersion(minVersion);

    return {
      invalidated: count,
      reason,
      timestamp: new Date(),
      details: `MinVersion: ${minVersion}`,
    };
  }

  /**
   * Register a dependency relationship.
   */
  public registerDependency(dependentKey: string, dependencyKeys: string[]): void {
    for (const depKey of dependencyKeys) {
      if (!this._dependencyMap[depKey]) {
        this._dependencyMap[depKey] = [];
      }
      if (!this._dependencyMap[depKey].includes(dependentKey)) {
        this._dependencyMap[depKey].push(dependentKey);
      }
    }
  }

  /**
   * Unregister a dependency relationship.
   */
  public unregisterDependency(dependentKey: string, dependencyKeys: string[]): void {
    for (const depKey of dependencyKeys) {
      if (this._dependencyMap[depKey]) {
        this._dependencyMap[depKey] = this._dependencyMap[depKey].filter((k) => k !== dependentKey);
        if (this._dependencyMap[depKey].length === 0) {
          delete this._dependencyMap[depKey];
        }
      }
    }
  }

  /**
   * Invalidate a key and all its dependents (dependency invalidation).
   */
  public invalidateWithDependents(key: string, reason: InvalidationReason = 'dependency_changed'): InvalidationResult {
    const invalidatedKeys = new Set<string>();
    
    // Invalidate the key itself
    if (this._cache.delete(key)) {
      invalidatedKeys.add(key);
    }

    // Invalidate all dependents recursively
    this._invalidateDependentsRecursive(key, invalidatedKeys);

    // Also invalidate keys that depend on this key
    const dependents = this._dependencyMap[key] || [];
    for (const depKey of dependents) {
      if (this._cache.delete(depKey)) {
        invalidatedKeys.add(depKey);
      }
    }

    return {
      invalidated: invalidatedKeys.size,
      reason,
      timestamp: new Date(),
      details: `Key: ${key}`,
    };
  }

  /**
   * Recursively invalidate dependents.
   */
  private _invalidateDependentsRecursive(key: string, invalidatedKeys: Set<string>): void {
    const dependents = this._dependencyMap[key] || [];

    for (const depKey of dependents) {
      if (!invalidatedKeys.has(depKey)) {
        if (this._cache.delete(depKey)) {
          invalidatedKeys.add(depKey);
        }
        this._invalidateDependentsRecursive(depKey, invalidatedKeys);
      }
    }
  }

  /**
   * Register a version for a key.
   */
  public registerVersion(key: string, version: number): void {
    if (!this._versionIndex.has(version)) {
      this._versionIndex.set(version, new Set());
    }
    this._versionIndex.get(version)!.add(key);
  }

  /**
   * Get all keys with a specific version.
   */
  public getKeysByVersion(version: number): string[] {
    const keys = this._versionIndex.get(version);
    return keys ? Array.from(keys) : [];
  }

  /**
   * Get current version for a key.
   */
  public getKeyVersion(key: string): number | null {
    return this._cache.getVersion(key);
  }

  /**
   * Invalidate all keys except those matching the keepPattern.
   */
  public invalidateExcept(keepPattern: string, reason: InvalidationReason = 'manual'): InvalidationResult {
    const allKeys = this._cache.keys();
    const keepRegex = new RegExp(keepPattern.replace(/\*/g, '.*'));
    let count = 0;

    for (const key of allKeys) {
      if (!keepRegex.test(key)) {
        if (this._cache.delete(key)) {
          count++;
        }
      }
    }

    return {
      invalidated: count,
      reason,
      timestamp: new Date(),
      details: `Except: ${keepPattern}`,
    };
  }

  /**
   * Clean up version index for a key.
   */
  public cleanupVersionIndex(key: string, oldVersion: number): void {
    const versionSet = this._versionIndex.get(oldVersion);
    if (versionSet) {
      versionSet.delete(key);
      if (versionSet.size === 0) {
        this._versionIndex.delete(oldVersion);
      }
    }
  }

  /**
   * Get dependency map.
   */
  public getDependencyMap(): DependencyMap {
    return { ...this._dependencyMap };
  }

  /**
   * Get statistics about invalidation.
   */
  public getStatistics(): {
    totalDependencies: number;
    totalVersions: number;
    cachedEntries: number;
  } {
    let totalDependencies = 0;
    for (const deps of Object.values(this._dependencyMap)) {
      totalDependencies += deps.length;
    }

    return {
      totalDependencies,
      totalVersions: this._versionIndex.size,
      cachedEntries: this._cache.size,
    };
  }
}
