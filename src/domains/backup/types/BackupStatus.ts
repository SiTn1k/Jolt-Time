/**
 * BackupStatus
 *
 * Defines the status of a backup operation.
 */

export type BackupStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'verified';

export const BACKUP_STATUS_DISPLAY: Record<BackupStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled',
  verified: 'Verified',
};

export const BACKUP_STATUS_COLORS: Record<BackupStatus, string> = {
  pending: '#9ca3af',
  in_progress: '#f59e0b',
  completed: '#10b981',
  failed: '#ef4444',
  cancelled: '#6b7280',
  verified: '#3b82f6',
};

/**
 * Checks if a backup status represents an active state.
 */
export function isActiveBackupStatus(status: BackupStatus): boolean {
  return status === 'pending' || status === 'in_progress';
}

/**
 * Checks if a backup status represents a terminal state.
 */
export function isTerminalBackupStatus(status: BackupStatus): boolean {
  return status === 'completed' || status === 'failed' || status === 'cancelled';
}

/**
 * Checks if a backup can be cancelled.
 */
export function isCancellableBackupStatus(status: BackupStatus): boolean {
  return status === 'pending' || status === 'in_progress';
}

/**
 * Checks if a backup is considered successful.
 */
export function isSuccessfulBackupStatus(status: BackupStatus): boolean {
  return status === 'completed' || status === 'verified';
}
