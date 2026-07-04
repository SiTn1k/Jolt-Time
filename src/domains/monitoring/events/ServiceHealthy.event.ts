/**
 * ServiceHealthy Event
 *
 * Domain event emitted when a service becomes healthy.
 */

import type { ServiceId } from '../value-objects/ServiceId';

/**
 * Event data for service becoming healthy.
 */
export interface ServiceHealthyEventData {
  /** Service ID */
  serviceId: string;

  /** Service name */
  serviceName: string;

  /** Response time in milliseconds */
  responseTimeMs: number;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for service becoming healthy.
 */
export interface ServiceHealthyEvent {
  /** Event type identifier */
  readonly eventType: 'ServiceHealthy';

  /** Event data */
  readonly data: ServiceHealthyEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a ServiceHealthyEvent.
 */
export function createServiceHealthyEvent(params: {
  serviceId: ServiceId;
  serviceName: string;
  responseTimeMs: number;
}): ServiceHealthyEvent {
  return {
    eventType: 'ServiceHealthy',
    version: 1,
    data: {
      serviceId: params.serviceId.value,
      serviceName: params.serviceName,
      responseTimeMs: params.responseTimeMs,
      occurredAt: new Date(),
    },
  };
}
