/**
 * IntegrationRequestCreated Event
 *
 * Domain event emitted when a new integration request is created.
 */

import type { RequestId } from '../value-objects/RequestId';
import type { ProviderId } from '../value-objects/ProviderId';

/**
 * Event data for request creation.
 */
export interface IntegrationRequestCreatedEventData {
  /** Request ID */
  requestId: string;

  /** Provider ID */
  providerId: string;

  /** Request type */
  requestType: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for request creation.
 */
export interface IntegrationRequestCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'IntegrationRequestCreated';

  /** Event data */
  readonly data: IntegrationRequestCreatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an IntegrationRequestCreatedEvent.
 */
export function createIntegrationRequestCreatedEvent(params: {
  requestId: RequestId;
  providerId: ProviderId;
  requestType: string;
}): IntegrationRequestCreatedEvent {
  return {
    eventType: 'IntegrationRequestCreated',
    version: 1,
    data: {
      requestId: params.requestId.value,
      providerId: params.providerId.value,
      requestType: params.requestType,
      occurredAt: new Date(),
    },
  };
}
