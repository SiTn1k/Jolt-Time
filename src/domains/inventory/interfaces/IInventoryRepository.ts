/**
 * Inventory Repository Interface
 *
 * Interface defining the contract for Inventory persistence.
 * All Inventory repository implementations must adhere to this interface.
 */

import type { InventoryId } from '../value-objects/InventoryId';
import type { InventoryItemId } from '../value-objects/InventoryItemId';
import type { Inventory } from '../entities/Inventory';
import type { InventoryItem } from '../entities/InventoryItem';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import type { InventoryFilters } from '../types/InventoryFilters';

/**
 * Filter parameters for querying inventories.
 */
export interface InventoryFilterParams {
  /** Filter by player profile ID */
  playerProfileId?: string;

  /** Filter by minimum capacity */
  minCapacity?: number;

  /** Filter by maximum capacity */
  maxCapacity?: number;

  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;
}

/**
 * Inventory repository interface.
 * Defines all data access operations for Inventory entities.
 */
export interface IInventoryRepository {
  /**
   * Creates a new inventory.
   * @param inventory The inventory to create
   * @returns The created inventory
   */
  create(inventory: Inventory): Promise<Inventory>;

  /**
   * Finds an inventory by its internal ID.
   * @param id The inventory ID to find
   * @returns The inventory if found, null otherwise
   */
  findById(id: InventoryId): Promise<Inventory | null>;

  /**
   * Finds an inventory by player profile ID.
   * @param playerProfileId The player profile ID to find inventory for
   * @returns The inventory if found, null otherwise
   */
  findByPlayerProfileId(playerProfileId: string): Promise<Inventory | null>;

  /**
   * Checks if an inventory exists by ID.
   * @param id The inventory ID to check
   * @returns true if inventory exists
   */
  exists(id: InventoryId): Promise<boolean>;

  /**
   * Updates an existing inventory.
   * @param inventory The inventory to update
   * @returns The updated inventory
   */
  update(inventory: Inventory): Promise<Inventory>;

  /**
   * Deletes an inventory.
   * @param id The inventory ID to delete
   */
  delete(id: InventoryId): Promise<void>;

  /**
   * Lists inventories with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of inventories
   */
  list(
    params: PaginationParams,
    filters?: InventoryFilterParams
  ): Promise<PaginatedResult<Inventory>>;

  /**
   * Counts total inventories with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching inventories
   */
  count(filters?: InventoryFilterParams): Promise<number>;
}

/**
 * Inventory Item repository interface.
 * Defines all data access operations for InventoryItem entities.
 */
export interface IInventoryItemRepository {
  /**
   * Creates a new inventory item.
   * @param item The item to create
   * @returns The created item
   */
  create(item: InventoryItem): Promise<InventoryItem>;

  /**
   * Finds an inventory item by its internal ID.
   * @param id The item ID to find
   * @returns The item if found, null otherwise
   */
  findById(id: InventoryItemId): Promise<InventoryItem | null>;

  /**
   * Finds all items in an inventory.
   * @param inventoryId The inventory ID
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of items
   */
  findByInventoryId(
    inventoryId: InventoryId,
    params: PaginationParams,
    filters?: InventoryFilters
  ): Promise<PaginatedResult<InventoryItem>>;

  /**
   * Finds an item by artifact ID and owner.
   * @param artifactId The artifact ID
   * @param ownerId The owner player profile ID
   * @returns The item if found, null otherwise
   */
  findByArtifactAndOwner(artifactId: string, ownerId: string): Promise<InventoryItem | null>;

  /**
   * Finds all items owned by a player profile.
   * @param ownerId The owner player profile ID
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of items
   */
  findByOwnerId(
    ownerId: string,
    params: PaginationParams,
    filters?: InventoryFilters
  ): Promise<PaginatedResult<InventoryItem>>;

  /**
   * Checks if an item exists by ID.
   * @param id The item ID to check
   * @returns true if item exists
   */
  exists(id: InventoryItemId): Promise<boolean>;

  /**
   * Updates an existing item.
   * @param item The item to update
   * @returns The updated item
   */
  update(item: InventoryItem): Promise<InventoryItem>;

  /**
   * Deletes an item.
   * @param id The item ID to delete
   */
  delete(id: InventoryItemId): Promise<void>;

  /**
   * Lists items with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of items
   */
  list(
    params: PaginationParams,
    filters?: InventoryFilters
  ): Promise<PaginatedResult<InventoryItem>>;

  /**
   * Counts total items with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching items
   */
  count(filters?: InventoryFilters): Promise<number>;
}