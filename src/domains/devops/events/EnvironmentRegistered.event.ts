/**
 * Environment Registered Event
 *
 * Domain event emitted when a new environment is registered.
 */

import type { EnvironmentId } from '../value-objects/EnvironmentId';
import type { EnvironmentType } from '../types/EnvironmentType';

/**
 * Event data for environment registration.
 */
export interface EnvironmentRegisteredEventData {
  /** Environment ID */
  environmentId: string;

  /** Environment name */
  name: string;

  /** Environment type */
  type: EnvironmentType;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for environment registration.
 */
export interface EnvironmentRegisteredEvent {
  /** Event type identifier */
  readonly eventType: 'EnvironmentRegistered';

  /** Event data */
  readonly data: EnvironmentRegisteredEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an EnvironmentRegisteredEvent.
 */
export function createEnvironmentRegisteredEvent(params: {
  environmentId: EnvironmentId;
  name: string;
  type: EnvironmentType;
}): EnvironmentRegisteredEvent {
  return {
    eventType: 'EnvironmentRegistered',
    version: 1,
    data: {
      environmentId: params.environmentId.value,
      name: params.name,
      type: params.type,
      occurredAt: new Date(),
    },
  };
}