/**
 * Configuration Group DTO
 *
 * Data transfer object for configuration groups.
 */

import type { ConfigurationMetadata } from '../types/ConfigurationMetadata';

/**
 * Input for creating a new configuration group.
 */
export interface CreateConfigurationGroupDto {
  /** Group name */
  name: string;

  /** Human-readable description (optional) */
  description?: string;

  /** Additional metadata (optional) */
  metadata?: ConfigurationMetadata;
}

/**
 * Input for updating a configuration group.
 */
export interface UpdateConfigurationGroupDto {
  /** New name (optional) */
  name?: string;

  /** New description (optional) */
  description?: string;

  /** New metadata (optional) */
  metadata?: ConfigurationMetadata;
}

/**
 * Configuration group response DTO.
 */
export interface ConfigurationGroupResponseDto {
  /** Unique group ID */
  groupId: string;

  /** Group name */
  name: string;

  /** Description */
  description: string;

  /** Metadata */
  metadata: ConfigurationMetadata;
}

/**
 * Configuration group summary DTO (minimal info).
 */
export interface ConfigurationGroupSummaryDto {
  /** Unique group ID */
  groupId: string;

  /** Group name */
  name: string;
}

/**
 * Validation rules for CreateConfigurationGroupDto.
 */
export const CREATE_CONFIGURATION_GROUP_VALIDATION = {
  name: {
    required: true,
    minLength: 1,
    maxLength: 64,
    pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
  },
  description: {
    required: false,
    maxLength: 500,
  },
} as const;
