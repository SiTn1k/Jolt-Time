/**
 * IHealthCheck Interface
 *
 * Interface defining the contract for HealthCheck entities.
 */

import type { HealthCheckId } from '../value-objects/HealthCheckId';
import type { HealthStatus } from '../types/HealthStatus';
import type { MonitoringMetadata } from '../types/MonitoringMetadata';

/**
 * Health check entity interface.
 * Defines the contract for health check domain entities.
 */
export interface IHealthCheck {
  /** Unique health check identifier */
  readonly healthCheckId: HealthCheckId;

  /** Name of the service checked */
  readonly serviceName: string;

  /** Health status of the service */
  readonly status: HealthStatus;

  /** Timestamp when the check was performed */
  readonly checkedAt: Date;

  /** Response time in milliseconds */
  readonly responseTime: number;

  /** Optional additional details about the health check */
  readonly details?: string;

  /** Health check metadata */
  readonly metadata: MonitoringMetadata;
}
