/**
 * Feature Flag DTO
 *
 * Data transfer object for feature flags.
 */

import type { ConfigurationMetadata } from '../types/ConfigurationMetadata';

/**
 * Input for creating a new feature flag.
 */
export interface CreateFeatureFlagDto {
  /** Feature flag key */
  key: string;

  /** Whether the flag is enabled (optional, default: false) */
  enabled?: boolean;

  /** Rollout percentage 0-100 (optional, default: 0) */
  rollout?: number;

  /** Human-readable description (optional) */
  description?: string;

  /** Additional metadata (optional) */
  metadata?: ConfigurationMetadata;
}

/**
 * Input for updating a feature flag.
 */
export interface UpdateFeatureFlagDto {
  /** New enabled state (optional) */
  enabled?: boolean;

  /** New rollout percentage (optional) */
  rollout?: number;

  /** New description (optional) */
  description?: string;

  /** New metadata (optional) */
  metadata?: ConfigurationMetadata;
}

/**
 * Feature flag response DTO.
 */
export interface FeatureFlagResponseDto {
  /** Unique flag ID */
  flagId: string;

  /** Feature flag key */
  key: string;

  /** Whether enabled */
  enabled: boolean;

  /** Rollout percentage */
  rollout: number;

  /** Description */
  description: string;

  /** Metadata */
  metadata: ConfigurationMetadata;
}

/**
 * Feature flag summary DTO (minimal info).
 */
export interface FeatureFlagSummaryDto {
  /** Unique flag ID */
  flagId: string;

  /** Feature flag key */
  key: string;

  /** Whether enabled */
  enabled: boolean;

  /** Rollout percentage */
  rollout: number;
}

/**
 * Validation rules for CreateFeatureFlagDto.
 */
export const CREATE_FEATURE_FLAG_VALIDATION = {
  key: {
    required: true,
    minLength: 1,
    maxLength: 64,
    pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
  },
  enabled: {
    required: false,
    default: false,
  },
  rollout: {
    required: false,
    default: 0,
    min: 0,
    max: 100,
  },
  description: {
    required: false,
    maxLength: 500,
  },
} as const;
