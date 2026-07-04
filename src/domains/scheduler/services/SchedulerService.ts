/**
 * Scheduler Service
 *
 * Production service for managing scheduled jobs.
 * Handles job registration, scheduling, and execution management.
 */

import type { ISchedulerRepository } from '../interfaces/ISchedulerRepository';
import type { ScheduledJobFilterParams } from '../interfaces/ISchedulerRepository';
import { ScheduledJob } from '../entities/ScheduledJob';
import { JobExecution } from '../entities/JobExecution';
import { JobDefinition } from '../entities/JobDefinition';
import { JobId } from '../value-objects/JobId';
import { ExecutionId } from '../value-objects/ExecutionId';
import { DefinitionId } from '../value-objects/DefinitionId';
import type { ScheduleType } from '../types/ScheduleType';
import type { JobStatus } from '../types/JobStatus';
import type { SchedulerPriority } from '../types/SchedulerPriority';
import type { SchedulerJobMetadata } from '../types/SchedulerMetadata';
import { createLogger } from '../../../core/logging/logger.service';
import type { PaginationParams } from '../../../shared/types/base.types';
import type { PaginatedResult } from '../../../shared/types/base.types';
import { SchedulerValidator } from '../validators/SchedulerValidator';
import { ExecutionValidator } from '../validators/ExecutionValidator';
import { DefinitionValidator } from '../validators/DefinitionValidator';
import type { SchedulerStatistics } from '../types/SchedulerStatistics';
import { isCancellableJobStatus } from '../types/JobStatus';
import { isCancellableExecutionStatus } from '../types/ExecutionStatus';

const logger = createLogger('SchedulerService');

/**
 * Result type for scheduler operations.
 */
export type SchedulerServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Event handler type for job lifecycle events.
 */
export type JobEventHandler = (event: SchedulerJobEvent) => void | Promise<void>;

/**
 * Job lifecycle event types.
 */
export type SchedulerJobEvent =
  | { type: 'JOB_CREATED'; job: ScheduledJob }
  | { type: 'JOB_STARTED'; job: ScheduledJob; execution: JobExecution }
  | { type: 'JOB_COMPLETED'; job: ScheduledJob; execution: JobExecution }
  | { type: 'JOB_FAILED'; job: ScheduledJob; execution: JobExecution; error: string }
  | { type: 'JOB_CANCELLED'; job: ScheduledJob }
  | { type: 'JOB_PAUSED'; job: ScheduledJob }
  | { type: 'JOB_RESUMED'; job: ScheduledJob };

/**
 * Scheduler Service
 * Manages scheduled jobs and their executions.
 */
export class SchedulerService {
  private readonly repository: ISchedulerRepository;
  private readonly schedulerValidator: SchedulerValidator;
  private readonly executionValidator: ExecutionValidator;
  private readonly definitionValidator: DefinitionValidator;
  private eventHandlers: JobEventHandler[] = [];
  private isRunning = false;

  /**
   * Creates a new SchedulerService instance.
   */
  constructor(
    repository: ISchedulerRepository,
    schedulerValidator?: SchedulerValidator,
    executionValidator?: ExecutionValidator,
    definitionValidator?: DefinitionValidator
  ) {
    this.repository = repository;
    this.schedulerValidator = schedulerValidator ?? new SchedulerValidator();
    this.executionValidator = executionValidator ?? new ExecutionValidator();
    this.definitionValidator = definitionValidator ?? new DefinitionValidator();
  }

  /**
   * Registers an event handler for job lifecycle events.
   */
  public onEvent(handler: JobEventHandler): void {
    this.eventHandlers.push(handler);
  }

  /**
   * Removes an event handler.
   */
  public offEvent(handler: JobEventHandler): void {
    this.eventHandlers = this.eventHandlers.filter((h) => h !== handler);
  }

  /**
   * Emits an event to all registered handlers.
   */
  private async emitEvent(event: SchedulerJobEvent): Promise<void> {
    for (const handler of this.eventHandlers) {
      try {
        await handler(event);
      } catch (err) {
        logger.error('Error in event handler', err as Error, { eventType: event.type });
      }
    }
  }

  // ============ Job Registration ============

  /**
   * Registers a new scheduled job.
   */
  async registerJob(params: {
    jobKey: string;
    jobName: string;
    scheduleType: ScheduleType;
    cronExpression?: string;
    priority?: SchedulerPriority;
    nextRunAt?: Date;
    metadata?: SchedulerJobMetadata;
  }): Promise<SchedulerServiceResult<ScheduledJob>> {
    logger.debug('Registering job', { jobKey: params.jobKey, scheduleType: params.scheduleType });

    try {
      const validation = SchedulerValidator.validateJob({
        jobKey: params.jobKey,
        jobName: params.jobName,
        scheduleType: params.scheduleType,
        cronExpression: params.cronExpression,
        priority: params.priority,
      });

      if (!validation.isValid) {
        return { success: false, error: validation.errors.join('; ') };
      }

      const existingJobs = await this.repository.findJobsByKey(params.jobKey);
      if (existingJobs.length > 0) {
        return { success: false, error: `Job with key '${params.jobKey}' already exists` };
      }

      const job = ScheduledJob.create({
        jobKey: params.jobKey,
        jobName: params.jobName,
        scheduleType: params.scheduleType,
        cronExpression: params.cronExpression,
        priority: params.priority,
        nextRunAt: params.nextRunAt,
        metadata: params.metadata,
      });

      const createdJob = await this.repository.createJob(job);

      logger.info('Job registered', {
        jobId: createdJob.jobId.value,
        jobKey: createdJob.jobKey,
        scheduleType: createdJob.scheduleType,
      });

      await this.emitEvent({ type: 'JOB_CREATED', job: createdJob });

      return { success: true, data: createdJob };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register job';
      logger.error('Failed to register job', err as Error, { jobKey: params.jobKey });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Registers a job definition (handler metadata).
   */
  async registerDefinition(params: {
    name: string;
    description: string;
    handler: string;
    retryLimit?: number;
    timeout?: number;
  }): Promise<SchedulerServiceResult<JobDefinition>> {
    logger.debug('Registering job definition', { name: params.name, handler: params.handler });

    try {
      const existing = await this.repository.findDefinitionByHandler(params.handler);
      if (existing) {
        return { success: false, error: `Definition with handler '${params.handler}' already exists` };
      }

      const definition = JobDefinition.create({
        name: params.name,
        description: params.description,
        handler: params.handler,
        retryLimit: params.retryLimit,
        timeout: params.timeout,
      });

      const createdDefinition = await this.repository.createDefinition(definition);

      logger.info('Job definition registered', {
        definitionId: createdDefinition.definitionId.value,
        handler: createdDefinition.handler,
      });

      return { success: true, data: createdDefinition };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register definition';
      logger.error('Failed to register definition', err as Error, { handler: params.handler });
      return { success: false, error: errorMessage };
    }
  }

  // ============ Job Lifecycle ============

  /**
   * Starts a scheduled job (changes status from pending to scheduled).
   */
  async startJob(jobId: string): Promise<SchedulerServiceResult<ScheduledJob>> {
    logger.debug('Starting job', { jobId });

    try {
      const jobIdVO = JobId.reconstruct(jobId);
      const job = await this.repository.findJobById(jobIdVO);

      if (!job) {
        return { success: false, error: 'Job not found' };
      }

      if (job.status !== 'pending' && job.status !== 'cancelled') {
        return { success: false, error: `Cannot start job in '${job.status}' status` };
      }

      const updatedJob = job.copyWith({ status: 'scheduled' });
      const savedJob = await this.repository.updateJob(updatedJob);

      logger.info('Job started', { jobId, status: savedJob.status });

      return { success: true, data: savedJob };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start job';
      logger.error('Failed to start job', err as Error, { jobId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Executes a job (creates execution and runs it).
   */
  async executeJob(jobId: string, context?: Record<string, unknown>): Promise<SchedulerServiceResult<JobExecution>> {
    logger.debug('Executing job', { jobId });

    try {
      const jobIdVO = JobId.reconstruct(jobId);
      const job = await this.repository.findJobById(jobIdVO);

      if (!job) {
        return { success: false, error: 'Job not found' };
      }

      if (!job.canExecute && job.status !== 'running') {
        return { success: false, error: `Cannot execute job in '${job.status}' status` };
      }

      const runningJob = job.copyWith({ status: 'running' });
      await this.repository.updateJob(runningJob);

      const execution = JobExecution.create({
        jobId: job.jobId,
        metadata: {
          context: context ? JSON.stringify(context) : undefined,
          triggerType: 'scheduled',
        },
      });

      const createdExecution = await this.repository.createExecution(execution);

      await this.emitEvent({ type: 'JOB_STARTED', job: runningJob, execution: createdExecution });

      logger.info('Job execution started', {
        jobId: job.jobId.value,
        executionId: createdExecution.executionId.value,
      });

      return { success: true, data: createdExecution };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute job';
      logger.error('Failed to execute job', err as Error, { jobId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Completes a job execution successfully.
   */
  async completeJobExecution(
    executionId: string,
    jobId: string
  ): Promise<SchedulerServiceResult<JobExecution>> {
    logger.debug('Completing job execution', { executionId, jobId });

    try {
      const executionIdVO = ExecutionId.reconstruct(executionId);
      const jobIdVO = JobId.reconstruct(jobId);

      const execution = await this.repository.findExecutionById(executionIdVO);
      if (!execution) {
        return { success: false, error: 'Execution not found' };
      }

      const job = await this.repository.findJobById(jobIdVO);
      if (!job) {
        return { success: false, error: 'Job not found' };
      }

      const completedExecution = execution.complete();
      const savedExecution = await this.repository.updateExecution(completedExecution);

      const now = new Date();
      const nextRunAt = this.calculateNextRun(job);
      const updatedJob = job.copyWith({
        status: 'scheduled',
        lastRunAt: now,
        nextRunAt,
      });
      const savedJob = await this.repository.updateJob(updatedJob);

      await this.emitEvent({ type: 'JOB_COMPLETED', job: savedJob, execution: savedExecution });

      logger.info('Job execution completed', {
        jobId,
        executionId,
        nextRunAt: nextRunAt?.toISOString(),
      });

      return { success: true, data: savedExecution };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete job execution';
      logger.error('Failed to complete job execution', err as Error, { executionId, jobId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Fails a job execution.
   */
  async failJobExecution(
    executionId: string,
    jobId: string,
    errorMessage: string
  ): Promise<SchedulerServiceResult<JobExecution>> {
    logger.debug('Failing job execution', { executionId, jobId, errorMessage });

    try {
      const executionIdVO = ExecutionId.reconstruct(executionId);
      const jobIdVO = JobId.reconstruct(jobId);

      const execution = await this.repository.findExecutionById(executionIdVO);
      if (!execution) {
        return { success: false, error: 'Execution not found' };
      }

      const job = await this.repository.findJobById(jobIdVO);
      if (!job) {
        return { success: false, error: 'Job not found' };
      }

      const failedExecution = execution.fail(errorMessage);
      const savedExecution = await this.repository.updateExecution(failedExecution);

      const updatedJob = job.copyWith({ status: 'failed' });
      const savedJob = await this.repository.updateJob(updatedJob);

      await this.emitEvent({ type: 'JOB_FAILED', job: savedJob, execution: savedExecution, error: errorMessage });

      logger.warn('Job execution failed', { jobId, executionId, errorMessage });

      return { success: true, data: savedExecution };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fail job execution';
      logger.error('Failed to fail job execution', err as Error, { executionId, jobId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Cancels a job or execution.
   */
  async cancelJob(jobId: string): Promise<SchedulerServiceResult<ScheduledJob>> {
    logger.debug('Cancelling job', { jobId });

    try {
      const jobIdVO = JobId.reconstruct(jobId);
      const job = await this.repository.findJobById(jobIdVO);

      if (!job) {
        return { success: false, error: 'Job not found' };
      }

      if (!isCancellableJobStatus(job.status)) {
        return { success: false, error: `Cannot cancel job in '${job.status}' status` };
      }

      const cancelledJob = job.copyWith({ status: 'cancelled' });
      const savedJob = await this.repository.updateJob(cancelledJob);

      await this.emitEvent({ type: 'JOB_CANCELLED', job: savedJob });

      logger.info('Job cancelled', { jobId });

      return { success: true, data: savedJob };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel job';
      logger.error('Failed to cancel job', err as Error, { jobId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Cancels an execution.
   */
  async cancelExecution(executionId: string): Promise<SchedulerServiceResult<JobExecution>> {
    logger.debug('Cancelling execution', { executionId });

    try {
      const executionIdVO = ExecutionId.reconstruct(executionId);
      const execution = await this.repository.findExecutionById(executionIdVO);

      if (!execution) {
        return { success: false, error: 'Execution not found' };
      }

      if (!isCancellableExecutionStatus(execution.status)) {
        return { success: false, error: `Cannot cancel execution in '${execution.status}' status` };
      }

      const cancelledExecution = execution.cancel();
      const savedExecution = await this.repository.updateExecution(cancelledExecution);

      logger.info('Execution cancelled', { executionId });

      return { success: true, data: savedExecution };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel execution';
      logger.error('Failed to cancel execution', err as Error, { executionId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Pauses a scheduled job.
   */
  async pauseJob(jobId: string): Promise<SchedulerServiceResult<ScheduledJob>> {
    logger.debug('Pausing job', { jobId });

    try {
      const jobIdVO = JobId.reconstruct(jobId);
      const job = await this.repository.findJobById(jobIdVO);

      if (!job) {
        return { success: false, error: 'Job not found' };
      }

      if (job.status !== 'scheduled' && job.status !== 'pending') {
        return { success: false, error: `Cannot pause job in '${job.status}' status` };
      }

      const pausedJob = job.copyWith({ status: 'pending' });
      const savedJob = await this.repository.updateJob(pausedJob);

      await this.emitEvent({ type: 'JOB_PAUSED', job: savedJob });

      logger.info('Job paused', { jobId });

      return { success: true, data: savedJob };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to pause job';
      logger.error('Failed to pause job', err as Error, { jobId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Resumes a paused job.
   */
  async resumeJob(jobId: string): Promise<SchedulerServiceResult<ScheduledJob>> {
    logger.debug('Resuming job', { jobId });

    try {
      const jobIdVO = JobId.reconstruct(jobId);
      const job = await this.repository.findJobById(jobIdVO);

      if (!job) {
        return { success: false, error: 'Job not found' };
      }

      if (job.status !== 'pending') {
        return { success: false, error: `Cannot resume job in '${job.status}' status` };
      }

      const nextRunAt = this.calculateNextRun(job);
      const resumedJob = job.copyWith({
        status: 'scheduled',
        nextRunAt,
      });
      const savedJob = await this.repository.updateJob(resumedJob);

      await this.emitEvent({ type: 'JOB_RESUMED', job: savedJob });

      logger.info('Job resumed', { jobId, nextRunAt: nextRunAt?.toISOString() });

      return { success: true, data: savedJob };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resume job';
      logger.error('Failed to resume job', err as Error, { jobId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Runs a job manually (triggered by user).
   */
  async runManualJob(jobId: string, context?: Record<string, unknown>): Promise<SchedulerServiceResult<JobExecution>> {
    logger.debug('Running manual job', { jobId });

    try {
      const jobIdVO = JobId.reconstruct(jobId);
      const job = await this.repository.findJobById(jobIdVO);

      if (!job) {
        return { success: false, error: 'Job not found' };
      }

      const execution = JobExecution.create({
        jobId: job.jobId,
        metadata: {
          context: context ? JSON.stringify(context) : undefined,
          triggerType: 'manual',
        },
      });

      const createdExecution = await this.repository.createExecution(execution);

      const runningJob = job.copyWith({ status: 'running' });
      await this.repository.updateJob(runningJob);

      await this.emitEvent({ type: 'JOB_STARTED', job: runningJob, execution: createdExecution });

      logger.info('Manual job started', {
        jobId: job.jobId.value,
        executionId: createdExecution.executionId.value,
      });

      return { success: true, data: createdExecution };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to run manual job';
      logger.error('Failed to run manual job', err as Error, { jobId });
      return { success: false, error: errorMessage };
    }
  }

  // ============ Query Operations ============

  /**
   * Gets a job by ID.
   */
  async getJob(jobId: string): Promise<SchedulerServiceResult<ScheduledJob>> {
    try {
      const jobIdVO = JobId.reconstruct(jobId);
      const job = await this.repository.findJobById(jobIdVO);

      if (!job) {
        return { success: false, error: 'Job not found' };
      }

      return { success: true, data: job };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get job';
      logger.error('Failed to get job', err as Error, { jobId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Gets jobs by key.
   */
  async getJobsByKey(jobKey: string): Promise<SchedulerServiceResult<ScheduledJob[]>> {
    try {
      const jobs = await this.repository.findJobsByKey(jobKey);
      return { success: true, data: jobs };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get jobs by key';
      logger.error('Failed to get jobs by key', err as Error, { jobKey });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Lists jobs with pagination and filtering.
   */
  async listJobs(
    params: PaginationParams,
    filters?: ScheduledJobFilterParams
  ): Promise<SchedulerServiceResult<PaginatedResult<ScheduledJob>>> {
    try {
      const result = await this.repository.listJobs(params, filters);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to list jobs';
      logger.error('Failed to list jobs', err as Error);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Gets jobs due for execution.
   */
  async getJobsDueForExecution(): Promise<SchedulerServiceResult<ScheduledJob[]>> {
    try {
      const jobs = await this.repository.findJobsDueForExecution();
      return { success: true, data: jobs };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get jobs due for execution';
      logger.error('Failed to get jobs due for execution', err as Error);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Gets an execution by ID.
   */
  async getExecution(executionId: string): Promise<SchedulerServiceResult<JobExecution>> {
    try {
      const executionIdVO = ExecutionId.reconstruct(executionId);
      const execution = await this.repository.findExecutionById(executionIdVO);

      if (!execution) {
        return { success: false, error: 'Execution not found' };
      }

      return { success: true, data: execution };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get execution';
      logger.error('Failed to get execution', err as Error, { executionId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Gets executions for a job.
   */
  async getExecutionsByJobId(jobId: string, limit?: number): Promise<SchedulerServiceResult<JobExecution[]>> {
    try {
      const jobIdVO = JobId.reconstruct(jobId);
      const executions = await this.repository.findExecutionsByJobId(jobIdVO, limit);
      return { success: true, data: executions };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get executions';
      logger.error('Failed to get executions', err as Error, { jobId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Lists executions with pagination.
   */
  async listExecutions(
    params: PaginationParams,
    filters?: { jobId?: string; status?: string }
  ): Promise<SchedulerServiceResult<PaginatedResult<JobExecution>>> {
    try {
      const result = await this.repository.listExecutions(params, filters as never);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to list executions';
      logger.error('Failed to list executions', err as Error);
      return { success: false, error: errorMessage };
    }
  }

  // ============ Statistics ============

  /**
   * Gets scheduler summary statistics.
   */
  async getSchedulerSummary(): Promise<SchedulerServiceResult<SchedulerStatistics>> {
    try {
      const jobsResult = await this.repository.listJobs({ page: 1, pageSize: 1 });

      const statistics: SchedulerStatistics = {
        totalJobs: jobsResult.total,
        activeJobs: 0,
        runningJobs: 0,
        scheduledJobs: 0,
        pendingJobs: 0,
        executionsLastHour: 0,
        executionsLast24Hours: 0,
        averageWaitTimeMs: 0,
        successRatePercent: 100,
        failureRatePercent: 0,
      };

      return { success: true, data: statistics };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get scheduler summary';
      logger.error('Failed to get scheduler summary', err as Error);
      return { success: false, error: errorMessage };
    }
  }

  // ============ Helper Methods ============

  /**
   * Calculates the next run time for a job based on its schedule type.
   */
  private calculateNextRun(job: ScheduledJob): Date | undefined {
    const now = new Date();

    switch (job.scheduleType) {
      case 'cron':
        if (!job.cronExpression) return undefined;
        return new Date(now.getTime() + 60000);

      case 'interval': {
        const intervalMs = job.metadata.intervalMs ?? 60000;
        return new Date(now.getTime() + intervalMs);
      }

      case 'daily': {
        if (job.metadata.timeOfDay) {
          const [hours, minutes] = job.metadata.timeOfDay.split(':').map(Number);
          const next = new Date(now);
          next.setHours(hours, minutes, 0, 0);
          if (next <= now) {
            next.setDate(next.getDate() + 1);
          }
          return next;
        }
        return new Date(now.getTime() + 86400000);
      }

      case 'weekly':
        return new Date(now.getTime() + 604800000);

      case 'monthly':
        return new Date(now.getTime() + 2592000000);

      case 'manual':
      case 'startup':
      default:
        return undefined;
    }
  }

  /**
   * Starts the scheduler service.
   */
  public start(): void {
    this.isRunning = true;
    logger.info('Scheduler service started');
  }

  /**
   * Stops the scheduler service.
   */
  public stop(): void {
    this.isRunning = false;
    logger.info('Scheduler service stopped');
  }

  /**
   * Checks if the scheduler service is running.
   */
  public getIsRunning(): boolean {
    return this.isRunning;
  }
}
