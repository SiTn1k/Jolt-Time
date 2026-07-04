/**
 * ServiceCritical Event
 *
 * Domain event emitted when a service enters critical state.
 */

import type { ServiceId } from '../value-objects/ServiceId';

/**
 * Event data for service entering critical state.
 */
export interface ServiceCriticalEventData {
  /** Service ID */
  serviceId: string;

  /** Service name */
  serviceName: string;

  /** Critical reason */
  reason: string;

  /** Response time in milliseconds */
  responseTimeMs: number;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for service entering critical state.
 */
export interface ServiceCriticalEvent {
  /** Event type identifier */
  readonly eventType: 'ServiceCritical';

  /** Event data */
  readonly data: ServiceCriticalEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a ServiceCriticalEvent.
 */
export function createServiceCriticalEvent(params: {
  serviceId: ServiceId;
  serviceName: string;
  reason: string;
  responseTimeMs: number;
}): ServiceCriticalEvent {
  return {
    eventType: 'ServiceCritical',
    version: 1,
    data: {
      serviceId: params.serviceId.value,
      serviceName: params.serviceName,
      reason: params.reason,
      responseTimeMs: params.responseTimeMs,
      occurredAt: new Date(),
    },
  };
}
