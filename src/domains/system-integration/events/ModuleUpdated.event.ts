/**
 * ModuleUpdated Event
 *
 * Domain event emitted when a system module is updated.
 */

import type { ModuleId } from '../value-objects/ModuleId';
import type { ModuleStatus } from '../types/ModuleStatus';

/**
 * Event data for module update.
 */
export interface ModuleUpdatedEventData {
  /** Module ID */
  moduleId: string;

  /** Module name */
  moduleName: string;

  /** Previous status */
  previousStatus: ModuleStatus;

  /** New status */
  newStatus: ModuleStatus;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for module update.
 */
export interface ModuleUpdatedEvent {
  /** Event type identifier */
  readonly eventType: 'ModuleUpdated';

  /** Event data */
  readonly data: ModuleUpdatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a ModuleUpdatedEvent.
 */
export function createModuleUpdatedEvent(params: {
  moduleId: ModuleId;
  moduleName: string;
  previousStatus: ModuleStatus;
  newStatus: ModuleStatus;
}): ModuleUpdatedEvent {
  return {
    eventType: 'ModuleUpdated',
    version: 1,
    data: {
      moduleId: params.moduleId.value,
      moduleName: params.moduleName,
      previousStatus: params.previousStatus,
      newStatus: params.newStatus,
      occurredAt: new Date(),
    },
  };
}
