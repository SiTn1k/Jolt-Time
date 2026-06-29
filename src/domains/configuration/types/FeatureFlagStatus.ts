/**
 * Feature Flag Status Enum
 *
 * Possible status values for a feature flag.
 */

export enum FeatureFlagStatus {
  /** Flag is active and evaluating */
  ACTIVE = 'active',

  /** Flag is temporarily disabled */
  INACTIVE = 'inactive',

  /** Flag is deprecated */
  DEPRECATED = 'deprecated',
}
