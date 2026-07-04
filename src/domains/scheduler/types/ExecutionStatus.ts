/**
 * ExecutionStatus
 *
 * Defines the status of a job execution.
 */

export type ExecutionStatus =
  | 'pending'
  | 'waiting'
  | 'running'
  | 'success'
  | 'failed'
  | 'retrying'
  | 'timeout'
  | 'cancelled';

export const EXECUTION_STATUS_DISPLAY: Record<ExecutionStatus, string> = {
  pending: 'Pending',
  waiting: 'Waiting',
  running: 'Running',
  success: 'Success',
  failed: 'Failed',
  retrying: 'Retrying',
  timeout: 'Timeout',
  cancelled: 'Cancelled',
};

export const EXECUTION_STATUS_COLORS: Record<ExecutionStatus, string> = {
  pending: '#9ca3af',
  waiting: '#6366f1',
  running: '#f59e0b',
  success: '#10b981',
  failed: '#ef4444',
  retrying: '#8b5cf6',
  timeout: '#f97316',
  cancelled: '#6b7280',
};

/**
 * Checks if an execution status represents an active state.
 */
export function isActiveExecutionStatus(status: ExecutionStatus): boolean {
  return status === 'pending' || status === 'waiting' || status === 'running' || status === 'retrying';
}

/**
 * Checks if an execution status represents a terminal state.
 */
export function isTerminalExecutionStatus(status: ExecutionStatus): boolean {
  return status === 'success' || status === 'failed' || status === 'timeout' || status === 'cancelled';
}

/**
 * Checks if an execution can be cancelled.
 */
export function isCancellableExecutionStatus(status: ExecutionStatus): boolean {
  return status === 'pending' || status === 'waiting' || status === 'running' || status === 'retrying';
}

/**
 * Checks if an execution should be retried.
 */
export function isRetryableExecutionStatus(status: ExecutionStatus): boolean {
  return status === 'failed' || status === 'timeout';
}
