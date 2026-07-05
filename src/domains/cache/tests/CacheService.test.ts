/**
 * CacheService Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CacheService } from '../services/CacheService';
import { MemoryCacheEngine } from '../services/MemoryCacheEngine';
import { TTLEngine } from '../services/TTLEngine';
import { CacheInvalidation } from '../services/CacheInvalidation';
import { CacheMapper } from '../mappers/CacheMapper';
import { RegionMapper } from '../mappers/RegionMapper';
import { StatisticsMapper } from '../mappers/StatisticsMapper';
import type { ICacheRepository } from '../interfaces/ICacheRepository';
import type { CacheEntry } from '../entities/CacheEntry';
import { CacheKey } from '../value-objects/CacheKey';

describe('CacheService', () => {
  let cache: MemoryCacheEngine;
  let ttlEngine: TTLEngine;
  let invalidation: CacheInvalidation;
  let cacheMapper: CacheMapper;
  let regionMapper: RegionMapper;
  let statisticsMapper: StatisticsMapper;
  let mockRepository: ICacheRepository;
  let cacheService: CacheService;

  beforeEach(() => {
    cache = new MemoryCacheEngine({
      maxEntries: 100,
      evictionPolicy: 'LRU',
      defaultTtlSeconds: 3600,
    });

    ttlEngine = new TTLEngine();
    invalidation = new CacheInvalidation(cache);
    cacheMapper = new CacheMapper();
    regionMapper = new RegionMapper();
    statisticsMapper = new StatisticsMapper();

    mockRepository = {
      createEntry: vi.fn(),
      findEntryByKey: vi.fn(),
      listEntries: vi.fn(),
      countEntries: vi.fn(),
      updateEntry: vi.fn(),
      deleteEntry: vi.fn(),
      deleteEntries: vi.fn(),
      createRegion: vi.fn(),
      findRegionById: vi.fn(),
      findRegionByName: vi.fn(),
      listRegions: vi.fn(),
      countRegions: vi.fn(),
      updateRegion: vi.fn(),
      deleteRegion: vi.fn(),
      createStatistics: vi.fn(),
      findStatisticsById: vi.fn(),
      listStatistics: vi.fn(),
      countStatistics: vi.fn(),
      updateStatistics: vi.fn(),
      deleteStatistics: vi.fn(),
    };

    cacheService = new CacheService(
      mockRepository,
      cache,
      ttlEngine,
      invalidation,
      cacheMapper,
      regionMapper,
      statisticsMapper,
      {
        enableWriteThrough: true,
        enableReadThrough: true,
        defaultTTLSeconds: 3600,
      }
    );
  });

  describe('Store Operation', () => {
    it('should store value in memory cache', async () => {
      const result = await cacheService.store('key1', 'value1');

      expect(result.success).toBe(true);
      expect(result.source).toBe('cache');
      expect(cacheService.has('key1')).toBe(true);
    });

    it('should store with TTL', async () => {
      await cacheService.store('key1', 'value1', { ttlSeconds: 1800 });

      expect(cacheService.has('key1')).toBe(true);
    });

    it('should store with region', async () => {
      await cacheService.store('key1', 'value1', { region: 'player' });

      expect(cacheService.has('key1')).toBe(true);
    });

    it('should write-through to repository', async () => {
      await cacheService.store('key1', 'value1');

      expect(mockRepository.createEntry).toHaveBeenCalled();
    });
  });

  describe('Load Operation', () => {
    it('should load from memory cache on hit', async () => {
      await cacheService.store('key1', 'value1');

      const result = await cacheService.load('key1');

      expect(result.success).toBe(true);
      expect(result.source).toBe('cache');
      expect(result.data).toBe('value1');
    });

    it('should load from repository on cache miss', async () => {
      const mockEntry = {
        cacheKey: CacheKey.create('key1'),
        cacheValue: 'value1',
        cacheType: 'memory' as const,
        status: 'active' as const,
        createdAt: new Date(),
        expiresAt: null,
        version: 1,
        metadata: { description: '', tags: [], source: undefined, createdBy: undefined, lastAccessedAt: undefined, accessCount: 0, customFields: {} },
      };

      (mockRepository.findEntryByKey as ReturnType<typeof vi.fn>).mockResolvedValue(mockEntry);

      const result = await cacheService.load('key1');

      expect(result.success).toBe(true);
      expect(result.source).toBe('repository');
      expect(result.data).toBe('value1');
    });

    it('should use loader on cache and repository miss', async () => {
      const loader = vi.fn().mockResolvedValue('loadedValue');

      const result = await cacheService.load('key1', loader);

      expect(result.success).toBe(true);
      expect(result.source).toBe('loader');
      expect(result.data).toBe('loadedValue');
      expect(loader).toHaveBeenCalled();
    });

    it('should return failure on complete miss', async () => {
      const result = await cacheService.load('nonexistent');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Cache miss');
    });
  });

  describe('Refresh Operation', () => {
    it('should invalidate and reload', async () => {
      await cacheService.store('key1', 'value1');
      const loader = vi.fn().mockResolvedValue('newValue');

      const result = await cacheService.refresh('key1', loader);

      expect(cacheService.has('key1')).toBe(true);
    });
  });

  describe('Invalidation', () => {
    it('should invalidate single key', async () => {
      await cacheService.store('key1', 'value1');

      const result = cacheService.invalidate('key1');

      expect(result.invalidated).toBe(1);
      expect(cacheService.has('key1')).toBe(false);
    });

    it('should invalidate region', async () => {
      await cacheService.store('key1', 'value1', { region: 'player' });
      await cacheService.store('key2', 'value2', { region: 'player' });

      const result = cacheService.invalidateRegion('player');

      expect(result.invalidated).toBe(2);
    });

    it('should invalidate all', async () => {
      await cacheService.store('key1', 'value1');
      await cacheService.store('key2', 'value2');

      const result = cacheService.invalidateAll();

      expect(result.invalidated).toBeGreaterThanOrEqual(2);
      expect(cacheService.size).toBe(0);
    });

    it('should invalidate by version', async () => {
      await cacheService.store('key1', 'value1', { version: 1 });
      await cacheService.store('key2', 'value2', { version: 2 });

      const result = cacheService.invalidateByVersion(1);

      expect(result.invalidated).toBe(1);
    });
  });

  describe('Delete Operation', () => {
    it('should delete from cache and repository', async () => {
      await cacheService.store('key1', 'value1');

      const deleted = await cacheService.delete('key1');

      expect(deleted).toBe(true);
      expect(cacheService.has('key1')).toBe(false);
      expect(mockRepository.deleteEntry).toHaveBeenCalled();
    });
  });

  describe('Statistics', () => {
    it('should track hit ratio', async () => {
      await cacheService.store('key1', 'value1');
      await cacheService.load('key1');
      await cacheService.load('key2'); // miss

      const hitRatio = cacheService.getHitRatio();

      expect(hitRatio).toBeCloseTo(0.5, 1);
    });

    it('should return memory stats', async () => {
      await cacheService.store('key1', 'value1');

      const stats = cacheService.getMemoryStats();

      expect(stats.totalEntries).toBeGreaterThanOrEqual(1);
    });

    it('should reset statistics', async () => {
      await cacheService.store('key1', 'value1');
      await cacheService.load('key1');

      cacheService.resetStats();

      expect(cacheService.getHitRatio()).toBe(0);
    });
  });

  describe('Region Summary', () => {
    it('should return region summary', async () => {
      await cacheService.store('key1', 'value1', { region: 'player' });
      await cacheService.store('key2', 'value2', { region: 'guild' });

      const summary = cacheService.getRegionSummary();

      expect(summary.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Health Check', () => {
    it('should report healthy when cache is operational', () => {
      expect(cacheService.isHealthy()).toBe(true);
    });
  });

  describe('Batch Operations', () => {
    it('should store many entries', async () => {
      await cacheService.storeMany([
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
        { key: 'key3', value: 'value3' },
      ]);

      expect(cacheService.size).toBe(3);
    });
  });

  describe('Failure Handling', () => {
    it('should handle repository failure gracefully on store', async () => {
      (mockRepository.createEntry as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('DB Error'));

      const result = await cacheService.store('key1', 'value1');

      // Should still succeed - cache is primary
      expect(result.success).toBe(true);
      expect(cacheService.has('key1')).toBe(true);
    });

    it('should handle repository failure gracefully on load', async () => {
      (mockRepository.findEntryByKey as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('DB Error'));

      const loader = vi.fn().mockResolvedValue('fallbackValue');
      const result = await cacheService.load('key1', loader);

      // Should fall back to loader
      expect(result.success).toBe(true);
      expect(result.data).toBe('fallbackValue');
    });
  });
});
