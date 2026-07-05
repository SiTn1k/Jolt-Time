/**
 * SystemStatistics Type
 *
 * Statistics about the system integration.
 */

export interface SystemStatistics {
  /** Total number of registered modules */
  totalModules: number;

  /** Number of healthy modules */
  healthyModules: number;

  /** Number of degraded modules */
  degradedModules: number;

  /** Number of failed modules */
  failedModules: number;

  /** Number of stopped modules */
  stoppedModules: number;

  /** Number of unregistered modules */
  unregisteredModules: number;

  /** Uptime in seconds since last snapshot */
  uptimeSeconds: number;

  /** Timestamp of last update */
  lastUpdated: string;
}
