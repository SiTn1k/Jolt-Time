/**
 * InventoryItem Entity
 *
 * Domain entity representing an item in the player's inventory.
 * Stores ownership information for collectible objects.
 *
 * InventoryItem Entity Responsibilities:
 * - Represent ownership of an artifact or item
 * - Track quantity and status
 * - Store acquisition and expiration data
 *
 * InventoryItem Entity is NOT:
 * - The artifact definition (that lives in Artifacts domain)
 * - Museum exhibition state (that lives in Museum domain)
 */
import type { IInventoryItem } from '../interfaces/IInventoryItem';
import { InventoryItemId } from '../value-objects/InventoryItemId';
import { InventoryId } from '../value-objects/InventoryId';
import { InventoryQuantity, DEFAULT_ITEM_QUANTITY } from '../value-objects/InventoryQuantity';
import { InventoryItemStatus } from '../types/InventoryItemStatus';
import type { InventoryMetadata } from '../types/InventoryMetadata';
import { INITIAL_INVENTORY_METADATA } from '../types/InventoryMetadata';

/**
 * Rarity tier for inventory items.
 */
export enum ItemRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  MYTHIC = 'mythic',
}

/**
 * InventoryItem entity class.
 * Immutable domain entity representing an item in the inventory.
 */
export class InventoryItem implements IInventoryItem {
  /** Unique internal inventory item identifier */
  public readonly itemId: InventoryItemId;

  /** Associated inventory ID */
  public readonly inventoryId: InventoryId;

  /** Associated artifact ID */
  public readonly artifactId: string;

  /** Associated player profile ID (owner) */
  public readonly ownerId: string;

  /** Item quantity (for stackable items) */
  public readonly quantity: InventoryQuantity;

  /** Item rarity tier */
  public readonly rarity: ItemRarity;

  /** Current item status */
  public readonly status: InventoryItemStatus;

  /** Item metadata */
  public readonly metadata: InventoryMetadata;

  /** Timestamp when item was obtained */
  public readonly obtainedAt: Date;

  /** Timestamp when item expires (null if never) */
  public readonly expiresAt: Date | null;

  /** Timestamp when item was created */
  public readonly createdAt: Date;

  /** Timestamp when item was last updated */
  public readonly updatedAt: Date;

  /**
   * Creates a new InventoryItem instance.
   * @param props InventoryItem properties
   */
  constructor(props: InventoryItemProps) {
    this.itemId = props.itemId;
    this.inventoryId = props.inventoryId;
    this.artifactId = props.artifactId;
    this.ownerId = props.ownerId;
    this.quantity = props.quantity;
    this.rarity = props.rarity;
    this.status = props.status;
    this.metadata = props.metadata ?? { ...INITIAL_INVENTORY_METADATA };
    this.obtainedAt = props.obtainedAt;
    this.expiresAt = props.expiresAt ?? null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new InventoryItem for an artifact.
   * Factory method for new item creation.
   */
  public static create(params: {
    itemId: InventoryItemId;
    inventoryId: InventoryId;
    artifactId: string;
    ownerId: string;
    rarity: ItemRarity;
    quantity?: InventoryQuantity;
    expiresAt?: Date;
  }): InventoryItem {
    const now = new Date();

    return new InventoryItem({
      itemId: params.itemId,
      inventoryId: params.inventoryId,
      artifactId: params.artifactId,
      ownerId: params.ownerId,
      quantity: params.quantity ?? InventoryQuantity.create(DEFAULT_ITEM_QUANTITY),
      rarity: params.rarity,
      status: InventoryItemStatus.ACTIVE,
      metadata: {
        ...INITIAL_INVENTORY_METADATA,
        acquiredAt: now.toISOString(),
      },
      obtainedAt: now,
      expiresAt: params.expiresAt ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs an InventoryItem from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: InventoryItemRecord): InventoryItem {
    return new InventoryItem({
      itemId: InventoryItemId.reconstruct(record.item_id),
      inventoryId: InventoryId.reconstruct(record.inventory_id),
      artifactId: record.artifact_id,
      ownerId: record.owner_id,
      quantity: InventoryQuantity.reconstruct(record.quantity),
      rarity: record.rarity as ItemRarity,
      status: record.status as InventoryItemStatus,
      metadata: record.metadata,
      obtainedAt: new Date(record.obtained_at),
      expiresAt: record.expires_at ? new Date(record.expires_at) : null,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
    });
  }

  /**
   * Checks if the item is expired.
   */
  public get isExpired(): boolean {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }

  /**
   * Checks if the item is available for use.
   */
  public get isAvailable(): boolean {
    return (
      this.status === 'active' &&
      !this.isExpired
    );
  }

  /**
   * Checks if the item is stackable (quantity > 1).
   */
  public get isStackable(): boolean {
    return this.quantity.value > 1;
  }

  /**
   * Serializes the InventoryItem to a plain object.
   */
  public toJSON(): InventoryItemJSON {
    return {
      itemId: this.itemId.value,
      inventoryId: this.inventoryId.value,
      artifactId: this.artifactId,
      ownerId: this.ownerId,
      quantity: this.quantity.value,
      rarity: this.rarity,
      status: this.status,
      metadata: this.metadata,
      obtainedAt: this.obtainedAt.toISOString(),
      expiresAt: this.expiresAt?.toISOString() ?? null,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Creates a copy with updated fields.
   * Returns a new InventoryItem instance.
   */
  public copyWith(params: Partial<InventoryItemProps>): InventoryItem {
    return new InventoryItem({
      itemId: params.itemId ?? this.itemId,
      inventoryId: params.inventoryId ?? this.inventoryId,
      artifactId: params.artifactId ?? this.artifactId,
      ownerId: params.ownerId ?? this.ownerId,
      quantity: params.quantity ?? this.quantity,
      rarity: params.rarity ?? this.rarity,
      status: params.status ?? this.status,
      metadata: params.metadata ?? this.metadata,
      obtainedAt: params.obtainedAt ?? this.obtainedAt,
      expiresAt: params.expiresAt !== undefined ? params.expiresAt : this.expiresAt,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Creates a copy with updated status.
   * Returns a new InventoryItem instance.
   */
  public changeStatus(newStatus: InventoryItemStatus): InventoryItem {
    return this.copyWith({
      status: newStatus,
    });
  }

  /**
   * Creates a copy marked as favorite.
   * Returns a new InventoryItem instance.
   */
  public toggleFavorite(): InventoryItem {
    return this.copyWith({
      metadata: {
        ...this.metadata,
        isFavorite: !this.metadata.isFavorite,
      },
    });
  }

  /**
   * Creates a copy with incremented usage count.
   * Returns a new InventoryItem instance.
   */
  public recordUsage(): InventoryItem {
    return this.copyWith({
      metadata: {
        ...this.metadata,
        usageCount: this.metadata.usageCount + 1,
        lastUsedAt: new Date().toISOString(),
      },
    });
  }
}

/**
 * InventoryItem properties interface for constructor.
 */
export interface InventoryItemProps {
  itemId: InventoryItemId;
  inventoryId: InventoryId;
  artifactId: string;
  ownerId: string;
  quantity: InventoryQuantity;
  rarity: ItemRarity;
  status: InventoryItemStatus;
  metadata?: InventoryMetadata;
  obtainedAt: Date;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of InventoryItem.
 */
export interface InventoryItemRecord {
  item_id: string;
  inventory_id: string;
  artifact_id: string;
  owner_id: string;
  quantity: number;
  rarity: string;
  status: string;
  metadata: InventoryMetadata;
  obtained_at: string;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * JSON serialization representation of InventoryItem.
 */
export interface InventoryItemJSON {
  itemId: string;
  inventoryId: string;
  artifactId: string;
  ownerId: string;
  quantity: number;
  rarity: ItemRarity;
  status: InventoryItemStatus;
  metadata: InventoryMetadata;
  obtainedAt: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}