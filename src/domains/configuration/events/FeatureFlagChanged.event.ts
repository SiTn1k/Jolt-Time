/**
 * Feature Flag Changed Event
 *
 * Domain event emitted when a feature flag is changed.
 */

import type { FeatureFlagId } from '../value-objects/FeatureFlagId';

/**
 * Event data for feature flag change.
 */
export interface FeatureFlagChangedEventData {
  /** Feature flag ID */
  flagId: string;

  /** Feature flag key */
  key: string;

  /** Previous enabled state */
  previousEnabled?: boolean;

  /** New enabled state */
  newEnabled?: boolean;

  /** Previous rollout percentage */
  previousRollout?: number;

  /** New rollout percentage */
  newRollout?: number;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for feature flag change.
 */
export interface FeatureFlagChangedEvent {
  /** Event type identifier */
  readonly eventType: 'FeatureFlagChanged';

  /** Event data */
  readonly data: FeatureFlagChangedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a FeatureFlagChangedEvent.
 */
export function createFeatureFlagChangedEvent(params: {
  flagId: FeatureFlagId;
  key: string;
  previousEnabled?: boolean;
  newEnabled?: boolean;
  previousRollout?: number;
  newRollout?: number;
}): FeatureFlagChangedEvent {
  return {
    eventType: 'FeatureFlagChanged',
    version: 1,
    data: {
      flagId: params.flagId.value,
      key: params.key,
      previousEnabled: params.previousEnabled,
      newEnabled: params.newEnabled,
      previousRollout: params.previousRollout,
      newRollout: params.newRollout,
      occurredAt: new Date(),
    },
  };
}
