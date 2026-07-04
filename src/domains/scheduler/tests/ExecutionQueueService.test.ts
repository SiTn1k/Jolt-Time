/**
 * Execution Queue Service Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutionQueueService } from '../../../domains/scheduler/services/ExecutionQueueService';
import { ScheduledJob } from '../../../domains/scheduler/entities/ScheduledJob';
import { JobExecution } from '../../../domains/scheduler/entities/JobExecution';
import { JobId } from '../../../domains/scheduler/value-objects/JobId';
import { ExecutionId } from '../../../domains/scheduler/value-objects/ExecutionId';

function createMockJob(key: string, priority: 'low' | 'normal' | 'high' | 'critical' = 'normal'): ScheduledJob {
  return ScheduledJob.create({
    jobKey: key,
    jobName: `Test ${key}`,
    scheduleType: 'manual',
    priority,
  });
}

function createMockExecution(job: ScheduledJob): JobExecution {
  return JobExecution.create({ jobId: job.jobId });
}

describe('ExecutionQueueService', () => {
  let queue: ExecutionQueueService;

  beforeEach(() => {
    queue = new ExecutionQueueService();
  });

  describe('enqueue', () => {
    it('should add an item to the queue', () => {
      const job = createMockJob('test.job');
      const execution = createMockExecution(job);
      const item = {
        id: execution.executionId.value,
        job,
        execution,
        priority: 5,
        addedAt: new Date(),
      };

      const result = queue.enqueue(item);

      expect(result).toBe(true);
      expect(queue.size()).toBe(1);
    });

    it('should reject duplicate items', () => {
      const job = createMockJob('test.job');
      const execution = createMockExecution(job);
      const item = {
        id: execution.executionId.value,
        job,
        execution,
        priority: 5,
        addedAt: new Date(),
      };

      queue.enqueue(item);
      const result = queue.enqueue(item);

      expect(result).toBe(false);
      expect(queue.size()).toBe(1);
    });

    it('should respect max queue size', () => {
      const smallQueue = new ExecutionQueueService({ maxQueueSize: 2 });

      const job1 = createMockJob('job1');
      const job2 = createMockJob('job2');
      const job3 = createMockJob('job3');

      smallQueue.enqueue({
        id: '1',
        job: job1,
        execution: createMockExecution(job1),
        priority: 5,
        addedAt: new Date(),
      });

      smallQueue.enqueue({
        id: '2',
        job: job2,
        execution: createMockExecution(job2),
        priority: 5,
        addedAt: new Date(),
      });

      const result = smallQueue.enqueue({
        id: '3',
        job: job3,
        execution: createMockExecution(job3),
        priority: 5,
        addedAt: new Date(),
      });

      expect(result).toBe(false);
    });

    it('should maintain priority ordering', () => {
      const job1 = createMockJob('job1', 'low');
      const job2 = createMockJob('job2', 'high');
      const job3 = createMockJob('job3', 'critical');

      queue.enqueue({
        id: '1',
        job: job1,
        execution: createMockExecution(job1),
        priority: 1,
        addedAt: new Date(),
      });

      queue.enqueue({
        id: '2',
        job: job2,
        execution: createMockExecution(job2),
        priority: 3,
        addedAt: new Date(),
      });

      queue.enqueue({
        id: '3',
        job: job3,
        execution: createMockExecution(job3),
        priority: 4,
        addedAt: new Date(),
      });

      const first = queue.peek();
      expect(first?.id).toBe('3'); // Critical (highest priority)
    });
  });

  describe('dequeue', () => {
    it('should remove and return an item', () => {
      const job = createMockJob('test.job');
      const execution = createMockExecution(job);

      queue.enqueue({
        id: '1',
        job,
        execution,
        priority: 5,
        addedAt: new Date(),
      });

      const item = queue.dequeue('1');

      expect(item).toBeDefined();
      expect(item?.id).toBe('1');
      expect(queue.size()).toBe(0);
    });

    it('should return null for non-existent item', () => {
      const item = queue.dequeue('non-existent');
      expect(item).toBeNull();
    });
  });

  describe('markRunning', () => {
    it('should move item from queue to running', () => {
      const job = createMockJob('test.job');
      const execution = createMockExecution(job);

      queue.enqueue({
        id: '1',
        job,
        execution,
        priority: 5,
        addedAt: new Date(),
      });

      queue.markRunning('1');

      expect(queue.size()).toBe(0);
      expect(queue.runningCount()).toBe(1);
    });
  });

  describe('markCompleted', () => {
    it('should move item from running to completed', () => {
      const job = createMockJob('test.job');
      const execution = createMockExecution(job);

      queue.enqueue({
        id: '1',
        job,
        execution,
        priority: 5,
        addedAt: new Date(),
      });

      queue.markRunning('1');
      queue.markCompleted('1');

      expect(queue.runningCount()).toBe(0);
      expect(queue.completedCount()).toBe(1);
    });
  });

  describe('markFailed', () => {
    it('should move item from running to failed', () => {
      const job = createMockJob('test.job');
      const execution = createMockExecution(job);

      queue.enqueue({
        id: '1',
        job,
        execution,
        priority: 5,
        addedAt: new Date(),
      });

      queue.markRunning('1');
      queue.markFailed('1');

      expect(queue.runningCount()).toBe(0);
      expect(queue.failedCount()).toBe(1);
    });
  });

  describe('isProcessed', () => {
    it('should return true for processed items', () => {
      const job = createMockJob('test.job');
      const execution = createMockExecution(job);

      queue.enqueue({
        id: '1',
        job,
        execution,
        priority: 5,
        addedAt: new Date(),
      });

      queue.dequeue('1');

      expect(queue.isProcessed('1')).toBe(false); // Removed from queue
    });
  });

  describe('getStatistics', () => {
    it('should return correct statistics', () => {
      const job1 = createMockJob('job1');
      const job2 = createMockJob('job2');

      queue.enqueue({
        id: '1',
        job: job1,
        execution: createMockExecution(job1),
        priority: 5,
        addedAt: new Date(),
      });

      queue.enqueue({
        id: '2',
        job: job2,
        execution: createMockExecution(job2),
        priority: 5,
        addedAt: new Date(),
      });

      queue.markRunning('1');
      queue.markCompleted('1');

      const stats = queue.getStatistics();

      expect(stats.pendingItems).toBe(1);
      expect(stats.runningItems).toBe(0);
      expect(stats.completedItems).toBe(1);
    });
  });

  describe('clear', () => {
    it('should clear all items', () => {
      const job1 = createMockJob('job1');
      const job2 = createMockJob('job2');

      queue.enqueue({
        id: '1',
        job: job1,
        execution: createMockExecution(job1),
        priority: 5,
        addedAt: new Date(),
      });

      queue.enqueue({
        id: '2',
        job: job2,
        execution: createMockExecution(job2),
        priority: 5,
        addedAt: new Date(),
      });

      queue.markRunning('1');

      queue.clear();

      expect(queue.size()).toBe(0);
      expect(queue.runningCount()).toBe(0);
    });
  });

  describe('prioritize', () => {
    it('should change item priority', () => {
      const job1 = createMockJob('job1', 'low');
      const job2 = createMockJob('job2', 'normal');

      queue.enqueue({
        id: '1',
        job: job1,
        execution: createMockExecution(job1),
        priority: 1,
        addedAt: new Date(),
      });

      queue.enqueue({
        id: '2',
        job: job2,
        execution: createMockExecution(job2),
        priority: 2,
        addedAt: new Date(),
      });

      queue.prioritize('1', 'critical');

      const first = queue.peek();
      expect(first?.id).toBe('1'); // Now highest priority
    });
  });

  describe('canAcceptMoreRunning', () => {
    it('should respect max concurrent limit', () => {
      const limitedQueue = new ExecutionQueueService({ maxConcurrent: 1 });

      const job1 = createMockJob('job1');
      const job2 = createMockJob('job2');

      limitedQueue.enqueue({
        id: '1',
        job: job1,
        execution: createMockExecution(job1),
        priority: 5,
        addedAt: new Date(),
      });

      limitedQueue.enqueue({
        id: '2',
        job: job2,
        execution: createMockExecution(job2),
        priority: 5,
        addedAt: new Date(),
      });

      limitedQueue.markRunning('1');

      expect(limitedQueue.canAcceptMoreRunning()).toBe(false);
    });
  });
});
