/**
 * Inventory Entity
 *
 * Domain entity representing a player's inventory.
 * The inventory is the central storage system for every collectible object.
 *
 * Inventory Entity Responsibilities:
 * - Represent player inventory ownership
 * - Track capacity and slot usage
 * - Store collection of inventory items
 *
 * Inventory Entity is NOT:
 * - Museum (which stores exhibition)
 * - Artifacts (which define item data)
 */
import type { IInventory } from '../interfaces/IInventory';
import { InventoryId } from '../value-objects/InventoryId';
import { PlayerProfileId } from '../../player-profile/value-objects/PlayerProfileId';
import { InventoryCapacity, DEFAULT_INVENTORY_CAPACITY } from '../value-objects/InventoryCapacity';
import type { InventoryStatistics } from '../types/InventoryStatistics';
import { INITIAL_INVENTORY_STATISTICS } from '../types/InventoryStatistics';

/**
 * Inventory entity class.
 * Immutable domain entity representing a player's inventory.
 */
export class Inventory implements IInventory {
  /** Unique internal inventory identifier */
  public readonly inventoryId: InventoryId;

  /** Associated player profile ID */
  public readonly playerProfileId: PlayerProfileId;

  /** Total inventory capacity (max slots) */
  public readonly capacity: InventoryCapacity;

  /** Number of slots currently used */
  public readonly usedSlots: number;

  /** Inventory statistics */
  public readonly statistics: InventoryStatistics;

  /** Timestamp when inventory was created */
  public readonly createdAt: Date;

  /** Timestamp when inventory was last updated */
  public readonly updatedAt: Date;

  /**
   * Creates a new Inventory instance.
   * @param props Inventory properties
   */
  constructor(props: InventoryProps) {
    this.inventoryId = props.inventoryId;
    this.playerProfileId = props.playerProfileId;
    this.capacity = props.capacity;
    this.usedSlots = props.usedSlots;
    this.statistics = props.statistics ?? { ...INITIAL_INVENTORY_STATISTICS };
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new Inventory for a player profile.
   * Factory method for new inventory creation.
   */
  public static create(params: {
    inventoryId: InventoryId;
    playerProfileId: PlayerProfileId;
    capacity?: InventoryCapacity;
  }): Inventory {
    const now = new Date();
    const capacity = params.capacity ?? InventoryCapacity.create(DEFAULT_INVENTORY_CAPACITY);

    return new Inventory({
      inventoryId: params.inventoryId,
      playerProfileId: params.playerProfileId,
      capacity,
      usedSlots: 0,
      statistics: { ...INITIAL_INVENTORY_STATISTICS },
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs an Inventory from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: InventoryRecord): Inventory {
    return new Inventory({
      inventoryId: InventoryId.reconstruct(record.inventory_id),
      playerProfileId: PlayerProfileId.reconstruct(record.player_profile_id),
      capacity: InventoryCapacity.reconstruct(record.capacity),
      usedSlots: record.used_slots,
      statistics: record.statistics,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
    });
  }

  /**
   * Gets the available slots in the inventory.
   */
  public get availableSlots(): number {
    return this.capacity.value - this.usedSlots;
  }

  /**
   * Checks if the inventory has available slots.
   */
  public get hasAvailableSlots(): boolean {
    return this.availableSlots > 0;
  }

  /**
   * Checks if the inventory is at full capacity.
   */
  public get isFull(): boolean {
    return this.usedSlots >= this.capacity.value;
  }

  /**
   * Gets the utilization percentage (0-100).
   */
  public get utilizationPercentage(): number {
    if (this.capacity.value === 0) return 0;
    return Math.round((this.usedSlots / this.capacity.value) * 100);
  }

  /**
   * Serializes the Inventory to a plain object.
   */
  public toJSON(): InventoryJSON {
    return {
      inventoryId: this.inventoryId.value,
      playerProfileId: this.playerProfileId.value,
      capacity: this.capacity.value,
      usedSlots: this.usedSlots,
      availableSlots: this.availableSlots,
      isFull: this.isFull,
      utilizationPercentage: this.utilizationPercentage,
      statistics: this.statistics,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Creates a copy with updated fields.
   * Returns a new Inventory instance.
   */
  public copyWith(params: Partial<InventoryProps>): Inventory {
    return new Inventory({
      inventoryId: params.inventoryId ?? this.inventoryId,
      playerProfileId: params.playerProfileId ?? this.playerProfileId,
      capacity: params.capacity ?? this.capacity,
      usedSlots: params.usedSlots ?? this.usedSlots,
      statistics: params.statistics ?? this.statistics,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Creates a copy with updated capacity.
   * Returns a new Inventory instance with expanded capacity.
   */
  public expandCapacity(newCapacity: InventoryCapacity): Inventory {
    return this.copyWith({
      capacity: newCapacity,
    });
  }

  /**
   * Creates a copy with incremented used slots.
   * Returns a new Inventory instance.
   */
  public incrementUsedSlots(): Inventory {
    return this.copyWith({
      usedSlots: this.usedSlots + 1,
    });
  }

  /**
   * Creates a copy with decremented used slots.
   * Returns a new Inventory instance.
   */
  public decrementUsedSlots(): Inventory {
    return this.copyWith({
      usedSlots: Math.max(0, this.usedSlots - 1),
    });
  }
}

/**
 * Inventory properties interface for constructor.
 */
export interface InventoryProps {
  inventoryId: InventoryId;
  playerProfileId: PlayerProfileId;
  capacity: InventoryCapacity;
  usedSlots: number;
  statistics?: InventoryStatistics;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of Inventory.
 */
export interface InventoryRecord {
  inventory_id: string;
  player_profile_id: string;
  capacity: number;
  used_slots: number;
  statistics: InventoryStatistics;
  created_at: string;
  updated_at: string;
}

/**
 * JSON serialization representation of Inventory.
 */
export interface InventoryJSON {
  inventoryId: string;
  playerProfileId: string;
  capacity: number;
  usedSlots: number;
  availableSlots: number;
  isFull: boolean;
  utilizationPercentage: number;
  statistics: InventoryStatistics;
  createdAt: string;
  updatedAt: string;
}