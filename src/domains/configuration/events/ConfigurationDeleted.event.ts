/**
 * Configuration Deleted Event
 *
 * Domain event emitted when a configuration entry is deleted.
 */

import type { ConfigurationId } from '../value-objects/ConfigurationId';
import type { ConfigurationKey } from '../value-objects/ConfigurationKey';

/**
 * Event data for configuration deletion.
 */
export interface ConfigurationDeletedEventData {
  /** Configuration ID */
  configId: string;

  /** Configuration key */
  key: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for configuration deletion.
 */
export interface ConfigurationDeletedEvent {
  /** Event type identifier */
  readonly eventType: 'ConfigurationDeleted';

  /** Event data */
  readonly data: ConfigurationDeletedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a ConfigurationDeletedEvent.
 */
export function createConfigurationDeletedEvent(params: {
  configId: ConfigurationId;
  key: ConfigurationKey;
}): ConfigurationDeletedEvent {
  return {
    eventType: 'ConfigurationDeleted',
    version: 1,
    data: {
      configId: params.configId.value,
      key: params.key.value,
      occurredAt: new Date(),
    },
  };
}
