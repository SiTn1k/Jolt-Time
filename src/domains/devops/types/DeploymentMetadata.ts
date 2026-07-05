/**
 * Deployment Metadata Type
 *
 * Extended metadata for deployments.
 */

/**
 * Deployment metadata interface.
 */
export interface DeploymentMetadata {
  /** Git commit SHA */
  commitSha?: string;

  /** Git branch name */
  branch?: string;

  /** Deployment notes */
  notes?: string;

  /** Artifacts produced by the deployment */
  artifacts?: string[];

  /** Related deployment IDs (e.g., rollback target) */
  relatedDeployments?: string[];

  /** Custom labels for organization */
  labels?: Record<string, string>;

  /** Deployment duration in seconds */
  durationSeconds?: number;

  /** Resource usage summary */
  resourceUsage?: {
    cpuCores?: number;
    memoryMb?: number;
    storageMb?: number;
  };
}

/**
 * Creates a default empty deployment metadata object.
 */
export function createDefaultDeploymentMetadata(): DeploymentMetadata {
  return {};
}