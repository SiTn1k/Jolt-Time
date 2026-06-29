/**
 * JobStatus
 *
 * Defines the status of a scheduled job.
 */

export type JobStatus =
  | 'pending'
  | 'scheduled'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

export const JOB_STATUS_DISPLAY: Record<JobStatus, string> = {
  pending: 'Pending',
  scheduled: 'Scheduled',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

export const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  pending: '#9ca3af',
  scheduled: '#3b82f6',
  running: '#f59e0b',
  completed: '#10b981',
  failed: '#ef4444',
  cancelled: '#6b7280',
};

/**
 * Checks if a job status represents an active state.
 */
export function isActiveJobStatus(status: JobStatus): boolean {
  return status === 'running' || status === 'scheduled';
}

/**
 * Checks if a job status represents a terminal state.
 */
export function isTerminalJobStatus(status: JobStatus): boolean {
  return status === 'completed' || status === 'failed' || status === 'cancelled';
}

/**
 * Checks if a job can be cancelled.
 */
export function isCancellableJobStatus(status: JobStatus): boolean {
  return status === 'pending' || status === 'scheduled';
}
