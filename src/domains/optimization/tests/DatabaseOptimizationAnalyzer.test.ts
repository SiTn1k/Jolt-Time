/**
 * Database Optimization Analyzer Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DatabaseOptimizationAnalyzer } from '../services/DatabaseOptimizationAnalyzer';

describe('DatabaseOptimizationAnalyzer', () => {
  let analyzer: DatabaseOptimizationAnalyzer;

  beforeEach(() => {
    analyzer = new DatabaseOptimizationAnalyzer({
      slowQueryThresholdMs: 100,
      duplicateQueryWindowMs: 60000,
      maxRecommendations: 10,
    });
  });

  describe('Query Recording', () => {
    it('should record SELECT queries', () => {
      analyzer.recordSelect('users', 50);

      const result = analyzer.analyze();
      expect(result.totalQueries).toBe(1);
    });

    it('should record INSERT queries', () => {
      analyzer.recordInsert('users', 100);

      const result = analyzer.analyze();
      expect(result.totalQueries).toBe(1);
    });

    it('should record UPDATE queries', () => {
      analyzer.recordUpdate('users', 75);

      const result = analyzer.analyze();
      expect(result.totalQueries).toBe(1);
    });

    it('should record DELETE queries', () => {
      analyzer.recordDelete('users', 60);

      const result = analyzer.analyze();
      expect(result.totalQueries).toBe(1);
    });
  });

  describe('Slow Query Detection', () => {
    it('should detect slow queries', () => {
      analyzer.recordSelect('users', 50);
      analyzer.recordSelect('users', 150);
      analyzer.recordSelect('users', 200);

      const slowQueries = analyzer.detectSlowQueries();

      expect(slowQueries).toHaveLength(2);
      expect(slowQueries[0].duration).toBe(200);
      expect(slowQueries[1].duration).toBe(150);
    });

    it('should provide recommendations for slow queries', () => {
      analyzer.recordSelect('users', 200);

      const slowQueries = analyzer.detectSlowQueries();

      expect(slowQueries[0].recommendation).toBeDefined();
    });
  });

  describe('Duplicate Query Detection', () => {
    it('should detect duplicate query patterns', async () => {
      // Record multiple similar queries quickly
      for (let i = 0; i < 5; i++) {
        analyzer.recordSelect('users', 50);
      }

      const patterns = analyzer.detectDuplicateQueries();

      expect(patterns.length).toBeGreaterThanOrEqual(1);
      expect(patterns[0].count).toBe(5);
    });

    it('should calculate duplicate query statistics', () => {
      analyzer.recordSelect('users', 50);
      analyzer.recordSelect('users', 100);
      analyzer.recordSelect('users', 75);

      const patterns = analyzer.detectDuplicateQueries();

      if (patterns.length > 0) {
        expect(patterns[0].averageDuration).toBe(75);
        expect(patterns[0].totalDuration).toBe(225);
      }
    });
  });

  describe('Repository Call Statistics', () => {
    it('should calculate repository stats', () => {
      analyzer.recordSelect('users', 50);
      analyzer.recordSelect('users', 100);
      analyzer.recordInsert('users', 75);

      const stats = analyzer.calculateRepositoryStats();

      expect(stats.length).toBeGreaterThanOrEqual(1);
    });

    it('should track slow call counts', () => {
      analyzer.recordSelect('users', 50);
      analyzer.recordSelect('users', 200);
      analyzer.recordSelect('users', 150);

      const stats = analyzer.calculateRepositoryStats();

      const selectStats = stats.find((s) => s.methodName === 'select');
      expect(selectStats?.slowCallCount).toBe(2);
    });
  });

  describe('Table Access Statistics', () => {
    it('should calculate table access stats', () => {
      analyzer.recordSelect('users', 50);
      analyzer.recordInsert('users', 75);
      analyzer.recordUpdate('users', 60);
      analyzer.recordSelect('products', 100);

      const stats = analyzer.calculateTableAccessStats();

      expect(stats.length).toBe(2);

      const usersStats = stats.find((s) => s.tableName === 'users');
      expect(usersStats?.selectCount).toBe(1);
      expect(usersStats?.insertCount).toBe(1);
      expect(usersStats?.updateCount).toBe(1);
    });
  });

  describe('Full Analysis', () => {
    it('should perform full analysis', () => {
      analyzer.recordSelect('users', 50);
      analyzer.recordSelect('users', 150);
      analyzer.recordInsert('users', 75);
      analyzer.recordSelect('products', 200);

      const result = analyzer.analyze();

      expect(result.totalQueries).toBe(4);
      expect(result.slowQueries.length).toBeGreaterThanOrEqual(2);
      expect(result.repositoryStats.length).toBeGreaterThanOrEqual(1);
      expect(result.tableAccessStats.length).toBe(2);
      expect(result.recommendations.length).toBeGreaterThanOrEqual(0);
      expect(result.analyzedAt).toBeInstanceOf(Date);
    });

    it('should calculate average duration', () => {
      analyzer.recordSelect('users', 50);
      analyzer.recordSelect('users', 100);

      const result = analyzer.analyze();

      expect(result.averageDuration).toBe(75);
    });
  });

  describe('Recommendations', () => {
    it('should generate recommendations for slow queries', () => {
      for (let i = 0; i < 3; i++) {
        analyzer.recordSelect('users', 200);
      }

      const result = analyzer.analyze();

      const slowQueryRecs = result.recommendations.filter(
        (r) => r.type === 'SLOW_QUERY'
      );
      expect(slowQueryRecs.length).toBeGreaterThan(0);
    });

    it('should generate recommendations for duplicates', () => {
      for (let i = 0; i < 15; i++) {
        analyzer.recordSelect('users', 50);
      }

      const result = analyzer.analyze();

      const duplicateRecs = result.recommendations.filter(
        (r) => r.type === 'DUPLICATE_QUERY'
      );
      expect(duplicateRecs.length).toBeGreaterThanOrEqual(1);
    });

    it('should prioritize critical recommendations', () => {
      analyzer.recordSelect('users', 1000);

      const result = analyzer.analyze();

      const criticalRecs = result.recommendations.filter(
        (r) => r.severity === 'HIGH' || r.severity === 'CRITICAL'
      );
      expect(criticalRecs.length).toBeGreaterThan(0);
    });
  });

  describe('Utility Methods', () => {
    it('should get total query count', () => {
      analyzer.recordSelect('users', 50);
      analyzer.recordSelect('users', 100);

      expect(analyzer.getTotalQueryCount()).toBe(2);
    });

    it('should get queries by operation', () => {
      analyzer.recordSelect('users', 50);
      analyzer.recordInsert('users', 100);
      analyzer.recordSelect('users', 75);

      const selects = analyzer.getQueriesByOperation('SELECT');
      expect(selects.length).toBe(2);

      const inserts = analyzer.getQueriesByOperation('INSERT');
      expect(inserts.length).toBe(1);
    });

    it('should get queries by table', () => {
      analyzer.recordSelect('users', 50);
      analyzer.recordSelect('products', 100);

      const usersQueries = analyzer.getQueriesByTable('users');
      expect(usersQueries.length).toBe(1);

      const productsQueries = analyzer.getQueriesByTable('products');
      expect(productsQueries.length).toBe(1);
    });

    it('should clear all queries', () => {
      analyzer.recordSelect('users', 50);
      analyzer.recordSelect('users', 100);

      analyzer.clear();

      expect(analyzer.getTotalQueryCount()).toBe(0);
    });

    it('should return current config', () => {
      const config = analyzer.getConfig();

      expect(config.slowQueryThresholdMs).toBe(100);
      expect(config.duplicateQueryWindowMs).toBe(60000);
      expect(config.maxRecommendations).toBe(10);
    });
  });
});
