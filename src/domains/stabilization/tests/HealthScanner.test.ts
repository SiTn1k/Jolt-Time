/**
 * Health Scanner Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HealthScanner } from '../services/HealthScanner';
import { HealthStatus } from '../types/HealthStatus';

// Mock logger
vi.mock('../../../core/logging/logger.service', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

describe('HealthScanner', () => {
  let healthScanner: HealthScanner;

  beforeEach(() => {
    healthScanner = new HealthScanner();
  });

  describe('HealthScanner Configuration', () => {
    it('should use default configuration', () => {
      const scanner = new HealthScanner();
      expect(scanner).toBeDefined();
    });

    it('should accept custom configuration', () => {
      const scanner = new HealthScanner({
        timeoutMs: 10000,
        memoryThreshold: 90,
        cpuThreshold: 90,
        databaseTimeoutMs: 5000,
        cacheTimeoutMs: 2000,
        apiTimeoutMs: 3000,
      });
      expect(scanner).toBeDefined();
    });
  });

  describe('Full Health Check', () => {
    it('should perform a full health check', async () => {
      const result = await healthScanner.performHealthCheck();

      expect(result).toBeDefined();
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.components).toBeDefined();
      expect(result.components.length).toBeGreaterThan(0);
      expect(result.summary).toBeDefined();
      expect(['healthy', 'warning', 'failed', 'unknown']).toContain(result.overall);
    });

    it('should return all component checks', async () => {
      const result = await healthScanner.performHealthCheck();

      const componentNames = result.components.map(c => c.component);
      expect(componentNames).toContain('Authentication');
      expect(componentNames).toContain('Database');
      expect(componentNames).toContain('Cache');
      expect(componentNames).toContain('API Gateway');
    });

    it('should track healthy/warning/failed counts', async () => {
      const result = await healthScanner.performHealthCheck();

      expect(result.summary.healthyCount).toBeGreaterThanOrEqual(0);
      expect(result.summary.warningCount).toBeGreaterThanOrEqual(0);
      expect(result.summary.failedCount).toBeGreaterThanOrEqual(0);
      expect(
        result.summary.healthyCount +
        result.summary.warningCount +
        result.summary.failedCount
      ).toBe(result.components.length);
    });
  });

  describe('Quick Health Check', () => {
    it('should perform a quick health check', async () => {
      const result = await healthScanner.performQuickCheck();

      expect(result).toBeDefined();
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.components).toBeDefined();
      expect(result.components.length).toBe(3); // Database, Cache, API Gateway
    });

    it('should only check essential components', async () => {
      const result = await healthScanner.performQuickCheck();

      const componentNames = result.components.map(c => c.component);
      expect(componentNames).toContain('Database');
      expect(componentNames).toContain('Cache');
      expect(componentNames).toContain('API Gateway');
      expect(componentNames.length).toBe(3);
    });
  });

  describe('Health Result Conversion', () => {
    it('should convert health check result to system health result', async () => {
      const healthCheck = await healthScanner.performHealthCheck();
      const systemHealth = healthScanner.toSystemHealthResult(healthCheck);

      expect(systemHealth).toBeDefined();
      expect(systemHealth.memory).toBeDefined();
      expect(systemHealth.cpu).toBeDefined();
      expect(systemHealth.database).toBeDefined();
      expect(systemHealth.cache).toBeDefined();
      expect(systemHealth.api).toBeDefined();
      expect(systemHealth.overall).toBeDefined();
    });

    it('should return overall status from health check', async () => {
      const healthCheck = await healthScanner.performHealthCheck();
      const systemHealth = healthScanner.toSystemHealthResult(healthCheck);

      // Overall should match the health check overall
      expect(systemHealth.overall).toBe(healthCheck.overall);
    });
  });

  describe('Component Status Determination', () => {
    it('should correctly aggregate component statuses', async () => {
      const result = await healthScanner.performHealthCheck();

      // Each component should have a valid status
      for (const component of result.components) {
        expect([HealthStatus.HEALTHY, HealthStatus.WARNING, HealthStatus.FAILED, HealthStatus.UNKNOWN]).toContain(
          component.status
        );
      }
    });

    it('should include latency in component checks', async () => {
      const result = await healthScanner.performHealthCheck();

      for (const component of result.components) {
        expect(component.latencyMs).toBeGreaterThanOrEqual(0);
      }
    });

    it('should include component names', async () => {
      const result = await healthScanner.performHealthCheck();

      for (const component of result.components) {
        expect(component.component).toBeTruthy();
        expect(typeof component.component).toBe('string');
      }
    });
  });
});
