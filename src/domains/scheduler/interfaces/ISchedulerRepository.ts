/**
 * ISchedulerRepository Interface
 *
 * Interface defining the contract for Scheduler persistence.
 * All SchedulerRepository implementations must adhere to this interface.
 */

import type { JobId } from '../value-objects/JobId';
import type { ExecutionId } from '../value-objects/ExecutionId';
import type { DefinitionId } from '../value-objects/DefinitionId';
import type { ScheduledJob } from '../entities/ScheduledJob';
import type { JobExecution } from '../entities/JobExecution';
import type { JobDefinition } from '../entities/JobDefinition';
import type { JobStatus } from '../types/JobStatus';
import type { ExecutionStatus } from '../types/ExecutionStatus';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying scheduled jobs.
 */
export interface ScheduledJobFilterParams {
  /** Filter by job key */
  jobKey?: string;
  /** Filter by status */
  status?: JobStatus;
  /** Filter by enabled status */
  isEnabled?: boolean;
  /** Filter by schedule type */
  scheduleType?: string;
}

/**
 * Filter parameters for querying job executions.
 */
export interface JobExecutionFilterParams {
  /** Filter by job ID */
  jobId?: JobId;
  /** Filter by status */
  status?: ExecutionStatus;
  /** Filter by date range start */
  startedAfter?: Date;
  /** Filter by date range end */
  startedBefore?: Date;
}

/**
 * Scheduler repository interface.
 * Defines all data access operations for scheduler entities.
 */
export interface ISchedulerRepository {
  // ============ ScheduledJob Operations ============

  /**
   * Creates a new scheduled job.
   * @param job The job to create
   * @returns The created job
   */
  createJob(job: ScheduledJob): Promise<ScheduledJob>;

  /**
   * Finds a scheduled job by its ID.
   * @param id The job ID to find
   * @returns The job if found, null otherwise
   */
  findJobById(id: JobId): Promise<ScheduledJob | null>;

  /**
   * Finds scheduled jobs by their job key.
   * @param jobKey The job key to find
   * @returns Array of matching jobs
   */
  findJobsByKey(jobKey: string): Promise<ScheduledJob[]>;

  /**
   * Updates an existing scheduled job.
   * @param job The job to update
   * @returns The updated job
   */
  updateJob(job: ScheduledJob): Promise<ScheduledJob>;

  /**
   * Deletes a scheduled job.
   * @param id The job ID to delete
   */
  deleteJob(id: JobId): Promise<void>;

  /**
   * Lists scheduled jobs with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of jobs
   */
  listJobs(
    params: PaginationParams,
    filters?: ScheduledJobFilterParams
  ): Promise<PaginatedResult<ScheduledJob>>;

  /**
   * Finds all jobs due for execution.
   * @returns Array of jobs ready to execute
   */
  findJobsDueForExecution(): Promise<ScheduledJob[]>;

  // ============ JobExecution Operations ============

  /**
   * Creates a new job execution record.
   * @param execution The execution to create
   * @returns The created execution
   */
  createExecution(execution: JobExecution): Promise<JobExecution>;

  /**
   * Finds a job execution by its ID.
   * @param id The execution ID to find
   * @returns The execution if found, null otherwise
   */
  findExecutionById(id: ExecutionId): Promise<JobExecution | null>;

  /**
   * Finds executions for a specific job.
   * @param jobId The job ID
   * @param limit Maximum number of executions to return
   * @returns Array of executions
   */
  findExecutionsByJobId(jobId: JobId, limit?: number): Promise<JobExecution[]>;

  /**
   * Updates an existing job execution.
   * @param execution The execution to update
   * @returns The updated execution
   */
  updateExecution(execution: JobExecution): Promise<JobExecution>;

  /**
   * Lists job executions with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of executions
   */
  listExecutions(
    params: PaginationParams,
    filters?: JobExecutionFilterParams
  ): Promise<PaginatedResult<JobExecution>>;

  // ============ JobDefinition Operations ============

  /**
   * Creates a new job definition.
   * @param definition The definition to create
   * @returns The created definition
   */
  createDefinition(definition: JobDefinition): Promise<JobDefinition>;

  /**
   * Finds a job definition by its ID.
   * @param id The definition ID to find
   * @returns The definition if found, null otherwise
   */
  findDefinitionById(id: DefinitionId): Promise<JobDefinition | null>;

  /**
   * Finds a job definition by its handler name.
   * @param handler The handler name to find
   * @returns The definition if found, null otherwise
   */
  findDefinitionByHandler(handler: string): Promise<JobDefinition | null>;

  /**
   * Updates an existing job definition.
   * @param definition The definition to update
   * @returns The updated definition
   */
  updateDefinition(definition: JobDefinition): Promise<JobDefinition>;

  /**
   * Deletes a job definition.
   * @param id The definition ID to delete
   */
  deleteDefinition(id: DefinitionId): Promise<void>;

  /**
   * Lists job definitions with pagination.
   * @param params Pagination parameters
   * @returns Paginated result of definitions
   */
  listDefinitions(
    params: PaginationParams
  ): Promise<PaginatedResult<JobDefinition>>;
}
