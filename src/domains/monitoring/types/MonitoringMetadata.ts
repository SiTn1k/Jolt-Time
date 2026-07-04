/**
 * MonitoringMetadata Type
 *
 * Type definitions for monitoring metadata.
 */

/**
 * Metadata for monitoring records.
 * Provides additional context for health checks, metrics, and service status.
 */
export interface MonitoringMetadata {
  /** Optional description of the record */
  description?: string;

  /** Optional tags for categorization */
  tags?: string[];

  /** Optional source of the monitoring data */
  source?: string;

  /** Optional environment (e.g., production, staging) */
  environment?: string;

  /** Optional region or datacenter */
  region?: string;

  /** Optional custom metadata fields */
  [key: string]: unknown;
}

/**
 * Initial/empty monitoring metadata.
 */
export const INITIAL_MONITORING_METADATA: MonitoringMetadata = {
  tags: [],
};

/**
 * Constraints for monitoring metadata.
 */
export const MONITORING_METADATA_CONSTRAINTS = {
  /** Maximum number of tags */
  MAX_TAGS: 20,
  /** Maximum length for each tag */
  MAX_TAG_LENGTH: 50,
  /** Maximum length for description */
  MAX_DESCRIPTION_LENGTH: 200,
  /** Maximum length for source */
  MAX_SOURCE_LENGTH: 100,
  /** Maximum length for environment */
  MAX_ENVIRONMENT_LENGTH: 50,
  /** Maximum length for region */
  MAX_REGION_LENGTH: 50,
} as const;
