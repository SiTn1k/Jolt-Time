/**
 * ServiceOffline Event
 *
 * Domain event emitted when a service goes offline.
 */

import type { ServiceId } from '../value-objects/ServiceId';

/**
 * Event data for service going offline.
 */
export interface ServiceOfflineEventData {
  /** Service ID */
  serviceId: string;

  /** Service name */
  serviceName: string;

  /** Reason for going offline */
  reason?: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for service going offline.
 */
export interface ServiceOfflineEvent {
  /** Event type identifier */
  readonly eventType: 'ServiceOffline';

  /** Event data */
  readonly data: ServiceOfflineEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a ServiceOfflineEvent.
 */
export function createServiceOfflineEvent(params: {
  serviceId: ServiceId;
  serviceName: string;
  reason?: string;
}): ServiceOfflineEvent {
  return {
    eventType: 'ServiceOffline',
    version: 1,
    data: {
      serviceId: params.serviceId.value,
      serviceName: params.serviceName,
      reason: params.reason,
      occurredAt: new Date(),
    },
  };
}
