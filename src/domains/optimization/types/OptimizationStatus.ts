/**
 * Optimization Status
 *
 * Defines the possible states of an optimization operation.
 */

export enum OptimizationStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'InProgress',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  CANCELLED = 'Cancelled',
}

/**
 * Constraints for optimization status values.
 */
export const OPTIMIZATION_STATUS_CONSTRAINTS = {
  MAX_STATUS_LENGTH: 20,
} as const;
