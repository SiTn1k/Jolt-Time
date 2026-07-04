/**
 * IntegrationRegistered Event
 *
 * Domain event emitted when a new integration provider is registered.
 */

import type { ProviderId } from '../value-objects/ProviderId';
import type { IntegrationType } from '../types/IntegrationType';
import type { IntegrationStatus } from '../types/IntegrationStatus';

/**
 * Event data for integration registration.
 */
export interface IntegrationRegisteredEventData {
  /** Provider ID */
  providerId: string;

  /** Provider name */
  providerName: string;

  /** Provider type */
  providerType: IntegrationType;

  /** Initial status */
  status: IntegrationStatus;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for integration registration.
 */
export interface IntegrationRegisteredEvent {
  /** Event type identifier */
  readonly eventType: 'IntegrationRegistered';

  /** Event data */
  readonly data: IntegrationRegisteredEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an IntegrationRegisteredEvent.
 */
export function createIntegrationRegisteredEvent(params: {
  providerId: ProviderId;
  providerName: string;
  providerType: IntegrationType;
  status: IntegrationStatus;
}): IntegrationRegisteredEvent {
  return {
    eventType: 'IntegrationRegistered',
    version: 1,
    data: {
      providerId: params.providerId.value,
      providerName: params.providerName,
      providerType: params.providerType,
      status: params.status,
      occurredAt: new Date(),
    },
  };
}
