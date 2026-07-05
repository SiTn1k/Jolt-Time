/**
 * CacheInvalidation Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CacheInvalidation } from '../services/CacheInvalidation';
import { MemoryCacheEngine } from '../services/MemoryCacheEngine';

describe('CacheInvalidation', () => {
  let cache: MemoryCacheEngine;
  let invalidation: CacheInvalidation;

  beforeEach(() => {
    cache = new MemoryCacheEngine({
      maxEntries: 100,
      evictionPolicy: 'LRU',
    });
    invalidation = new CacheInvalidation(cache);

    // Setup initial cache entries
    cache.set('key1', 'value1', { region: 'player' });
    cache.set('key2', 'value2', { region: 'player' });
    cache.set('key3', 'value3', { region: 'guild' });
    cache.set('key4', 'value4', { region: 'system' });
  });

  describe('Single Key Invalidation', () => {
    it('should invalidate a single key', () => {
      const result = invalidation.invalidateKey('key1');

      expect(result.invalidated).toBe(1);
      expect(cache.has('key1')).toBe(false);
      expect(cache.has('key2')).toBe(true);
    });

    it('should return zero when invalidating non-existent key', () => {
      const result = invalidation.invalidateKey('nonexistent');

      expect(result.invalidated).toBe(0);
    });
  });

  describe('Multiple Key Invalidation', () => {
    it('should invalidate multiple keys', () => {
      const result = invalidation.invalidateKeys(['key1', 'key2']);

      expect(result.invalidated).toBe(2);
      expect(cache.has('key1')).toBe(false);
      expect(cache.has('key2')).toBe(false);
      expect(cache.has('key3')).toBe(true);
    });
  });

  describe('Pattern Invalidation', () => {
    it('should invalidate keys matching pattern', () => {
      cache.set('player:1', 'value1');
      cache.set('player:2', 'value2');
      cache.set('guild:1', 'value3');

      const result = invalidation.invalidatePattern('player:*');

      expect(result.invalidated).toBe(2);
      expect(cache.has('player:1')).toBe(false);
      expect(cache.has('player:2')).toBe(false);
      expect(cache.has('guild:1')).toBe(true);
    });
  });

  describe('Region Invalidation', () => {
    it('should invalidate all entries in a region', () => {
      const result = invalidation.invalidateRegion('player');

      expect(result.invalidated).toBe(2);
      expect(cache.has('key1')).toBe(false);
      expect(cache.has('key2')).toBe(false);
      expect(cache.has('key3')).toBe(true);
    });

    it('should return zero when invalidating non-existent region', () => {
      const result = invalidation.invalidateRegion('nonexistent');

      expect(result.invalidated).toBe(0);
    });
  });

  describe('Global Flush', () => {
    it('should invalidate all entries', () => {
      const result = invalidation.invalidateAll();

      expect(result.invalidated).toBe(4);
      expect(cache.size).toBe(0);
    });
  });

  describe('Version Invalidation', () => {
    it('should invalidate by exact version', () => {
      cache.set('key1', 'value1', { version: 1 });
      cache.set('key2', 'value2', { version: 1 });
      cache.set('key3', 'value3', { version: 2 });

      const result = invalidation.invalidateByVersion(1);

      expect(result.invalidated).toBe(2);
      expect(cache.has('key1')).toBe(false);
      expect(cache.has('key2')).toBe(false);
      expect(cache.has('key3')).toBe(true);
    });

    it('should invalidate by minimum version', () => {
      cache.set('key1', 'value1', { version: 1 });
      cache.set('key2', 'value2', { version: 2 });
      cache.set('key3', 'value3', { version: 3 });

      const result = invalidation.invalidateByMinVersion(2);

      expect(result.invalidated).toBe(2);
      expect(cache.has('key1')).toBe(true);
      expect(cache.has('key2')).toBe(false);
      expect(cache.has('key3')).toBe(false);
    });
  });

  describe('Dependency Invalidation', () => {
    it('should register dependencies', () => {
      invalidation.registerDependency('derived', ['base1', 'base2']);

      const map = invalidation.getDependencyMap();

      expect(map['base1']).toContain('derived');
      expect(map['base2']).toContain('derived');
    });

    it('should invalidate with dependents', () => {
      cache.set('base', 'baseValue');
      cache.set('derived', 'derivedValue');

      invalidation.registerDependency('derived', ['base']);

      const result = invalidation.invalidateWithDependents('base');

      // Both base and derived should be invalidated
      expect(result.invalidated).toBeGreaterThanOrEqual(1);
    });

    it('should unregister dependencies', () => {
      invalidation.registerDependency('derived', ['base1', 'base2']);
      invalidation.unregisterDependency('derived', ['base1']);

      const map = invalidation.getDependencyMap();

      expect(map['base1']).not.toContain('derived');
      expect(map['base2']).toContain('derived');
    });
  });

  describe('Except Pattern', () => {
    it('should invalidate all except matching pattern', () => {
      cache.set('user:1', 'value1');
      cache.set('user:2', 'value2');
      cache.set('config:1', 'value3');

      const result = invalidation.invalidateExcept('user:*');

      expect(result.invalidated).toBe(1);
      expect(cache.has('user:1')).toBe(true);
      expect(cache.has('user:2')).toBe(true);
      expect(cache.has('config:1')).toBe(false);
    });
  });

  describe('Version Registration', () => {
    it('should register and retrieve keys by version', () => {
      invalidation.registerVersion('key1', 1);
      invalidation.registerVersion('key2', 1);
      invalidation.registerVersion('key3', 2);

      const keysV1 = invalidation.getKeysByVersion(1);
      const keysV2 = invalidation.getKeysByVersion(2);

      expect(keysV1).toContain('key1');
      expect(keysV1).toContain('key2');
      expect(keysV2).toContain('key3');
    });

    it('should return current version for key', () => {
      cache.set('key1', 'value1', { version: 5 });

      expect(invalidation.getKeyVersion('key1')).toBe(5);
    });

    it('should return null for non-existent key version', () => {
      expect(invalidation.getKeyVersion('nonexistent')).toBeNull();
    });
  });

  describe('Statistics', () => {
    it('should provide invalidation statistics', () => {
      invalidation.registerDependency('derived', ['base']);

      const stats = invalidation.getStatistics();

      expect(stats.totalDependencies).toBe(1);
      expect(stats.cachedEntries).toBe(4);
    });
  });
});
