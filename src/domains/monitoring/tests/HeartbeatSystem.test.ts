/**
 * HeartbeatSystem Tests
 *
 * Unit tests for the HeartbeatSystem class.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HeartbeatSystem } from '../services/HeartbeatSystem';
import type { IMonitoringService } from '../services/MonitoringService';
import { ServiceStatusType } from '../types/ServiceStatusType';

// Mock logger
vi.mock('../../../core/logging/logger.service', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

describe('HeartbeatSystem', () => {
  let mockMonitoringService: IMonitoringService;
  let system: HeartbeatSystem;

  beforeEach(() => {
    vi.useFakeTimers();

    mockMonitoringService = {
      recordHealthCheck: vi.fn(),
      runHealthCheck: vi.fn(),
      getHealthChecks: vi.fn(),
      recordMetric: vi.fn(),
      recordSystemMetrics: vi.fn(),
      getMetrics: vi.fn(),
      updateServiceStatus: vi.fn(),
      recordHeartbeat: vi.fn().mockResolvedValue({
        serviceId: { value: 'svc-123' },
        serviceName: 'test-service',
        status: ServiceStatusType.ONLINE,
        lastHeartbeat: new Date(),
        metadata: { tags: [] },
      }),
      getServiceStatus: vi.fn(),
      getServiceStatuses: vi.fn(),
      getMonitoringStatistics: vi.fn(),
      getLatestHealthEvents: vi.fn(),
      getLatestMetricEvents: vi.fn(),
      getLatestServiceEvents: vi.fn(),
    };

    system = new HeartbeatSystem(mockMonitoringService, {
      intervalMs: 1000,
      offlineThresholdMs: 3000,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    system.stopAll();
  });

  describe('startTracking', () => {
    it('should start tracking a service and send initial heartbeat', async () => {
      await system.startTracking('test-service', '1.0.0');

      expect(mockMonitoringService.recordHeartbeat).toHaveBeenCalledWith('test-service', '1.0.0');
    });
  });

  describe('stopTracking', () => {
    it('should stop tracking and update status to offline', async () => {
      await system.startTracking('test-service', '1.0.0');
      await system.stopTracking('test-service');

      expect(mockMonitoringService.updateServiceStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          serviceName: 'test-service',
          status: ServiceStatusType.OFFLINE,
        })
      );
    });
  });

  describe('sendHeartbeat', () => {
    it('should send heartbeat and update state', async () => {
      await system.startTracking('test-service', '1.0.0');
      mockMonitoringService.recordHeartbeat = vi.fn().mockResolvedValue({
        serviceId: { value: 'svc-123' },
        serviceName: 'test-service',
        status: ServiceStatusType.ONLINE,
        lastHeartbeat: new Date(),
        metadata: { tags: [] },
      });

      await system.sendHeartbeat('test-service', '1.0.0');

      expect(mockMonitoringService.recordHeartbeat).toHaveBeenCalledWith('test-service', '1.0.0');

      const state = system.getHeartbeatState('test-service');
      expect(state).toBeDefined();
      expect(state?.isOnline).toBe(true);
      expect(state?.status).toBe(ServiceStatusType.ONLINE);
    });

    it('should handle heartbeat failure gracefully', async () => {
      await system.startTracking('test-service', '1.0.0');
      (mockMonitoringService.recordHeartbeat as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

      await system.sendHeartbeat('test-service', '1.0.0');

      const state = system.getHeartbeatState('test-service');
      expect(state?.consecutiveFailures).toBe(1);
    });
  });

  describe('getHeartbeatState', () => {
    it('should return null for non-tracked service', () => {
      const state = system.getHeartbeatState('non-existent');
      expect(state).toBeNull();
    });

    it('should return state for tracked service', async () => {
      await system.startTracking('test-service', '1.0.0');

      const state = system.getHeartbeatState('test-service');
      expect(state).toBeDefined();
      expect(state?.serviceName).toBe('test-service');
    });
  });

  describe('getAllHeartbeatStates', () => {
    it('should return empty array when no services tracked', () => {
      const states = system.getAllHeartbeatStates();
      expect(states).toEqual([]);
    });

    it('should return all tracked services', async () => {
      await system.startTracking('service-1', '1.0.0');
      await system.startTracking('service-2', '1.0.0');

      const states = system.getAllHeartbeatStates();
      expect(states.length).toBe(2);
    });
  });

  describe('getHeartbeatStatistics', () => {
    it('should return statistics for tracked services', async () => {
      await system.startTracking('service-1', '1.0.0');
      await system.startTracking('service-2', '1.0.0');

      const stats = system.getHeartbeatStatistics();

      expect(stats.totalServices).toBe(2);
      expect(stats.onlineServices).toBe(2);
      expect(stats.offlineServices).toBe(0);
    });
  });

  describe('stopAll', () => {
    it('should stop all tracking and clear intervals', async () => {
      await system.startTracking('service-1', '1.0.0');
      await system.startTracking('service-2', '1.0.0');

      system.stopAll();

      const states = system.getAllHeartbeatStates();
      expect(states).toEqual([]);
    });
  });

  describe('failure handling', () => {
    it('should never affect gameplay when heartbeat fails', async () => {
      // First start tracking
      await system.startTracking('test-service', '1.0.0');
      
      // Then make heartbeat fail
      (mockMonitoringService.recordHeartbeat as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

      // Should not throw
      await expect(system.sendHeartbeat('test-service', '1.0.0')).resolves.not.toThrow();

      // State should be updated but game continues
      const state = system.getHeartbeatState('test-service');
      expect(state?.consecutiveFailures).toBe(1);
    });

    it('should continue tracking even if heartbeat fails repeatedly', async () => {
      // First start tracking
      await system.startTracking('test-service', '1.0.0');
      
      // Then make heartbeat fail
      (mockMonitoringService.recordHeartbeat as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

      await system.sendHeartbeat('test-service', '1.0.0');
      await system.sendHeartbeat('test-service', '1.0.0');

      const state = system.getHeartbeatState('test-service');
      expect(state?.consecutiveFailures).toBe(2);
      // Game continues normally
    });
  });
});
