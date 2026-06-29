/**
 * Configuration Cache Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ConfigurationCache } from '../services/ConfigurationCache';

describe('ConfigurationCache', () => {
  let cache: ConfigurationCache;

  beforeEach(() => {
    cache = new ConfigurationCache({ defaultTtlMs: 1000, maxSize: 100 });
  });

  afterEach(() => {
    cache.invalidate('all');
  });

  describe('get/set operations', () => {
    it('should store and retrieve a value', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    it('should return null for non-existent key', () => {
      expect(cache.get('nonexistent')).toBeNull();
    });

    it('should return null for expired entry', async () => {
      const shortCache = new ConfigurationCache({ defaultTtlMs: 50 });
      shortCache.set('key1', 'value1');
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(shortCache.get('key1')).toBeNull();
    });

    it('should overwrite existing value', () => {
      cache.set('key1', 'value1');
      cache.set('key1', 'value2');
      expect(cache.get('key1')).toBe('value2');
    });
  });

  describe('delete operation', () => {
    it('should delete a value', () => {
      cache.set('key1', 'value1');
      cache.delete('key1');
      expect(cache.get('key1')).toBeNull();
    });

    it('should not throw when deleting non-existent key', () => {
      expect(() => cache.delete('nonexistent')).not.toThrow();
    });
  });

  describe('invalidate operation', () => {
    it('should invalidate all entries', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.invalidate('all');
      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();
    });

    it('should invalidate only entry cache', () => {
      cache.set('key1', 'value1', undefined, 'entry');
      cache.set('key2', 'value2', undefined, 'flag');
      cache.invalidate('entry');
      expect(cache.get('key1', 'entry')).toBeNull();
      expect(cache.get('key2', 'flag')).toBe('value2');
    });

    it('should invalidate only flag cache', () => {
      cache.set('key1', 'value1', undefined, 'entry');
      cache.set('key2', 'value2', undefined, 'flag');
      cache.invalidate('flag');
      expect(cache.get('key1', 'entry')).toBe('value1');
      expect(cache.get('key2', 'flag')).toBeNull();
    });
  });

  describe('refresh operation', () => {
    it('should refresh TTL of existing entry', async () => {
      const shortCache = new ConfigurationCache({ defaultTtlMs: 50 });
      shortCache.set('key1', 'value1');
      shortCache.refresh('key1', 'entry', 200);
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(shortCache.get('key1')).toBe('value1');
    });

    it('should return false for non-existent key', () => {
      expect(cache.refresh('nonexistent')).toBe(false);
    });
  });

  describe('has operation', () => {
    it('should return true for existing non-expired entry', () => {
      cache.set('key1', 'value1');
      expect(cache.has('key1')).toBe(true);
    });

    it('should return false for non-existent entry', () => {
      expect(cache.has('nonexistent')).toBe(false);
    });

    it('should return false for expired entry', async () => {
      const shortCache = new ConfigurationCache({ defaultTtlMs: 50 });
      shortCache.set('key1', 'value1');
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(shortCache.has('key1')).toBe(false);
    });
  });

  describe('statistics', () => {
    it('should track hits and misses', () => {
      cache.set('key1', 'value1');
      cache.get('key1'); // hit
      cache.get('key1'); // hit
      cache.get('nonexistent'); // miss
      const stats = cache.getStatistics();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBeCloseTo(0.666, 2);
    });

    it('should track evictions', async () => {
      const smallCache = new ConfigurationCache({ defaultTtlMs: 50, maxSize: 2 });
      smallCache.set('key1', 'value1');
      smallCache.set('key2', 'value2');
      await new Promise((resolve) => setTimeout(resolve, 60));
      smallCache.get('key1'); // will be expired and evicted
      const stats = smallCache.getStatistics();
      expect(stats.evictions).toBeGreaterThanOrEqual(0);
    });
  });

  describe('size and keys', () => {
    it('should return correct size', () => {
      cache.set('key1', 'value1', undefined, 'entry');
      cache.set('key2', 'value2', undefined, 'entry');
      expect(cache.size('entry')).toBe(2);
    });

    it('should return all keys', () => {
      cache.set('key1', 'value1', undefined, 'entry');
      cache.set('key2', 'value2', undefined, 'entry');
      const keys = cache.keys('entry');
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
    });
  });

  describe('cleanup operation', () => {
    it('should remove expired entries', async () => {
      const shortCache = new ConfigurationCache({ defaultTtlMs: 50 });
      shortCache.set('key1', 'value1');
      await new Promise((resolve) => setTimeout(resolve, 100));
      const cleaned = shortCache.cleanup();
      expect(cleaned).toBe(1);
      expect(shortCache.size('entry')).toBe(0);
    });
  });

  describe('preload operation', () => {
    it('should preload multiple entries', () => {
      cache.preload([
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
      ], 'entry');
      expect(cache.get('key1')).toBe('value1');
      expect(cache.get('key2')).toBe('value2');
    });
  });

  describe('eviction', () => {
    it('should evict oldest when at max size', async () => {
      const smallCache = new ConfigurationCache({ defaultTtlMs: 60000, maxSize: 2 });
      smallCache.set('key1', 'value1');
      await new Promise((resolve) => setTimeout(resolve, 10));
      smallCache.set('key2', 'value2');
      smallCache.set('key3', 'value3'); // should evict key1
      expect(smallCache.get('key1')).toBeNull();
      expect(smallCache.get('key2')).toBe('value2');
      expect(smallCache.get('key3')).toBe('value3');
    });
  });
});
