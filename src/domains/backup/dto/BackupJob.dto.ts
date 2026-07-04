/**
 * BackupJobDto
 *
 * Data Transfer Object for backup job operations.
 */

import type { BackupStatus } from '../types/BackupStatus';
import type { JobMetadata } from '../types/BackupMetadata';
import type { JobScheduleType } from '../entities/BackupJob';

/**
 * DTO for job data.
 */
export interface BackupJobDto {
  jobId: string;
  jobName: string;
  scheduleType: JobScheduleType;
  status: BackupStatus;
  lastRunAt: string | null;
  nextRunAt: string | null;
  metadata: JobMetadata;
}

/**
 * DTO for creating a new job.
 */
export interface CreateBackupJobDto {
  jobName: string;
  scheduleType: JobScheduleType;
  metadata?: Partial<JobMetadata>;
}

/**
 * DTO for updating a job.
 */
export interface UpdateBackupJobDto {
  jobName?: string;
  scheduleType?: JobScheduleType;
  status?: BackupStatus;
  lastRunAt?: string | null;
  nextRunAt?: string | null;
  metadata?: Partial<JobMetadata>;
}

/**
 * DTO for job list response.
 */
export interface JobListDto {
  jobs: BackupJobDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
