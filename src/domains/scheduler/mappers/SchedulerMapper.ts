/**
 * Scheduler Mapper
 *
 * Maps between ScheduledJob entity and DTOs.
 * No scheduling logic - pure transformation only.
 */

import type { ScheduledJob } from '../entities/ScheduledJob';
import type { ScheduledJobRecord } from '../entities/ScheduledJob';
import type {
  ScheduledJobDto,
  ScheduledJobListDto,
  CreateScheduledJobDto,
  UpdateScheduledJobDto,
} from '../dto/ScheduledJobDto';

/**
 * Mapper for converting between ScheduledJob entity and DTOs.
 */
export class SchedulerMapper {
  /**
   * Converts a ScheduledJob entity to ScheduledJobDto.
   */
  public static toDto(job: ScheduledJob): ScheduledJobDto {
    return {
      jobId: job.jobId.value,
      jobKey: job.jobKey,
      jobName: job.jobName,
      scheduleType: job.scheduleType,
      cronExpression: job.cronExpression,
      status: job.status,
      priority: job.priority,
      nextRunAt: job.nextRunAt?.toISOString(),
      lastRunAt: job.lastRunAt?.toISOString(),
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
      metadata: job.metadata,
    };
  }

  /**
   * Converts a ScheduledJob entity to a database record format.
   */
  public static toRecord(job: ScheduledJob): ScheduledJobRecord {
    return job.toRecord();
  }

  /**
   * Converts a database record to ScheduledJobDto.
   */
  public static fromRecordToDto(record: ScheduledJobRecord): ScheduledJobDto {
    return {
      jobId: record.job_id,
      jobKey: record.job_key,
      jobName: record.job_name,
      scheduleType: record.schedule_type,
      cronExpression: record.cron_expression,
      status: record.status,
      priority: record.priority,
      nextRunAt: record.next_run_at,
      lastRunAt: record.last_run_at,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      metadata: record.metadata,
    };
  }

  /**
   * Converts an array of ScheduledJob entities to ScheduledJobListDto.
   */
  public static toListDto(jobs: ScheduledJob[], total: number, page: number, pageSize: number): ScheduledJobListDto {
    return {
      jobs: jobs.map((job) => this.toDto(job)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
