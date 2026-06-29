/**
 * SchedulerResponseDto
 *
 * Data transfer objects for scheduler responses.
 */

import type { SchedulerStatistics } from '../types/SchedulerStatistics';

/**
 * Response DTO for scheduler statistics.
 */
export interface SchedulerResponseDto {
  totalJobs: number;
  activeJobs: number;
  runningJobs: number;
  scheduledJobs: number;
  pendingJobs: number;
  executionsLastHour: number;
  executionsLast24Hours: number;
  averageWaitTimeMs: number;
  successRatePercent: number;
  failureRatePercent: number;
}

/**
 * Response DTO for scheduler health status.
 */
export interface SchedulerHealthDto {
  isHealthy: boolean;
  isRunning: boolean;
  lastHeartbeatAt?: string;
  uptimeSeconds: number;
  activeWorkers: number;
}

/**
 * Converts SchedulerStatistics to SchedulerResponseDto.
 */
export function toSchedulerResponseDto(stats: SchedulerStatistics): SchedulerResponseDto {
  return {
    totalJobs: stats.totalJobs,
    activeJobs: stats.activeJobs,
    runningJobs: stats.runningJobs,
    scheduledJobs: stats.scheduledJobs,
    pendingJobs: stats.pendingJobs,
    executionsLastHour: stats.executionsLastHour,
    executionsLast24Hours: stats.executionsLast24Hours,
    averageWaitTimeMs: stats.averageWaitTimeMs,
    successRatePercent: stats.successRatePercent,
    failureRatePercent: stats.failureRatePercent,
  };
}
