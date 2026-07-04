/**
 * HealthStatus Type
 *
 * Type definitions for health check status values.
 */

/**
 * Health status values for service health checks.
 */
export enum HealthStatus {
  /** Service is healthy and functioning normally */
  HEALTHY = 'healthy',
  /** Service is functional but experiencing minor issues */
  WARNING = 'warning',
  /** Service is critically impaired */
  CRITICAL = 'critical',
  /** Service is offline and unavailable */
  OFFLINE = 'offline',
  /** Service is under maintenance */
  MAINTENANCE = 'maintenance',
}

/**
 * Health status constraints for validation.
 */
export const HEALTH_STATUS_CONSTRAINTS = {
  /** Maximum length for status details */
  MAX_DETAILS_LENGTH: 500,
  /** Maximum number of checks per health report */
  MAX_CHECKS_PER_REPORT: 50,
  /** Timeout for health checks in milliseconds */
  CHECK_TIMEOUT_MS: 5000,
} as const;
