/**
 * HardeningStarted Event
 *
 * Domain event emitted when hardening process starts.
 */

import type { HardeningStatus } from '../types/HardeningStatus';
import type { RulePriority } from '../types/RulePriority';

/**
 * Event data for hardening start.
 */
export interface HardeningStartedEventData {
  /** Rule ID */
  ruleId: string;
  /** Rule name */
  name: string;
  /** Initial status */
  status: HardeningStatus;
  /** Priority level */
  priority: RulePriority;
  /** Creation timestamp */
  occurredAt: Date;
}

/**
 * Domain event for hardening start.
 */
export interface HardeningStartedEvent {
  /** Event type identifier */
  readonly eventType: 'HardeningStarted';
  /** Event data */
  readonly data: HardeningStartedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a HardeningStartedEvent.
 */
export function createHardeningStartedEvent(params: {
  ruleId: string;
  name: string;
  status: HardeningStatus;
  priority: RulePriority;
}): HardeningStartedEvent {
  return {
    eventType: 'HardeningStarted',
    version: 1,
    data: {
      ruleId: params.ruleId,
      name: params.name,
      status: params.status,
      priority: params.priority,
      occurredAt: new Date(),
    },
  };
}
