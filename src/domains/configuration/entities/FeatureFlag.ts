/**
 * FeatureFlag Entity
 *
 * Domain entity representing a feature flag.
 * Feature flags control feature visibility and rollout.
 */

import type { IFeatureFlag } from '../interfaces/IFeatureFlag';
import { FeatureFlagId } from '../value-objects/FeatureFlagId';
import { DEFAULT_CONFIGURATION_METADATA } from '../types/ConfigurationMetadata';
import type { ConfigurationMetadata } from '../types/ConfigurationMetadata';

/**
 * FeatureFlag entity class.
 * Immutable domain entity representing a feature flag.
 */
export class FeatureFlag implements IFeatureFlag {
  /** Unique internal feature flag identifier */
  public readonly flagId: FeatureFlagId;

  /** Feature flag key */
  public readonly key: string;

  /** Whether the flag is enabled */
  public readonly enabled: boolean;

  /** Rollout percentage (0-100) */
  public readonly rollout: number;

  /** Human-readable description */
  public readonly description: string;

  /** Additional metadata */
  public readonly metadata: ConfigurationMetadata;

  /**
   * Creates a new FeatureFlag instance.
   * @param props FeatureFlag properties
   */
  constructor(props: FeatureFlagProps) {
    this.flagId = props.flagId;
    this.key = props.key;
    this.enabled = props.enabled ?? false;
    this.rollout = props.rollout ?? 0;
    this.description = props.description ?? '';
    this.metadata = props.metadata ?? { ...DEFAULT_CONFIGURATION_METADATA };
  }

  /**
   * Creates a new FeatureFlag.
   * Factory method for new flag creation.
   */
  public static create(params: {
    flagId: FeatureFlagId;
    key: string;
    enabled?: boolean;
    rollout?: number;
    description?: string;
    metadata?: ConfigurationMetadata;
  }): FeatureFlag {
    return new FeatureFlag({
      flagId: params.flagId,
      key: params.key,
      enabled: params.enabled ?? false,
      rollout: params.rollout ?? 0,
      description: params.description ?? '',
      metadata: params.metadata ?? { ...DEFAULT_CONFIGURATION_METADATA },
    });
  }

  /**
   * Creates a FeatureFlag from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: FeatureFlagRecord): FeatureFlag {
    return new FeatureFlag({
      flagId: FeatureFlagId.reconstruct(record.flag_id),
      key: record.key,
      enabled: record.enabled,
      rollout: record.rollout,
      description: record.description ?? '',
      metadata: record.metadata ?? { ...DEFAULT_CONFIGURATION_METADATA },
    });
  }

  /**
   * Serializes the FeatureFlag to a plain object.
   */
  public toJSON(): FeatureFlagJSON {
    return {
      flagId: this.flagId.value,
      key: this.key,
      enabled: this.enabled,
      rollout: this.rollout,
      description: this.description,
      metadata: this.metadata,
    };
  }

  /**
   * Creates a copy with updated fields.
   * Returns a new FeatureFlag instance.
   */
  public copyWith(params: Partial<FeatureFlagProps>): FeatureFlag {
    return new FeatureFlag({
      flagId: params.flagId ?? this.flagId,
      key: params.key ?? this.key,
      enabled: params.enabled ?? this.enabled,
      rollout: params.rollout ?? this.rollout,
      description: params.description ?? this.description,
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Checks if the flag is active (enabled and rollout > 0).
   */
  public isActive(): boolean {
    return this.enabled && this.rollout > 0;
  }

  /**
   * Checks if a specific percentage should see this feature.
   * @param percentage A value between 0-100
   */
  public shouldShowForPercentage(percentage: number): boolean {
    if (!this.enabled) return false;
    return percentage <= this.rollout;
  }
}

/**
 * FeatureFlag properties interface for constructor.
 */
export interface FeatureFlagProps {
  flagId: FeatureFlagId;
  key: string;
  enabled?: boolean;
  rollout?: number;
  description?: string;
  metadata?: ConfigurationMetadata;
}

/**
 * Database record representation of FeatureFlag.
 */
export interface FeatureFlagRecord {
  flag_id: string;
  key: string;
  enabled: boolean;
  rollout: number;
  description: string;
  metadata: ConfigurationMetadata;
}

/**
 * JSON serialization representation of FeatureFlag.
 */
export interface FeatureFlagJSON {
  flagId: string;
  key: string;
  enabled: boolean;
  rollout: number;
  description: string;
  metadata: ConfigurationMetadata;
}
