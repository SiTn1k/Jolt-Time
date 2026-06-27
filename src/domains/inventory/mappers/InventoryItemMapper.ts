/**
 * Inventory Item Mapper
 *
 * Maps between InventoryItem entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { InventoryItem } from '../entities/InventoryItem';
import type { InventoryItemRecord } from '../entities/InventoryItem';
import type { CreateInventoryItemDto } from '../dto/CreateInventoryItem.dto';
import type { UpdateInventoryItemDto } from '../dto/UpdateInventoryItem.dto';
import type { InventoryItemResponseDto, InventoryItemSummaryDto } from '../dto/InventoryResponse.dto';

/**
 * Mapper for converting between InventoryItem entity and DTOs.
 */
export class InventoryItemMapper {
  /**
   * Converts an InventoryItem entity to InventoryItemResponseDto.
   */
  public static toResponse(item: InventoryItem): InventoryItemResponseDto {
    return {
      itemId: item.itemId.value,
      inventoryId: item.inventoryId.value,
      artifactId: item.artifactId,
      ownerId: item.ownerId,
      quantity: item.quantity.value,
      rarity: item.rarity,
      status: item.status,
      metadata: item.metadata,
      obtainedAt: item.obtainedAt.toISOString(),
      expiresAt: item.expiresAt?.toISOString() ?? null,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  /**
   * Converts an InventoryItem entity to InventoryItemSummaryDto.
   */
  public static toSummary(item: InventoryItem): InventoryItemSummaryDto {
    return {
      itemId: item.itemId.value,
      artifactId: item.artifactId,
      rarity: item.rarity,
      status: item.status,
      quantity: item.quantity.value,
      isFavorite: item.metadata.isFavorite,
      obtainedAt: item.obtainedAt.toISOString(),
    };
  }

  /**
   * Converts an array of InventoryItem entities to InventoryItemResponseDto array.
   */
  public static toResponseList(items: InventoryItem[]): InventoryItemResponseDto[] {
    return items.map((item) => this.toResponse(item));
  }

  /**
   * Converts an array of InventoryItem entities to InventoryItemSummaryDto array.
   */
  public static toSummaryList(items: InventoryItem[]): InventoryItemSummaryDto[] {
    return items.map((item) => this.toSummary(item));
  }

  /**
   * Converts a CreateInventoryItemDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateInventoryItemDto): Omit<CreateInventoryItemDto, never> {
    return {
      inventoryId: dto.inventoryId,
      artifactId: dto.artifactId,
      ownerId: dto.ownerId,
      rarity: dto.rarity,
      quantity: dto.quantity,
      expiresAt: dto.expiresAt ?? undefined,
      source: dto.source,
    };
  }

  /**
   * Converts an UpdateInventoryItemDto to a plain object for entity updates.
   */
  public static fromUpdateDto(dto: UpdateInventoryItemDto): Partial<InventoryItem> {
    return {
      status: dto.status as unknown as InventoryItem['status'],
      quantity: dto.quantity as unknown as InventoryItem['quantity'],
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
    } as Partial<InventoryItem>;
  }

  /**
   * Converts a database record to CreateInventoryItemDto format.
   */
  public static fromRecordToDto(record: InventoryItemRecord): CreateInventoryItemDto {
    return {
      inventoryId: record.inventory_id,
      artifactId: record.artifact_id,
      ownerId: record.owner_id,
      rarity: record.rarity,
      quantity: record.quantity,
      expiresAt: record.expires_at ?? undefined,
      source: record.metadata.source,
    };
  }

  /**
   * Converts an InventoryItem entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(item: InventoryItem): Omit<InventoryItemRecord, never> {
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
}