/**
 * Scheduler Service Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SchedulerService } from '../../../domains/scheduler/services/SchedulerService';
import { ScheduledJob } from '../../../domains/scheduler/entities/ScheduledJob';
import { JobExecution } from '../../../domains/scheduler/entities/JobExecution';
import { JobDefinition } from '../../../domains/scheduler/entities/JobDefinition';
import { JobId } from '../../../domains/scheduler/value-objects/JobId';
import { ExecutionId } from '../../../domains/scheduler/value-objects/ExecutionId';
import { DefinitionId } from '../../../domains/scheduler/value-objects/DefinitionId';

describe('SchedulerService', () => {
  const createMockRepository = () => {
    const jobs = new Map<string, ScheduledJob>();
    const executions = new Map<string, JobExecution>();
    const definitions = new Map<string, JobDefinition>();

    return {
      jobs,
      executions,
      definitions,

      createJob: vi.fn(async (job: ScheduledJob) => {
        jobs.set(job.jobId.value, job);
        return job;
      }),

      findJobById: vi.fn(async (id: JobId) => {
        return jobs.get(id.value) ?? null;
      }),

      findJobsByKey: vi.fn(async (jobKey: string) => {
        return Array.from(jobs.values()).filter(j => j.jobKey === jobKey);
      }),

      updateJob: vi.fn(async (job: ScheduledJob) => {
        jobs.set(job.jobId.value, job);
        return job;
      }),

      deleteJob: vi.fn(async (id: JobId) => {
        jobs.delete(id.value);
      }),

      listJobs: vi.fn(async () => ({
        items: Array.from(jobs.values()),
        total: jobs.size,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      })),

      findJobsDueForExecution: vi.fn(async () => {
        const now = new Date();
        return Array.from(jobs.values()).filter(j =>
          j.status === 'scheduled' && (!j.nextRunAt || j.nextRunAt <= now)
        );
      }),

      createExecution: vi.fn(async (execution: JobExecution) => {
        executions.set(execution.executionId.value, execution);
        return execution;
      }),

      findExecutionById: vi.fn(async (id: ExecutionId) => {
        return executions.get(id.value) ?? null;
      }),

      findExecutionsByJobId: vi.fn(async (jobId: JobId, limit?: number) => {
        const results = Array.from(executions.values()).filter(e => e.jobId.value === jobId.value);
        return limit ? results.slice(0, limit) : results;
      }),

      updateExecution: vi.fn(async (execution: JobExecution) => {
        executions.set(execution.executionId.value, execution);
        return execution;
      }),

      listExecutions: vi.fn(async () => ({
        items: Array.from(executions.values()),
        total: executions.size,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      })),

      createDefinition: vi.fn(async (definition: JobDefinition) => {
        definitions.set(definition.definitionId.value, definition);
        return definition;
      }),

      findDefinitionById: vi.fn(async (id: DefinitionId) => {
        return definitions.get(id.value) ?? null;
      }),

      findDefinitionByHandler: vi.fn(async (handler: string) => {
        return Array.from(definitions.values()).find(d => d.handler === handler) ?? null;
      }),

      updateDefinition: vi.fn(async (definition: JobDefinition) => {
        definitions.set(definition.definitionId.value, definition);
        return definition;
      }),

      deleteDefinition: vi.fn(async (id: DefinitionId) => {
        definitions.delete(id.value);
      }),

      listDefinitions: vi.fn(async () => ({
        items: Array.from(definitions.values()),
        total: definitions.size,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      })),
    };
  };

  let service: SchedulerService;
  let mockRepository: ReturnType<typeof createMockRepository>;

  beforeEach(() => {
    mockRepository = createMockRepository();
    service = new SchedulerService(mockRepository as any);
  });

  describe('registerJob', () => {
    it('should register a new job', async () => {
      const result = await service.registerJob({
        jobKey: 'test.job',
        jobName: 'Test Job',
        scheduleType: 'manual',
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.jobKey).toBe('test.job');
      expect(result.data?.status).toBe('pending');
    });

    it('should fail for duplicate job key', async () => {
      await service.registerJob({
        jobKey: 'test.job',
        jobName: 'Test Job',
        scheduleType: 'manual',
      });

      const result = await service.registerJob({
        jobKey: 'test.job',
        jobName: 'Another Job',
        scheduleType: 'manual',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('startJob', () => {
    it('should start a pending job', async () => {
      const regResult = await service.registerJob({
        jobKey: 'start.job',
        jobName: 'Start Job',
        scheduleType: 'manual',
      });

      const result = await service.startJob(regResult.data!.jobId.value);

      expect(result.success).toBe(true);
      expect(result.data?.status).toBe('scheduled');
    });

    it('should fail for non-existent job', async () => {
      const result = await service.startJob('00000000-0000-4000-a000-000000000000');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Job not found');
    });
  });

  describe('cancelJob', () => {
    it('should cancel a pending job', async () => {
      const regResult = await service.registerJob({
        jobKey: 'cancel.job',
        jobName: 'Cancel Job',
        scheduleType: 'manual',
      });

      const result = await service.cancelJob(regResult.data!.jobId.value);

      expect(result.success).toBe(true);
      expect(result.data?.status).toBe('cancelled');
    });
  });

  describe('pauseJob', () => {
    it('should pause a scheduled job', async () => {
      const regResult = await service.registerJob({
        jobKey: 'pause.job',
        jobName: 'Pause Job',
        scheduleType: 'manual',
      });

      await service.startJob(regResult.data!.jobId.value);

      const pauseResult = await service.pauseJob(regResult.data!.jobId.value);

      expect(pauseResult.success).toBe(true);
      expect(pauseResult.data?.status).toBe('pending');
    });
  });

  describe('resumeJob', () => {
    it('should resume a paused job', async () => {
      const regResult = await service.registerJob({
        jobKey: 'resume.job',
        jobName: 'Resume Job',
        scheduleType: 'manual',
      });

      await service.startJob(regResult.data!.jobId.value);
      await service.pauseJob(regResult.data!.jobId.value);

      const result = await service.resumeJob(regResult.data!.jobId.value);

      expect(result.success).toBe(true);
      expect(result.data?.status).toBe('scheduled');
    });
  });

  describe('executeJob', () => {
    it('should execute a scheduled job', async () => {
      const regResult = await service.registerJob({
        jobKey: 'execute.job',
        jobName: 'Execute Job',
        scheduleType: 'manual',
      });

      await service.startJob(regResult.data!.jobId.value);

      const result = await service.executeJob(regResult.data!.jobId.value);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.status).toBe('pending');
    });
  });

  describe('completeJobExecution', () => {
    it('should complete an execution', async () => {
      const regResult = await service.registerJob({
        jobKey: 'complete.job',
        jobName: 'Complete Job',
        scheduleType: 'manual',
      });

      await service.startJob(regResult.data!.jobId.value);
      const execResult = await service.executeJob(regResult.data!.jobId.value);

      const result = await service.completeJobExecution(
        execResult.data!.executionId.value,
        regResult.data!.jobId.value
      );

      expect(result.success).toBe(true);
      expect(result.data?.status).toBe('success');
    });
  });

  describe('failJobExecution', () => {
    it('should fail an execution', async () => {
      const regResult = await service.registerJob({
        jobKey: 'fail.job',
        jobName: 'Fail Job',
        scheduleType: 'manual',
      });

      await service.startJob(regResult.data!.jobId.value);
      const execResult = await service.executeJob(regResult.data!.jobId.value);

      const result = await service.failJobExecution(
        execResult.data!.executionId.value,
        regResult.data!.jobId.value,
        'Test error'
      );

      expect(result.success).toBe(true);
      expect(result.data?.status).toBe('failed');
    });
  });

  describe('lifecycle', () => {
    it('should start and stop', () => {
      service.start();
      expect(service.getIsRunning()).toBe(true);

      service.stop();
      expect(service.getIsRunning()).toBe(false);
    });
  });
});
