/**
 * Retry Engine Service Unit Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RetryEngineService, DEFAULT_RETRY_CONFIG } from '../../../domains/scheduler/services/RetryEngineService';
import { ScheduledJob } from '../../../domains/scheduler/entities/ScheduledJob';
import { JobExecution } from '../../../domains/scheduler/entities/JobExecution';

// Mock scheduler service
const createMockSchedulerService = () => ({
  executeJob: vi.fn(async () => ({
    success: true,
    data: JobExecution.create({ jobId: { value: 'test-job-id' } as any }),
  })),
});

describe('RetryEngineService', () => {
  let service: RetryEngineService;
  let mockScheduler: ReturnType<typeof createMockSchedulerService>;

  beforeEach(() => {
    vi.useFakeTimers();
    mockScheduler = createMockSchedulerService();
    service = new RetryEngineService(mockScheduler as any);
  });

  afterEach(() => {
    vi.useRealTimers();
    service.clearAllRetries();
  });

  describe('shouldRetry', () => {
    it('should return false for successful execution', () => {
      const job = ScheduledJob.create({
        jobKey: 'test',
        jobName: 'Test',
        scheduleType: 'manual',
      });

      const execution = JobExecution.create({ jobId: job.jobId });
      const runningExecution = execution.start();

      expect(service.shouldRetry(runningExecution, job)).toBe(false);
    });

    it('should return true for failed execution within retry limit', () => {
      const job = ScheduledJob.create({
        jobKey: 'test',
        jobName: 'Test',
        scheduleType: 'manual',
      });

      const execution = JobExecution.create({ jobId: job.jobId });
      const failedExecution = execution.fail('Test error');

      expect(service.shouldRetry(failedExecution, job)).toBe(true);
    });

    it('should return false when max retries exceeded', () => {
      const job = ScheduledJob.create({
        jobKey: 'test',
        jobName: 'Test',
        scheduleType: 'manual',
        metadata: {
          jobKey: 'test',
          scheduleType: 'manual',
          priority: 'normal',
          isEnabled: true,
          maxRetries: 1,
          timeoutMs: 60000,
        },
      });

      const execution = JobExecution.create({
        jobId: job.jobId,
        metadata: { retryAttempt: 1 } as any,
      });
      const failedExecution = execution.fail('Test error');

      expect(service.shouldRetry(failedExecution, job)).toBe(false);
    });
  });

  describe('calculateDelay', () => {
    it('should calculate exponential backoff delay', () => {
      const baseDelay = service.calculateDelay(1);
      const secondDelay = service.calculateDelay(2);

      expect(secondDelay).toBeGreaterThan(baseDelay);
    });

    it('should respect max delay limit', () => {
      const largeDelay = service.calculateDelay(100);
      expect(largeDelay).toBeLessThanOrEqual(DEFAULT_RETRY_CONFIG.maxDelayMs);
    });

    it('should add jitter to delay', () => {
      const delays: number[] = [];
      for (let i = 0; i < 10; i++) {
        delays.push(service.calculateDelay(2));
      }

      // With jitter, delays should vary
      const uniqueDelays = new Set(delays);
      expect(uniqueDelays.size).toBeGreaterThan(1);
    });
  });

  describe('scheduleRetry', () => {
    it('should schedule a retry for failed execution', async () => {
      const job = ScheduledJob.create({
        jobKey: 'test',
        jobName: 'Test',
        scheduleType: 'manual',
      });

      const execution = JobExecution.create({ jobId: job.jobId });
      const failedExecution = execution.fail('Test error');

      const retryState = await service.scheduleRetry(failedExecution, job);

      expect(retryState).not.toBeNull();
      expect(retryState?.attempt).toBe(1);
      expect(retryState?.nextRetryAt).toBeDefined();
    });

    it('should not schedule retry when limit exceeded', async () => {
      const job = ScheduledJob.create({
        jobKey: 'test',
        jobName: 'Test',
        scheduleType: 'manual',
        metadata: {
          jobKey: 'test',
          scheduleType: 'manual',
          priority: 'normal',
          isEnabled: true,
          maxRetries: 0,
          timeoutMs: 60000,
        },
      });

      const execution = JobExecution.create({ jobId: job.jobId });
      const failedExecution = execution.fail('Test error');

      const retryState = await service.scheduleRetry(failedExecution, job);

      expect(retryState).toBeNull();
    });
  });

  describe('cancelRetry', () => {
    it('should cancel a pending retry', async () => {
      const job = ScheduledJob.create({
        jobKey: 'test',
        jobName: 'Test',
        scheduleType: 'manual',
      });

      const execution = JobExecution.create({ jobId: job.jobId });
      const failedExecution = execution.fail('Test error');

      await service.scheduleRetry(failedExecution, job);

      const cancelled = service.cancelRetry(
        failedExecution.executionId.value,
        job.jobId.value
      );

      expect(cancelled).toBe(true);
      expect(service.getStatistics().pendingRetries).toBe(0);
    });

    it('should return false for non-existent retry', () => {
      const cancelled = service.cancelRetry('non-existent', 'non-existent');
      expect(cancelled).toBe(false);
    });
  });

  describe('getRetryState', () => {
    it('should return retry state', async () => {
      const job = ScheduledJob.create({
        jobKey: 'test',
        jobName: 'Test',
        scheduleType: 'manual',
      });

      const execution = JobExecution.create({ jobId: job.jobId });
      const failedExecution = execution.fail('Test error');

      await service.scheduleRetry(failedExecution, job);

      const state = service.getRetryState(
        failedExecution.executionId.value,
        job.jobId.value
      );

      expect(state).not.toBeNull();
      expect(state?.attempt).toBe(1);
    });

    it('should return null for non-existent retry', () => {
      const state = service.getRetryState('non-existent', 'non-existent');
      expect(state).toBeNull();
    });
  });

  describe('getStatistics', () => {
    it('should return correct statistics', async () => {
      const job = ScheduledJob.create({
        jobKey: 'test',
        jobName: 'Test',
        scheduleType: 'manual',
      });

      const execution = JobExecution.create({ jobId: job.jobId });
      const failedExecution = execution.fail('Test error');

      await service.scheduleRetry(failedExecution, job);

      const stats = service.getStatistics();

      expect(stats.pendingRetries).toBe(1);
      expect(stats.activeRetryStates).toBe(1);
      expect(stats.config).toBeDefined();
    });
  });

  describe('setConfig', () => {
    it('should update configuration', () => {
      service.setConfig({ maxRetries: 10 });

      const config = service.getConfig();
      expect(config.maxRetries).toBe(10);
    });
  });

  describe('clearAllRetries', () => {
    it('should clear all pending retries', async () => {
      const job = ScheduledJob.create({
        jobKey: 'test',
        jobName: 'Test',
        scheduleType: 'manual',
      });

      const execution = JobExecution.create({ jobId: job.jobId });
      const failedExecution = execution.fail('Test error');

      await service.scheduleRetry(failedExecution, job);

      service.clearAllRetries();

      const stats = service.getStatistics();
      expect(stats.pendingRetries).toBe(0);
      expect(stats.activeRetryStates).toBe(0);
    });
  });
});
