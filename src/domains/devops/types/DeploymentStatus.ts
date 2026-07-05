/**
 * Deployment Status Type
 *
 * Defines the possible states of a deployment.
 */

/**
 * Deployment status enum.
 */
export enum DeploymentStatus {
  /** Deployment is pending and not yet started */
  PENDING = 'pending',

  /** Deployment is currently in progress */
  IN_PROGRESS = 'in_progress',

  /** Deployment completed successfully */
  COMPLETED = 'completed',

  /** Deployment failed */
  FAILED = 'failed',

  /** Deployment was rolled back */
  ROLLED_BACK = 'rolled_back',

  /** Deployment is cancelled */
  CANCELLED = 'cancelled',
}

/**
 * Checks if a status represents an active (non-terminal) state.
 */
export function isActiveDeploymentStatus(status: DeploymentStatus): boolean {
  return status === DeploymentStatus.PENDING || status === DeploymentStatus.IN_PROGRESS;
}

/**
 * Checks if a status represents a completed (terminal) state.
 */
export function isCompletedDeploymentStatus(status: DeploymentStatus): boolean {
  return status === DeploymentStatus.COMPLETED;
}

/**
 * Checks if a status represents a failed (terminal) state.
 */
export function isFailedDeploymentStatus(status: DeploymentStatus): boolean {
  return status === DeploymentStatus.FAILED || status === DeploymentStatus.ROLLED_BACK || status === DeploymentStatus.CANCELLED;
}

/**
 * Checks if a status is terminal (no further transitions allowed).
 */
export function isTerminalDeploymentStatus(status: DeploymentStatus): boolean {
  return isCompletedDeploymentStatus(status) || isFailedDeploymentStatus(status);
}