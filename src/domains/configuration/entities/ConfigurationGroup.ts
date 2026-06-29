/**
 * ConfigurationGroup Entity
 *
 * Domain entity representing a configuration group.
 * Groups organize related configuration entries.
 */

import type { IConfigurationGroup } from '../interfaces/IConfigurationGroup';
import { GroupId } from '../value-objects/GroupId';
import { DEFAULT_CONFIGURATION_METADATA } from '../types/ConfigurationMetadata';
import type { ConfigurationMetadata } from '../types/ConfigurationMetadata';

/**
 * ConfigurationGroup entity class.
 * Immutable domain entity representing a configuration group.
 */
export class ConfigurationGroup implements IConfigurationGroup {
  /** Unique internal group identifier */
  public readonly groupId: GroupId;

  /** Group name */
  public readonly name: string;

  /** Human-readable description */
  public readonly description: string;

  /** Additional metadata */
  public readonly metadata: ConfigurationMetadata;

  /**
   * Creates a new ConfigurationGroup instance.
   * @param props ConfigurationGroup properties
   */
  constructor(props: ConfigurationGroupProps) {
    this.groupId = props.groupId;
    this.name = props.name;
    this.description = props.description ?? '';
    this.metadata = props.metadata ?? { ...DEFAULT_CONFIGURATION_METADATA };
  }

  /**
   * Creates a new ConfigurationGroup.
   * Factory method for new group creation.
   */
  public static create(params: {
    groupId: GroupId;
    name: string;
    description?: string;
    metadata?: ConfigurationMetadata;
  }): ConfigurationGroup {
    return new ConfigurationGroup({
      groupId: params.groupId,
      name: params.name,
      description: params.description ?? '',
      metadata: params.metadata ?? { ...DEFAULT_CONFIGURATION_METADATA },
    });
  }

  /**
   * Creates a ConfigurationGroup from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: ConfigurationGroupRecord): ConfigurationGroup {
    return new ConfigurationGroup({
      groupId: GroupId.reconstruct(record.group_id),
      name: record.name,
      description: record.description ?? '',
      metadata: record.metadata ?? { ...DEFAULT_CONFIGURATION_METADATA },
    });
  }

  /**
   * Serializes the ConfigurationGroup to a plain object.
   */
  public toJSON(): ConfigurationGroupJSON {
    return {
      groupId: this.groupId.value,
      name: this.name,
      description: this.description,
      metadata: this.metadata,
    };
  }

  /**
   * Creates a copy with updated fields.
   * Returns a new ConfigurationGroup instance.
   */
  public copyWith(params: Partial<ConfigurationGroupProps>): ConfigurationGroup {
    return new ConfigurationGroup({
      groupId: params.groupId ?? this.groupId,
      name: params.name ?? this.name,
      description: params.description ?? this.description,
      metadata: params.metadata ?? this.metadata,
    });
  }
}

/**
 * ConfigurationGroup properties interface for constructor.
 */
export interface ConfigurationGroupProps {
  groupId: GroupId;
  name: string;
  description?: string;
  metadata?: ConfigurationMetadata;
}

/**
 * Database record representation of ConfigurationGroup.
 */
export interface ConfigurationGroupRecord {
  group_id: string;
  name: string;
  description: string;
  metadata: ConfigurationMetadata;
}

/**
 * JSON serialization representation of ConfigurationGroup.
 */
export interface ConfigurationGroupJSON {
  groupId: string;
  name: string;
  description: string;
  metadata: ConfigurationMetadata;
}
