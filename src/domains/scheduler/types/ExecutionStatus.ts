/**
 * ExecutionStatus
 *
 * Defines the status of a job execution.
 */

export type ExecutionStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

export const EXECUTION_STATUS_DISPLAY: Record<ExecutionStatus, string> = {
  pending: 'Pending',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

export const EXECUTION_STATUS_COLORS: Record<ExecutionStatus, string> = {
  pending: '#9ca3af',
  running: '#f59e0b',
  completed: '#10b981',
  failed: '#ef4444',
  cancelled: '#6b7280',
};

/**
 * Checks if an execution status represents an active state.
 */
export function isActiveExecutionStatus(status: ExecutionStatus): boolean {
  return status === 'pending' || status === 'running';
}

/**
 * Checks if an execution status represents a terminal state.
 */
export function isTerminalExecutionStatus(status: ExecutionStatus): boolean {
  return status === 'completed' || status === 'failed' || status === 'cancelled';
}

/**
 * Checks if an execution can be cancelled.
 */
export function isCancellableExecutionStatus(status: ExecutionStatus): boolean {
  return status === 'pending' || status === 'running';
}
