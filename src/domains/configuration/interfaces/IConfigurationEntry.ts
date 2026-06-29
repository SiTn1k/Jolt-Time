/**
 * Configuration Entry Interface
 *
 * Interface defining the contract for ConfigurationEntry entity.
 */

import type { ConfigurationId } from '../value-objects/ConfigurationId';
import type { ConfigurationKey } from '../value-objects/ConfigurationKey';
import type { GroupId } from '../value-objects/GroupId';
import type { ConfigurationType } from '../types/ConfigurationType';
import type { ConfigurationMetadata } from '../types/ConfigurationMetadata';

/**
 * ConfigurationEntry entity interface.
 * Represents a single configuration entry in the system.
 */
export interface IConfigurationEntry {
  /** Unique internal configuration identifier */
  readonly configId: ConfigurationId;

  /** Configuration key (dot-notation) */
  readonly key: ConfigurationKey;

  /** Configuration value */
  readonly value: unknown;

  /** Value type */
  readonly valueType: ConfigurationType;

  /** Associated group ID */
  readonly groupId: GroupId | null;

  /** Human-readable description */
  readonly description: string;

  /** Schema version */
  readonly version: number;

  /** Whether this entry is public (exposed to client) */
  readonly isPublic: boolean;

  /** Timestamp when entry was created */
  readonly createdAt: Date;

  /** Timestamp when entry was last updated */
  readonly updatedAt: Date;

  /** Additional metadata */
  readonly metadata: ConfigurationMetadata;
}
