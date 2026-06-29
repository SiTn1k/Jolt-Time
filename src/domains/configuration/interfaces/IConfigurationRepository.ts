/**
 * Configuration Repository Interface
 *
 * Interface defining the contract for configuration persistence.
 * All configuration repository implementations must adhere to this interface.
 */

import type { ConfigurationEntry } from '../entities/ConfigurationEntry';
import type { ConfigurationGroup } from '../entities/ConfigurationGroup';
import type { FeatureFlag } from '../entities/FeatureFlag';
import type { ConfigurationId } from '../value-objects/ConfigurationId';
import type { GroupId } from '../value-objects/GroupId';
import type { FeatureFlagId } from '../value-objects/FeatureFlagId';
import type { ConfigurationKey } from '../value-objects/ConfigurationKey';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying configuration entries.
 */
export interface ConfigurationFilterParams {
  /** Filter by group ID */
  groupId?: GroupId;

  /** Filter by key prefix */
  keyPrefix?: string;

  /** Filter by public flag */
  isPublic?: boolean;

  /** Filter by value type */
  valueType?: string;
}

/**
 * Configuration repository interface.
 * Defines all data access operations for configuration entities.
 */
export interface IConfigurationRepository {
  // Configuration Entry Operations

  /**
   * Creates a new configuration entry.
   * @param entry The entry to create
   * @returns The created entry
   */
  createEntry(entry: ConfigurationEntry): Promise<ConfigurationEntry>;

  /**
   * Finds an entry by its ID.
   * @param id The configuration ID to find
   * @returns The entry if found, null otherwise
   */
  findEntryById(id: ConfigurationId): Promise<ConfigurationEntry | null>;

  /**
   * Finds an entry by its key.
   * @param key The configuration key to find
   * @returns The entry if found, null otherwise
   */
  findEntryByKey(key: ConfigurationKey): Promise<ConfigurationEntry | null>;

  /**
   * Updates an existing entry.
   * @param entry The entry to update
   * @returns The updated entry
   */
  updateEntry(entry: ConfigurationEntry): Promise<ConfigurationEntry>;

  /**
   * Deletes an entry.
   * @param id The configuration ID to delete
   */
  deleteEntry(id: ConfigurationId): Promise<void>;

  /**
   * Lists entries with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of entries
   */
  listEntries(
    params: PaginationParams,
    filters?: ConfigurationFilterParams
  ): Promise<PaginatedResult<ConfigurationEntry>>;

  /**
   * Counts entries with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching entries
   */
  countEntries(filters?: ConfigurationFilterParams): Promise<number>;

  // Configuration Group Operations

  /**
   * Creates a new configuration group.
   * @param group The group to create
   * @returns The created group
   */
  createGroup(group: ConfigurationGroup): Promise<ConfigurationGroup>;

  /**
   * Finds a group by its ID.
   * @param id The group ID to find
   * @returns The group if found, null otherwise
   */
  findGroupById(id: GroupId): Promise<ConfigurationGroup | null>;

  /**
   * Finds a group by its name.
   * @param name The group name to find
   * @returns The group if found, null otherwise
   */
  findGroupByName(name: string): Promise<ConfigurationGroup | null>;

  /**
   * Updates an existing group.
   * @param group The group to update
   * @returns The updated group
   */
  updateGroup(group: ConfigurationGroup): Promise<ConfigurationGroup>;

  /**
   * Deletes a group.
   * @param id The group ID to delete
   */
  deleteGroup(id: GroupId): Promise<void>;

  /**
   * Lists all groups.
   * @param params Pagination parameters
   * @returns Paginated result of groups
   */
  listGroups(params: PaginationParams): Promise<PaginatedResult<ConfigurationGroup>>;

  // Feature Flag Operations

  /**
   * Creates a new feature flag.
   * @param flag The flag to create
   * @returns The created flag
   */
  createFeatureFlag(flag: FeatureFlag): Promise<FeatureFlag>;

  /**
   * Finds a feature flag by its ID.
   * @param id The flag ID to find
   * @returns The flag if found, null otherwise
   */
  findFeatureFlagById(id: FeatureFlagId): Promise<FeatureFlag | null>;

  /**
   * Finds a feature flag by its key.
   * @param key The flag key to find
   * @returns The flag if found, null otherwise
   */
  findFeatureFlagByKey(key: string): Promise<FeatureFlag | null>;

  /**
   * Updates an existing feature flag.
   * @param flag The flag to update
   * @returns The updated flag
   */
  updateFeatureFlag(flag: FeatureFlag): Promise<FeatureFlag>;

  /**
   * Deletes a feature flag.
   * @param id The flag ID to delete
   */
  deleteFeatureFlag(id: FeatureFlagId): Promise<void>;

  /**
   * Lists all feature flags.
   * @param params Pagination parameters
   * @returns Paginated result of flags
   */
  listFeatureFlags(params: PaginationParams): Promise<PaginatedResult<FeatureFlag>>;

  /**
   * Checks if a feature flag exists by key.
   * @param key The flag key to check
   * @returns true if flag exists
   */
  featureFlagExists(key: string): Promise<boolean>;
}
