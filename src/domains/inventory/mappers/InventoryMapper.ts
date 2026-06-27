/**
 * Inventory Mapper
 *
 * Maps between Inventory entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { Inventory } from '../entities/Inventory';
import type { InventoryRecord } from '../entities/Inventory';
import type { CreateInventoryDto } from '../dto/CreateInventory.dto';
import type { InventoryResponseDto, InventorySummaryDto } from '../dto/InventoryResponse.dto';

/**
 * Mapper for converting between Inventory entity and DTOs.
 */
export class InventoryMapper {
  /**
   * Converts an Inventory entity to InventoryResponseDto.
   */
  public static toResponse(inventory: Inventory): InventoryResponseDto {
    return {
      inventoryId: inventory.inventoryId.value,
      playerProfileId: inventory.playerProfileId.value,
      capacity: inventory.capacity.value,
      usedSlots: inventory.usedSlots,
      availableSlots: inventory.availableSlots,
      isFull: inventory.isFull,
      utilizationPercentage: inventory.utilizationPercentage,
      statistics: inventory.statistics,
      createdAt: inventory.createdAt.toISOString(),
      updatedAt: inventory.updatedAt.toISOString(),
    };
  }

  /**
   * Converts an Inventory entity to InventorySummaryDto.
   */
  public static toSummary(inventory: Inventory): InventorySummaryDto {
    return {
      inventoryId: inventory.inventoryId.value,
      usedSlots: inventory.usedSlots,
      capacity: inventory.capacity.value,
      utilizationPercentage: inventory.utilizationPercentage,
      uniqueArtifacts: inventory.statistics.uniqueArtifacts,
      totalItems: inventory.statistics.totalItems,
    };
  }

  /**
   * Converts an array of Inventory entities to InventoryResponseDto array.
   */
  public static toResponseList(inventories: Inventory[]): InventoryResponseDto[] {
    return inventories.map((inventory) => this.toResponse(inventory));
  }

  /**
   * Converts an array of Inventory entities to InventorySummaryDto array.
   */
  public static toSummaryList(inventories: Inventory[]): InventorySummaryDto[] {
    return inventories.map((inventory) => this.toSummary(inventory));
  }

  /**
   * Converts a CreateInventoryDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateInventoryDto): Omit<CreateInventoryDto, never> {
    return {
      playerProfileId: dto.playerProfileId,
      capacity: dto.capacity,
    };
  }

  /**
   * Converts a database record to CreateInventoryDto format.
   */
  public static fromRecordToDto(record: InventoryRecord): CreateInventoryDto {
    return {
      playerProfileId: record.player_profile_id,
      capacity: record.capacity,
    };
  }

  /**
   * Converts an Inventory entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(inventory: Inventory): Omit<InventoryRecord, never> {
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
}