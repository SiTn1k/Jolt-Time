/**
 * Inventory Service
 *
 * Production service for managing inventories and inventory items.
 * Handles all business logic for inventory operations including:
 * - Inventory creation and loading
 * - Item management (add, remove, update)
 * - Stack logic (increase/decrease quantity)
 * - Capacity management
 * - Ownership validation
 * - Sorting and filtering
 *
 * This service is the main entry point for inventory operations.
 */

import { randomUUID } from 'crypto';
import { SupabaseInventoryRepository, SupabaseInventoryItemRepository } from '../domains/inventory/repositories/SupabaseInventoryRepository';
import { Inventory } from '../domains/inventory/entities/Inventory';
import { InventoryItem, ItemRarity } from '../domains/inventory/entities/InventoryItem';
import { InventoryId } from '../domains/inventory/value-objects/InventoryId';
import { InventoryItemId } from '../domains/inventory/value-objects/InventoryItemId';
import { InventoryCapacity, DEFAULT_INVENTORY_CAPACITY } from '../domains/inventory/value-objects/InventoryCapacity';
import { InventoryQuantity } from '../domains/inventory/value-objects/InventoryQuantity';
import { PlayerProfileId } from '../domains/player-profile/value-objects/PlayerProfileId';
import { InventoryMapper } from '../domains/inventory/mappers/InventoryMapper';
import { InventoryItemMapper } from '../domains/inventory/mappers/InventoryItemMapper';
import { InventoryCapacityValidator } from '../domains/inventory/validators/InventoryCapacityValidator';
import { InventoryQuantityValidator } from '../domains/inventory/validators/InventoryQuantityValidator';
import { InventoryItemValidator } from '../domains/inventory/validators/InventoryItemValidator';
import { InventoryItemStatus } from '../domains/inventory/types/InventoryItemStatus';
import { InventoryFilters, InventorySortOption } from '../domains/inventory/types/InventoryFilters';
import type { CreateInventoryDto } from '../domains/inventory/dto/CreateInventory.dto';
import type { CreateInventoryItemDto } from '../domains/inventory/dto/CreateInventoryItem.dto';
import type { UpdateInventoryItemDto } from '../domains/inventory/dto/UpdateInventoryItem.dto';
import type { InventoryResponseDto, InventorySummaryDto, InventoryItemResponseDto, InventoryItemSummaryDto } from '../domains/inventory/dto/InventoryResponse.dto';
import type { PaginationParams, PaginatedResult } from '../shared/types/base.types';
import { SortOrder } from '../shared/constants';
import { createLogger } from '../core/logging/logger.service';

const logger = createLogger('InventoryService');

/**
 * Result type for service operations.
 */
export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Inventory Service
 * Handles all business logic for inventory operations.
 */
export class InventoryService {
  private readonly inventoryRepository: SupabaseInventoryRepository;
  private readonly itemRepository: SupabaseInventoryItemRepository;

  /**
   * Creates a new InventoryService instance.
   */
  constructor(
    inventoryRepository?: SupabaseInventoryRepository,
    itemRepository?: SupabaseInventoryItemRepository
  ) {
    this.inventoryRepository = inventoryRepository ?? new SupabaseInventoryRepository();
    this.itemRepository = itemRepository ?? new SupabaseInventoryItemRepository();
  }

  // =========================================================================
  // INVENTORY MANAGEMENT
  // =========================================================================

  /**
   * Creates a new inventory for a player profile.
   * Called automatically when a Player Profile is created.
   *
   * @param playerProfileId - The player profile ID to create inventory for
   * @param capacity - Optional initial capacity (defaults to 100)
   * @returns ServiceResult with the created inventory
   */
  async createInventory(
    playerProfileId: string,
    capacity?: number
  ): Promise<ServiceResult<Inventory>> {
    logger.debug('Creating inventory', { playerProfileId, capacity });

    try {
      // Validate player profile ID format
      const validation = InventoryItemValidator.validate({
        ownerId: playerProfileId,
      });

      if (!validation.isValid) {
        return { success: false, error: `Invalid player profile ID: ${validation.errors.join(', ')}` };
      }

      // Check if inventory already exists for this player
      const existingInventory = await this.inventoryRepository.findByPlayerProfileId(playerProfileId);
      if (existingInventory) {
        logger.info('Inventory already exists for player', { playerProfileId });
        return { success: true, data: existingInventory };
      }

      // Validate capacity if provided
      if (capacity !== undefined) {
        const capacityValidation = InventoryCapacityValidator.validate(capacity);
        if (!capacityValidation.isValid) {
          return { success: false, error: capacityValidation.error ?? 'Invalid capacity' };
        }
      }

      // Create inventory entity
      const inventoryId = InventoryId.generate();
      const profileIdVO = PlayerProfileId.reconstruct(playerProfileId);
      const capacityVO = capacity !== undefined
        ? InventoryCapacity.create(capacity)
        : InventoryCapacity.create(DEFAULT_INVENTORY_CAPACITY);

      const inventory = Inventory.create({
        inventoryId,
        playerProfileId: profileIdVO,
        capacity: capacityVO,
      });

      // Persist to database
      const createdInventory = await this.inventoryRepository.create(inventory);

      logger.info('Inventory created successfully', {
        inventoryId: createdInventory.inventoryId.value,
        playerProfileId,
        capacity: createdInventory.capacity.value,
      });

      return { success: true, data: createdInventory };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create inventory';
      logger.error('Failed to create inventory', err as Error, { playerProfileId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Loads an inventory by ID.
   *
   * @param inventoryId - The inventory ID
   * @returns ServiceResult with the inventory
   */
  async loadInventory(inventoryId: string): Promise<ServiceResult<Inventory>> {
    logger.debug('Loading inventory', { inventoryId });

    try {
      const inventoryIdVO = InventoryId.reconstruct(inventoryId);
      const inventory = await this.inventoryRepository.findById(inventoryIdVO);

      if (!inventory) {
        return { success: false, error: 'Inventory not found' };
      }

      return { success: true, data: inventory };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load inventory';
      logger.error('Failed to load inventory', err as Error, { inventoryId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Loads an inventory by player profile ID.
   *
   * @param playerProfileId - The player profile ID
   * @returns ServiceResult with the inventory
   */
  async loadInventoryByPlayerProfile(playerProfileId: string): Promise<ServiceResult<Inventory>> {
    logger.debug('Loading inventory by player profile', { playerProfileId });

    try {
      const inventory = await this.inventoryRepository.findByPlayerProfileId(playerProfileId);

      if (!inventory) {
        return { success: false, error: 'Inventory not found' };
      }

      return { success: true, data: inventory };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load inventory';
      logger.error('Failed to load inventory', err as Error, { playerProfileId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Expands inventory capacity.
   *
   * @param inventoryId - The inventory ID
   * @param newCapacity - The new capacity
   * @returns ServiceResult with the updated inventory
   */
  async expandCapacity(inventoryId: string, newCapacity: number): Promise<ServiceResult<Inventory>> {
    logger.debug('Expanding inventory capacity', { inventoryId, newCapacity });

    try {
      // Validate new capacity
      const capacityValidation = InventoryCapacityValidator.validate(newCapacity);
      if (!capacityValidation.isValid) {
        return { success: false, error: capacityValidation.error ?? 'Invalid capacity' };
      }

      // Load current inventory
      const loadResult = await this.loadInventory(inventoryId);
      if (!loadResult.success) {
        return loadResult;
      }

      // Validate expansion
      const expansionValidation = InventoryCapacityValidator.validateExpansion(
        loadResult.data.capacity.value,
        newCapacity
      );
      if (!expansionValidation.isValid) {
        return { success: false, error: expansionValidation.error ?? 'Invalid expansion' };
      }

      // Update inventory with new capacity
      const updatedInventory = loadResult.data.expandCapacity(
        InventoryCapacity.create(newCapacity)
      );

      const savedInventory = await this.inventoryRepository.update(updatedInventory);

      logger.info('Inventory capacity expanded', {
        inventoryId,
        oldCapacity: loadResult.data.capacity.value,
        newCapacity,
      });

      return { success: true, data: savedInventory };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to expand capacity';
      logger.error('Failed to expand capacity', err as Error, { inventoryId, newCapacity });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Gets inventory summary.
   *
   * @param inventoryId - The inventory ID
   * @returns ServiceResult with the summary DTO
   */
  async getInventorySummary(inventoryId: string): Promise<ServiceResult<InventorySummaryDto>> {
    const result = await this.loadInventory(inventoryId);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, data: InventoryMapper.toSummary(result.data) };
  }

  /**
   * Gets inventory response DTO.
   *
   * @param inventoryId - The inventory ID
   * @returns ServiceResult with the response DTO
   */
  async getInventoryResponse(inventoryId: string): Promise<ServiceResult<InventoryResponseDto>> {
    const result = await this.loadInventory(inventoryId);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, data: InventoryMapper.toResponse(result.data) };
  }

  // =========================================================================
  // ITEM MANAGEMENT
  // =========================================================================

  /**
   * Adds an item to the inventory.
   * Handles both stackable and non-stackable items.
   *
   * @param dto - Item creation data
   * @returns ServiceResult with the added item
   */
  async addItem(dto: CreateInventoryItemDto): Promise<ServiceResult<InventoryItem>> {
    logger.debug('Adding item to inventory', { artifactId: dto.artifactId, ownerId: dto.ownerId });

    try {
      // Validate item data
      const validation = InventoryItemValidator.validate({
        artifactId: dto.artifactId,
        ownerId: dto.ownerId,
        rarity: dto.rarity,
        quantity: dto.quantity,
      });

      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      // Load inventory to check capacity
      const inventoryResult = await this.loadInventoryByPlayerProfile(dto.ownerId);
      if (!inventoryResult.success) {
        return { success: false, error: inventoryResult.error };
      }

      const inventory = inventoryResult.data;

      // For non-stackable items (quantity = 1), check if there's space
      const itemQuantity = dto.quantity ?? 1;
      if (itemQuantity === 1 && inventory.isFull) {
        return { success: false, error: 'Inventory is full' };
      }

      // Check for existing stackable item
      const existingItem = await this.itemRepository.findByArtifactAndOwner(dto.artifactId, dto.ownerId);

      if (existingItem) {
        // Stackable item exists - increase quantity
        const quantityValidation = InventoryQuantityValidator.validateStackAddition(
          existingItem.quantity.value,
          itemQuantity
        );

        if (!quantityValidation.isValid) {
          return { success: false, error: quantityValidation.error ?? 'Cannot stack items' };
        }

        const updatedItem = existingItem.copyWith({
          quantity: InventoryQuantity.create(existingItem.quantity.value + itemQuantity),
        });

        const savedItem = await this.itemRepository.update(updatedItem);

        // Update inventory used slots if this is a new slot (non-stackable case)
        // For stackable items, quantity increases but slot count stays the same

        logger.info('Item quantity increased', {
          itemId: savedItem.itemId.value,
          artifactId: dto.artifactId,
          newQuantity: savedItem.quantity.value,
        });

        return { success: true, data: savedItem };
      }

      // New item - create it
      const itemId = InventoryItemId.generate();
      const inventoryIdVO = InventoryId.reconstruct(inventory.inventoryId.value);

      const item = InventoryItem.create({
        itemId,
        inventoryId: inventoryIdVO,
        artifactId: dto.artifactId,
        ownerId: dto.ownerId,
        rarity: dto.rarity as ItemRarity,
        quantity: InventoryQuantity.create(itemQuantity),
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      });

      const createdItem = await this.itemRepository.create(item);

      // Update inventory used slots
      const updatedInventory = inventory.incrementUsedSlots();
      await this.inventoryRepository.update(updatedInventory);

      logger.info('Item added to inventory', {
        itemId: createdItem.itemId.value,
        artifactId: dto.artifactId,
        quantity: itemQuantity,
      });

      return { success: true, data: createdItem };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item';
      logger.error('Failed to add item', err as Error, { artifactId: dto.artifactId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Removes an item from the inventory.
   *
   * @param itemId - The item ID to remove
   * @param ownerId - The owner player profile ID (for ownership validation)
   * @returns ServiceResult indicating success
   */
  async removeItem(itemId: string, ownerId: string): Promise<ServiceResult<void>> {
    logger.debug('Removing item from inventory', { itemId, ownerId });

    try {
      // Load and validate item
      const itemIdVO = InventoryItemId.reconstruct(itemId);
      const item = await this.itemRepository.findById(itemIdVO);

      if (!item) {
        return { success: false, error: 'Item not found' };
      }

      // Validate ownership
      if (item.ownerId !== ownerId) {
        return { success: false, error: 'Item does not belong to this player' };
      }

      // Load inventory to update used slots
      const inventoryResult = await this.loadInventoryByPlayerProfile(ownerId);
      if (!inventoryResult.success) {
        return { success: false, error: inventoryResult.error };
      }

      // Delete the item
      await this.itemRepository.delete(itemIdVO);

      // Update inventory used slots
      const updatedInventory = inventoryResult.data.decrementUsedSlots();
      await this.inventoryRepository.update(updatedInventory);

      logger.info('Item removed from inventory', { itemId, artifactId: item.artifactId });

      return { success: true, data: undefined };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove item';
      logger.error('Failed to remove item', err as Error, { itemId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Updates an inventory item.
   *
   * @param dto - Update data
   * @returns ServiceResult with the updated item
   */
  async updateItem(dto: UpdateInventoryItemDto): Promise<ServiceResult<InventoryItem>> {
    logger.debug('Updating inventory item', { itemId: dto.itemId });

    try {
      // Load existing item
      const itemIdVO = InventoryItemId.reconstruct(dto.itemId);
      const item = await this.itemRepository.findById(itemIdVO);

      if (!item) {
        return { success: false, error: 'Item not found' };
      }

      // Apply updates
      let updatedItem = item;

      if (dto.quantity !== undefined) {
        // Validate quantity
        const quantityValidation = InventoryQuantityValidator.validate(dto.quantity);
        if (!quantityValidation.isValid) {
          return { success: false, error: quantityValidation.error ?? 'Invalid quantity' };
        }

        // Prevent negative quantity
        if (dto.quantity < 0) {
          return { success: false, error: 'Quantity cannot be negative' };
        }

        updatedItem = updatedItem.copyWith({
          quantity: InventoryQuantity.create(dto.quantity),
        });
      }

      if (dto.status !== undefined) {
        updatedItem = updatedItem.changeStatus(dto.status);
      }

      if (dto.isFavorite !== undefined) {
        if (dto.isFavorite && !item.metadata.isFavorite) {
          updatedItem = updatedItem.toggleFavorite();
        } else if (!dto.isFavorite && item.metadata.isFavorite) {
          updatedItem = updatedItem.toggleFavorite();
        }
      }

      if (dto.expiresAt !== undefined) {
        updatedItem = updatedItem.copyWith({
          expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        });
      }

      // Save updates
      const savedItem = await this.itemRepository.update(updatedItem);

      logger.info('Item updated', { itemId: dto.itemId });

      return { success: true, data: savedItem };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
      logger.error('Failed to update item', err as Error, { itemId: dto.itemId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Increases item quantity (stack merge).
   *
   * @param itemId - The item ID
   * @param amount - Amount to increase by
   * @returns ServiceResult with the updated item
   */
  async increaseQuantity(itemId: string, amount: number): Promise<ServiceResult<InventoryItem>> {
    logger.debug('Increasing item quantity', { itemId, amount });

    try {
      // Validate amount
      if (amount <= 0) {
        return { success: false, error: 'Amount must be positive' };
      }

      // Load item
      const itemIdVO = InventoryItemId.reconstruct(itemId);
      const item = await this.itemRepository.findById(itemIdVO);

      if (!item) {
        return { success: false, error: 'Item not found' };
      }

      // Validate stack addition
      const validation = InventoryQuantityValidator.validateStackAddition(
        item.quantity.value,
        amount
      );

      if (!validation.isValid) {
        return { success: false, error: validation.error ?? 'Cannot increase quantity' };
      }

      // Update quantity
      const updatedItem = item.copyWith({
        quantity: InventoryQuantity.create(item.quantity.value + amount),
      });

      const savedItem = await this.itemRepository.update(updatedItem);

      logger.info('Item quantity increased', {
        itemId,
        newQuantity: savedItem.quantity.value,
      });

      return { success: true, data: savedItem };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to increase quantity';
      logger.error('Failed to increase quantity', err as Error, { itemId, amount });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Decreases item quantity.
   * Prevents quantity from going below 0.
   *
   * @param itemId - The item ID
   * @param amount - Amount to decrease by
   * @returns ServiceResult with the updated item
   */
  async decreaseQuantity(itemId: string, amount: number): Promise<ServiceResult<InventoryItem>> {
    logger.debug('Decreasing item quantity', { itemId, amount });

    try {
      // Validate amount
      if (amount <= 0) {
        return { success: false, error: 'Amount must be positive' };
      }

      // Load item
      const itemIdVO = InventoryItemId.reconstruct(itemId);
      const item = await this.itemRepository.findById(itemIdVO);

      if (!item) {
        return { success: false, error: 'Item not found' };
      }

      // Calculate new quantity
      const newQuantity = item.quantity.value - amount;

      // Prevent negative quantity
      if (newQuantity < 0) {
        return { success: false, error: 'Cannot decrease below 0' };
      }

      // If quantity becomes 0, delete the item
      if (newQuantity === 0) {
        await this.itemRepository.delete(itemIdVO);

        // Update inventory used slots
        const inventoryResult = await this.loadInventoryByPlayerProfile(item.ownerId);
        if (inventoryResult.success) {
          const updatedInventory = inventoryResult.data.decrementUsedSlots();
          await this.inventoryRepository.update(updatedInventory);
        }

        logger.info('Item deleted due to 0 quantity', { itemId });
        return { success: true, data: item };
      }

      // Update quantity
      const updatedItem = item.copyWith({
        quantity: InventoryQuantity.create(newQuantity),
      });

      const savedItem = await this.itemRepository.update(updatedItem);

      logger.info('Item quantity decreased', {
        itemId,
        newQuantity: savedItem.quantity.value,
      });

      return { success: true, data: savedItem };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decrease quantity';
      logger.error('Failed to decrease quantity', err as Error, { itemId, amount });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Moves an item to another player's inventory (trade/gift).
   *
   * @param itemId - The item ID to move
   * @param fromOwnerId - Current owner ID
   * @param toOwnerId - New owner ID
   * @returns ServiceResult with the moved item
   */
  async moveItem(
    itemId: string,
    fromOwnerId: string,
    toOwnerId: string
  ): Promise<ServiceResult<InventoryItem>> {
    logger.debug('Moving item', { itemId, fromOwnerId, toOwnerId });

    try {
      // Load item
      const itemIdVO = InventoryItemId.reconstruct(itemId);
      const item = await this.itemRepository.findById(itemIdVO);

      if (!item) {
        return { success: false, error: 'Item not found' };
      }

      // Validate ownership
      if (item.ownerId !== fromOwnerId) {
        return { success: false, error: 'Item does not belong to this player' };
      }

      // Check if target player has inventory
      const targetInventoryResult = await this.loadInventoryByPlayerProfile(toOwnerId);
      if (!targetInventoryResult.success) {
        return { success: false, error: 'Target player inventory not found' };
      }

      const targetInventory = targetInventoryResult.data;

      // Check if target inventory has space
      if (targetInventory.isFull) {
        return { success: false, error: 'Target inventory is full' };
      }

      // Check if item already exists in target inventory (for stackable items)
      const existingInTarget = await this.itemRepository.findByArtifactAndOwner(
        item.artifactId,
        toOwnerId
      );

      if (existingInTarget) {
        // Stack the items
        const newQuantity = existingInTarget.quantity.value + item.quantity.value;

        // Validate stack
        const validation = InventoryQuantityValidator.validateStackAddition(
          existingInTarget.quantity.value,
          item.quantity.value
        );

        if (!validation.isValid) {
          return { success: false, error: validation.error ?? 'Cannot stack items' };
        }

        // Update existing item
        const updatedExistingItem = existingInTarget.copyWith({
          quantity: InventoryQuantity.create(newQuantity),
        });

        await this.itemRepository.update(updatedExistingItem);

        // Delete the original item
        await this.itemRepository.delete(itemIdVO);

        logger.info('Items stacked during move', {
          originalItemId: itemId,
          targetItemId: existingInTarget.itemId.value,
          totalQuantity: newQuantity,
        });

        return { success: true, data: updatedExistingItem };
      }

      // Update item owner
      const targetInventoryId = InventoryId.reconstruct(targetInventory.inventoryId.value);

      const movedItem = item.copyWith({
        inventoryId: targetInventoryId,
        ownerId: toOwnerId,
      });

      const savedItem = await this.itemRepository.update(movedItem);

      // Update source inventory used slots
      const sourceInventoryResult = await this.loadInventoryByPlayerProfile(fromOwnerId);
      if (sourceInventoryResult.success) {
        const updatedSourceInventory = sourceInventoryResult.data.decrementUsedSlots();
        await this.inventoryRepository.update(updatedSourceInventory);
      }

      // Update target inventory used slots
      const updatedTargetInventory = targetInventory.incrementUsedSlots();
      await this.inventoryRepository.update(updatedTargetInventory);

      logger.info('Item moved to new owner', {
        itemId,
        fromOwnerId,
        toOwnerId,
      });

      return { success: true, data: savedItem };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to move item';
      logger.error('Failed to move item', err as Error, { itemId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Deletes an item permanently.
   *
   * @param itemId - The item ID
   * @param ownerId - The owner player profile ID (for ownership validation)
   * @returns ServiceResult indicating success
   */
  async deleteItem(itemId: string, ownerId: string): Promise<ServiceResult<void>> {
    logger.debug('Deleting item', { itemId, ownerId });

    try {
      // Load item
      const itemIdVO = InventoryItemId.reconstruct(itemId);
      const item = await this.itemRepository.findById(itemIdVO);

      if (!item) {
        return { success: false, error: 'Item not found' };
      }

      // Validate ownership
      if (item.ownerId !== ownerId) {
        return { success: false, error: 'Item does not belong to this player' };
      }

      // Delete the item
      await this.itemRepository.delete(itemIdVO);

      // Update inventory used slots
      const inventoryResult = await this.loadInventoryByPlayerProfile(ownerId);
      if (inventoryResult.success) {
        const updatedInventory = inventoryResult.data.decrementUsedSlots();
        await this.inventoryRepository.update(updatedInventory);
      }

      logger.info('Item deleted', { itemId, artifactId: item.artifactId });

      return { success: true, data: undefined };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete item';
      logger.error('Failed to delete item', err as Error, { itemId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Restores a soft-deleted item (marks as active again).
   *
   * @param itemId - The item ID
   * @param ownerId - The owner player profile ID
   * @returns ServiceResult with the restored item
   */
  async restoreItem(itemId: string, ownerId: string): Promise<ServiceResult<InventoryItem>> {
    logger.debug('Restoring item', { itemId, ownerId });

    try {
      // Load item
      const itemIdVO = InventoryItemId.reconstruct(itemId);
      const item = await this.itemRepository.findById(itemIdVO);

      if (!item) {
        return { success: false, error: 'Item not found' };
      }

      // Validate ownership
      if (item.ownerId !== ownerId) {
        return { success: false, error: 'Item does not belong to this player' };
      }

      // Check if item is in a restorable state
      if (item.status !== InventoryItemStatus.LOCKED && item.status !== InventoryItemStatus.EXPIRED) {
        return { success: false, error: 'Item cannot be restored from current status' };
      }

      // Check inventory capacity
      const inventoryResult = await this.loadInventoryByPlayerProfile(ownerId);
      if (!inventoryResult.success) {
        return { success: false, error: inventoryResult.error };
      }

      if (inventoryResult.data.isFull) {
        return { success: false, error: 'Inventory is full' };
      }

      // Restore item (set status to active)
      const restoredItem = item.changeStatus(InventoryItemStatus.ACTIVE);
      const savedItem = await this.itemRepository.update(restoredItem);

      logger.info('Item restored', { itemId });

      return { success: true, data: savedItem };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to restore item';
      logger.error('Failed to restore item', err as Error, { itemId });
      return { success: false, error: errorMessage };
    }
  }

  // =========================================================================
  // ITEM QUERIES
  // =========================================================================

  /**
   * Finds an item by ID.
   *
   * @param itemId - The item ID
   * @returns ServiceResult with the item
   */
  async findItem(itemId: string): Promise<ServiceResult<InventoryItem>> {
    logger.debug('Finding item', { itemId });

    try {
      const itemIdVO = InventoryItemId.reconstruct(itemId);
      const item = await this.itemRepository.findById(itemIdVO);

      if (!item) {
        return { success: false, error: 'Item not found' };
      }

      return { success: true, data: item };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to find item';
      logger.error('Failed to find item', err as Error, { itemId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Finds an item by artifact ID and owner.
   *
   * @param artifactId - The artifact ID
   * @param ownerId - The owner player profile ID
   * @returns ServiceResult with the item or null
   */
  async findItemByArtifactId(
    artifactId: string,
    ownerId: string
  ): Promise<ServiceResult<InventoryItem | null>> {
    logger.debug('Finding item by artifact ID', { artifactId, ownerId });

    try {
      const item = await this.itemRepository.findByArtifactAndOwner(artifactId, ownerId);
      return { success: true, data: item };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to find item';
      logger.error('Failed to find item by artifact ID', err as Error, { artifactId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Lists items in an inventory with pagination and sorting.
   *
   * @param inventoryId - The inventory ID
   * @param params - Pagination parameters
   * @param sortOption - Sort option
   * @returns ServiceResult with paginated items
   */
  async listItems(
    inventoryId: string,
    params: PaginationParams,
    sortOption?: InventorySortOption
  ): Promise<ServiceResult<PaginatedResult<InventoryItemResponseDto>>> {
    logger.debug('Listing inventory items', { inventoryId, params, sortOption });

    try {
      // Convert sort option to params
      const queryParams: PaginationParams = {
        ...params,
        sortBy: this.sortOptionToColumn(sortOption),
        sortOrder: this.sortOptionToOrder(sortOption),
      };

      const inventoryIdVO = InventoryId.reconstruct(inventoryId);
      const result = await this.itemRepository.findByInventoryId(inventoryIdVO, queryParams);

      const responseItems = result.items.map((item) => InventoryItemMapper.toResponse(item));

      return {
        success: true,
        data: {
          ...result,
          items: responseItems,
        },
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to list items';
      logger.error('Failed to list items', err as Error, { inventoryId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Lists items owned by a player with pagination and sorting.
   *
   * @param ownerId - The owner player profile ID
   * @param params - Pagination parameters
   * @param filters - Filter parameters
   * @param sortOption - Sort option
   * @returns ServiceResult with paginated items
   */
  async listItemsByOwner(
    ownerId: string,
    params: PaginationParams,
    filters?: InventoryFilters,
    sortOption?: InventorySortOption
  ): Promise<ServiceResult<PaginatedResult<InventoryItemResponseDto>>> {
    logger.debug('Listing items by owner', { ownerId, params, filters, sortOption });

    try {
      // Convert sort option to params
      const queryParams: PaginationParams = {
        ...params,
        sortBy: this.sortOptionToColumn(sortOption),
        sortOrder: this.sortOptionToOrder(sortOption),
      };

      const result = await this.itemRepository.findByOwnerId(ownerId, queryParams, filters);

      const responseItems = result.items.map((item) => InventoryItemMapper.toResponse(item));

      return {
        success: true,
        data: {
          ...result,
          items: responseItems,
        },
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to list items';
      logger.error('Failed to list items by owner', err as Error, { ownerId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Gets item response DTO.
   *
   * @param itemId - The item ID
   * @returns ServiceResult with the response DTO
   */
  async getItemResponse(itemId: string): Promise<ServiceResult<InventoryItemResponseDto>> {
    const result = await this.findItem(itemId);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, data: InventoryItemMapper.toResponse(result.data) };
  }

  /**
   * Gets item summary DTO.
   *
   * @param itemId - The item ID
   * @returns ServiceResult with the summary DTO
   */
  async getItemSummary(itemId: string): Promise<ServiceResult<InventoryItemSummaryDto>> {
    const result = await this.findItem(itemId);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, data: InventoryItemMapper.toSummary(result.data) };
  }

  /**
   * Counts items in an inventory.
   *
   * @param inventoryId - The inventory ID
   * @returns ServiceResult with the count
   */
  async countItems(inventoryId: string): Promise<ServiceResult<number>> {
    logger.debug('Counting inventory items', { inventoryId });

    try {
      const inventoryIdVO = InventoryId.reconstruct(inventoryId);
      const count = await this.itemRepository.count({ itemId: inventoryId });

      return { success: true, data: count };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to count items';
      logger.error('Failed to count items', err as Error, { inventoryId });
      return { success: false, error: errorMessage };
    }
  }

  // =========================================================================
  // HELPER METHODS
  // =========================================================================

  /**
   * Converts sort option to column name.
   */
  private sortOptionToColumn(sortOption?: InventorySortOption): string {
    switch (sortOption) {
      case InventorySortOption.NEWEST_FIRST:
        return 'obtained_at';
      case InventorySortOption.OLDEST_FIRST:
        return 'obtained_at';
      case InventorySortOption.HIGHEST_RARITY:
        return 'rarity';
      case InventorySortOption.ALPHABETICAL:
        return 'artifact_name';
      case InventorySortOption.MOST_USED:
        return 'usage_count';
      case InventorySortOption.BY_TYPE:
        return 'artifact_type';
      default:
        return 'obtained_at';
    }
  }

  /**
   * Converts sort option to sort order.
   */
  private sortOptionToOrder(sortOption?: InventorySortOption): SortOrder {
    switch (sortOption) {
      case InventorySortOption.NEWEST_FIRST:
      case InventorySortOption.HIGHEST_RARITY:
        return SortOrder.DESC;
      case InventorySortOption.OLDEST_FIRST:
      case InventorySortOption.ALPHABETICAL:
        return SortOrder.ASC;
      default:
        return SortOrder.DESC;
    }
  }
}

/**
 * Create a new InventoryService instance.
 */
export function createInventoryService(): InventoryService {
  return new InventoryService();
}