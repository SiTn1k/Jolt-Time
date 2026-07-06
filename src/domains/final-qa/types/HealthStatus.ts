/**
 * Health Status Type
 *
 * Defines the health status for QA snapshots.
 */

/**
 * Health status enumeration.
 */
export enum HealthStatus {
  HEALTHY = 'HEALTHY',
  DEGRADED = 'DEGRADED',
  UNHEALTHY = 'UNHEALTHY',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Constraints for health status values.
 */
export const HEALTH_STATUS_CONSTRAINTS = {
  VALID_STATUSES: Object.values(HealthStatus) as string[],
  MAX_STATUS_LENGTH: 20,
} as const;
