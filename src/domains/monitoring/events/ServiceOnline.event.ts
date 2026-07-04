/**
 * ServiceOnline Event
 *
 * Domain event emitted when a service comes online.
 */

import type { ServiceId } from '../value-objects/ServiceId';

/**
 * Event data for service coming online.
 */
export interface ServiceOnlineEventData {
  /** Service ID */
  serviceId: string;

  /** Service name */
  serviceName: string;

  /** Service version */
  version?: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for service coming online.
 */
export interface ServiceOnlineEvent {
  /** Event type identifier */
  readonly eventType: 'ServiceOnline';

  /** Event data */
  readonly data: ServiceOnlineEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a ServiceOnlineEvent.
 */
export function createServiceOnlineEvent(params: {
  serviceId: ServiceId;
  serviceName: string;
  version?: string;
}): ServiceOnlineEvent {
  return {
    eventType: 'ServiceOnline',
    version: 1,
    data: {
      serviceId: params.serviceId.value,
      serviceName: params.serviceName,
      version: params.version,
      occurredAt: new Date(),
    },
  };
}
