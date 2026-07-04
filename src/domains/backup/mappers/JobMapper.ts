/**
 * JobMapper
 *
 * Maps between BackupJob entity and DTOs.
 * No backup logic - pure transformation only.
 */

import type { BackupJobRecord } from '../entities/BackupJob';
import { BackupJob } from '../entities/BackupJob';
import type { BackupJobDto, CreateBackupJobDto, UpdateBackupJobDto, JobListDto } from '../dto/BackupJob.dto';
import type { JobScheduleType } from '../entities/BackupJob';

/**
 * Mapper for converting between BackupJob entity and DTOs.
 */
export class JobMapper {
  /**
   * Converts a BackupJob entity to BackupJobDto.
   */
  public static toDto(job: BackupJob): BackupJobDto {
    return {
      jobId: job.jobId.value,
      jobName: job.jobName,
      scheduleType: job.scheduleType,
      status: job.status,
      lastRunAt: job.lastRunAt?.toISOString() ?? null,
      nextRunAt: job.nextRunAt?.toISOString() ?? null,
      metadata: job.metadata,
    };
  }

  /**
   * Converts a BackupJob entity to a database record format.
   */
  public static toRecord(job: BackupJob): BackupJobRecord {
    return job.toRecord();
  }

  /**
   * Converts a database record to BackupJobDto.
   */
  public static fromRecordToDto(record: BackupJobRecord): BackupJobDto {
    return {
      jobId: record.job_id,
      jobName: record.job_name,
      scheduleType: record.schedule_type as JobScheduleType,
      status: record.status as BackupJobDto['status'],
      lastRunAt: record.last_run_at,
      nextRunAt: record.next_run_at,
      metadata: record.metadata,
    };
  }

  /**
   * Converts a database record to BackupJob entity.
   */
  public static fromRecord(record: BackupJobRecord): BackupJob {
    return BackupJob.fromDatabase(record);
  }

  /**
   * Converts an array of BackupJob entities to JobListDto.
   */
  public static toListDto(
    jobs: BackupJob[],
    total: number,
    page: number,
    pageSize: number
  ): JobListDto {
    return {
      jobs: jobs.map((j) => this.toDto(j)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Converts a CreateBackupJobDto to partial job props for entity creation.
   */
  public static fromCreateDto(dto: CreateBackupJobDto): {
    jobName: string;
    scheduleType: CreateBackupJobDto['scheduleType'];
    metadata?: CreateBackupJobDto['metadata'];
  } {
    return {
      jobName: dto.jobName,
      scheduleType: dto.scheduleType,
      metadata: dto.metadata as CreateBackupJobDto['metadata'],
    };
  }

  /**
   * Converts an UpdateBackupJobDto to partial job props for entity updates.
   */
  public static fromUpdateDto(dto: UpdateBackupJobDto): Partial<{
    jobName: string;
    scheduleType: UpdateBackupJobDto['scheduleType'];
    status: UpdateBackupJobDto['status'];
    lastRunAt: Date | null;
    nextRunAt: Date | null;
    metadata: UpdateBackupJobDto['metadata'];
  }> {
    return {
      jobName: dto.jobName,
      scheduleType: dto.scheduleType,
      status: dto.status,
      lastRunAt: dto.lastRunAt ? new Date(dto.lastRunAt) : null,
      nextRunAt: dto.nextRunAt ? new Date(dto.nextRunAt) : null,
      metadata: dto.metadata as UpdateBackupJobDto['metadata'],
    };
  }
}
