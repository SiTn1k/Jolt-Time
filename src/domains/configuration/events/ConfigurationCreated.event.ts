/**
 * Configuration Created Event
 *
 * Domain event emitted when a new configuration entry is created.
 */

import type { ConfigurationId } from '../value-objects/ConfigurationId';
import type { ConfigurationKey } from '../value-objects/ConfigurationKey';

/**
 * Event data for configuration creation.
 */
export interface ConfigurationCreatedEventData {
  /** Configuration ID */
  configId: string;

  /** Configuration key */
  key: string;

  /** Value type */
  valueType: string;

  /** Whether public */
  isPublic: boolean;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for configuration creation.
 */
export interface ConfigurationCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'ConfigurationCreated';

  /** Event data */
  readonly data: ConfigurationCreatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a ConfigurationCreatedEvent.
 */
export function createConfigurationCreatedEvent(params: {
  configId: ConfigurationId;
  key: ConfigurationKey;
  valueType: string;
  isPublic: boolean;
}): ConfigurationCreatedEvent {
  return {
    eventType: 'ConfigurationCreated',
    version: 1,
    data: {
      configId: params.configId.value,
      key: params.key.value,
      valueType: params.valueType,
      isPublic: params.isPublic,
      occurredAt: new Date(),
    },
  };
}
