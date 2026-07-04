/**
 * ServiceWarning Event
 *
 * Domain event emitted when a service enters warning state.
 */

import type { ServiceId } from '../value-objects/ServiceId';

/**
 * Event data for service entering warning state.
 */
export interface ServiceWarningEventData {
  /** Service ID */
  serviceId: string;

  /** Service name */
  serviceName: string;

  /** Warning reason */
  reason: string;

  /** Response time in milliseconds */
  responseTimeMs: number;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for service entering warning state.
 */
export interface ServiceWarningEvent {
  /** Event type identifier */
  readonly eventType: 'ServiceWarning';

  /** Event data */
  readonly data: ServiceWarningEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a ServiceWarningEvent.
 */
export function createServiceWarningEvent(params: {
  serviceId: ServiceId;
  serviceName: string;
  reason: string;
  responseTimeMs: number;
}): ServiceWarningEvent {
  return {
    eventType: 'ServiceWarning',
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
