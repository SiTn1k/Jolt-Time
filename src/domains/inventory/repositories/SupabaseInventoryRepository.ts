/**
 * Supabase Inventory Repository
 *
 * Production Supabase implementation of the Inventory repository.
 * Handles all persistence operations for Inventory entities.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type {
  IInventoryRepository,
  IInventoryItemRepository,
  InventoryFilterParams,
} from '../interfaces/IInventoryRepository';
import { Inventory, InventoryRecord } from '../entities/Inventory';
import { InventoryItem, InventoryItemRecord, ItemRarity } from '../entities/InventoryItem';
import type { InventoryId } from '../value-objects/InventoryId';
import type { InventoryItemId } from '../value-objects/InventoryItemId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import type { InventoryFilters } from '../types/InventoryFilters';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { createLogger } from '../../../core/logging/logger.service';
import { RepositoryError } from '../../../database/errors/repository.error';
import { SortOrder } from '../../../shared/constants';

const logger = createLogger('SupabaseInventoryRepository');

/**
 * Supabase implementation of the Inventory Repository.
 * Implements IInventoryRepository for Inventory entity persistence.
 */
export class SupabaseInventoryRepository implements IInventoryRepository {
  private readonly tableName = 'inventories';
  private readonly _client?: SupabaseClient<Database>;

  /**
   * Creates a new SupabaseInventoryRepository instance.
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
   * Maps a database row to InventoryRecord format.
   */
  private mapRowToRecord(row: Record<string, unknown>): InventoryRecord {
    return {
      inventory_id: row.inventory_id as string,
      player_profile_id: row.player_profile_id as string,
      capacity: row.capacity as number,
      used_slots: row.used_slots as number,
      statistics: row.statistics as Inventory['statistics'],
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    };
  }

  /**
   * Maps a database row to an Inventory entity.
   */
  private mapRowToEntity(row: Record<string, unknown>): Inventory {
    const record = this.mapRowToRecord(row);
    return Inventory.fromDatabase(record);
  }

  /**
   * Converts an Inventory entity to database insert format.
   */
  private toInsertRecord(inventory: Inventory): Record<string, unknown> {
    return {
      inventory_id: inventory.inventoryId.value,
      player_profile_id: inventory.playerProfileId.value,
      capacity: inventory.capacity.value,
      used_slots: inventory.usedSlots,
      statistics: inventory.statistics,
      created_at: inventory.createdAt.toISOString(),
      updated_at: inventory.updatedAt.toISOString(),
    };
  }

  /**
   * Converts an Inventory entity to database update format.
   */
  private toUpdateRecord(inventory: Inventory): Record<string, unknown> {
    return {
      capacity: inventory.capacity.value,
      used_slots: inventory.usedSlots,
      statistics: inventory.statistics,
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Calculates pagination offset from page and pageSize.
   */
  private calculateOffset(params: PaginationParams): number {
    return (params.page - 1) * params.pageSize;
  }

  /**
   * Creates a new inventory.
   * @param inventory The inventory to create
   * @returns The created inventory
   */
  async create(inventory: Inventory): Promise<Inventory> {
    logger.debug('Creating inventory', { inventoryId: inventory.inventoryId.value });

    try {
      const record = this.toInsertRecord(inventory);
      const { data, error } = await (this.client as any)
        .from(this.tableName)
        .insert(record)
        .select()
        .single();

      if (error) {
        logger.error('Failed to create inventory', error);
        throw RepositoryError.createFailed('Inventory', error);
      }

      if (!data) {
        throw RepositoryError.createFailed('Inventory');
      }

      logger.info('Inventory created successfully', { inventoryId: inventory.inventoryId.value });
      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error creating inventory', err as Error);
      throw RepositoryError.createFailed('Inventory', err as Error);
    }
  }

  /**
   * Finds an inventory by its internal ID.
   * @param id The inventory ID to find
   * @returns The inventory if found, null otherwise
   */
  async findById(id: InventoryId): Promise<Inventory | null> {
    logger.debug('Finding inventory by ID', { inventoryId: id.value });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('inventory_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find inventory by ID', error);
        throw RepositoryError.entityNotFound('Inventory', id.value, this.tableName);
      }

      return data ? this.mapRowToEntity(data as Record<string, unknown>) : null;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error finding inventory', err as Error);
      throw RepositoryError.entityNotFound('Inventory', id.value, this.tableName);
    }
  }

  /**
   * Finds an inventory by player profile ID.
   * @param playerProfileId The player profile ID to find inventory for
   * @returns The inventory if found, null otherwise
   */
  async findByPlayerProfileId(playerProfileId: string): Promise<Inventory | null> {
    logger.debug('Finding inventory by player profile ID', { playerProfileId });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('player_profile_id', playerProfileId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find inventory by player profile ID', error);
        throw RepositoryError.entityNotFound('Inventory', playerProfileId, this.tableName);
      }

      return data ? this.mapRowToEntity(data as Record<string, unknown>) : null;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error finding inventory', err as Error);
      throw RepositoryError.entityNotFound('Inventory', playerProfileId, this.tableName);
    }
  }

  /**
   * Checks if an inventory exists by ID.
   * @param id The inventory ID to check
   * @returns true if inventory exists
   */
  async exists(id: InventoryId): Promise<boolean> {
    logger.debug('Checking if inventory exists', { inventoryId: id.value });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('inventory_id')
        .eq('inventory_id', id.value)
        .limit(1);

      if (error) {
        logger.error('Failed to check inventory existence', error);
        return false;
      }

      return (data?.length ?? 0) > 0;
    } catch (err) {
      logger.error('Unexpected error checking inventory existence', err as Error);
      return false;
    }
  }

  /**
   * Updates an existing inventory.
   * @param inventory The inventory to update
   * @returns The updated inventory
   */
  async update(inventory: Inventory): Promise<Inventory> {
    logger.debug('Updating inventory', { inventoryId: inventory.inventoryId.value });

    try {
      const record = this.toUpdateRecord(inventory);
      const { data, error } = await (this.client as any)
        .from(this.tableName)
        .update(record)
        .eq('inventory_id', inventory.inventoryId.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update inventory', error);
        throw RepositoryError.updateFailed('Inventory', inventory.inventoryId.value, error);
      }

      if (!data) {
        throw RepositoryError.entityNotFound('Inventory', inventory.inventoryId.value, this.tableName);
      }

      logger.info('Inventory updated successfully', { inventoryId: inventory.inventoryId.value });
      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error updating inventory', err as Error);
      throw RepositoryError.updateFailed('Inventory', inventory.inventoryId.value, err as Error);
    }
  }

  /**
   * Deletes an inventory.
   * @param id The inventory ID to delete
   */
  async delete(id: InventoryId): Promise<void> {
    logger.debug('Deleting inventory', { inventoryId: id.value });

    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('inventory_id', id.value);

      if (error) {
        logger.error('Failed to delete inventory', error);
        throw RepositoryError.deleteFailed('Inventory', id.value, error);
      }

      logger.info('Inventory deleted successfully', { inventoryId: id.value });
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error deleting inventory', err as Error);
      throw RepositoryError.deleteFailed('Inventory', id.value, err as Error);
    }
  }

  /**
   * Lists inventories with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of inventories
   */
  async list(
    params: PaginationParams,
    filters?: InventoryFilterParams
  ): Promise<PaginatedResult<Inventory>> {
    logger.debug('Listing inventories', { params, filters });

    try {
      const offset = this.calculateOffset(params);

      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters?.playerProfileId) {
        query = query.eq('player_profile_id', filters.playerProfileId);
      }
      if (filters?.minCapacity !== undefined) {
        query = query.gte('capacity', filters.minCapacity);
      }
      if (filters?.maxCapacity !== undefined) {
        query = query.lte('capacity', filters.maxCapacity);
      }
      if (filters?.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }
      if (filters?.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
      }

      // Apply sorting
      const sortColumn = params.sortBy ?? 'created_at';
      const sortOrder = params.sortOrder === SortOrder.ASC ? true : false;
      query = query.order(sortColumn, { ascending: sortOrder });

      const { data, error, count } = await query
        .range(offset, offset + params.pageSize - 1);

      if (error) {
        logger.error('Failed to list inventories', error);
        throw new RepositoryError({
          message: 'Failed to list inventories',
          operation: 'SELECT',
          cause: error,
        });
      }

      const items = (data ?? []).map((row) => this.mapRowToEntity(row as Record<string, unknown>));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / params.pageSize);

      return {
        items,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error listing inventories', err as Error);
      throw new RepositoryError({
        message: 'Failed to list inventories',
        operation: 'SELECT',
        cause: err as Error,
      });
    }
  }

  /**
   * Counts total inventories with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching inventories
   */
  async count(filters?: InventoryFilterParams): Promise<number> {
    logger.debug('Counting inventories', { filters });

    try {
      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      // Apply filters
      if (filters?.playerProfileId) {
        query = query.eq('player_profile_id', filters.playerProfileId);
      }
      if (filters?.minCapacity !== undefined) {
        query = query.gte('capacity', filters.minCapacity);
      }
      if (filters?.maxCapacity !== undefined) {
        query = query.lte('capacity', filters.maxCapacity);
      }
      if (filters?.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }
      if (filters?.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
      }

      const { error, count } = await query;

      if (error) {
        logger.error('Failed to count inventories', error);
        throw new RepositoryError({
          message: 'Failed to count inventories',
          operation: 'SELECT',
          cause: error,
        });
      }

      return count ?? 0;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error counting inventories', err as Error);
      throw new RepositoryError({
        message: 'Failed to count inventories',
        operation: 'SELECT',
        cause: err as Error,
      });
    }
  }
}

/**
 * Supabase implementation of the Inventory Item Repository.
 * Implements IInventoryItemRepository for InventoryItem entity persistence.
 */
export class SupabaseInventoryItemRepository implements IInventoryItemRepository {
  private readonly tableName = 'inventory_items';
  private readonly _client?: SupabaseClient<Database>;

  /**
   * Creates a new SupabaseInventoryItemRepository instance.
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
   * Maps a database row to InventoryItemRecord format.
   */
  private mapRowToRecord(row: Record<string, unknown>): InventoryItemRecord {
    return {
      item_id: row.item_id as string,
      inventory_id: row.inventory_id as string,
      artifact_id: row.artifact_id as string,
      owner_id: row.owner_id as string,
      quantity: row.quantity as number,
      rarity: row.rarity as string,
      status: row.status as string,
      metadata: row.metadata as InventoryItem['metadata'],
      obtained_at: row.obtained_at as string,
      expires_at: row.expires_at as string | null,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    };
  }

  /**
   * Maps a database row to an InventoryItem entity.
   */
  private mapRowToEntity(row: Record<string, unknown>): InventoryItem {
    const record = this.mapRowToRecord(row);
    return InventoryItem.fromDatabase(record);
  }

  /**
   * Converts an InventoryItem entity to database insert format.
   */
  private toInsertRecord(item: InventoryItem): Record<string, unknown> {
    return {
      item_id: item.itemId.value,
      inventory_id: item.inventoryId.value,
      artifact_id: item.artifactId,
      owner_id: item.ownerId,
      quantity: item.quantity.value,
      rarity: item.rarity,
      status: item.status,
      metadata: item.metadata,
      obtained_at: item.obtainedAt.toISOString(),
      expires_at: item.expiresAt?.toISOString() ?? null,
      created_at: item.createdAt.toISOString(),
      updated_at: item.updatedAt.toISOString(),
    };
  }

  /**
   * Converts an InventoryItem entity to database update format.
   */
  private toUpdateRecord(item: InventoryItem): Record<string, unknown> {
    return {
      quantity: item.quantity.value,
      status: item.status,
      metadata: item.metadata,
      expires_at: item.expiresAt?.toISOString() ?? null,
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Calculates pagination offset from page and pageSize.
   */
  private calculateOffset(params: PaginationParams): number {
    return (params.page - 1) * params.pageSize;
  }

  /**
   * Creates a new inventory item.
   * @param item The item to create
   * @returns The created item
   */
  async create(item: InventoryItem): Promise<InventoryItem> {
    logger.debug('Creating inventory item', { itemId: item.itemId.value });

    try {
      const record = this.toInsertRecord(item);
      const { data, error } = await (this.client as any)
        .from(this.tableName)
        .insert(record)
        .select()
        .single();

      if (error) {
        logger.error('Failed to create inventory item', error);
        throw RepositoryError.createFailed('InventoryItem', error);
      }

      if (!data) {
        throw RepositoryError.createFailed('InventoryItem');
      }

      logger.info('Inventory item created successfully', { itemId: item.itemId.value });
      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error creating inventory item', err as Error);
      throw RepositoryError.createFailed('InventoryItem', err as Error);
    }
  }

  /**
   * Finds an inventory item by its internal ID.
   * @param id The item ID to find
   * @returns The item if found, null otherwise
   */
  async findById(id: InventoryItemId): Promise<InventoryItem | null> {
    logger.debug('Finding inventory item by ID', { itemId: id.value });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('item_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find inventory item by ID', error);
        throw RepositoryError.entityNotFound('InventoryItem', id.value, this.tableName);
      }

      return data ? this.mapRowToEntity(data as Record<string, unknown>) : null;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error finding inventory item', err as Error);
      throw RepositoryError.entityNotFound('InventoryItem', id.value, this.tableName);
    }
  }

  /**
   * Finds all items in an inventory.
   * @param inventoryId The inventory ID
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of items
   */
  async findByInventoryId(
    inventoryId: InventoryId,
    params: PaginationParams,
    filters?: InventoryFilters
  ): Promise<PaginatedResult<InventoryItem>> {
    logger.debug('Finding items by inventory ID', { inventoryId: inventoryId.value, params, filters });

    try {
      const offset = this.calculateOffset(params);

      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .eq('inventory_id', inventoryId.value);

      // Apply filters
      if (filters?.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }
      if (filters?.rarity && filters.rarity.length > 0) {
        query = query.in('rarity', filters.rarity);
      }
      if (filters?.type && filters.type.length > 0) {
        query = query.in('artifact_type', filters.type);
      }
      if (filters?.artifactId) {
        query = query.eq('artifact_id', filters.artifactId);
      }
      if (filters?.itemId) {
        query = query.eq('item_id', filters.itemId);
      }
      if (filters?.favoritesOnly) {
        query = query.eq('metadata->>isFavorite', 'true');
      }
      if (filters?.searchQuery) {
        query = query.ilike('artifact_name', `%${filters.searchQuery}%`);
      }
      if (filters?.minLevel !== undefined) {
        query = query.gte('level', filters.minLevel);
      }
      if (filters?.maxLevel !== undefined) {
        query = query.lte('level', filters.maxLevel);
      }

      // Apply sorting
      const sortColumn = this.getSortColumn(params.sortBy);
      const sortOrder = params.sortOrder === SortOrder.ASC ? true : false;
      query = query.order(sortColumn, { ascending: sortOrder });

      const { data, error, count } = await query
        .range(offset, offset + params.pageSize - 1);

      if (error) {
        logger.error('Failed to find items by inventory ID', error);
        throw new RepositoryError({
          message: 'Failed to find items by inventory ID',
          operation: 'SELECT',
          cause: error,
        });
      }

      const items = (data ?? []).map((row) => this.mapRowToEntity(row as Record<string, unknown>));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / params.pageSize);

      return {
        items,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error finding items by inventory ID', err as Error);
      throw new RepositoryError({
        message: 'Failed to find items by inventory ID',
        operation: 'SELECT',
        cause: err as Error,
      });
    }
  }

  /**
   * Finds an item by artifact ID and owner.
   * @param artifactId The artifact ID
   * @param ownerId The owner player profile ID
   * @returns The item if found, null otherwise
   */
  async findByArtifactAndOwner(artifactId: string, ownerId: string): Promise<InventoryItem | null> {
    logger.debug('Finding item by artifact and owner', { artifactId, ownerId });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('artifact_id', artifactId)
        .eq('owner_id', ownerId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find item by artifact and owner', error);
        return null;
      }

      return data ? this.mapRowToEntity(data as Record<string, unknown>) : null;
    } catch (err) {
      logger.error('Unexpected error finding item by artifact and owner', err as Error);
      return null;
    }
  }

  /**
   * Finds all items owned by a player profile.
   * @param ownerId The owner player profile ID
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of items
   */
  async findByOwnerId(
    ownerId: string,
    params: PaginationParams,
    filters?: InventoryFilters
  ): Promise<PaginatedResult<InventoryItem>> {
    logger.debug('Finding items by owner ID', { ownerId, params, filters });

    try {
      const offset = this.calculateOffset(params);

      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .eq('owner_id', ownerId);

      // Apply filters
      if (filters?.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }
      if (filters?.rarity && filters.rarity.length > 0) {
        query = query.in('rarity', filters.rarity);
      }
      if (filters?.type && filters.type.length > 0) {
        query = query.in('artifact_type', filters.type);
      }
      if (filters?.artifactId) {
        query = query.eq('artifact_id', filters.artifactId);
      }
      if (filters?.itemId) {
        query = query.eq('item_id', filters.itemId);
      }
      if (filters?.favoritesOnly) {
        query = query.eq('metadata->>isFavorite', 'true');
      }
      if (filters?.searchQuery) {
        query = query.ilike('artifact_name', `%${filters.searchQuery}%`);
      }
      if (filters?.minLevel !== undefined) {
        query = query.gte('level', filters.minLevel);
      }
      if (filters?.maxLevel !== undefined) {
        query = query.lte('level', filters.maxLevel);
      }

      // Apply sorting
      const sortColumn = this.getSortColumn(params.sortBy);
      const sortOrder = params.sortOrder === SortOrder.ASC ? true : false;
      query = query.order(sortColumn, { ascending: sortOrder });

      const { data, error, count } = await query
        .range(offset, offset + params.pageSize - 1);

      if (error) {
        logger.error('Failed to find items by owner ID', error);
        throw new RepositoryError({
          message: 'Failed to find items by owner ID',
          operation: 'SELECT',
          cause: error,
        });
      }

      const items = (data ?? []).map((row) => this.mapRowToEntity(row as Record<string, unknown>));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / params.pageSize);

      return {
        items,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error finding items by owner ID', err as Error);
      throw new RepositoryError({
        message: 'Failed to find items by owner ID',
        operation: 'SELECT',
        cause: err as Error,
      });
    }
  }

  /**
   * Checks if an item exists by ID.
   * @param id The item ID to check
   * @returns true if item exists
   */
  async exists(id: InventoryItemId): Promise<boolean> {
    logger.debug('Checking if item exists', { itemId: id.value });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('item_id')
        .eq('item_id', id.value)
        .limit(1);

      if (error) {
        logger.error('Failed to check item existence', error);
        return false;
      }

      return (data?.length ?? 0) > 0;
    } catch (err) {
      logger.error('Unexpected error checking item existence', err as Error);
      return false;
    }
  }

  /**
   * Updates an existing item.
   * @param item The item to update
   * @returns The updated item
   */
  async update(item: InventoryItem): Promise<InventoryItem> {
    logger.debug('Updating inventory item', { itemId: item.itemId.value });

    try {
      const record = this.toUpdateRecord(item);
      const { data, error } = await (this.client as any)
        .from(this.tableName)
        .update(record)
        .eq('item_id', item.itemId.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update inventory item', error);
        throw RepositoryError.updateFailed('InventoryItem', item.itemId.value, error);
      }

      if (!data) {
        throw RepositoryError.entityNotFound('InventoryItem', item.itemId.value, this.tableName);
      }

      logger.info('Inventory item updated successfully', { itemId: item.itemId.value });
      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error updating inventory item', err as Error);
      throw RepositoryError.updateFailed('InventoryItem', item.itemId.value, err as Error);
    }
  }

  /**
   * Deletes an item.
   * @param id The item ID to delete
   */
  async delete(id: InventoryItemId): Promise<void> {
    logger.debug('Deleting inventory item', { itemId: id.value });

    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('item_id', id.value);

      if (error) {
        logger.error('Failed to delete inventory item', error);
        throw RepositoryError.deleteFailed('InventoryItem', id.value, error);
      }

      logger.info('Inventory item deleted successfully', { itemId: id.value });
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error deleting inventory item', err as Error);
      throw RepositoryError.deleteFailed('InventoryItem', id.value, err as Error);
    }
  }

  /**
   * Lists items with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of items
   */
  async list(
    params: PaginationParams,
    filters?: InventoryFilters
  ): Promise<PaginatedResult<InventoryItem>> {
    logger.debug('Listing inventory items', { params, filters });

    try {
      const offset = this.calculateOffset(params);

      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters?.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }
      if (filters?.rarity && filters.rarity.length > 0) {
        query = query.in('rarity', filters.rarity);
      }
      if (filters?.type && filters.type.length > 0) {
        query = query.in('artifact_type', filters.type);
      }
      if (filters?.artifactId) {
        query = query.eq('artifact_id', filters.artifactId);
      }
      if (filters?.itemId) {
        query = query.eq('item_id', filters.itemId);
      }
      if (filters?.favoritesOnly) {
        query = query.eq('metadata->>isFavorite', 'true');
      }
      if (filters?.searchQuery) {
        query = query.ilike('artifact_name', `%${filters.searchQuery}%`);
      }
      if (filters?.minLevel !== undefined) {
        query = query.gte('level', filters.minLevel);
      }
      if (filters?.maxLevel !== undefined) {
        query = query.lte('level', filters.maxLevel);
      }

      // Apply sorting
      const sortColumn = this.getSortColumn(params.sortBy);
      const sortOrder = params.sortOrder === SortOrder.ASC ? true : false;
      query = query.order(sortColumn, { ascending: sortOrder });

      const { data, error, count } = await query
        .range(offset, offset + params.pageSize - 1);

      if (error) {
        logger.error('Failed to list inventory items', error);
        throw new RepositoryError({
          message: 'Failed to list inventory items',
          operation: 'SELECT',
          cause: error,
        });
      }

      const items = (data ?? []).map((row) => this.mapRowToEntity(row as Record<string, unknown>));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / params.pageSize);

      return {
        items,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error listing inventory items', err as Error);
      throw new RepositoryError({
        message: 'Failed to list inventory items',
        operation: 'SELECT',
        cause: err as Error,
      });
    }
  }

  /**
   * Counts total items with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching items
   */
  async count(filters?: InventoryFilters): Promise<number> {
    logger.debug('Counting inventory items', { filters });

    try {
      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      // Apply filters
      if (filters?.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }
      if (filters?.rarity && filters.rarity.length > 0) {
        query = query.in('rarity', filters.rarity);
      }
      if (filters?.type && filters.type.length > 0) {
        query = query.in('artifact_type', filters.type);
      }
      if (filters?.artifactId) {
        query = query.eq('artifact_id', filters.artifactId);
      }
      if (filters?.itemId) {
        query = query.eq('item_id', filters.itemId);
      }
      if (filters?.favoritesOnly) {
        query = query.eq('metadata->>isFavorite', 'true');
      }
      if (filters?.searchQuery) {
        query = query.ilike('artifact_name', `%${filters.searchQuery}%`);
      }
      if (filters?.minLevel !== undefined) {
        query = query.gte('level', filters.minLevel);
      }
      if (filters?.maxLevel !== undefined) {
        query = query.lte('level', filters.maxLevel);
      }

      const { error, count } = await query;

      if (error) {
        logger.error('Failed to count inventory items', error);
        throw new RepositoryError({
          message: 'Failed to count inventory items',
          operation: 'SELECT',
          cause: error,
        });
      }

      return count ?? 0;
    } catch (err) {
      if (err instanceof RepositoryError) throw err;
      logger.error('Unexpected error counting inventory items', err as Error);
      throw new RepositoryError({
        message: 'Failed to count inventory items',
        operation: 'SELECT',
        cause: err as Error,
      });
    }
  }

  /**
   * Maps sort option to actual column name.
   */
  private getSortColumn(sortBy?: string): string {
    const columnMapping: Record<string, string> = {
      'newest': 'obtained_at',
      'oldest': 'obtained_at',
      'rarity': 'rarity',
      'alpha': 'artifact_name',
      'used': 'usage_count',
      'type': 'artifact_type',
      'obtained_at': 'obtained_at',
      'created_at': 'created_at',
    };

    return columnMapping[sortBy ?? ''] ?? 'obtained_at';
  }
}