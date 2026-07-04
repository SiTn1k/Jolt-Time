/**
 * MonitoringService Tests
 *
 * Unit tests for the MonitoringService class.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MonitoringService } from '../services/MonitoringService';
import type { IMonitoringRepository } from '../interfaces/IMonitoringRepository';
import type { HealthCheck } from '../entities/HealthCheck';
import type { SystemMetric } from '../entities/SystemMetric';
import type { ServiceStatus } from '../entities/ServiceStatus';
import { HealthStatus } from '../types/HealthStatus';
import { ServiceStatusType } from '../types/ServiceStatusType';
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

describe('MonitoringService', () => {
  let mockRepository: IMonitoringRepository;
  let service: MonitoringService;

  beforeEach(() => {
    mockRepository = {
      recordHealthCheck: vi.fn(),
      findHealthCheckById: vi.fn(),
      listHealthChecks: vi.fn(),
      countHealthChecks: vi.fn(),
      recordMetric: vi.fn(),
      findMetricById: vi.fn(),
      listMetrics: vi.fn(),
      countMetrics: vi.fn(),
      upsertServiceStatus: vi.fn(),
      findServiceStatusById: vi.fn(),
      findServiceStatusByName: vi.fn(),
      listServiceStatuses: vi.fn(),
      countServiceStatuses: vi.fn(),
      deleteServiceStatus: vi.fn(),
    };

    service = new MonitoringService(mockRepository);
  });

  describe('recordHealthCheck', () => {
    it('should record a health check successfully', async () => {
      const mockHealthCheck = {
        healthCheckId: { value: '123' },
        serviceName: 'test-service',
        status: HealthStatus.HEALTHY,
        responseTime: 100,
        details: 'Test details',
        checkedAt: new Date(),
        metadata: { tags: [] },
      } as unknown as HealthCheck;

      (mockRepository.recordHealthCheck as ReturnType<typeof vi.fn>).mockResolvedValue(mockHealthCheck);

      const result = await service.recordHealthCheck({
        serviceName: 'test-service',
        status: HealthStatus.HEALTHY,
        responseTime: 100,
        details: 'Test details',
      });

      expect(result).toBeDefined();
      expect(mockRepository.recordHealthCheck).toHaveBeenCalledTimes(1);
    });

    it('should throw error but not affect gameplay when repository fails', async () => {
      (mockRepository.recordHealthCheck as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('DB Error'));

      await expect(
        service.recordHealthCheck({
          serviceName: 'test-service',
          status: HealthStatus.HEALTHY,
          responseTime: 100,
        })
      ).rejects.toThrow('DB Error');
    });
  });

  describe('recordMetric', () => {
    it('should record a metric successfully', async () => {
      const mockMetric = {
        metricId: { value: '456' },
        metricName: 'memory_usage',
        metricValue: 1024,
        unit: MetricUnit.BYTES,
        recordedAt: new Date(),
        metadata: { tags: [] },
      } as unknown as SystemMetric;

      (mockRepository.recordMetric as ReturnType<typeof vi.fn>).mockResolvedValue(mockMetric);

      const result = await service.recordMetric({
        metricName: 'memory_usage',
        metricValue: 1024,
        unit: MetricUnit.BYTES,
      });

      expect(result).toBeDefined();
      expect(mockRepository.recordMetric).toHaveBeenCalledTimes(1);
    });

    it('should throw error but not affect gameplay when repository fails', async () => {
      (mockRepository.recordMetric as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('DB Error'));

      await expect(
        service.recordMetric({
          metricName: 'memory_usage',
          metricValue: 1024,
          unit: MetricUnit.BYTES,
        })
      ).rejects.toThrow('DB Error');
    });
  });

  describe('recordSystemMetrics', () => {
    it('should record multiple metrics in batch', async () => {
      const mockMetric = {
        metricId: { value: '789' },
        metricName: 'cpu_usage',
        metricValue: 50,
        unit: MetricUnit.PERCENT,
        recordedAt: new Date(),
        metadata: { tags: [] },
      } as unknown as SystemMetric;

      (mockRepository.recordMetric as ReturnType<typeof vi.fn>).mockResolvedValue(mockMetric);

      const results = await service.recordSystemMetrics([
        { metricName: 'cpu_usage', metricValue: 50, unit: MetricUnit.PERCENT },
        { metricName: 'memory_usage', metricValue: 1024, unit: MetricUnit.BYTES },
      ]);

      expect(results.length).toBe(2);
      expect(mockRepository.recordMetric).toHaveBeenCalledTimes(2);
    });
  });

  describe('updateServiceStatus', () => {
    it('should update service status successfully', async () => {
      const mockServiceStatus = {
        serviceId: { value: 'svc-123' },
        serviceName: 'api-service',
        status: ServiceStatusType.ONLINE,
        lastHeartbeat: new Date(),
        metadata: { tags: [] },
      } as unknown as ServiceStatus;

      (mockRepository.findServiceStatusByName as ReturnType<typeof vi.fn>).mockResolvedValue(null);
      (mockRepository.upsertServiceStatus as ReturnType<typeof vi.fn>).mockResolvedValue(mockServiceStatus);

      const result = await service.updateServiceStatus({
        serviceName: 'api-service',
        status: ServiceStatusType.ONLINE,
      });

      expect(result).toBeDefined();
      expect(mockRepository.upsertServiceStatus).toHaveBeenCalledTimes(1);
    });

    it('should detect status transition to offline', async () => {
      const existingStatus = {
        serviceId: { value: 'svc-123' },
        serviceName: 'api-service',
        status: ServiceStatusType.ONLINE,
        lastHeartbeat: new Date(),
        metadata: { tags: [] },
      } as unknown as ServiceStatus;

      const updatedStatus = {
        ...existingStatus,
        status: ServiceStatusType.OFFLINE,
      };

      (mockRepository.findServiceStatusByName as ReturnType<typeof vi.fn>).mockResolvedValue(existingStatus);
      (mockRepository.upsertServiceStatus as ReturnType<typeof vi.fn>).mockResolvedValue(updatedStatus);

      const result = await service.updateServiceStatus({
        serviceName: 'api-service',
        status: ServiceStatusType.OFFLINE,
      });

      expect(result.status).toBe(ServiceStatusType.OFFLINE);
    });
  });

  describe('recordHeartbeat', () => {
    it('should record heartbeat with online status', async () => {
      const mockServiceStatus = {
        serviceId: { value: 'svc-123' },
        serviceName: 'api-service',
        status: ServiceStatusType.ONLINE,
        lastHeartbeat: new Date(),
        metadata: { tags: [] },
      } as unknown as ServiceStatus;

      (mockRepository.findServiceStatusByName as ReturnType<typeof vi.fn>).mockResolvedValue(null);
      (mockRepository.upsertServiceStatus as ReturnType<typeof vi.fn>).mockResolvedValue(mockServiceStatus);

      const result = await service.recordHeartbeat('api-service', '1.0.0');

      expect(result.status).toBe(ServiceStatusType.ONLINE);
    });
  });

  describe('getMonitoringStatistics', () => {
    it('should compute monitoring statistics', async () => {
      const mockHealthChecks = {
        items: [
          { status: HealthStatus.HEALTHY, responseTime: 100 },
          { status: HealthStatus.HEALTHY, responseTime: 200 },
          { status: HealthStatus.WARNING, responseTime: 500 },
          { status: HealthStatus.CRITICAL, responseTime: 1000 },
        ] as unknown as HealthCheck[],
        total: 4,
        page: 1,
        pageSize: 100,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      (mockRepository.countHealthChecks as ReturnType<typeof vi.fn>).mockResolvedValue(4);
      (mockRepository.listHealthChecks as ReturnType<typeof vi.fn>).mockResolvedValue(mockHealthChecks);

      const stats = await service.getMonitoringStatistics();

      expect(stats.totalCount).toBe(4);
      expect(stats.healthyCount).toBe(2);
      expect(stats.warningCount).toBe(1);
      expect(stats.criticalCount).toBe(1);
      expect(stats.averageResponseTimeMs).toBe(450);
    });

    it('should return empty statistics on error', async () => {
      (mockRepository.countHealthChecks as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('DB Error'));

      const stats = await service.getMonitoringStatistics();

      expect(stats.totalCount).toBe(0);
    });
  });

  describe('getLatestHealthEvents', () => {
    it('should return latest health events', async () => {
      const events = service.getLatestHealthEvents(5);
      expect(Array.isArray(events)).toBe(true);
    });
  });

  describe('getLatestMetricEvents', () => {
    it('should return latest metric events', async () => {
      const events = service.getLatestMetricEvents(5);
      expect(Array.isArray(events)).toBe(true);
    });
  });

  describe('getLatestServiceEvents', () => {
    it('should return latest service events', async () => {
      const events = service.getLatestServiceEvents(5);
      expect(Array.isArray(events)).toBe(true);
    });
  });
});
