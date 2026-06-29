/**
 * SchedulerStatistics
 *
 * Statistics types for the scheduler domain.
 */

/**
 * Statistics for a scheduled job.
 */
export interface SchedulerJobStatistics {
  /** Total number of executions */
  totalExecutions: number;
  /** Number of successful executions */
  successfulExecutions: number;
  /** Number of failed executions */
  failedExecutions: number;
  /** Average execution duration in milliseconds */
  averageDurationMs: number;
  /** Last execution timestamp */
  lastExecutedAt?: Date;
  /** Last successful execution timestamp */
  lastSuccessfulAt?: Date;
  /** Last failed execution timestamp */
  lastFailedAt?: Date;
  /** Next scheduled execution */
  nextScheduledAt?: Date;
}

/**
 * Statistics for the scheduler overall.
 */
export interface SchedulerStatistics {
  /** Total number of scheduled jobs */
  totalJobs: number;
  /** Number of active jobs */
  activeJobs: number;
  /** Number of jobs running */
  runningJobs: number;
  /** Number of jobs scheduled for execution */
  scheduledJobs: number;
  /** Number of jobs pending execution */
  pendingJobs: number;
  /** Total executions in the last hour */
  executionsLastHour: number;
  /** Total executions in the last 24 hours */
  executionsLast24Hours: number;
  /** Average queue wait time in milliseconds */
  averageWaitTimeMs: number;
  /** Success rate percentage */
  successRatePercent: number;
  /** Failure rate percentage */
  failureRatePercent: number;
}

/**
 * Initial statistics for a new job.
 */
export const INITIAL_JOB_STATISTICS: SchedulerJobStatistics = {
  totalExecutions: 0,
  successfulExecutions: 0,
  failedExecutions: 0,
  averageDurationMs: 0,
};

/**
 * Initial scheduler statistics.
 */
export const INITIAL_SCHEDULER_STATISTICS: SchedulerStatistics = {
  totalJobs: 0,
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
