/**
 * HealthChecked Event
 *
 * Domain event emitted when a health check is recorded.
 */

import type { HealthCheckId } from '../value-objects/HealthCheckId';
import type { HealthStatus } from '../types/HealthStatus';

/**
 * Event data for health check completion.
 */
export interface HealthCheckedEventData {
  /** Health check ID */
  healthCheckId: string;

  /** Service name */
  serviceName: string;

  /** Health status */
  status: HealthStatus;

  /** Response time in milliseconds */
  responseTime: number;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for health check completion.
 */
export interface HealthCheckedEvent {
  /** Event type identifier */
  readonly eventType: 'HealthChecked';

  /** Event data */
  readonly data: HealthCheckedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a HealthCheckedEvent.
 */
export function createHealthCheckedEvent(params: {
  healthCheckId: HealthCheckId;
  serviceName: string;
  status: HealthStatus;
  responseTime: number;
}): HealthCheckedEvent {
  return {
    eventType: 'HealthChecked',
    version: 1,
    data: {
      healthCheckId: params.healthCheckId.value,
      serviceName: params.serviceName,
      status: params.status,
      responseTime: params.responseTime,
      occurredAt: new Date(),
    },
  };
}
