/**
 * IEnvironment Interface
 *
 * Interface defining the contract for Environment entities.
 */

import type { EnvironmentId } from '../value-objects/EnvironmentId';
import type { EnvironmentType } from '../types/EnvironmentType';
import type { EnvironmentConfiguration } from '../entities/Environment';

/**
 * Environment entity interface.
 * Defines the contract for Environment domain entities.
 */
export interface IEnvironment {
  /** Unique environment identifier */
  readonly environmentId: EnvironmentId;

  /** Environment name */
  readonly name: string;

  /** Environment type */
  readonly type: EnvironmentType;

  /** Environment status */
  readonly status: 'active' | 'inactive';

  /** Environment configuration */
  readonly configuration: EnvironmentConfiguration;

  /** Extended metadata */
  readonly metadata: EnvironmentMetadata;

  /** Timestamp when environment was created */
  readonly createdAt: Date;

  /** Timestamp when environment was last updated */
  readonly updatedAt: Date;
}

/**
 * Environment metadata interface.
 */
export interface EnvironmentMetadata {
  /** Owner team or person */
  owner?: string;

  /** Cost center */
  costCenter?: string;

  /** Tags for organization */
  tags?: string[];

  /** Custom metadata */
  customFields?: Record<string, unknown>;
}