/**
 * MemoryCacheEngine Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryCacheEngine } from '../services/MemoryCacheEngine';

describe('MemoryCacheEngine', () => {
  let cache: MemoryCacheEngine;

  beforeEach(() => {
    cache = new MemoryCacheEngine({
      maxEntries: 100,
      maxMemoryUsage: 10 * 1024 * 1024, // 10MB
      evictionPolicy: 'LRU',
      defaultTtlSeconds: 3600,
    });
  });

  describe('Basic Operations', () => {
    it('should store and retrieve a value', () => {
      cache.set('key1', 'value1');
      const result = cache.get('key1');

      expect(result.hit).toBe(true);
      expect(result.value).toBe('value1');
    });

    it('should return miss for non-existent key', () => {
      const result = cache.get('nonexistent');

      expect(result.hit).toBe(false);
      expect(result.value).toBeUndefined();
    });

    it('should delete a key', () => {
      cache.set('key1', 'value1');
      const deleted = cache.delete('key1');

      expect(deleted).toBe(true);
      expect(cache.get('key1').hit).toBe(false);
    });

    it('should return false when deleting non-existent key', () => {
      const deleted = cache.delete('nonexistent');

      expect(deleted).toBe(false);
    });

    it('should check if key exists', () => {
      cache.set('key1', 'value1');

      expect(cache.has('key1')).toBe(true);
      expect(cache.has('nonexistent')).toBe(false);
    });

    it('should clear all entries', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.clear();

      expect(cache.size).toBe(0);
    });
  });

  describe('TTL and Expiration', () => {
    it('should expire entries after TTL', async () => {
      const shortCache = new MemoryCacheEngine({
        defaultTtlSeconds: 1,
      });

      shortCache.set('key1', 'value1');
      expect(shortCache.get('key1').hit).toBe(true);

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect(shortCache.get('key1').hit).toBe(false);
    });

    it('should respect custom TTL per entry', async () => {
      cache.set('key1', 'value1', { ttlSeconds: 1 });

      expect(cache.get('key1').hit).toBe(true);

      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect(cache.get('key1').hit).toBe(false);
    });

    it('should store entries without expiration when no TTL is set', () => {
      const noExpiryCache = new MemoryCacheEngine({
        defaultTtlSeconds: null,
      });

      noExpiryCache.set('key1', 'value1');

      expect(noExpiryCache.get('key1').hit).toBe(true);
    });
  });

  describe('Eviction Policies', () => {
    it('should evict LRU entries when max entries reached', () => {
      const smallCache = new MemoryCacheEngine({
        maxEntries: 3,
        evictionPolicy: 'LRU',
      });

      smallCache.set('key1', 'value1');
      smallCache.set('key2', 'value2');
      smallCache.set('key3', 'value3');

      // Access key1 to make it recently used
      smallCache.get('key1');

      // Add another entry, should evict key2 (LRU)
      smallCache.set('key4', 'value4');

      expect(smallCache.get('key1').hit).toBe(true);
      expect(smallCache.get('key2').hit).toBe(false);
      expect(smallCache.get('key3').hit).toBe(true);
      expect(smallCache.get('key4').hit).toBe(true);
    });

    it('should evict FIFO entries when max entries reached', () => {
      const fifoCache = new MemoryCacheEngine({
        maxEntries: 3,
        evictionPolicy: 'FIFO',
      });

      fifoCache.set('key1', 'value1');
      fifoCache.set('key2', 'value2');
      fifoCache.set('key3', 'value3');

      // Add another entry, should evict key1 (FIFO)
      fifoCache.set('key4', 'value4');

      expect(fifoCache.get('key1').hit).toBe(false);
      expect(fifoCache.get('key2').hit).toBe(true);
      expect(fifoCache.get('key3').hit).toBe(true);
      expect(fifoCache.get('key4').hit).toBe(true);
    });
  });

  describe('Regions', () => {
    it('should store entries with region', () => {
      cache.set('key1', 'value1', { region: 'player' });
      cache.set('key2', 'value2', { region: 'guild' });

      expect(cache.keysInRegion('player')).toContain('key1');
      expect(cache.keysInRegion('guild')).toContain('key2');
    });

    it('should delete all entries in a region', () => {
      cache.set('key1', 'value1', { region: 'player' });
      cache.set('key2', 'value2', { region: 'player' });
      cache.set('key3', 'value3', { region: 'guild' });

      const deleted = cache.deleteRegion('player');

      expect(deleted).toBe(2);
      expect(cache.get('key1').hit).toBe(false);
      expect(cache.get('key2').hit).toBe(false);
      expect(cache.get('key3').hit).toBe(true);
    });
  });

  describe('Versioning', () => {
    it('should return version of cached entry', () => {
      cache.set('key1', 'value1', { version: 5 });

      expect(cache.getVersion('key1')).toBe(5);
    });

    it('should return null for non-existent key version', () => {
      expect(cache.getVersion('nonexistent')).toBeNull();
    });

    it('should increment version', () => {
      cache.set('key1', 'value1', { version: 1 });

      const newVersion = cache.incrementVersion('key1');

      expect(newVersion).toBe(2);
      expect(cache.getVersion('key1')).toBe(2);
    });
  });

  describe('Statistics', () => {
    it('should track hits and misses', () => {
      cache.set('key1', 'value1');

      cache.get('key1'); // hit
      cache.get('key1'); // hit
      cache.get('key2'); // miss

      const stats = cache.getStats();

      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(1);
    });

    it('should calculate hit ratio', () => {
      cache.set('key1', 'value1');

      cache.get('key1');
      cache.get('key1');
      cache.get('key2'); // miss

      expect(cache.getHitRatio()).toBeCloseTo(0.666, 2);
    });

    it('should reset statistics', () => {
      cache.set('key1', 'value1');
      cache.get('key1');

      cache.resetStats();

      const stats = cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
    });
  });

  describe('Pattern Matching', () => {
    it('should get all keys', () => {
      cache.set('user:1', 'value1');
      cache.set('user:2', 'value2');
      cache.set('guild:1', 'value3');

      const allKeys = cache.keys();

      expect(allKeys).toHaveLength(3);
    });

    it('should filter keys by pattern', () => {
      cache.set('user:1', 'value1');
      cache.set('user:2', 'value2');
      cache.set('guild:1', 'value3');

      const userKeys = cache.keys('user:*');

      expect(userKeys).toHaveLength(2);
      expect(userKeys).toContain('user:1');
      expect(userKeys).toContain('user:2');
    });
  });

  describe('Batch Operations', () => {
    it('should set many entries at once', () => {
      cache.setMany([
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
        { key: 'key3', value: 'value3' },
      ]);

      expect(cache.size).toBe(3);
      expect(cache.get('key1').value).toBe('value1');
      expect(cache.get('key2').value).toBe('value2');
      expect(cache.get('key3').value).toBe('value3');
    });
  });

  describe('Lazy Loading', () => {
    it('should load value using loader function on cache miss', () => {
      const loader = vi.fn().mockReturnValue('loadedValue');

      const value = cache.getOrLoad('key1', loader);

      expect(loader).toHaveBeenCalledTimes(1);
      expect(value).toBe('loadedValue');
      expect(cache.get('key1').value).toBe('loadedValue');
    });

    it('should not call loader on cache hit', () => {
      cache.set('key1', 'existingValue');
      const loader = vi.fn().mockReturnValue('loadedValue');

      const value = cache.getOrLoad('key1', loader);

      expect(loader).not.toHaveBeenCalled();
      expect(value).toBe('existingValue');
    });
  });

  describe('Version Invalidation', () => {
    it('should invalidate by version', () => {
      cache.set('key1', 'value1', { version: 1 });
      cache.set('key2', 'value2', { version: 1 });
      cache.set('key3', 'value3', { version: 2 });

      const count = cache.invalidateByVersion(1);

      expect(count).toBe(2);
      expect(cache.has('key1')).toBe(false);
      expect(cache.has('key2')).toBe(false);
      expect(cache.has('key3')).toBe(true);
    });

    it('should invalidate by minimum version', () => {
      cache.set('key1', 'value1', { version: 1 });
      cache.set('key2', 'value2', { version: 2 });
      cache.set('key3', 'value3', { version: 3 });

      const count = cache.invalidateByMinVersion(2);

      expect(count).toBe(2);
      expect(cache.has('key1')).toBe(true);
      expect(cache.has('key2')).toBe(false);
      expect(cache.has('key3')).toBe(false);
    });
  });
});
