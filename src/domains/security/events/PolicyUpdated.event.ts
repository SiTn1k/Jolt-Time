/**
 * Policy Updated Event
 *
 * Domain event emitted when a security policy is updated.
 */

import type { PolicyId } from '../value-objects/PolicyId';
import type { PolicyType } from '../types/PolicyType';

/**
 * Event data for policy update.
 */
export interface PolicyUpdatedEventData {
  /** Policy ID */
  policyId: string;

  /** Policy name */
  policyName: string;

  /** Policy type */
  policyType: PolicyType;

  /** Whether enabled */
  enabled: boolean;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for policy update.
 */
export interface PolicyUpdatedEvent {
  /** Event type identifier */
  readonly eventType: 'PolicyUpdated';

  /** Event data */
  readonly data: PolicyUpdatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a PolicyUpdatedEvent.
 */
export function createPolicyUpdatedEvent(params: {
  policyId: PolicyId;
  policyName: string;
  policyType: PolicyType;
  enabled: boolean;
}): PolicyUpdatedEvent {
  return {
    eventType: 'PolicyUpdated',
    version: 1,
    data: {
      policyId: params.policyId.value,
      policyName: params.policyName,
      policyType: params.policyType,
      enabled: params.enabled,
      occurredAt: new Date(),
    },
  };
}
