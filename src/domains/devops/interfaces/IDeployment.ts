/**
 * IDeployment Interface
 *
 * Interface defining the contract for Deployment entities.
 */

import type { DeploymentId } from '../value-objects/DeploymentId';
import type { DeploymentStatus } from '../types/DeploymentStatus';
import type { DeploymentMetadata } from '../types/DeploymentMetadata';

/**
 * Deployment entity interface.
 * Defines the contract for Deployment domain entities.
 */
export interface IDeployment {
  /** Unique deployment identifier */
  readonly deploymentId: DeploymentId;

  /** Deployment version identifier */
  readonly version: string;

  /** Environment ID for this deployment */
  readonly environmentId: string;

  /** Current deployment status */
  readonly status: DeploymentStatus;

  /** Timestamp when deployment started */
  readonly startedAt: Date;

  /** Timestamp when deployment completed */
  readonly completedAt: Date | null;

  /** Extended metadata */
  readonly metadata: DeploymentMetadata;

  /** Timestamp when deployment was created */
  readonly createdAt: Date;

  /** Timestamp when deployment was last updated */
  readonly updatedAt: Date;
}