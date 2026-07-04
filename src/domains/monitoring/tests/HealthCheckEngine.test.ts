/**
 * HealthCheckEngine Tests
 *
 * Unit tests for the HealthCheckEngine class.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HealthCheckEngine } from '../services/HealthCheckEngine';
import type { IMonitoringService } from '../services/MonitoringService';
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

describe('HealthCheckEngine', () => {
  let mockMonitoringService: IMonitoringService;
  let engine: HealthCheckEngine;

  beforeEach(() => {
    mockMonitoringService = {
      recordHealthCheck: vi.fn(),
      runHealthCheck: vi.fn(),
      getHealthChecks: vi.fn(),
      recordMetric: vi.fn(),
      recordSystemMetrics: vi.fn(),
      getMetrics: vi.fn(),
      updateServiceStatus: vi.fn(),
      recordHeartbeat: vi.fn(),
      getServiceStatus: vi.fn(),
      getServiceStatuses: vi.fn(),
      getMonitoringStatistics: vi.fn(),
      getLatestHealthEvents: vi.fn(),
      getLatestMetricEvents: vi.fn(),
      getLatestServiceEvents: vi.fn(),
    };

    engine = new HealthCheckEngine(mockMonitoringService);
  });

  describe('registerHealthCheck', () => {
    it('should register a health check function', () => {
      const healthCheckFn = vi.fn().mockResolvedValue({
        status: HealthStatus.HEALTHY,
        responseTimeMs: 100,
      });

      engine.registerHealthCheck('test-service', healthCheckFn);

      const services = engine.getRegisteredServices();
      expect(services).toContain('test-service');
    });
  });

  describe('unregisterHealthCheck', () => {
    it('should unregister a health check', () => {
      const healthCheckFn = vi.fn().mockResolvedValue({
        status: HealthStatus.HEALTHY,
        responseTimeMs: 100,
      });

      engine.registerHealthCheck('test-service', healthCheckFn);
      const removed = engine.unregisterHealthCheck('test-service');

      expect(removed).toBe(true);
      expect(engine.getRegisteredServices()).not.toContain('test-service');
    });

    it('should return false when unregistering non-existent health check', () => {
      const removed = engine.unregisterHealthCheck('non-existent');
      expect(removed).toBe(false);
    });
  });

  describe('runHealthCheck', () => {
    it('should run a registered health check and record result', async () => {
      const healthCheckFn = vi.fn().mockResolvedValue({
        status: HealthStatus.HEALTHY,
        responseTimeMs: 100,
        details: 'All good',
      });

      (mockMonitoringService.recordHealthCheck as ReturnType<typeof vi.fn>).mockResolvedValue({
        healthCheckId: { value: '123' },
        serviceName: 'test-service',
        status: HealthStatus.HEALTHY,
        responseTime: 100,
        checkedAt: new Date(),
        metadata: { tags: [] },
      });

      engine.registerHealthCheck('test-service', healthCheckFn);
      const result = await engine.runHealthCheck('test-service');

      expect(result.status).toBe(HealthStatus.HEALTHY);
      expect(result.serviceName).toBe('test-service');
      expect(mockMonitoringService.recordHealthCheck).toHaveBeenCalled();
    });

    it('should return warning for unregistered service', async () => {
      const result = await engine.runHealthCheck('unregistered-service');

      expect(result.status).toBe(HealthStatus.WARNING);
      expect(result.details).toContain('No health check registered');
    });

    it('should handle health check that throws error', async () => {
      const healthCheckFn = vi.fn().mockRejectedValue(new Error('Connection failed'));

      (mockMonitoringService.recordHealthCheck as ReturnType<typeof vi.fn>).mockResolvedValue({
        healthCheckId: { value: '123' },
        serviceName: 'failing-service',
        status: HealthStatus.CRITICAL,
        responseTime: 0,
        checkedAt: new Date(),
        metadata: { tags: [] },
      });

      engine.registerHealthCheck('failing-service', healthCheckFn);
      const result = await engine.runHealthCheck('failing-service');

      expect(result.status).toBe(HealthStatus.CRITICAL);
      expect(result.details).toContain('Connection failed');
    });

    it('should never affect gameplay even when health check fails', async () => {
      const healthCheckFn = vi.fn().mockRejectedValue(new Error('Timeout'));

      (mockMonitoringService.recordHealthCheck as ReturnType<typeof vi.fn>).mockResolvedValue({
        healthCheckId: { value: '123' },
        serviceName: 'timeout-service',
        status: HealthStatus.CRITICAL,
        responseTime: 0,
        checkedAt: new Date(),
        metadata: { tags: [] },
      });

      engine.registerHealthCheck('timeout-service', healthCheckFn);

      // Should not throw - error is handled gracefully
      await expect(engine.runHealthCheck('timeout-service')).resolves.toBeDefined();
    });
  });

  describe('runAllHealthChecks', () => {
    it('should run all registered health checks', async () => {
      const healthCheck1 = vi.fn().mockResolvedValue({
        status: HealthStatus.HEALTHY,
        responseTimeMs: 50,
      });

      const healthCheck2 = vi.fn().mockResolvedValue({
        status: HealthStatus.HEALTHY,
        responseTimeMs: 75,
      });

      (mockMonitoringService.recordHealthCheck as ReturnType<typeof vi.fn>).mockResolvedValue({
        healthCheckId: { value: '123' },
        serviceName: 'service',
        status: HealthStatus.HEALTHY,
        responseTime: 50,
        checkedAt: new Date(),
        metadata: { tags: [] },
      });

      engine.registerHealthCheck('service-1', healthCheck1);
      engine.registerHealthCheck('service-2', healthCheck2);

      const results = await engine.runAllHealthChecks();

      expect(results.length).toBe(2);
      expect(healthCheck1).toHaveBeenCalled();
      expect(healthCheck2).toHaveBeenCalled();
    });

    it('should handle mixed results from health checks', async () => {
      const healthyCheck = vi.fn().mockResolvedValue({
        status: HealthStatus.HEALTHY,
        responseTimeMs: 50,
      });

      const failingCheck = vi.fn().mockRejectedValue(new Error('Failed'));

      (mockMonitoringService.recordHealthCheck as ReturnType<typeof vi.fn>).mockResolvedValue({
        healthCheckId: { value: '123' },
        serviceName: 'service',
        status: HealthStatus.HEALTHY,
        responseTime: 50,
        checkedAt: new Date(),
        metadata: { tags: [] },
      });

      engine.registerHealthCheck('healthy-service', healthyCheck);
      engine.registerHealthCheck('failing-service', failingCheck);

      const results = await engine.runAllHealthChecks();

      expect(results.length).toBe(2);
    });
  });

  describe('initializeBuiltInHealthChecks', () => {
    it('should register built-in health checks', () => {
      engine.initializeBuiltInHealthChecks();

      const services = engine.getRegisteredServices();

      expect(services).toContain('database');
      expect(services).toContain('telegram_api');
      expect(services).toContain('configuration_service');
      expect(services).toContain('scheduler');
      expect(services).toContain('event_bus');
      expect(services).toContain('notification');
      expect(services).toContain('analytics');
      expect(services).toContain('audit');
    });
  });
});
