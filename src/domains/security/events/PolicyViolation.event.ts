/**
 * Policy Violation Detected Event
 *
 * Domain event emitted when a policy violation is detected.
 */

import type { PolicyId } from '../value-objects/PolicyId';
import type { PolicyType } from '../types/PolicyType';

/**
 * Event data for policy violation.
 */
export interface PolicyViolationDetectedEventData {
  /** Policy ID */
  policyId: string;

  /** Policy type */
  policyType: PolicyType;

  /** Actor ID */
  actorId: string;

  /** Violation description */
  description: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for policy violation.
 */
export interface PolicyViolationDetectedEvent {
  /** Event type identifier */
  readonly eventType: 'PolicyViolationDetected';

  /** Event data */
  readonly data: PolicyViolationDetectedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a PolicyViolationDetectedEvent.
 */
export function createPolicyViolationDetectedEvent(params: {
  policyId: PolicyId;
  policyType: PolicyType;
  actorId: string;
  description: string;
}): PolicyViolationDetectedEvent {
  return {
    eventType: 'PolicyViolationDetected',
    version: 1,
    data: {
      policyId: params.policyId.value,
      policyType: params.policyType,
      actorId: params.actorId,
      description: params.description,
      occurredAt: new Date(),
    },
  };
}
