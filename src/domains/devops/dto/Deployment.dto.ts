/**
 * Deployment DTO
 *
 * Data transfer object for deployment data.
 */

import type { DeploymentMetadata } from '../types/DeploymentMetadata';

/**
 * Deployment data transfer object.
 */
export interface DeploymentDto {
  deploymentId: string;
  version: string;
  environmentId: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  metadata: DeploymentMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * Summary deployment data transfer object.
 */
export interface DeploymentSummaryDto {
  deploymentId: string;
  version: string;
  environmentId: string;
  status: string;
  startedAt: string;
}

/**
 * Deployment detail data transfer object.
 */
export interface DeploymentDetailDto extends DeploymentDto {
  durationSeconds: number | null;
}