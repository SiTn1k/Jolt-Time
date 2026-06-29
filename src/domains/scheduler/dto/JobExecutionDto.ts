/**
 * JobExecutionDto
 *
 * Data transfer object for job execution responses.
 */

import type { ExecutionStatus } from '../types/ExecutionStatus';
import type { SchedulerExecutionMetadata } from '../types/SchedulerMetadata';

/**
 * Response DTO for a job execution.
 */
export interface JobExecutionDto {
  executionId: string;
  jobId: string;
  startedAt: string;
  finishedAt?: string;
  duration?: number;
  status: ExecutionStatus;
  errorMessage?: string;
  metadata: SchedulerExecutionMetadata;
}

/**
 * Response DTO for job execution list.
 */
export interface JobExecutionListDto {
  executions: JobExecutionDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * DTO for job execution statistics.
 */
export interface JobExecutionStatisticsDto {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageDurationMs: number;
  lastExecutedAt?: string;
  lastSuccessfulAt?: string;
  lastFailedAt?: string;
}
