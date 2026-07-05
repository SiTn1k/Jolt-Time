/**
 * Infrastructure Statistics Type
 *
 * Statistics for infrastructure monitoring.
 */

/**
 * Infrastructure statistics interface.
 */
export interface InfrastructureStatistics {
  /** Total number of nodes */
  totalNodes: number;

  /** Number of healthy nodes */
  healthyNodes: number;

  /** Number of unhealthy nodes */
  unhealthyNodes: number;

  /** Number of nodes by type */
  nodesByType: Record<string, number>;

  /** Number of nodes by region */
  nodesByRegion: Record<string, number>;

  /** Total deployments across all environments */
  totalDeployments: number;

  /** Successful deployments */
  successfulDeployments: number;

  /** Failed deployments */
  failedDeployments: number;

  /** Average deployment duration in seconds */
  averageDeploymentDuration: number;

  /** Uptime percentage */
  uptimePercentage: number;
}

/**
 * Creates initial infrastructure statistics.
 */
export function createInitialInfrastructureStatistics(): InfrastructureStatistics {
  return {
    totalNodes: 0,
    healthyNodes: 0,
    unhealthyNodes: 0,
    nodesByType: {},
    nodesByRegion: {},
    totalDeployments: 0,
    successfulDeployments: 0,
    failedDeployments: 0,
    averageDeploymentDuration: 0,
    uptimePercentage: 100,
  };
}