/**
 * Inventory Interface
 *
 * Interface defining the contract for Inventory entity.
 * All Inventory implementations must adhere to this interface.
 */

import type { InventoryId } from '../value-objects/InventoryId';
import type { PlayerProfileId } from '../../player-profile/value-objects/PlayerProfileId';
import type { InventoryCapacity } from '../value-objects/InventoryCapacity';
import type { InventoryStatistics } from '../types/InventoryStatistics';

/**
 * Inventory entity interface.
 * Represents a player's inventory in the Jolt Time system.
 */
export interface IInventory {
  /** Unique internal inventory identifier */
  readonly inventoryId: InventoryId;

  /** Associated player profile ID */
  readonly playerProfileId: PlayerProfileId;

  /** Total inventory capacity (max slots) */
  readonly capacity: InventoryCapacity;

  /** Number of slots currently used */
  readonly usedSlots: number;

  /** Inventory statistics */
  readonly statistics: InventoryStatistics;

  /** Timestamp when inventory was created */
  readonly createdAt: Date;

  /** Timestamp when inventory was last updated */
  readonly updatedAt: Date;

  /** Number of available slots */
  readonly availableSlots: number;

  /** Whether inventory has available slots */
  readonly hasAvailableSlots: boolean;

  /** Whether inventory is at full capacity */
  readonly isFull: boolean;

  /** Utilization percentage (0-100) */
  readonly utilizationPercentage: number;
}