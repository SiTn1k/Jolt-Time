/**
 * MetricCollector Tests
 *
 * Unit tests for the MetricCollector class.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MetricCollector } from '../services/MetricCollector';
import type { IMonitoringService } from '../services/MonitoringService';
import { MetricUnit } from '../types/MetricUnit';

// Mock logger
vi.mock('../../../core/logging/logger.service', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

describe('MetricCollector', () => {
  let mockMonitoringService: IMonitoringService;
  let collector: MetricCollector;

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

    collector = new MetricCollector(mockMonitoringService, {
      collectMemory: true,
      collectCpu: true,
      collectProcess: true,
    });
  });

  describe('collectMemoryMetrics', () => {
    it('should collect memory metrics', async () => {
      (mockMonitoringService.recordMetric as ReturnType<typeof vi.fn>).mockResolvedValue({
        metricId: { value: '123' },
        metricName: 'memory_heap_used',
        metricValue: 1024,
        unit: MetricUnit.BYTES,
        recordedAt: new Date(),
        metadata: { tags: [] },
      });

      await collector.collectMemoryMetrics();

      expect(mockMonitoringService.recordMetric).toHaveBeenCalled();
      // Should record: heap_used, heap_total, rss, external, usage_percent
      expect(mockMonitoringService.recordMetric).toHaveBeenCalledTimes(5);
    });
  });

  describe('collectCpuMetrics', () => {
    it('should collect CPU metrics', async () => {
      (mockMonitoringService.recordMetric as ReturnType<typeof vi.fn>).mockResolvedValue({
        metricId: { value: '123' },
        metricName: 'cpu_usage_percent',
        metricValue: 50,
        unit: MetricUnit.PERCENT,
        recordedAt: new Date(),
        metadata: { tags: [] },
      });

      await collector.collectCpuMetrics();

      expect(mockMonitoringService.recordMetric).toHaveBeenCalled();
      // Should record: usage_percent, numCpus
      expect(mockMonitoringService.recordMetric).toHaveBeenCalledTimes(2);
    });
  });

  describe('collectProcessMetrics', () => {
    it('should collect process metrics', async () => {
      (mockMonitoringService.recordMetric as ReturnType<typeof vi.fn>).mockResolvedValue({
        metricId: { value: '123' },
        metricName: 'process_uptime_seconds',
        metricValue: 3600,
        unit: MetricUnit.SECONDS,
        recordedAt: new Date(),
        metadata: { tags: [] },
      });

      await collector.collectProcessMetrics();

      expect(mockMonitoringService.recordMetric).toHaveBeenCalled();
      // Should record: uptime_seconds, pid
      expect(mockMonitoringService.recordMetric).toHaveBeenCalledTimes(2);
    });
  });

  describe('collectAllMetrics', () => {
    it('should collect all enabled metrics', async () => {
      (mockMonitoringService.recordMetric as ReturnType<typeof vi.fn>).mockResolvedValue({
        metricId: { value: '123' },
        metricName: 'metric',
        metricValue: 100,
        unit: MetricUnit.NONE,
        recordedAt: new Date(),
        metadata: { tags: [] },
      });

      await collector.collectAllMetrics();

      // Should collect memory (5), cpu (2), process (2) = 9 metrics
      expect(mockMonitoringService.recordMetric).toHaveBeenCalledTimes(9);
    });

    it('should never fail even if metrics collection fails', async () => {
      (mockMonitoringService.recordMetric as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('DB Error'));

      // Should not throw
      await expect(collector.collectAllMetrics()).resolves.toBeUndefined();
    });
  });

  describe('recordCustomMetric', () => {
    it('should record a custom metric', async () => {
      (mockMonitoringService.recordMetric as ReturnType<typeof vi.fn>).mockResolvedValue({
        metricId: { value: '123' },
        metricName: 'custom_metric',
        metricValue: 100,
        unit: MetricUnit.NONE,
        recordedAt: new Date(),
        metadata: { tags: [] },
      });

      await collector.recordCustomMetric({
        metricName: 'custom_metric',
        metricValue: 100,
        unit: MetricUnit.NONE,
        description: 'Test metric',
      });

      expect(mockMonitoringService.recordMetric).toHaveBeenCalledWith({
        metricName: 'custom_metric',
        metricValue: 100,
        unit: MetricUnit.NONE,
        metadata: expect.objectContaining({
          description: 'Test metric',
        }),
      });
    });
  });

  describe('recordResponseTime', () => {
    it('should record response time metric', async () => {
      (mockMonitoringService.recordMetric as ReturnType<typeof vi.fn>).mockResolvedValue({
        metricId: { value: '123' },
        metricName: 'response_time_api',
        metricValue: 250,
        unit: MetricUnit.MILLISECONDS,
        recordedAt: new Date(),
        metadata: { tags: [] },
      });

      await collector.recordResponseTime('api', 250);

      expect(mockMonitoringService.recordMetric).toHaveBeenCalledWith({
        metricName: 'response_time_api',
        metricValue: 250,
        unit: MetricUnit.MILLISECONDS,
        metadata: expect.objectContaining({
          description: 'Response time for api',
        }),
      });
    });
  });

  describe('recordDatabaseLatency', () => {
    it('should record database latency metric', async () => {
      (mockMonitoringService.recordMetric as ReturnType<typeof vi.fn>).mockResolvedValue({
        metricId: { value: '123' },
        metricName: 'database_latency_select',
        metricValue: 50,
        unit: MetricUnit.MILLISECONDS,
        recordedAt: new Date(),
        metadata: { tags: [] },
      });

      await collector.recordDatabaseLatency('select', 50);

      expect(mockMonitoringService.recordMetric).toHaveBeenCalledWith({
        metricName: 'database_latency_select',
        metricValue: 50,
        unit: MetricUnit.MILLISECONDS,
        metadata: expect.objectContaining({
          description: 'Database latency for select',
        }),
      });
    });
  });

  describe('recordQueueLength', () => {
    it('should record queue length metric', async () => {
      (mockMonitoringService.recordMetric as ReturnType<typeof vi.fn>).mockResolvedValue({
        metricId: { value: '123' },
        metricName: 'queue_length_notifications',
        metricValue: 42,
        unit: MetricUnit.NONE,
        recordedAt: new Date(),
        metadata: { tags: [] },
      });

      await collector.recordQueueLength('notifications', 42);

      expect(mockMonitoringService.recordMetric).toHaveBeenCalledWith({
        metricName: 'queue_length_notifications',
        metricValue: 42,
        unit: MetricUnit.NONE,
        metadata: expect.objectContaining({
          description: 'Queue length for notifications',
        }),
      });
    });
  });

  describe('recordActiveSessions', () => {
    it('should record active sessions metric', async () => {
      (mockMonitoringService.recordMetric as ReturnType<typeof vi.fn>).mockResolvedValue({
        metricId: { value: '123' },
        metricName: 'active_sessions',
        metricValue: 100,
        unit: MetricUnit.NONE,
        recordedAt: new Date(),
        metadata: { tags: [] },
      });

      await collector.recordActiveSessions(100);

      expect(mockMonitoringService.recordMetric).toHaveBeenCalledWith({
        metricName: 'active_sessions',
        metricValue: 100,
        unit: MetricUnit.NONE,
        metadata: expect.objectContaining({
          description: 'Number of active sessions',
        }),
      });
    });
  });

  describe('recordErrorCount', () => {
    it('should record error count metric', async () => {
      (mockMonitoringService.recordMetric as ReturnType<typeof vi.fn>).mockResolvedValue({
        metricId: { value: '123' },
        metricName: 'errors_validation',
        metricValue: 5,
        unit: MetricUnit.NONE,
        recordedAt: new Date(),
        metadata: { tags: [] },
      });

      await collector.recordErrorCount('validation', 5);

      expect(mockMonitoringService.recordMetric).toHaveBeenCalledWith({
        metricName: 'errors_validation',
        metricValue: 5,
        unit: MetricUnit.NONE,
        metadata: expect.objectContaining({
          description: 'Error count for validation',
        }),
      });
    });
  });
});
