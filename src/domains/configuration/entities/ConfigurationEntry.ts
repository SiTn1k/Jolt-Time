/**
 * ConfigurationEntry Entity
 *
 * Domain entity representing a single configuration entry.
 * Configuration is the central runtime configuration system, shared across every domain.
 * Configuration never contains gameplay logic.
 */

import type { IConfigurationEntry } from '../interfaces/IConfigurationEntry';
import { ConfigurationId } from '../value-objects/ConfigurationId';
import { ConfigurationKey } from '../value-objects/ConfigurationKey';
import { GroupId } from '../value-objects/GroupId';
import { ConfigurationType } from '../types/ConfigurationType';
import { DEFAULT_CONFIGURATION_METADATA } from '../types/ConfigurationMetadata';
import type { ConfigurationMetadata } from '../types/ConfigurationMetadata';

/**
 * ConfigurationEntry entity class.
 * Immutable domain entity representing a single configuration entry.
 */
export class ConfigurationEntry implements IConfigurationEntry {
  /** Unique internal configuration identifier */
  public readonly configId: ConfigurationId;

  /** Configuration key (dot-notation) */
  public readonly key: ConfigurationKey;

  /** Configuration value */
  public readonly value: unknown;

  /** Value type */
  public readonly valueType: ConfigurationType;

  /** Associated group ID */
  public readonly groupId: GroupId | null;

  /** Human-readable description */
  public readonly description: string;

  /** Schema version */
  public readonly version: number;

  /** Whether this entry is public (exposed to client) */
  public readonly isPublic: boolean;

  /** Timestamp when entry was created */
  public readonly createdAt: Date;

  /** Timestamp when entry was last updated */
  public readonly updatedAt: Date;

  /** Additional metadata */
  public readonly metadata: ConfigurationMetadata;

  /**
   * Creates a new ConfigurationEntry instance.
   * @param props ConfigurationEntry properties
   */
  constructor(props: ConfigurationEntryProps) {
    this.configId = props.configId;
    this.key = props.key;
    this.value = props.value;
    this.valueType = props.valueType;
    this.groupId = props.groupId ?? null;
    this.description = props.description ?? '';
    this.version = props.version ?? 1;
    this.isPublic = props.isPublic ?? false;
    this.metadata = props.metadata ?? { ...DEFAULT_CONFIGURATION_METADATA };
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new ConfigurationEntry.
   * Factory method for new entry creation.
   */
  public static create(params: {
    configId: ConfigurationId;
    key: ConfigurationKey;
    value: unknown;
    valueType: ConfigurationType;
    groupId?: GroupId | null;
    description?: string;
    isPublic?: boolean;
    metadata?: ConfigurationMetadata;
  }): ConfigurationEntry {
    const now = new Date();

    return new ConfigurationEntry({
      configId: params.configId,
      key: params.key,
      value: params.value,
      valueType: params.valueType,
      groupId: params.groupId ?? null,
      description: params.description ?? '',
      version: 1,
      isPublic: params.isPublic ?? false,
      metadata: params.metadata ?? { ...DEFAULT_CONFIGURATION_METADATA },
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Creates a ConfigurationEntry from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: ConfigurationEntryRecord): ConfigurationEntry {
    return new ConfigurationEntry({
      configId: ConfigurationId.reconstruct(record.config_id),
      key: ConfigurationKey.reconstruct(record.key),
      value: record.value,
      valueType: record.value_type as ConfigurationType,
      groupId: record.group_id ? GroupId.reconstruct(record.group_id) : null,
      description: record.description ?? '',
      version: record.version,
      isPublic: record.is_public,
      metadata: record.metadata ?? { ...DEFAULT_CONFIGURATION_METADATA },
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
    });
  }

  /**
   * Serializes the ConfigurationEntry to a plain object.
   */
  public toJSON(): ConfigurationEntryJSON {
    return {
      configId: this.configId.value,
      key: this.key.value,
      value: this.value,
      valueType: this.valueType,
      groupId: this.groupId?.value ?? null,
      description: this.description,
      version: this.version,
      isPublic: this.isPublic,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      metadata: this.metadata,
    };
  }

  /**
   * Creates a copy with updated fields.
   * Returns a new ConfigurationEntry instance.
   */
  public copyWith(params: Partial<ConfigurationEntryProps>): ConfigurationEntry {
    return new ConfigurationEntry({
      configId: params.configId ?? this.configId,
      key: params.key ?? this.key,
      value: params.value ?? this.value,
      valueType: params.valueType ?? this.valueType,
      groupId: params.groupId !== undefined ? params.groupId : this.groupId,
      description: params.description ?? this.description,
      version: this.version + 1,
      isPublic: params.isPublic ?? this.isPublic,
      metadata: params.metadata ?? this.metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }
}

/**
 * ConfigurationEntry properties interface for constructor.
 */
export interface ConfigurationEntryProps {
  configId: ConfigurationId;
  key: ConfigurationKey;
  value: unknown;
  valueType: ConfigurationType;
  groupId?: GroupId | null;
  description?: string;
  version?: number;
  isPublic?: boolean;
  metadata?: ConfigurationMetadata;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of ConfigurationEntry.
 */
export interface ConfigurationEntryRecord {
  config_id: string;
  key: string;
  value: unknown;
  value_type: string;
  group_id: string | null;
  description: string;
  version: number;
  is_public: boolean;
  metadata: ConfigurationMetadata;
  created_at: string;
  updated_at: string;
}

/**
 * JSON serialization representation of ConfigurationEntry.
 */
export interface ConfigurationEntryJSON {
  configId: string;
  key: string;
  value: unknown;
  valueType: ConfigurationType;
  groupId: string | null;
  description: string;
  version: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  metadata: ConfigurationMetadata;
}
