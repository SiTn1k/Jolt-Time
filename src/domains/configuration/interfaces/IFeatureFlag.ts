/**
 * Feature Flag Interface
 *
 * Interface defining the contract for FeatureFlag entity.
 */

import type { FeatureFlagId } from '../value-objects/FeatureFlagId';
import type { ConfigurationMetadata } from '../types/ConfigurationMetadata';

/**
 * FeatureFlag entity interface.
 * Represents a feature flag in the system.
 */
export interface IFeatureFlag {
  /** Unique internal feature flag identifier */
  readonly flagId: FeatureFlagId;

  /** Feature flag key */
  readonly key: string;

  /** Whether the flag is enabled */
  readonly enabled: boolean;

  /** Rollout percentage (0-100) */
  readonly rollout: number;

  /** Human-readable description */
  readonly description: string;

  /** Additional metadata */
  readonly metadata: ConfigurationMetadata;
}
