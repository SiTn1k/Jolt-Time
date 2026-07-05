/**
 * IntegrationMetadata Type
 *
 * Metadata associated with the system integration state.
 */

export interface IntegrationMetadata {
  /** Timestamp when the last snapshot was taken */
  lastSnapshotAt?: string;

  /** Number of registered modules */
  registeredModulesCount?: number;

  /** Number of healthy modules */
  healthyModulesCount?: number;

  /** Number of failed modules */
  failedModulesCount?: number;

  /** System-wide error message if any */
  errorMessage?: string;

  /** Additional metadata key-value pairs */
  [key: string]: unknown;
}
