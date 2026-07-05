/**
 * Health Status Type
 *
 * Defines the health status values for system components.
 */

/**
 * Health status values.
 */
export enum HealthStatus {
  /** Component is healthy and functioning normally */
  HEALTHY = 'healthy',
  /** Component has warnings but is still functioning */
  WARNING = 'warning',
  /** Component is failing or unavailable */
  FAILED = 'failed',
  /** Health status is unknown */
  UNKNOWN = 'unknown',
}

/**
 * Constraints for health status.
 */
export const HEALTH_STATUS_CONSTRAINTS = {
  VALID_STATUSES: Object.values(HealthStatus),
} as const;
