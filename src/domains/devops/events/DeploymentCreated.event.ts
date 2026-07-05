/**
 * Deployment Created Event
 *
 * Domain event emitted when a new deployment is created.
 */

import type { DeploymentId } from '../value-objects/DeploymentId';

/**
 * Event data for deployment creation.
 */
export interface DeploymentCreatedEventData {
  /** Deployment ID */
  deploymentId: string;

  /** Version deployed */
  version: string;

  /** Environment ID */
  environmentId: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for deployment creation.
 */
export interface DeploymentCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'DeploymentCreated';

  /** Event data */
  readonly data: DeploymentCreatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a DeploymentCreatedEvent.
 */
export function createDeploymentCreatedEvent(params: {
  deploymentId: DeploymentId;
  version: string;
  environmentId: string;
}): DeploymentCreatedEvent {
  return {
    eventType: 'DeploymentCreated',
    version: 1,
    data: {
      deploymentId: params.deploymentId.value,
      version: params.version,
      environmentId: params.environmentId,
      occurredAt: new Date(),
    },
  };
}