/**
 * Configuration Statistics Type
 *
 * Statistics about configuration entries and groups.
 */

export interface ConfigurationStatistics {
  /** Total number of configuration entries */
  totalEntries: number;

  /** Number of entries by type */
  entriesByType: Record<string, number>;

  /** Number of public vs private entries */
  publicEntries: number;
  privateEntries: number;

  /** Number of feature flags */
  totalFeatureFlags: number;
  activeFeatureFlags: number;

  /** Last updated timestamp */
  lastUpdated: Date | null;

  /** Number of configuration groups */
  totalGroups: number;
}

/**
 * Initial configuration statistics.
 */
export const INITIAL_CONFIGURATION_STATISTICS: ConfigurationStatistics = {
  totalEntries: 0,
  entriesByType: {},
  publicEntries: 0,
  privateEntries: 0,
  totalFeatureFlags: 0,
  activeFeatureFlags: 0,
  lastUpdated: null,
  totalGroups: 0,
};
