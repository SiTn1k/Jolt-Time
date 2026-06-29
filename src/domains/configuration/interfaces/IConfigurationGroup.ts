/**
 * Configuration Group Interface
 *
 * Interface defining the contract for ConfigurationGroup entity.
 */

import type { GroupId } from '../value-objects/GroupId';
import type { ConfigurationMetadata } from '../types/ConfigurationMetadata';

/**
 * ConfigurationGroup entity interface.
 * Represents a configuration group in the system.
 */
export interface IConfigurationGroup {
  /** Unique internal group identifier */
  readonly groupId: GroupId;

  /** Group name */
  readonly name: string;

  /** Human-readable description */
  readonly description: string;

  /** Additional metadata */
  readonly metadata: ConfigurationMetadata;
}
