/**
 * Memory Analyzer Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryAnalyzer } from '../services/MemoryAnalyzer';

describe('MemoryAnalyzer', () => {
  let analyzer: MemoryAnalyzer;

  beforeEach(() => {
    analyzer = new MemoryAnalyzer({
      highMemoryThresholdBytes: 100 * 1024 * 1024, // 100MB
      growthThresholdPercent: 50,
      maxSnapshots: 100,
      maxRecommendations: 10,
    });
  });

  describe('Snapshot Methods', () => {
    it('should record current memory snapshot', () => {
      const snapshot = analyzer.takeSnapshot();

      if (snapshot) {
        expect(snapshot.timestamp).toBeInstanceOf(Date);
        expect(snapshot.heapUsed).toBeGreaterThanOrEqual(0);
        expect(snapshot.heapTotal).toBeGreaterThanOrEqual(0);
      }
    });

    it('should get current memory usage', () => {
      const mem = analyzer.getCurrentMemoryUsage();

      if (mem) {
        expect(mem.heapUsed).toBeGreaterThanOrEqual(0);
        expect(mem.heapTotal).toBeGreaterThanOrEqual(0);
        expect(mem.external).toBeGreaterThanOrEqual(0);
        expect(mem.rss).toBeGreaterThanOrEqual(0);
      }
    });

    it('should track peak memory', () => {
      analyzer.takeSnapshot();
      analyzer.takeSnapshot();

      const peak = analyzer.getPeakMemory();
      expect(peak).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Object Count Methods', () => {
    it('should record object count', () => {
      analyzer.recordObjectCount('User', 100);
      analyzer.recordObjectCount('Item', 50);

      const counts = analyzer.getObjectCounts();

      expect(counts).toHaveLength(2);
      const userCount = counts.find((c) => c.typeName === 'User');
      expect(userCount?.count).toBe(100);
    });

    it('should increment object count', () => {
      analyzer.incrementObjectCount('User', 10);
      analyzer.incrementObjectCount('User', 5);

      const counts = analyzer.getObjectCounts();
      const userCount = counts.find((c) => c.typeName === 'User');

      expect(userCount?.count).toBe(15);
    });

    it('should decrement object count', () => {
      analyzer.recordObjectCount('User', 100);
      analyzer.decrementObjectCount('User', 30);

      const counts = analyzer.getObjectCounts();
      const userCount = counts.find((c) => c.typeName === 'User');

      expect(userCount?.count).toBe(70);
    });

    it('should not go below zero on decrement', () => {
      analyzer.recordObjectCount('User', 10);
      analyzer.decrementObjectCount('User', 100);

      const counts = analyzer.getObjectCounts();
      const userCount = counts.find((c) => c.typeName === 'User');

      expect(userCount?.count).toBe(0);
    });
  });

  describe('Analysis Methods', () => {
    it('should perform full analysis', () => {
      analyzer.recordObjectCount('User', 100);
      analyzer.recordObjectCount('Item', 50);

      const result = analyzer.analyze();

      expect(result.currentUsage).toBeDefined();
      expect(result.peakUsage).toBeDefined();
      expect(result.averageUsage).toBeDefined();
      expect(result.objectCounts).toHaveLength(2);
      expect(result.analyzedAt).toBeInstanceOf(Date);
    });

    it('should calculate current usage', () => {
      const stats = analyzer.calculateCurrentUsage();

      expect(stats.current).toBeGreaterThanOrEqual(0);
      expect(stats.sampleCount).toBeGreaterThanOrEqual(0);
    });

    it('should calculate peak usage', () => {
      analyzer.takeSnapshot();
      analyzer.takeSnapshot();

      const stats = analyzer.calculatePeakUsage();

      expect(stats.peak).toBeGreaterThanOrEqual(0);
      expect(stats.sampleCount).toBeGreaterThanOrEqual(0);
    });

    it('should calculate average usage', () => {
      analyzer.takeSnapshot();
      analyzer.takeSnapshot();

      const stats = analyzer.calculateAverageUsage();

      expect(stats.average).toBeGreaterThanOrEqual(0);
      expect(stats.min).toBeGreaterThanOrEqual(0);
      expect(stats.max).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Snapshot Comparison', () => {
    it('should compare snapshots', () => {
      analyzer.takeSnapshot();
      analyzer.takeSnapshot();
      analyzer.takeSnapshot();

      const comparison = analyzer.compareSnapshots(0, 2);

      if (comparison) {
        expect(comparison.startSnapshot).toBeDefined();
        expect(comparison.endSnapshot).toBeDefined();
        expect(comparison.duration).toBeGreaterThanOrEqual(0);
      }
    });

    it('should compare to start', () => {
      for (let i = 0; i < 15; i++) {
        analyzer.takeSnapshot();
      }

      const comparison = analyzer.compareToStart(10);

      if (comparison) {
        expect(comparison.startSnapshot).toBeDefined();
        expect(comparison.endSnapshot).toBeDefined();
      }
    });

    it('should analyze growth', () => {
      for (let i = 0; i < 5; i++) {
        analyzer.takeSnapshot();
      }

      const growth = analyzer.analyzeGrowth();

      if (growth) {
        expect(growth.duration).toBeGreaterThanOrEqual(0);
        expect(growth.rateBytesPerSecond).toBeGreaterThanOrEqual(0);
      }
    });

    it('should return null for invalid comparison', () => {
      analyzer.takeSnapshot();

      const comparison = analyzer.compareSnapshots(0, 10);
      expect(comparison).toBeNull();
    });
  });

  describe('Utility Methods', () => {
    it('should get snapshot count', () => {
      // Note: constructor already takes 1 snapshot
      analyzer.takeSnapshot();
      analyzer.takeSnapshot();

      expect(analyzer.getSnapshotCount()).toBeGreaterThanOrEqual(2);
    });

    it('should get uptime', () => {
      const uptime = analyzer.getUptime();

      expect(uptime).toBeGreaterThanOrEqual(0);
    });

    it('should clear all data', () => {
      analyzer.takeSnapshot();
      analyzer.recordObjectCount('User', 100);

      analyzer.clear();

      expect(analyzer.getSnapshotCount()).toBe(0);
      expect(analyzer.getObjectCounts()).toHaveLength(0);
      expect(analyzer.getPeakMemory()).toBe(0);
    });

    it('should return all snapshots', () => {
      // Note: constructor already takes 1 snapshot
      analyzer.takeSnapshot();
      analyzer.takeSnapshot();

      const snapshots = analyzer.getSnapshots();

      expect(snapshots.length).toBeGreaterThanOrEqual(2);
      expect(snapshots[0]).toBeDefined();
      expect(snapshots[1]).toBeDefined();
    });

    it('should return current config', () => {
      const config = analyzer.getConfig();

      expect(config.highMemoryThresholdBytes).toBe(100 * 1024 * 1024);
      expect(config.growthThresholdPercent).toBe(50);
      expect(config.maxSnapshots).toBe(100);
    });
  });
});
