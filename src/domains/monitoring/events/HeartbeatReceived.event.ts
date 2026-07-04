/**
 * HeartbeatReceived Event
 *
 * Domain event emitted when a heartbeat is received from a service.
 */

import type { ServiceId } from '../value-objects/ServiceId';

/**
 * Event data for heartbeat received.
 */
export interface HeartbeatReceivedEventData {
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
 * Domain event for heartbeat received.
 */
export interface HeartbeatReceivedEvent {
  /** Event type identifier */
  readonly eventType: 'HeartbeatReceived';

  /** Event data */
  readonly data: HeartbeatReceivedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a HeartbeatReceivedEvent.
 */
export function createHeartbeatReceivedEvent(params: {
  serviceId: ServiceId;
  serviceName: string;
  version?: string;
}): HeartbeatReceivedEvent {
  return {
    eventType: 'HeartbeatReceived',
    version: 1,
    data: {
      serviceId: params.serviceId.value,
      serviceName: params.serviceName,
      version: params.version,
      occurredAt: new Date(),
    },
  };
}
