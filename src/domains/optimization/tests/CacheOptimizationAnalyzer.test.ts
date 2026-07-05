/**
 * Cache Optimization Analyzer Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CacheOptimizationAnalyzer } from '../services/CacheOptimizationAnalyzer';

describe('CacheOptimizationAnalyzer', () => {
  let analyzer: CacheOptimizationAnalyzer;

  beforeEach(() => {
    analyzer = new CacheOptimizationAnalyzer({
      hitRatioThreshold: 0.8,
      missRatioThreshold: 0.3,
      slowAccessThresholdMs: 50,
      maxRecommendations: 10,
    });
  });

  describe('Recording Methods', () => {
    it('should record cache hits', () => {
      analyzer.recordHit('key1', 'region1');
      analyzer.recordHit('key2', 'region1');

      expect(analyzer.getTotalHits()).toBe(2);
    });

    it('should record cache misses', () => {
      analyzer.recordMiss('key1', 'region1');
      analyzer.recordMiss('key2', 'region2');

      expect(analyzer.getTotalMisses()).toBe(2);
    });

    it('should register cache entries', () => {
      analyzer.registerEntry({
        key: 'key1',
        region: 'region1',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 60000),
        sizeBytes: 1024,
      });

      const entry = analyzer.getEntry('key1');
      expect(entry).toBeDefined();
      expect(entry?.sizeBytes).toBe(1024);
    });

    it('should remove cache entries', () => {
      analyzer.registerEntry({
        key: 'key1',
        region: 'region1',
        createdAt: new Date(),
        expiresAt: null,
        sizeBytes: 1024,
      });

      analyzer.removeEntry('key1');

      const entry = analyzer.getEntry('key1');
      expect(entry).toBeUndefined();
    });
  });

  describe('Analysis Methods', () => {
    it('should calculate hit ratio correctly', () => {
      for (let i = 0; i < 8; i++) {
        analyzer.recordHit(`key${i}`, 'region1');
      }
      for (let i = 0; i < 2; i++) {
        analyzer.recordMiss(`miss${i}`, 'region1');
      }

      expect(analyzer.getHitRatio()).toBeCloseTo(0.8, 2);
    });

    it('should calculate miss ratio correctly', () => {
      for (let i = 0; i < 3; i++) {
        analyzer.recordHit(`key${i}`, 'region1');
      }
      for (let i = 0; i < 7; i++) {
        analyzer.recordMiss(`miss${i}`, 'region1');
      }

      expect(analyzer.getMissRatio()).toBeCloseTo(0.7, 2);
    });

    it('should calculate region statistics', () => {
      analyzer.recordHit('key1', 'region1', 5);
      analyzer.recordHit('key2', 'region1', 10);
      analyzer.recordMiss('key3', 'region1', 50);

      const regionStats = analyzer.calculateRegionStats();

      expect(regionStats.length).toBe(1);
      expect(regionStats[0].hitCount).toBe(2);
      expect(regionStats[0].missCount).toBe(1);
      expect(regionStats[0].hitRatio).toBeCloseTo(0.666, 2);
    });

    it('should calculate lifetime statistics', () => {
      analyzer.registerEntry({
        key: 'key1',
        region: 'region1',
        createdAt: new Date(Date.now() - 30000),
        expiresAt: new Date(Date.now() + 30000),
        sizeBytes: 1024,
      });

      const lifetimeStats = analyzer.calculateLifetimeStats();

      expect(lifetimeStats.activeCount).toBe(1);
      expect(lifetimeStats.averageLifetime).toBeGreaterThan(0);
    });
  });

  describe('Full Analysis', () => {
    it('should perform full analysis', () => {
      analyzer.recordHit('key1', 'region1', 5);
      analyzer.recordHit('key2', 'region1', 10);
      analyzer.recordMiss('key3', 'region1', 50);

      const result = analyzer.analyze();

      expect(result.totalHits).toBe(2);
      expect(result.totalMisses).toBe(1);
      expect(result.hitRatio).toBeCloseTo(0.666, 2);
      expect(result.regionStats.length).toBe(1);
      expect(result.lifetimeStats).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(result.analyzedAt).toBeInstanceOf(Date);
    });

    it('should calculate average response times', () => {
      analyzer.recordHit('key1', 'region1', 5);
      analyzer.recordHit('key2', 'region1', 15);
      analyzer.recordMiss('key3', 'region1', 50);

      const result = analyzer.analyze();

      expect(result.averageHitTime).toBe(10);
      expect(result.averageMissTime).toBe(50);
    });
  });

  describe('Recommendations', () => {
    it('should recommend for low hit ratio', () => {
      // Record 2 hits and 8 misses (20% hit ratio, below 80% threshold)
      for (let i = 0; i < 2; i++) {
        analyzer.recordHit(`hit${i}`, 'region1');
      }
      for (let i = 0; i < 8; i++) {
        analyzer.recordMiss(`miss${i}`, 'region1');
      }

      const result = analyzer.analyze();

      const lowHitRatioRecs = result.recommendations.filter(
        (r) => r.type === 'LOW_HIT_RATIO'
      );
      expect(lowHitRatioRecs.length).toBeGreaterThan(0);
    });

    it('should recommend for high miss rate', () => {
      // Record 3 hits and 7 misses (70% miss rate, above 30% threshold)
      for (let i = 0; i < 3; i++) {
        analyzer.recordHit(`hit${i}`, 'region1');
      }
      for (let i = 0; i < 7; i++) {
        analyzer.recordMiss(`miss${i}`, 'region1');
      }

      const result = analyzer.analyze();

      const highMissRecs = result.recommendations.filter(
        (r) => r.type === 'HIGH_MISS_RATE'
      );
      expect(highMissRecs.length).toBeGreaterThan(0);
    });

    it('should recommend for slow region response', () => {
      // Record many accesses with slow response time
      for (let i = 0; i < 150; i++) {
        analyzer.recordHit(`key${i}`, 'slow_region', 100);
      }

      const result = analyzer.analyze();

      const slowRegionRecs = result.recommendations.filter(
        (r) => r.type === 'COLD_START' && r.regionName === 'slow_region'
      );
      expect(slowRegionRecs.length).toBeGreaterThan(0);
    });
  });

  describe('Utility Methods', () => {
    it('should get total access count', () => {
      analyzer.recordHit('key1', 'region1');
      analyzer.recordMiss('key2', 'region1');

      expect(analyzer.getTotalAccessCount()).toBe(2);
    });

    it('should get unique key count', () => {
      analyzer.registerEntry({
        key: 'key1',
        region: 'region1',
        createdAt: new Date(),
        expiresAt: null,
        sizeBytes: 1024,
      });

      analyzer.registerEntry({
        key: 'key2',
        region: 'region1',
        createdAt: new Date(),
        expiresAt: null,
        sizeBytes: 2048,
      });

      expect(analyzer.getUniqueKeyCount()).toBe(2);
    });

    it('should clear all data', () => {
      analyzer.recordHit('key1', 'region1');
      analyzer.recordMiss('key2', 'region1');

      analyzer.clear();

      expect(analyzer.getTotalAccessCount()).toBe(0);
    });

    it('should return current config', () => {
      const config = analyzer.getConfig();

      expect(config.hitRatioThreshold).toBe(0.8);
      expect(config.missRatioThreshold).toBe(0.3);
      expect(config.slowAccessThresholdMs).toBe(50);
    });

    it('should get entries by region', () => {
      analyzer.registerEntry({
        key: 'key1',
        region: 'region1',
        createdAt: new Date(),
        expiresAt: null,
        sizeBytes: 1024,
      });

      analyzer.registerEntry({
        key: 'key2',
        region: 'region2',
        createdAt: new Date(),
        expiresAt: null,
        sizeBytes: 2048,
      });

      const entries = analyzer.getEntriesByRegion('region1');
      expect(entries.length).toBe(1);
      expect(entries[0].key).toBe('key1');
    });
  });
});
