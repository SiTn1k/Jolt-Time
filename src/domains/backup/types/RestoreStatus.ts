/**
 * RestoreStatus
 *
 * Defines the status of a restore operation.
 */

export type RestoreStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'rolled_back';

export const RESTORE_STATUS_DISPLAY: Record<RestoreStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled',
  rolled_back: 'Rolled Back',
};

export const RESTORE_STATUS_COLORS: Record<RestoreStatus, string> = {
  pending: '#9ca3af',
  in_progress: '#f59e0b',
  completed: '#10b981',
  failed: '#ef4444',
  cancelled: '#6b7280',
  rolled_back: '#8b5cf6',
};

/**
 * Checks if a restore status represents an active state.
 */
export function isActiveRestoreStatus(status: RestoreStatus): boolean {
  return status === 'pending' || status === 'in_progress';
}

/**
 * Checks if a restore status represents a terminal state.
 */
export function isTerminalRestoreStatus(status: RestoreStatus): boolean {
  return status === 'completed' || status === 'failed' || status === 'cancelled' || status === 'rolled_back';
}

/**
 * Checks if a restore can be cancelled.
 */
export function isCancellableRestoreStatus(status: RestoreStatus): boolean {
  return status === 'pending';
}

/**
 * Checks if a restore is considered successful.
 */
export function isSuccessfulRestoreStatus(status: RestoreStatus): boolean {
  return status === 'completed';
}
