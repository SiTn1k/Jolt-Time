/**
 * Supabase Configuration Repository
 *
 * Production Supabase implementation of the Configuration repository.
 * Handles all persistence operations for Configuration entities.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type { IConfigurationRepository, ConfigurationFilterParams } from '../interfaces/IConfigurationRepository';
import type { ConfigurationEntry, ConfigurationEntryRecord } from '../entities/ConfigurationEntry';
import type { ConfigurationGroup, ConfigurationGroupRecord } from '../entities/ConfigurationGroup';
import type { FeatureFlag, FeatureFlagRecord } from '../entities/FeatureFlag';
import type { ConfigurationId } from '../value-objects/ConfigurationId';
import type { GroupId } from '../value-objects/GroupId';
import type { FeatureFlagId } from '../value-objects/FeatureFlagId';
import type { ConfigurationKey } from '../value-objects/ConfigurationKey';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { createLogger } from '../../../core/logging/logger.service';
import { RepositoryError } from '../../../database/errors/repository.error';
import { SortOrder } from '../../../shared/constants';

const logger = createLogger('SupabaseConfigurationRepository');

/**
 * Supabase implementation of the Configuration Repository.
 * Implements IConfigurationRepository for Configuration entity persistence.
 */
export class SupabaseConfigurationRepository implements IConfigurationRepository {
  private readonly tableName = 'configurations';
  private readonly groupTableName = 'configuration_groups';
  private readonly featureFlagTableName = 'feature_flags';
  private readonly _client?: SupabaseClient<Database>;

  /**
   * Creates a new SupabaseConfigurationRepository instance.
   * @param client Optional Supabase client (uses default provider if not provided)
   */
  constructor(client?: SupabaseClient<Database>) {
    this._client = client;
  }

  /**
   * Get the Supabase client.
   */
  private get client(): SupabaseClient<Database> {
    return this._client ?? getSupabaseClient();
  }

  /**
   * Maps a database row to ConfigurationEntryRecord format.
   */
  private mapRowToEntryRecord(row: Record<string, unknown>): ConfigurationEntryRecord {
    return {
      config_id: row.config_id as string,
      key: row.key as string,
      value: row.value,
      value_type: row.value_type as string,
      group_id: row.group_id as string | null,
      description: row.description as string,
      version: row.version as number,
      is_public: row.is_public as boolean,
      metadata: row.metadata as ConfigurationEntryRecord['metadata'],
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    };
  }

  /**
   * Maps a database row to a ConfigurationEntry entity.
   */
  private mapRowToEntry(row: Record<string, unknown>): ConfigurationEntry {
    const record = this.mapRowToEntryRecord(row);
    return ConfigurationEntry.fromDatabase(record);
  }

  /**
   * Converts a ConfigurationEntry entity to database insert format.
   */
  private toEntryInsertRecord(entry: ConfigurationEntry): Record<string, unknown> {
    return {
      config_id: entry.configId.value,
      key: entry.key.value,
      value: entry.value,
      value_type: entry.valueType,
      group_id: entry.groupId?.value ?? null,
      description: entry.description,
      version: entry.version,
      is_public: entry.isPublic,
      metadata: entry.metadata,
      created_at: entry.createdAt.toISOString(),
      updated_at: entry.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a ConfigurationEntry entity to database update format.
   */
  private toEntryUpdateRecord(entry: ConfigurationEntry): Record<string, unknown> {
    return {
      value: entry.value,
      description: entry.description,
      version: entry.version + 1,
      is_public: entry.isPublic,
      metadata: entry.metadata,
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Maps a database row to ConfigurationGroupRecord format.
   */
  private mapRowToGroupRecord(row: Record<string, unknown>): ConfigurationGroupRecord {
    return {
      group_id: row.group_id as string,
      name: row.name as string,
      description: row.description as string,
      metadata: row.metadata as ConfigurationGroupRecord['metadata'],
    };
  }

  /**
   * Maps a database row to a ConfigurationGroup entity.
   */
  private mapRowToGroup(row: Record<string, unknown>): ConfigurationGroup {
    const record = this.mapRowToGroupRecord(row);
    return ConfigurationGroup.fromDatabase(record);
  }

  /**
   * Converts a ConfigurationGroup entity to database insert format.
   */
  private toGroupInsertRecord(group: ConfigurationGroup): Record<string, unknown> {
    return {
      group_id: group.groupId.value,
      name: group.name,
      description: group.description,
      metadata: group.metadata,
    };
  }

  /**
   * Converts a ConfigurationGroup entity to database update format.
   */
  private toGroupUpdateRecord(group: ConfigurationGroup): Record<string, unknown> {
    return {
      name: group.name,
      description: group.description,
      metadata: group.metadata,
    };
  }

  /**
   * Maps a database row to FeatureFlagRecord format.
   */
  private mapRowToFeatureFlagRecord(row: Record<string, unknown>): FeatureFlagRecord {
    return {
      flag_id: row.flag_id as string,
      key: row.key as string,
      enabled: row.enabled as boolean,
      rollout: row.rollout as number,
      description: row.description as string,
      metadata: row.metadata as FeatureFlagRecord['metadata'],
    };
  }

  /**
   * Maps a database row to a FeatureFlag entity.
   */
  private mapRowToFeatureFlag(row: Record<string, unknown>): FeatureFlag {
    const record = this.mapRowToFeatureFlagRecord(row);
    return FeatureFlag.fromDatabase(record);
  }

  /**
   * Converts a FeatureFlag entity to database insert format.
   */
  private toFeatureFlagInsertRecord(flag: FeatureFlag): Record<string, unknown> {
    return {
      flag_id: flag.flagId.value,
      key: flag.key,
      enabled: flag.enabled,
      rollout: flag.rollout,
      description: flag.description,
      metadata: flag.metadata,
    };
  }

  /**
   * Converts a FeatureFlag entity to database update format.
   */
  private toFeatureFlagUpdateRecord(flag: FeatureFlag): Record<string, unknown> {
    return {
      enabled: flag.enabled,
      rollout: flag.rollout,
      description: flag.description,
      metadata: flag.metadata,
    };
  }

  /**
   * Calculates pagination offset from page and pageSize.
   */
  private calculateOffset(params: PaginationParams): number {
    return (params.page - 1) * params.pageSize;
  }

  // Configuration Entry Operations

  /**
   * Creates a new configuration entry.
   * @param entry The entry to create
   * @returns The created entry
   */
  async createEntry(entry: ConfigurationEntry): Promise<ConfigurationEntry> {
    logger.debug('Creating configuration entry', { key: entry.key.value });

    try {
      const record = this.toEntryInsertRecord(entry);
      const { data, error } = await (this.client as any)
        .from(this.tableName)
        .insert(record)
        .select()
        .single();

      if (error) {
        logger.error('Failed to create configuration entry', error);
        throw RepositoryError.createFailed('ConfigurationEntry', error);
      }

      if (!data) {
        throw RepositoryError.createFailed('ConfigurationEntry');
      }

      logger.info('Configuration entry created successfully', { key: entry.key.value });
      return this.mapRowToEntry(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error creating configuration entry', err as Error);
      throw RepositoryError.createFailed('ConfigurationEntry', err as Error);
    }
  }

  /**
   * Finds an entry by its ID.
   * @param id The configuration ID to find
   * @returns The entry if found, null otherwise
   */
  async findEntryById(id: ConfigurationId): Promise<ConfigurationEntry | null> {
    logger.debug('Finding configuration entry by ID', { configId: id.value });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('config_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find configuration entry by ID', error);
        throw RepositoryError.entityNotFound('ConfigurationEntry', id.value, this.tableName);
      }

      return data ? this.mapRowToEntry(data as Record<string, unknown>) : null;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error finding configuration entry', err as Error);
      throw RepositoryError.entityNotFound('ConfigurationEntry', id.value, this.tableName);
    }
  }

  /**
   * Finds an entry by its key.
   * @param key The configuration key to find
   * @returns The entry if found, null otherwise
   */
  async findEntryByKey(key: ConfigurationKey): Promise<ConfigurationEntry | null> {
    logger.debug('Finding configuration entry by key', { key: key.value });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('key', key.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find configuration entry by key', error);
        throw RepositoryError.entityNotFound('ConfigurationEntry', key.value, this.tableName);
      }

      return data ? this.mapRowToEntry(data as Record<string, unknown>) : null;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error finding configuration entry', err as Error);
      throw RepositoryError.entityNotFound('ConfigurationEntry', key.value, this.tableName);
    }
  }

  /**
   * Updates an existing entry.
   * @param entry The entry to update
   * @returns The updated entry
   */
  async updateEntry(entry: ConfigurationEntry): Promise<ConfigurationEntry> {
    logger.debug('Updating configuration entry', { key: entry.key.value });

    try {
      const record = this.toEntryUpdateRecord(entry);
      const { data, error } = await (this.client as any)
        .from(this.tableName)
        .update(record)
        .eq('config_id', entry.configId.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update configuration entry', error);
        throw RepositoryError.updateFailed('ConfigurationEntry', entry.configId.value, error);
      }

      if (!data) {
        throw RepositoryError.entityNotFound('ConfigurationEntry', entry.configId.value, this.tableName);
      }

      logger.info('Configuration entry updated successfully', { key: entry.key.value });
      return this.mapRowToEntry(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error updating configuration entry', err as Error);
      throw RepositoryError.updateFailed('ConfigurationEntry', entry.configId.value, err as Error);
    }
  }

  /**
   * Deletes an entry.
   * @param id The configuration ID to delete
   */
  async deleteEntry(id: ConfigurationId): Promise<void> {
    logger.debug('Deleting configuration entry', { configId: id.value });

    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('config_id', id.value);

      if (error) {
        logger.error('Failed to delete configuration entry', error);
        throw RepositoryError.deleteFailed('ConfigurationEntry', id.value, error);
      }

      logger.info('Configuration entry deleted successfully', { configId: id.value });
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error deleting configuration entry', err as Error);
      throw RepositoryError.deleteFailed('ConfigurationEntry', id.value, err as Error);
    }
  }

  /**
   * Lists entries with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of entries
   */
  async listEntries(
    params: PaginationParams,
    filters?: ConfigurationFilterParams
  ): Promise<PaginatedResult<ConfigurationEntry>> {
    logger.debug('Listing configuration entries', { params, filters });

    try {
      const offset = this.calculateOffset(params);

      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters?.groupId) {
        query = query.eq('group_id', filters.groupId.value);
      }
      if (filters?.keyPrefix) {
        query = query.like('key', `${filters.keyPrefix}%`);
      }
      if (filters?.isPublic !== undefined) {
        query = query.eq('is_public', filters.isPublic);
      }
      if (filters?.valueType) {
        query = query.eq('value_type', filters.valueType);
      }

      // Apply sorting
      const sortColumn = params.sortBy || 'key';
      const sortOrder = params.sortOrder === SortOrder.ASC ? true : false;
      query = query.order(sortColumn, { ascending: sortOrder });

      const { data, error, count } = await query
        .range(offset, offset + params.pageSize - 1);

      if (error) {
        logger.error('Failed to list configuration entries', error);
        throw new RepositoryError({
          message: 'Failed to list configuration entries',
          operation: 'SELECT',
          cause: error,
        });
      }

      const entries = (data ?? []).map((row) => this.mapRowToEntry(row as Record<string, unknown>));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / params.pageSize);

      return {
        items: entries,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error listing configuration entries', err as Error);
      throw new RepositoryError({
        message: 'Failed to list configuration entries',
        operation: 'SELECT',
        cause: err as Error,
      });
    }
  }

  /**
   * Counts entries with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching entries
   */
  async countEntries(filters?: ConfigurationFilterParams): Promise<number> {
    logger.debug('Counting configuration entries', { filters });

    try {
      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      // Apply filters
      if (filters?.groupId) {
        query = query.eq('group_id', filters.groupId.value);
      }
      if (filters?.keyPrefix) {
        query = query.like('key', `${filters.keyPrefix}%`);
      }
      if (filters?.isPublic !== undefined) {
        query = query.eq('is_public', filters.isPublic);
      }
      if (filters?.valueType) {
        query = query.eq('value_type', filters.valueType);
      }

      const { error, count } = await query;

      if (error) {
        logger.error('Failed to count configuration entries', error);
        throw new RepositoryError({
          message: 'Failed to count configuration entries',
          operation: 'SELECT',
          cause: error,
        });
      }

      return count ?? 0;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error counting configuration entries', err as Error);
      throw new RepositoryError({
        message: 'Failed to count configuration entries',
        operation: 'SELECT',
        cause: err as Error,
      });
    }
  }

  // Configuration Group Operations

  /**
   * Creates a new configuration group.
   * @param group The group to create
   * @returns The created group
   */
  async createGroup(group: ConfigurationGroup): Promise<ConfigurationGroup> {
    logger.debug('Creating configuration group', { name: group.name });

    try {
      const record = this.toGroupInsertRecord(group);
      const { data, error } = await (this.client as any)
        .from(this.groupTableName)
        .insert(record)
        .select()
        .single();

      if (error) {
        logger.error('Failed to create configuration group', error);
        throw RepositoryError.createFailed('ConfigurationGroup', error);
      }

      if (!data) {
        throw RepositoryError.createFailed('ConfigurationGroup');
      }

      logger.info('Configuration group created successfully', { name: group.name });
      return this.mapRowToGroup(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error creating configuration group', err as Error);
      throw RepositoryError.createFailed('ConfigurationGroup', err as Error);
    }
  }

  /**
   * Finds a group by its ID.
   * @param id The group ID to find
   * @returns The group if found, null otherwise
   */
  async findGroupById(id: GroupId): Promise<ConfigurationGroup | null> {
    logger.debug('Finding configuration group by ID', { groupId: id.value });

    try {
      const { data, error } = await this.client
        .from(this.groupTableName)
        .select('*')
        .eq('group_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find configuration group by ID', error);
        throw RepositoryError.entityNotFound('ConfigurationGroup', id.value, this.groupTableName);
      }

      return data ? this.mapRowToGroup(data as Record<string, unknown>) : null;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error finding configuration group', err as Error);
      throw RepositoryError.entityNotFound('ConfigurationGroup', id.value, this.groupTableName);
    }
  }

  /**
   * Finds a group by its name.
   * @param name The group name to find
   * @returns The group if found, null otherwise
   */
  async findGroupByName(name: string): Promise<ConfigurationGroup | null> {
    logger.debug('Finding configuration group by name', { name });

    try {
      const { data, error } = await this.client
        .from(this.groupTableName)
        .select('*')
        .eq('name', name)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find configuration group by name', error);
        throw RepositoryError.entityNotFound('ConfigurationGroup', name, this.groupTableName);
      }

      return data ? this.mapRowToGroup(data as Record<string, unknown>) : null;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error finding configuration group', err as Error);
      throw RepositoryError.entityNotFound('ConfigurationGroup', name, this.groupTableName);
    }
  }

  /**
   * Updates an existing group.
   * @param group The group to update
   * @returns The updated group
   */
  async updateGroup(group: ConfigurationGroup): Promise<ConfigurationGroup> {
    logger.debug('Updating configuration group', { name: group.name });

    try {
      const record = this.toGroupUpdateRecord(group);
      const { data, error } = await (this.client as any)
        .from(this.groupTableName)
        .update(record)
        .eq('group_id', group.groupId.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update configuration group', error);
        throw RepositoryError.updateFailed('ConfigurationGroup', group.groupId.value, error);
      }

      if (!data) {
        throw RepositoryError.entityNotFound('ConfigurationGroup', group.groupId.value, this.groupTableName);
      }

      logger.info('Configuration group updated successfully', { name: group.name });
      return this.mapRowToGroup(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error updating configuration group', err as Error);
      throw RepositoryError.updateFailed('ConfigurationGroup', group.groupId.value, err as Error);
    }
  }

  /**
   * Deletes a group.
   * @param id The group ID to delete
   */
  async deleteGroup(id: GroupId): Promise<void> {
    logger.debug('Deleting configuration group', { groupId: id.value });

    try {
      const { error } = await this.client
        .from(this.groupTableName)
        .delete()
        .eq('group_id', id.value);

      if (error) {
        logger.error('Failed to delete configuration group', error);
        throw RepositoryError.deleteFailed('ConfigurationGroup', id.value, error);
      }

      logger.info('Configuration group deleted successfully', { groupId: id.value });
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error deleting configuration group', err as Error);
      throw RepositoryError.deleteFailed('ConfigurationGroup', id.value, err as Error);
    }
  }

  /**
   * Lists all groups.
   * @param params Pagination parameters
   * @returns Paginated result of groups
   */
  async listGroups(params: PaginationParams): Promise<PaginatedResult<ConfigurationGroup>> {
    logger.debug('Listing configuration groups', { params });

    try {
      const offset = this.calculateOffset(params);

      let query = this.client
        .from(this.groupTableName)
        .select('*', { count: 'exact' });

      // Apply sorting
      const sortColumn = params.sortBy || 'name';
      const sortOrder = params.sortOrder === SortOrder.ASC ? true : false;
      query = query.order(sortColumn, { ascending: sortOrder });

      const { data, error, count } = await query
        .range(offset, offset + params.pageSize - 1);

      if (error) {
        logger.error('Failed to list configuration groups', error);
        throw new RepositoryError({
          message: 'Failed to list configuration groups',
          operation: 'SELECT',
          cause: error,
        });
      }

      const groups = (data ?? []).map((row) => this.mapRowToGroup(row as Record<string, unknown>));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / params.pageSize);

      return {
        items: groups,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error listing configuration groups', err as Error);
      throw new RepositoryError({
        message: 'Failed to list configuration groups',
        operation: 'SELECT',
        cause: err as Error,
      });
    }
  }

  // Feature Flag Operations

  /**
   * Creates a new feature flag.
   * @param flag The flag to create
   * @returns The created flag
   */
  async createFeatureFlag(flag: FeatureFlag): Promise<FeatureFlag> {
    logger.debug('Creating feature flag', { key: flag.key });

    try {
      const record = this.toFeatureFlagInsertRecord(flag);
      const { data, error } = await (this.client as any)
        .from(this.featureFlagTableName)
        .insert(record)
        .select()
        .single();

      if (error) {
        logger.error('Failed to create feature flag', error);
        throw RepositoryError.createFailed('FeatureFlag', error);
      }

      if (!data) {
        throw RepositoryError.createFailed('FeatureFlag');
      }

      logger.info('Feature flag created successfully', { key: flag.key });
      return this.mapRowToFeatureFlag(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error creating feature flag', err as Error);
      throw RepositoryError.createFailed('FeatureFlag', err as Error);
    }
  }

  /**
   * Finds a feature flag by its ID.
   * @param id The flag ID to find
   * @returns The flag if found, null otherwise
   */
  async findFeatureFlagById(id: FeatureFlagId): Promise<FeatureFlag | null> {
    logger.debug('Finding feature flag by ID', { flagId: id.value });

    try {
      const { data, error } = await this.client
        .from(this.featureFlagTableName)
        .select('*')
        .eq('flag_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find feature flag by ID', error);
        throw RepositoryError.entityNotFound('FeatureFlag', id.value, this.featureFlagTableName);
      }

      return data ? this.mapRowToFeatureFlag(data as Record<string, unknown>) : null;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error finding feature flag', err as Error);
      throw RepositoryError.entityNotFound('FeatureFlag', id.value, this.featureFlagTableName);
    }
  }

  /**
   * Finds a feature flag by its key.
   * @param key The flag key to find
   * @returns The flag if found, null otherwise
   */
  async findFeatureFlagByKey(key: string): Promise<FeatureFlag | null> {
    logger.debug('Finding feature flag by key', { key });

    try {
      const { data, error } = await this.client
        .from(this.featureFlagTableName)
        .select('*')
        .eq('key', key)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find feature flag by key', error);
        throw RepositoryError.entityNotFound('FeatureFlag', key, this.featureFlagTableName);
      }

      return data ? this.mapRowToFeatureFlag(data as Record<string, unknown>) : null;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error finding feature flag', err as Error);
      throw RepositoryError.entityNotFound('FeatureFlag', key, this.featureFlagTableName);
    }
  }

  /**
   * Updates an existing feature flag.
   * @param flag The flag to update
   * @returns The updated flag
   */
  async updateFeatureFlag(flag: FeatureFlag): Promise<FeatureFlag> {
    logger.debug('Updating feature flag', { key: flag.key });

    try {
      const record = this.toFeatureFlagUpdateRecord(flag);
      const { data, error } = await (this.client as any)
        .from(this.featureFlagTableName)
        .update(record)
        .eq('flag_id', flag.flagId.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update feature flag', error);
        throw RepositoryError.updateFailed('FeatureFlag', flag.flagId.value, error);
      }

      if (!data) {
        throw RepositoryError.entityNotFound('FeatureFlag', flag.flagId.value, this.featureFlagTableName);
      }

      logger.info('Feature flag updated successfully', { key: flag.key });
      return this.mapRowToFeatureFlag(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error updating feature flag', err as Error);
      throw RepositoryError.updateFailed('FeatureFlag', flag.flagId.value, err as Error);
    }
  }

  /**
   * Deletes a feature flag.
   * @param id The flag ID to delete
   */
  async deleteFeatureFlag(id: FeatureFlagId): Promise<void> {
    logger.debug('Deleting feature flag', { flagId: id.value });

    try {
      const { error } = await this.client
        .from(this.featureFlagTableName)
        .delete()
        .eq('flag_id', id.value);

      if (error) {
        logger.error('Failed to delete feature flag', error);
        throw RepositoryError.deleteFailed('FeatureFlag', id.value, error);
      }

      logger.info('Feature flag deleted successfully', { flagId: id.value });
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error deleting feature flag', err as Error);
      throw RepositoryError.deleteFailed('FeatureFlag', id.value, err as Error);
    }
  }

  /**
   * Lists all feature flags.
   * @param params Pagination parameters
   * @returns Paginated result of flags
   */
  async listFeatureFlags(params: PaginationParams): Promise<PaginatedResult<FeatureFlag>> {
    logger.debug('Listing feature flags', { params });

    try {
      const offset = this.calculateOffset(params);

      let query = this.client
        .from(this.featureFlagTableName)
        .select('*', { count: 'exact' });

      // Apply sorting
      const sortColumn = params.sortBy || 'key';
      const sortOrder = params.sortOrder === SortOrder.ASC ? true : false;
      query = query.order(sortColumn, { ascending: sortOrder });

      const { data, error, count } = await query
        .range(offset, offset + params.pageSize - 1);

      if (error) {
        logger.error('Failed to list feature flags', error);
        throw new RepositoryError({
          message: 'Failed to list feature flags',
          operation: 'SELECT',
          cause: error,
        });
      }

      const flags = (data ?? []).map((row) => this.mapRowToFeatureFlag(row as Record<string, unknown>));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / params.pageSize);

      return {
        items: flags,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error listing feature flags', err as Error);
      throw new RepositoryError({
        message: 'Failed to list feature flags',
        operation: 'SELECT',
        cause: err as Error,
      });
    }
  }

  /**
   * Checks if a feature flag exists by key.
   * @param key The flag key to check
   * @returns true if flag exists
   */
  async featureFlagExists(key: string): Promise<boolean> {
    logger.debug('Checking feature flag exists', { key });

    try {
      const { data, error } = await this.client
        .from(this.featureFlagTableName)
        .select('flag_id')
        .eq('key', key)
        .limit(1);

      if (error) {
        logger.error('Failed to check feature flag existence', error);
        return false;
      }

      return (data?.length ?? 0) > 0;
    } catch (err) {
      logger.error('Unexpected error checking feature flag existence', err as Error);
      return false;
    }
  }
}
