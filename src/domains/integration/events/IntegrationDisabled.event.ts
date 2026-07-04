/**
 * IntegrationDisabled Event
 *
 * Domain event emitted when an integration provider is disabled.
 */

import type { ProviderId } from '../value-objects/ProviderId';
import type { IntegrationStatus } from '../types/IntegrationStatus';

/**
 * Event data for integration disable.
 */
export interface IntegrationDisabledEventData {
  /** Provider ID */
  providerId: string;

  /** Previous status */
  previousStatus: IntegrationStatus;

  /** New status */
  newStatus: IntegrationStatus;

  /** Reason for disable */
  reason?: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for integration disable.
 */
export interface IntegrationDisabledEvent {
  /** Event type identifier */
  readonly eventType: 'IntegrationDisabled';

  /** Event data */
  readonly data: IntegrationDisabledEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an IntegrationDisabledEvent.
 */
export function createIntegrationDisabledEvent(params: {
  providerId: ProviderId;
  previousStatus: IntegrationStatus;
  newStatus: IntegrationStatus;
  reason?: string;
}): IntegrationDisabledEvent {
  return {
    eventType: 'IntegrationDisabled',
    version: 1,
    data: {
      providerId: params.providerId.value,
      previousStatus: params.previousStatus,
      newStatus: params.newStatus,
      reason: params.reason,
      occurredAt: new Date(),
    },
  };
}
