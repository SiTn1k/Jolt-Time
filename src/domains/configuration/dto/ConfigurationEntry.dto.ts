/**
 * Configuration Entry DTO
 *
 * Data transfer object for configuration entries.
 */

import { ConfigurationType } from '../types/ConfigurationType';
import type { ConfigurationMetadata } from '../types/ConfigurationMetadata';

/**
 * Input for creating a new configuration entry.
 */
export interface CreateConfigurationEntryDto {
  /** Configuration key (dot-notation) */
  key: string;

  /** Configuration value */
  value: unknown;

  /** Value type */
  valueType: ConfigurationType;

  /** Associated group ID (optional) */
  groupId?: string;

  /** Human-readable description (optional) */
  description?: string;

  /** Whether this entry is public (optional, default: false) */
  isPublic?: boolean;

  /** Additional metadata (optional) */
  metadata?: ConfigurationMetadata;
}

/**
 * Input for updating a configuration entry.
 */
export interface UpdateConfigurationEntryDto {
  /** New value (optional) */
  value?: unknown;

  /** New description (optional) */
  description?: string;

  /** New public flag (optional) */
  isPublic?: boolean;

  /** New metadata (optional) */
  metadata?: ConfigurationMetadata;
}

/**
 * Configuration entry response DTO.
 */
export interface ConfigurationEntryResponseDto {
  /** Unique configuration ID */
  configId: string;

  /** Configuration key */
  key: string;

  /** Configuration value */
  value: unknown;

  /** Value type */
  valueType: ConfigurationType;

  /** Associated group ID */
  groupId: string | null;

  /** Description */
  description: string;

  /** Schema version */
  version: number;

  /** Whether public */
  isPublic: boolean;

  /** Created timestamp */
  createdAt: string;

  /** Updated timestamp */
  updatedAt: string;

  /** Metadata */
  metadata: ConfigurationMetadata;
}

/**
 * Configuration entry summary DTO (minimal info).
 */
export interface ConfigurationEntrySummaryDto {
  /** Unique configuration ID */
  configId: string;

  /** Configuration key */
  key: string;

  /** Value type */
  valueType: ConfigurationType;

  /** Whether public */
  isPublic: boolean;
}

/**
 * Validation rules for CreateConfigurationEntryDto.
 */
export const CREATE_CONFIGURATION_ENTRY_VALIDATION = {
  key: {
    required: true,
    minLength: 1,
    maxLength: 255,
    pattern: /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)*$/,
  },
  value: {
    required: true,
  },
  valueType: {
    required: true,
    enum: Object.values(ConfigurationType),
  },
  groupId: {
    required: false,
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  },
  isPublic: {
    required: false,
    default: false,
  },
} as const;
