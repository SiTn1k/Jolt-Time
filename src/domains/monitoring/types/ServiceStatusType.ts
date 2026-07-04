/**
 * ServiceStatusType Type
 *
 * Type definitions for service status values.
 */

/**
 * Service status values for monitored services.
 */
export enum ServiceStatusType {
  /** Service is running and accepting requests */
  ONLINE = 'online',
  /** Service is running but not accepting requests */
  DEGRADED = 'degraded',
  /** Service is not running */
  OFFLINE = 'offline',
  /** Service is starting up */
  STARTING = 'starting',
  /** Service is shutting down */
  STOPPING = 'stopping',
}

/**
 * Service status constraints for validation.
 */
export const SERVICE_STATUS_CONSTRAINTS = {
  /** Maximum length for service name */
  MAX_SERVICE_NAME_LENGTH: 100,
  /** Maximum length for service version */
  MAX_VERSION_LENGTH: 50,
  /** Maximum number of retries for service health */
  MAX_RETRIES: 3,
  /** Interval between heartbeats in seconds */
  HEARTBEAT_INTERVAL_SECONDS: 30,
} as const;
