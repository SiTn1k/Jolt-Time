/**
 * Supabase Scheduler Repository
 *
 * Production Supabase implementation of the Scheduler repository.
 * Handles all persistence operations for scheduler entities.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type {
  ISchedulerRepository,
  ScheduledJobFilterParams,
  JobExecutionFilterParams,
} from '../interfaces/ISchedulerRepository';
import { ScheduledJob } from '../entities/ScheduledJob';
import { JobExecution } from '../entities/JobExecution';
import { JobDefinition } from '../entities/JobDefinition';
import { JobId } from '../value-objects/JobId';
import { ExecutionId } from '../value-objects/ExecutionId';
import { DefinitionId } from '../value-objects/DefinitionId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { createLogger } from '../../../core/logging/logger.service';
import { RepositoryError } from '../../../database/errors/repository.error';
import { DatabaseError } from '../../../database/errors/database.error';
import { getSupabaseAdminClient } from '../../../database/providers/supabase.provider';

const logger = createLogger('SupabaseSchedulerRepository');

/**
 * Raw database row types for scheduler tables.
 */
interface ScheduledJobRow {
  job_id: string;
  job_key: string;
  job_name: string;
  schedule_type: string;
  cron_expression: string | null;
  status: string;
  priority: string;
  next_run_at: string | null;
  last_run_at: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown>;
}

interface JobExecutionRow {
  execution_id: string;
  job_id: string;
  started_at: string;
  finished_at: string | null;
  duration: number | null;
  status: string;
  error_message: string | null;
  metadata: Record<string, unknown>;
}

interface JobDefinitionRow {
  definition_id: string;
  name: string;
  description: string;
  handler: string;
  retry_limit: number;
  timeout: number;
  metadata: Record<string, unknown>;
}

/**
 * Supabase implementation of the Scheduler Repository.
 * Implements ISchedulerRepository for scheduler entity persistence.
 */
export class SupabaseSchedulerRepository implements ISchedulerRepository {
  private readonly tableNameJobs = 'scheduled_jobs';
  private readonly tableNameExecutions = 'job_executions';
  private readonly tableNameDefinitions = 'job_definitions';
  private readonly _client: SupabaseClient<Database>;

  /**
   * Creates a new SupabaseSchedulerRepository instance.
   * @param client Optional Supabase client (uses admin client if not provided)
   */
  constructor(client?: SupabaseClient<Database>) {
    this._client = client ?? getSupabaseAdminClient();
  }

  /**
   * Get the client, ensuring it's initialized.
   */
  private getClient(): SupabaseClient<Database> {
    if (!this._client) {
      throw DatabaseError.connectionFailed(new Error('SupabaseSchedulerRepository: Client not initialized'));
    }
    return this._client;
  }

  // ============ ScheduledJob Operations ============

  /**
   * Creates a new scheduled job.
   */
  async createJob(job: ScheduledJob): Promise<ScheduledJob> {
    try {
      const record = job.toRecord();
      const { data, error } = await this.getClient()
        .from(this.tableNameJobs)
        .insert({
          job_id: record.job_id,
          job_key: record.job_key,
          job_name: record.job_name,
          schedule_type: record.schedule_type,
          cron_expression: record.cron_expression,
          status: record.status,
          priority: record.priority,
          next_run_at: record.next_run_at,
          last_run_at: record.last_run_at,
          created_at: record.created_at,
          updated_at: record.updated_at,
          metadata: record.metadata,
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to create scheduled job', error);
        throw RepositoryError.createFailed('ScheduledJob', error as Error);
      }

      return this.mapRowToScheduledJob(data as unknown as ScheduledJobRow);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Error creating scheduled job', err as Error);
      throw RepositoryError.createFailed('ScheduledJob', err as Error);
    }
  }

  /**
   * Finds a scheduled job by its ID.
   */
  async findJobById(id: JobId): Promise<ScheduledJob | null> {
    try {
      const { data, error } = await this.getClient()
        .from(this.tableNameJobs)
        .select('*')
        .eq('job_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find job by ID', error);
        throw RepositoryError.queryFailed('findJobById', error as Error);
      }

      return this.mapRowToScheduledJob(data as unknown as ScheduledJobRow);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Error finding job by ID', err as Error);
      throw RepositoryError.queryFailed('findJobById', err as Error);
    }
  }

  /**
   * Finds scheduled jobs by their job key.
   */
  async findJobsByKey(jobKey: string): Promise<ScheduledJob[]> {
    try {
      const { data, error } = await this.getClient()
        .from(this.tableNameJobs)
        .select('*')
        .eq('job_key', jobKey);

      if (error) {
        logger.error('Failed to find jobs by key', error);
        throw RepositoryError.queryFailed('findJobsByKey', error as Error);
      }

      return (data as unknown as ScheduledJobRow[]).map((row) =>
        this.mapRowToScheduledJob(row)
      );
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Error finding jobs by key', err as Error);
      throw RepositoryError.queryFailed('findJobsByKey', err as Error);
    }
  }

  /**
   * Updates an existing scheduled job.
   */
  async updateJob(job: ScheduledJob): Promise<ScheduledJob> {
    try {
      const record = job.toRecord();
      const { data, error } = await this.getClient()
        .from(this.tableNameJobs)
        .update({
          job_key: record.job_key,
          job_name: record.job_name,
          schedule_type: record.schedule_type,
          cron_expression: record.cron_expression,
          status: record.status,
          priority: record.priority,
          next_run_at: record.next_run_at,
          last_run_at: record.last_run_at,
          updated_at: record.updated_at,
          metadata: record.metadata,
        })
        .eq('job_id', record.job_id)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update scheduled job', error);
        throw RepositoryError.updateFailed('ScheduledJob', record.job_id, error as Error);
      }

      return this.mapRowToScheduledJob(data as unknown as ScheduledJobRow);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Error updating scheduled job', err as Error);
      throw RepositoryError.updateFailed('ScheduledJob', job.jobId.value, err as Error);
    }
  }

  /**
   * Deletes a scheduled job.
   */
  async deleteJob(id: JobId): Promise<void> {
    try {
      const { error } = await this.getClient()
        .from(this.tableNameJobs)
        .delete()
        .eq('job_id', id.value);

      if (error) {
        logger.error('Failed to delete scheduled job', error);
        throw RepositoryError.deleteFailed('ScheduledJob', id.value, error as Error);
      }
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Error deleting scheduled job', err as Error);
      throw RepositoryError.deleteFailed('ScheduledJob', id.value, err as Error);
    }
  }

  /**
   * Lists scheduled jobs with pagination and filtering.
   */
  async listJobs(
    params: PaginationParams,
    filters?: ScheduledJobFilterParams
  ): Promise<PaginatedResult<ScheduledJob>> {
    try {
      const { page = 1, pageSize = 20 } = params;
      const offset = (page - 1) * pageSize;

      let query = this.getClient()
        .from(this.tableNameJobs)
        .select('*', { count: 'exact' });

      if (filters?.jobKey) {
        query = query.eq('job_key', filters.jobKey);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.scheduleType) {
        query = query.eq('schedule_type', filters.scheduleType);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

      if (error) {
        logger.error('Failed to list scheduled jobs', error);
        throw RepositoryError.queryFailed('listJobs', error as Error);
      }

      const jobs = (data as unknown as ScheduledJobRow[]).map((row) =>
        this.mapRowToScheduledJob(row)
      );

      const totalPages = Math.ceil((count ?? jobs.length) / pageSize);

      return {
        items: jobs,
        total: count ?? jobs.length,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Error listing scheduled jobs', err as Error);
      throw RepositoryError.queryFailed('listJobs', err as Error);
    }
  }

  /**
   * Finds all jobs due for execution.
   */
  async findJobsDueForExecution(): Promise<ScheduledJob[]> {
    try {
      const now = new Date().toISOString();
      const { data, error } = await this.getClient()
        .from(this.tableNameJobs)
        .select('*')
        .eq('status', 'scheduled')
        .or(`next_run_at.is.null,next_run_at.lte.${now}`)
        .order('priority', { ascending: false })
        .order('next_run_at', { ascending: true, nullsFirst: true });

      if (error) {
        logger.error('Failed to find jobs due for execution', error);
        throw RepositoryError.queryFailed('findJobsDueForExecution', error as Error);
      }

      return (data as unknown as ScheduledJobRow[]).map((row) =>
        this.mapRowToScheduledJob(row)
      );
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Error finding jobs due for execution', err as Error);
      throw RepositoryError.queryFailed('findJobsDueForExecution', err as Error);
    }
  }

  // ============ JobExecution Operations ============

  /**
   * Creates a new job execution record.
   */
  async createExecution(execution: JobExecution): Promise<JobExecution> {
    try {
      const record = execution.toRecord();
      const { data, error } = await this.getClient()
        .from(this.tableNameExecutions)
        .insert({
          execution_id: record.execution_id,
          job_id: record.job_id,
          started_at: record.started_at,
          finished_at: record.finished_at,
          duration: record.duration,
          status: record.status,
          error_message: record.error_message,
          metadata: record.metadata,
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to create job execution', error);
        throw RepositoryError.createFailed('JobExecution', error as Error);
      }

      return this.mapRowToJobExecution(data as unknown as JobExecutionRow);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Error creating job execution', err as Error);
      throw RepositoryError.createFailed('JobExecution', err as Error);
    }
  }

  /**
   * Finds a job execution by its ID.
   */
  async findExecutionById(id: ExecutionId): Promise<JobExecution | null> {
    try {
      const { data, error } = await this.getClient()
        .from(this.tableNameExecutions)
        .select('*')
        .eq('execution_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find execution by ID', error);
        throw RepositoryError.queryFailed('findExecutionById', error as Error);
      }

      return this.mapRowToJobExecution(data as unknown as JobExecutionRow);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Error finding execution by ID', err as Error);
      throw RepositoryError.queryFailed('findExecutionById', err as Error);
    }
  }

  /**
   * Finds executions for a specific job.
   */
  async findExecutionsByJobId(jobId: JobId, limit?: number): Promise<JobExecution[]> {
    try {
      let query = this.getClient()
        .from(this.tableNameExecutions)
        .select('*')
        .eq('job_id', jobId.value)
        .order('started_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Failed to find executions by job ID', error);
        throw RepositoryError.queryFailed('findExecutionsByJobId', error as Error);
      }

      return (data as unknown as JobExecutionRow[]).map((row) =>
        this.mapRowToJobExecution(row)
      );
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Error finding executions by job ID', err as Error);
      throw RepositoryError.queryFailed('findExecutionsByJobId', err as Error);
    }
  }

  /**
   * Updates an existing job execution.
   */
  async updateExecution(execution: JobExecution): Promise<JobExecution> {
    try {
      const record = execution.toRecord();
      const { data, error } = await this.getClient()
        .from(this.tableNameExecutions)
        .update({
          finished_at: record.finished_at,
          duration: record.duration,
          status: record.status,
          error_message: record.error_message,
          metadata: record.metadata,
        })
        .eq('execution_id', record.execution_id)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update job execution', error);
        throw RepositoryError.updateFailed('JobExecution', record.execution_id, error as Error);
      }

      return this.mapRowToJobExecution(data as unknown as JobExecutionRow);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Error updating job execution', err as Error);
      throw RepositoryError.updateFailed('JobExecution', execution.executionId.value, err as Error);
    }
  }

  /**
   * Lists job executions with pagination and filtering.
   */
  async listExecutions(
    params: PaginationParams,
    filters?: JobExecutionFilterParams
  ): Promise<PaginatedResult<JobExecution>> {
    try {
      const { page = 1, pageSize = 20 } = params;
      const offset = (page - 1) * pageSize;

      let query = this.getClient()
        .from(this.tableNameExecutions)
        .select('*', { count: 'exact' });

      if (filters?.jobId) {
        query = query.eq('job_id', filters.jobId.value);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.startedAfter) {
        query = query.gte('started_at', filters.startedAfter.toISOString());
      }
      if (filters?.startedBefore) {
        query = query.lte('started_at', filters.startedBefore.toISOString());
      }

      const { data, error, count } = await query
        .order('started_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

      if (error) {
        logger.error('Failed to list job executions', error);
        throw RepositoryError.queryFailed('listExecutions', error as Error);
      }

      const executions = (data as unknown as JobExecutionRow[]).map((row) =>
        this.mapRowToJobExecution(row)
      );

      const totalPages = Math.ceil((count ?? executions.length) / pageSize);

      return {
        items: executions,
        total: count ?? executions.length,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Error listing job executions', err as Error);
      throw RepositoryError.queryFailed('listExecutions', err as Error);
    }
  }

  // ============ JobDefinition Operations ============

  /**
   * Creates a new job definition.
   */
  async createDefinition(definition: JobDefinition): Promise<JobDefinition> {
    try {
      const record = definition.toRecord();
      const { data, error } = await this.getClient()
        .from(this.tableNameDefinitions)
        .insert({
          definition_id: record.definition_id,
          name: record.name,
          description: record.description,
          handler: record.handler,
          retry_limit: record.retry_limit,
          timeout: record.timeout,
          metadata: record.metadata,
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to create job definition', error);
        throw RepositoryError.createFailed('JobDefinition', error as Error);
      }

      return this.mapRowToJobDefinition(data as unknown as JobDefinitionRow);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Error creating job definition', err as Error);
      throw RepositoryError.createFailed('JobDefinition', err as Error);
    }
  }

  /**
   * Finds a job definition by its ID.
   */
  async findDefinitionById(id: DefinitionId): Promise<JobDefinition | null> {
    try {
      const { data, error } = await this.getClient()
        .from(this.tableNameDefinitions)
        .select('*')
        .eq('definition_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find definition by ID', error);
        throw RepositoryError.queryFailed('findDefinitionById', error as Error);
      }

      return this.mapRowToJobDefinition(data as unknown as JobDefinitionRow);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Error finding definition by ID', err as Error);
      throw RepositoryError.queryFailed('findDefinitionById', err as Error);
    }
  }

  /**
   * Finds a job definition by its handler name.
   */
  async findDefinitionByHandler(handler: string): Promise<JobDefinition | null> {
    try {
      const { data, error } = await this.getClient()
        .from(this.tableNameDefinitions)
        .select('*')
        .eq('handler', handler)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find definition by handler', error);
        throw RepositoryError.queryFailed('findDefinitionByHandler', error as Error);
      }

      return this.mapRowToJobDefinition(data as unknown as JobDefinitionRow);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Error finding definition by handler', err as Error);
      throw RepositoryError.queryFailed('findDefinitionByHandler', err as Error);
    }
  }

  /**
   * Updates an existing job definition.
   */
  async updateDefinition(definition: JobDefinition): Promise<JobDefinition> {
    try {
      const record = definition.toRecord();
      const { data, error } = await this.getClient()
        .from(this.tableNameDefinitions)
        .update({
          name: record.name,
          description: record.description,
          handler: record.handler,
          retry_limit: record.retry_limit,
          timeout: record.timeout,
          metadata: record.metadata,
        })
        .eq('definition_id', record.definition_id)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update job definition', error);
        throw RepositoryError.updateFailed('JobDefinition', record.definition_id, error as Error);
      }

      return this.mapRowToJobDefinition(data as unknown as JobDefinitionRow);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Error updating job definition', err as Error);
      throw RepositoryError.updateFailed('JobDefinition', definition.definitionId.value, err as Error);
    }
  }

  /**
   * Deletes a job definition.
   */
  async deleteDefinition(id: DefinitionId): Promise<void> {
    try {
      const { error } = await this.getClient()
        .from(this.tableNameDefinitions)
        .delete()
        .eq('definition_id', id.value);

      if (error) {
        logger.error('Failed to delete job definition', error);
        throw RepositoryError.deleteFailed('JobDefinition', id.value, error as Error);
      }
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Error deleting job definition', err as Error);
      throw RepositoryError.deleteFailed('JobDefinition', id.value, err as Error);
    }
  }

  /**
   * Lists job definitions with pagination.
   */
  async listDefinitions(
    params: PaginationParams
  ): Promise<PaginatedResult<JobDefinition>> {
    try {
      const { page = 1, pageSize = 20 } = params;
      const offset = (page - 1) * pageSize;

      const { data, error, count } = await this.getClient()
        .from(this.tableNameDefinitions)
        .select('*', { count: 'exact' })
        .order('name', { ascending: true })
        .range(offset, offset + pageSize - 1);

      if (error) {
        logger.error('Failed to list job definitions', error);
        throw RepositoryError.queryFailed('listDefinitions', error as Error);
      }

      const definitions = (data as unknown as JobDefinitionRow[]).map((row) =>
        this.mapRowToJobDefinition(row)
      );

      const totalPages = Math.ceil((count ?? definitions.length) / pageSize);

      return {
        items: definitions,
        total: count ?? definitions.length,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Error listing job definitions', err as Error);
      throw RepositoryError.queryFailed('listDefinitions', err as Error);
    }
  }

  // ============ Helper Methods ============

  /**
   * Maps a database row to a ScheduledJob entity.
   */
  private mapRowToScheduledJob(row: ScheduledJobRow): ScheduledJob {
    return ScheduledJob.fromStorage({
      job_id: row.job_id,
      job_key: row.job_key,
      job_name: row.job_name,
      schedule_type: row.schedule_type as import('../types/ScheduleType').ScheduleType,
      cron_expression: row.cron_expression ?? undefined,
      status: row.status as import('../types/JobStatus').JobStatus,
      priority: row.priority as import('../types/SchedulerPriority').SchedulerPriority,
      next_run_at: row.next_run_at ?? undefined,
      last_run_at: row.last_run_at ?? undefined,
      created_at: row.created_at,
      updated_at: row.updated_at,
      metadata: row.metadata as import('../types/SchedulerMetadata').SchedulerJobMetadata,
    });
  }

  /**
   * Maps a database row to a JobExecution entity.
   */
  private mapRowToJobExecution(row: JobExecutionRow): JobExecution {
    return JobExecution.fromStorage({
      execution_id: row.execution_id,
      job_id: row.job_id,
      started_at: row.started_at,
      finished_at: row.finished_at ?? undefined,
      duration: row.duration ?? undefined,
      status: row.status as import('../types/ExecutionStatus').ExecutionStatus,
      error_message: row.error_message ?? undefined,
      metadata: row.metadata as import('../types/SchedulerMetadata').SchedulerExecutionMetadata,
    });
  }

  /**
   * Maps a database row to a JobDefinition entity.
   */
  private mapRowToJobDefinition(row: JobDefinitionRow): JobDefinition {
    return JobDefinition.fromStorage({
      definition_id: row.definition_id,
      name: row.name,
      description: row.description,
      handler: row.handler,
      retry_limit: row.retry_limit,
      timeout: row.timeout,
      metadata: row.metadata as import('../types/SchedulerMetadata').SchedulerDefinitionMetadata,
    });
  }
}
