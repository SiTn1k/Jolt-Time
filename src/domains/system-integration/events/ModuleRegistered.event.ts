/**
 * ModuleRegistered Event
 *
 * Domain event emitted when a new system module is registered.
 */

import type { ModuleId } from '../value-objects/ModuleId';
import type { ModuleStatus } from '../types/ModuleStatus';

/**
 * Event data for module registration.
 */
export interface ModuleRegisteredEventData {
  /** Module ID */
  moduleId: string;

  /** Module name */
  moduleName: string;

  /** Module version */
  moduleVersion: string;

  /** Initial status */
  status: ModuleStatus;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for module registration.
 */
export interface ModuleRegisteredEvent {
  /** Event type identifier */
  readonly eventType: 'ModuleRegistered';

  /** Event data */
  readonly data: ModuleRegisteredEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a ModuleRegisteredEvent.
 */
export function createModuleRegisteredEvent(params: {
  moduleId: ModuleId;
  moduleName: string;
  moduleVersion: string;
  status: ModuleStatus;
}): ModuleRegisteredEvent {
  return {
    eventType: 'ModuleRegistered',
    version: 1,
    data: {
      moduleId: params.moduleId.value,
      moduleName: params.moduleName,
      moduleVersion: params.moduleVersion,
      status: params.status,
      occurredAt: new Date(),
    },
  };
}
