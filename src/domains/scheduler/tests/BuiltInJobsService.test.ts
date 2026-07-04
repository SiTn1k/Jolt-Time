/**
 * Built-in Jobs Service Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  BuiltInJobsService,
  getBuiltInJobsService,
} from '../../../domains/scheduler/services/BuiltInJobsService';

describe('BuiltInJobsService', () => {
  let service: BuiltInJobsService;

  beforeEach(() => {
    // Create a new instance for each test
    service = new BuiltInJobsService();
  });

  describe('BUILT_IN_JOBS', () => {
    it('should have all required built-in jobs', () => {
      const jobs = BuiltInJobsService.BUILT_IN_JOBS;

      expect(jobs).toHaveLength(8);

      const jobKeys = jobs.map(j => j.key);
      expect(jobKeys).toContain('system.daily_reward_trigger');
      expect(jobKeys).toContain('system.daily_reset');
      expect(jobKeys).toContain('system.weekly_reset');
      expect(jobKeys).toContain('system.monthly_reset');
      expect(jobKeys).toContain('system.config_refresh');
      expect(jobKeys).toContain('system.analytics_cleanup');
      expect(jobKeys).toContain('system.notification_cleanup');
      expect(jobKeys).toContain('system.maintenance');
    });

    it('should have valid cron expressions for time-based jobs', () => {
      const jobs = BuiltInJobsService.BUILT_IN_JOBS;

      for (const job of jobs) {
        if (job.scheduleType === 'daily' || job.scheduleType === 'weekly' || job.scheduleType === 'monthly') {
          expect(job.cronExpression).toBeDefined();
        }
      }
    });
  });

  describe('getBuiltInJobs', () => {
    it('should return all built-in job definitions', () => {
      const jobs = service.getBuiltInJobs();
      expect(jobs).toHaveLength(8);
    });
  });

  describe('getBuiltInJob', () => {
    it('should return a job by key', () => {
      const job = service.getBuiltInJob('system.daily_reset');
      expect(job).toBeDefined();
      expect(job?.name).toBe('Daily Reset');
    });

    it('should return undefined for non-existent job', () => {
      const job = service.getBuiltInJob('non-existent');
      expect(job).toBeUndefined();
    });
  });

  describe('isBuiltInJob', () => {
    it('should return false for unregistered job', () => {
      expect(service.isBuiltInJob('system.daily_reset')).toBe(false);
    });
  });

  describe('event handling', () => {
    it('should register and emit events', async () => {
      const handler = vi.fn();
      service.onEvent('DAILY_REWARD_TRIGGER', handler);

      const context = {
        execution: {
          executionId: { value: 'test-id' },
        },
        job: {
          jobKey: 'system.daily_reward_trigger',
        },
      };

      const handlerFn = service.createHandler('system.daily_reward_trigger');
      await handlerFn(context as any);

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'DAILY_REWARD_TRIGGER',
          jobKey: 'system.daily_reward_trigger',
        })
      );
    });

    it('should handle multiple handlers', async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      service.onEvent('DAILY_REWARD_TRIGGER', handler1);
      service.onEvent('DAILY_REWARD_TRIGGER', handler2);

      const context = {
        execution: {
          executionId: { value: 'test-id' },
        },
        job: {
          jobKey: 'system.daily_reward_trigger',
        },
      };

      const handlerFn = service.createHandler('system.daily_reward_trigger');
      await handlerFn(context as any);

      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });

    it('should remove event handler', () => {
      const handler = vi.fn();
      service.onEvent('DAILY_REWARD_TRIGGER', handler);
      service.offEvent('DAILY_REWARD_TRIGGER', handler);

      const handlers = (service as any).eventHandlers.get('DAILY_REWARD_TRIGGER');
      expect(handlers).toHaveLength(0);
    });

    it('should handle handler errors gracefully', async () => {
      const errorHandler = vi.fn(() => {
        throw new Error('Handler error');
      });
      const normalHandler = vi.fn();

      service.onEvent('DAILY_REWARD_TRIGGER', errorHandler);
      service.onEvent('DAILY_REWARD_TRIGGER', normalHandler);

      const context = {
        execution: {
          executionId: { value: 'test-id' },
        },
        job: {
          jobKey: 'system.daily_reward_trigger',
        },
      };

      const handlerFn = service.createHandler('system.daily_reward_trigger');
      await handlerFn(context as any);

      // Normal handler should still be called despite error handler throwing
      expect(normalHandler).toHaveBeenCalled();
    });
  });

  describe('createHandler', () => {
    it('should create handler for each built-in job type', async () => {
      const jobs = BuiltInJobsService.BUILT_IN_JOBS;

      for (const job of jobs) {
        const handler = service.createHandler(job.key);
        expect(handler).toBeDefined();
        expect(typeof handler).toBe('function');
      }
    });

    it('should return success result', async () => {
      const handler = service.createHandler('system.daily_reward_trigger');

      const context = {
        execution: {
          executionId: { value: 'test-id' },
        },
        job: {
          jobKey: 'system.daily_reward_trigger',
        },
        metadata: {},
      };

      const result = await handler(context as any);
      expect(result.success).toBe(true);
    });
  });

  describe('getEventTypeForJobKey', () => {
    it('should map job keys to event types', () => {
      expect((service as any).getEventTypeForJobKey('system.daily_reward_trigger')).toBe('DAILY_REWARD_TRIGGER');
      expect((service as any).getEventTypeForJobKey('system.daily_reset')).toBe('DAILY_RESET_TRIGGER');
      expect((service as any).getEventTypeForJobKey('system.weekly_reset')).toBe('WEEKLY_RESET_TRIGGER');
      expect((service as any).getEventTypeForJobKey('system.monthly_reset')).toBe('MONTHLY_RESET_TRIGGER');
      expect((service as any).getEventTypeForJobKey('system.config_refresh')).toBe('CONFIGURATION_REFRESH');
      expect((service as any).getEventTypeForJobKey('system.analytics_cleanup')).toBe('ANALYTICS_CLEANUP');
      expect((service as any).getEventTypeForJobKey('system.notification_cleanup')).toBe('NOTIFICATION_CLEANUP');
      expect((service as any).getEventTypeForJobKey('system.maintenance')).toBe('SYSTEM_MAINTENANCE');
    });

    it('should default to SYSTEM_MAINTENANCE for unknown keys', () => {
      expect((service as any).getEventTypeForJobKey('unknown.job')).toBe('SYSTEM_MAINTENANCE');
    });
  });

  describe('singleton', () => {
    it('should return same instance from getBuiltInJobsService', () => {
      const instance1 = getBuiltInJobsService();
      const instance2 = getBuiltInJobsService();
      expect(instance1).toBe(instance2);
    });
  });
});
