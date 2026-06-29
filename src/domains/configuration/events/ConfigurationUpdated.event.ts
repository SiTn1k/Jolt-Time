/**
 * Configuration Updated Event
 *
 * Domain event emitted when a configuration entry is updated.
 */

import type { ConfigurationId } from '../value-objects/ConfigurationId';
import type { ConfigurationKey } from '../value-objects/ConfigurationKey';

/**
 * Event data for configuration update.
 */
export interface ConfigurationUpdatedEventData {
  /** Configuration ID */
  configId: string;

  /** Configuration key */
  key: string;

  /** Previous value (if changed) */
  previousValue?: unknown;

  /** New value (if changed) */
  newValue?: unknown;

  /** Version after update */
  version: number;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for configuration update.
 */
export interface ConfigurationUpdatedEvent {
  /** Event type identifier */
  readonly eventType: 'ConfigurationUpdated';

  /** Event data */
  readonly data: ConfigurationUpdatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a ConfigurationUpdatedEvent.
 */
export function createConfigurationUpdatedEvent(params: {
  configId: ConfigurationId;
  key: ConfigurationKey;
  previousValue?: unknown;
  newValue?: unknown;
  version: number;
}): ConfigurationUpdatedEvent {
  return {
    eventType: 'ConfigurationUpdated',
    version: 1,
    data: {
      configId: params.configId.value,
      key: params.key.value,
      previousValue: params.previousValue,
      newValue: params.newValue,
      version: params.version,
      occurredAt: new Date(),
    },
  };
}
