/**
 * Configuration Metadata Type
 *
 * Metadata for configuration entries and groups.
 */

export interface ConfigurationMetadata {
  /** Schema version for tracking changes */
  version: number;

  /** Who created this configuration */
  createdBy?: string;

  /** Who last modified this configuration */
  updatedBy?: string;

  /** Tags for categorization */
  tags?: string[];

  /** Optional notes or description */
  notes?: string;

  /** Environment this belongs to */
  environment?: string;

  /** Feature flag rollout percentage (0-100) */
  rolloutPercentage?: number;
}

/**
 * Default configuration metadata.
 */
export const DEFAULT_CONFIGURATION_METADATA: ConfigurationMetadata = {
  version: 1,
  tags: [],
};
