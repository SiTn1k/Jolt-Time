/**
 * RequestStatus
 *
 * Defines the possible states of an integration request.
 */

/**
 * Possible status values for an integration request.
 */
export type RequestStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'timeout'
  | 'cancelled';

/**
 * Display names for request statuses.
 */
export const REQUEST_STATUS_DISPLAY: Record<RequestStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  completed: 'Completed',
  failed: 'Failed',
  timeout: 'Timeout',
  cancelled: 'Cancelled',
};

/**
 * Status colors for UI display.
 */
export const REQUEST_STATUS_COLORS: Record<RequestStatus, string> = {
  pending: '#9ca3af',
  processing: '#3b82f6',
  completed: '#10b981',
  failed: '#ef4444',
  timeout: '#f59e0b',
  cancelled: '#6b7280',
};

/**
 * Checks if a request status represents a terminal state.
 */
export function isTerminalRequestStatus(status: RequestStatus): boolean {
  return status === 'completed' || status === 'failed' || status === 'timeout' || status === 'cancelled';
}

/**
 * Checks if a request status represents a successful state.
 */
export function isSuccessfulRequestStatus(status: RequestStatus): boolean {
  return status === 'completed';
}

/**
 * Checks if a request status represents an active/processing state.
 */
export function isProcessingRequestStatus(status: RequestStatus): boolean {
  return status === 'pending' || status === 'processing';
}
