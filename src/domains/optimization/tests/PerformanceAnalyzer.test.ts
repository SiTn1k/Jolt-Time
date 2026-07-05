/**
 * Performance Analyzer Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PerformanceAnalyzer } from '../services/PerformanceAnalyzer';

describe('PerformanceAnalyzer', () => {
  let analyzer: PerformanceAnalyzer;

  beforeEach(() => {
    analyzer = new PerformanceAnalyzer({
      slowQueryThresholdMs: 100,
      maxSamples: 1000,
    });
  });

  describe('Timing Methods', () => {
    it('should start and end timing', () => {
      const result = analyzer.startTiming();
      expect(result.startTime).toBeGreaterThan(0);
      expect(result.endTime).toBe(0);
      expect(result.duration).toBe(0);

      // Small delay to ensure duration > 0
      const start = Date.now();
      while (Date.now() - start < 5) { /* wait */ }
      
      const duration = analyzer.endTiming(result);
      expect(result.endTime).toBeGreaterThanOrEqual(result.startTime);
      expect(duration).toBeGreaterThanOrEqual(0);
    });

    it('should measure function execution time', async () => {
      const { result, duration } = await analyzer.measure(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return 'test';
      });

      expect(result).toBe('test');
      expect(duration).toBeGreaterThanOrEqual(10);
    });

    it('should measure sync function execution time', async () => {
      const { result, duration } = await analyzer.measure(() => {
        return 'sync-test';
      });

      expect(result).toBe('sync-test');
      expect(duration).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Execution Time Statistics', () => {
    it('should record and return execution times', () => {
      analyzer.recordExecutionTime(100);
      analyzer.recordExecutionTime(200);
      analyzer.recordExecutionTime(300);

      const stats = analyzer.getExecutionTimeStats();

      expect(stats.sampleCount).toBe(3);
      expect(stats.min).toBe(100);
      expect(stats.max).toBe(300);
      expect(stats.average).toBe(200);
    });

    it('should calculate percentiles correctly', () => {
      for (let i = 1; i <= 100; i++) {
        analyzer.recordExecutionTime(i);
      }

      const stats = analyzer.getExecutionTimeStats();

      expect(stats.p95).toBe(95);
      expect(stats.p99).toBe(99);
    });

    it('should return zero stats for empty data', () => {
      const stats = analyzer.getExecutionTimeStats();

      expect(stats.sampleCount).toBe(0);
      expect(stats.average).toBe(0);
      expect(stats.min).toBe(0);
      expect(stats.max).toBe(0);
    });
  });

  describe('Memory Statistics', () => {
    it('should record memory usage', () => {
      analyzer.recordMemoryUsage(1024);
      analyzer.recordMemoryUsage(2048);
      analyzer.recordMemoryUsage(3072);

      const stats = analyzer.getMemoryStats();

      expect(stats.sampleCount).toBe(3);
      expect(stats.min).toBe(1024);
      expect(stats.max).toBe(3072);
      expect(stats.average).toBe(2048);
    });

    it('should track peak memory', () => {
      // Record higher values first
      analyzer.recordMemoryUsage(2000);
      analyzer.recordMemoryUsage(1000);
      analyzer.recordMemoryUsage(500);

      const stats = analyzer.getMemoryStats();

      // Peak should track the maximum recorded
      expect(stats.peak).toBeGreaterThanOrEqual(2000);
    });
  });

  describe('CPU Statistics', () => {
    it('should record CPU usage', () => {
      analyzer.recordCpuUsage(50);
      analyzer.recordCpuUsage(75);
      analyzer.recordCpuUsage(100);

      const stats = analyzer.getCpuStats();

      expect(stats.sampleCount).toBe(3);
      expect(stats.average).toBe(75);
      expect(stats.peak).toBe(100);
    });

    it('should clamp CPU usage to 0-100', () => {
      analyzer.recordCpuUsage(150);
      analyzer.recordCpuUsage(-10);

      const stats = analyzer.getCpuStats();

      expect(stats.peak).toBe(100);
    });
  });

  describe('Repository Timing', () => {
    it('should record repository calls', () => {
      analyzer.recordRepositoryCall({
        queryId: 'q1',
        operation: 'SELECT',
        tableName: 'users',
        duration: 50,
      });

      analyzer.recordRepositoryCall({
        queryId: 'q2',
        operation: 'INSERT',
        tableName: 'users',
        duration: 150,
      });

      const stats = analyzer.getRepositoryTimingStats();

      expect(stats.totalCalls).toBe(2);
      expect(stats.averageTime).toBe(100);
      expect(stats.slowQueries).toHaveLength(1);
      expect(stats.slowQueries[0].queryId).toBe('q2');
    });

    it('should get slow query count', () => {
      analyzer.recordRepositoryCall({
        queryId: 'q1',
        operation: 'SELECT',
        tableName: 'users',
        duration: 50,
      });

      analyzer.recordRepositoryCall({
        queryId: 'q2',
        operation: 'SELECT',
        tableName: 'users',
        duration: 200,
      });

      expect(analyzer.getSlowQueryCount()).toBe(1);
    });

    it('should track by operation', () => {
      analyzer.recordRepositoryCall({
        queryId: 'q1',
        operation: 'SELECT',
        tableName: 'users',
        duration: 50,
      });

      analyzer.recordRepositoryCall({
        queryId: 'q2',
        operation: 'SELECT',
        tableName: 'users',
        duration: 100,
      });

      analyzer.recordRepositoryCall({
        queryId: 'q3',
        operation: 'INSERT',
        tableName: 'users',
        duration: 75,
      });

      const stats = analyzer.getRepositoryTimingStats();

      expect(stats.byOperation['SELECT'].count).toBe(2);
      expect(stats.byOperation['INSERT'].count).toBe(1);
    });
  });

  describe('Cache Timing', () => {
    it('should record cache hits and misses', () => {
      analyzer.recordCacheHit(5);
      analyzer.recordCacheHit(10);
      analyzer.recordCacheMiss(50);
      analyzer.recordCacheMiss(100);

      const stats = analyzer.getCacheTimingStats();

      expect(stats.totalHits).toBe(2);
      expect(stats.totalMisses).toBe(2);
      expect(stats.hitRatio).toBe(0.5);
      expect(stats.missRatio).toBe(0.5);
    });

    it('should calculate hit ratio', () => {
      analyzer.recordCacheHit();
      analyzer.recordCacheHit();
      analyzer.recordCacheMiss();

      expect(analyzer.getCacheHitRatio()).toBeCloseTo(0.666, 2);
    });

    it('should track hit/miss response times', () => {
      analyzer.recordCacheHit(5);
      analyzer.recordCacheMiss(50);

      const stats = analyzer.getCacheTimingStats();

      expect(stats.averageHitTime).toBe(5);
      expect(stats.averageMissTime).toBe(50);
    });
  });

  describe('Aggregated Statistics', () => {
    it('should return aggregated stats', () => {
      analyzer.recordExecutionTime(100);
      analyzer.recordMemoryUsage(1024);
      analyzer.recordCpuUsage(50);
      analyzer.recordCacheHit();

      const stats = analyzer.getAggregatedStats();

      expect(stats.executionTime).toBeDefined();
      expect(stats.memory).toBeDefined();
      expect(stats.cpu).toBeDefined();
      expect(stats.cache).toBeDefined();
      expect(stats.generatedAt).toBeInstanceOf(Date);
    });
  });

  describe('Optimization Statistics', () => {
    it('should convert to optimization statistics format', () => {
      analyzer.recordExecutionTime(100);
      analyzer.recordExecutionTime(200);
      analyzer.recordMemoryUsage(1024);
      analyzer.recordCpuUsage(50);
      // 1 hit / 3 total = 33.33%
      analyzer.recordCacheHit(5);
      analyzer.recordCacheMiss(15);
      analyzer.recordCacheMiss(15);

      const stats = analyzer.toOptimizationStatistics();

      expect(stats.sampleCount).toBe(2);
      expect(stats.minExecutionTime).toBe(100);
      expect(stats.maxExecutionTime).toBe(200);
      expect(stats.cacheHitRate).toBeCloseTo(33.33, 1);
      expect(stats.averageMemoryUsage).toBe(1024);
      expect(stats.averageCpuUsage).toBe(50);
    });
  });

  describe('Reset Methods', () => {
    it('should reset all statistics', () => {
      analyzer.recordExecutionTime(100);
      analyzer.recordMemoryUsage(1024);
      analyzer.recordCpuUsage(50);
      analyzer.recordRepositoryCall({
        queryId: 'q1',
        operation: 'SELECT',
        tableName: 'users',
        duration: 50,
      });
      analyzer.recordCacheHit();

      analyzer.reset();

      const execStats = analyzer.getExecutionTimeStats();
      expect(execStats.sampleCount).toBe(0);

      const memStats = analyzer.getMemoryStats();
      expect(memStats.sampleCount).toBe(0);

      const repoStats = analyzer.getRepositoryTimingStats();
      expect(repoStats.totalCalls).toBe(0);

      const cacheStats = analyzer.getCacheTimingStats();
      expect(cacheStats.totalHits).toBe(0);
    });

    it('should reset only execution times', () => {
      analyzer.recordExecutionTime(100);
      analyzer.recordMemoryUsage(1024);

      analyzer.resetExecutionTimes();

      expect(analyzer.getExecutionTimeStats().sampleCount).toBe(0);
      expect(analyzer.getMemoryStats().sampleCount).toBe(1);
    });

    it('should reset only cache timing', () => {
      analyzer.recordCacheHit();
      analyzer.recordCacheMiss();

      analyzer.resetCacheTiming();

      const stats = analyzer.getCacheTimingStats();
      expect(stats.totalHits).toBe(0);
      expect(stats.totalMisses).toBe(0);
    });
  });

  describe('Utility Methods', () => {
    it('should return uptime', () => {
      const uptime = analyzer.getUptime();
      expect(uptime).toBeGreaterThanOrEqual(0);
    });

    it('should return total samples', () => {
      analyzer.recordExecutionTime(100);
      analyzer.recordMemoryUsage(1024);
      analyzer.recordCpuUsage(50);

      const samples = analyzer.getTotalSamples();

      expect(samples.executionTimes).toBe(1);
      expect(samples.memoryUsages).toBe(1);
      expect(samples.cpuUsages).toBe(1);
    });
  });
});
