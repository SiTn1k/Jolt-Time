/**
 * Inventory Entity Unit Tests
 *
 * Tests for Inventory entity and related functionality.
 */

import { describe, it, expect } from 'vitest';
import { Inventory } from '../entities/Inventory';
import { InventoryId } from '../value-objects/InventoryId';
import { InventoryCapacity, DEFAULT_INVENTORY_CAPACITY } from '../value-objects/InventoryCapacity';
import { PlayerProfileId } from '../../player-profile/value-objects/PlayerProfileId';
import { INITIAL_INVENTORY_STATISTICS } from '../types/InventoryStatistics';

describe('Inventory Entity', () => {
  const validInventoryId = InventoryId.reconstruct('123e4567-e89b-12d3-a456-426614174000');
  const validProfileId = PlayerProfileId.reconstruct('223e4567-e89b-12d3-a456-426614174001');
  const validCapacity = InventoryCapacity.create(100);

  describe('create', () => {
    it('should create a new inventory with default values', () => {
      const inventory = Inventory.create({
        inventoryId: validInventoryId,
        playerProfileId: validProfileId,
      });

      expect(inventory.inventoryId).toEqual(validInventoryId);
      expect(inventory.playerProfileId).toEqual(validProfileId);
      expect(inventory.capacity.value).toBe(DEFAULT_INVENTORY_CAPACITY);
      expect(inventory.usedSlots).toBe(0);
      expect(inventory.statistics).toEqual(INITIAL_INVENTORY_STATISTICS);
    });

    it('should create inventory with custom capacity', () => {
      const customCapacity = InventoryCapacity.create(200);
      const inventory = Inventory.create({
        inventoryId: validInventoryId,
        playerProfileId: validProfileId,
        capacity: customCapacity,
      });

      expect(inventory.capacity.value).toBe(200);
      expect(inventory.usedSlots).toBe(0);
    });

    it('should set createdAt and updatedAt timestamps', () => {
      const beforeCreate = new Date();
      const inventory = Inventory.create({
        inventoryId: validInventoryId,
        playerProfileId: validProfileId,
      });
      const afterCreate = new Date();

      expect(inventory.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(inventory.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
      expect(inventory.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(inventory.updatedAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    });
  });

  describe('fromDatabase', () => {
    it('should reconstruct inventory from database record', () => {
      const record = {
        inventory_id: '123e4567-e89b-12d3-a456-426614174000',
        player_profile_id: '223e4567-e89b-12d3-a456-426614174001',
        capacity: 150,
        used_slots: 25,
        statistics: { ...INITIAL_INVENTORY_STATISTICS, totalItems: 25 },
        created_at: '2024-01-15T10:00:00.000Z',
        updated_at: '2024-02-20T15:30:00.000Z',
      };

      const inventory = Inventory.fromDatabase(record);

      expect(inventory.inventoryId.value).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(inventory.playerProfileId.value).toBe('223e4567-e89b-12d3-a456-426614174001');
      expect(inventory.capacity.value).toBe(150);
      expect(inventory.usedSlots).toBe(25);
      expect(inventory.statistics.totalItems).toBe(25);
    });
  });

  describe('availableSlots', () => {
    it('should return correct available slots', () => {
      const inventory = Inventory.create({
        inventoryId: validInventoryId,
        playerProfileId: validProfileId,
        capacity: InventoryCapacity.create(100),
      });

      expect(inventory.availableSlots).toBe(100);
    });

    it('should return correct available slots after adding items', () => {
      const inventory = Inventory.create({
        inventoryId: validInventoryId,
        playerProfileId: validProfileId,
        capacity: InventoryCapacity.create(100),
      }).copyWith({ usedSlots: 30 });

      expect(inventory.availableSlots).toBe(70);
    });
  });

  describe('hasAvailableSlots', () => {
    it('should return true when inventory has space', () => {
      const inventory = Inventory.create({
        inventoryId: validInventoryId,
        playerProfileId: validProfileId,
      });

      expect(inventory.hasAvailableSlots).toBe(true);
    });

    it('should return false when inventory is full', () => {
      const inventory = Inventory.create({
        inventoryId: validInventoryId,
        playerProfileId: validProfileId,
        capacity: InventoryCapacity.create(100),
      }).copyWith({ usedSlots: 100 });

      expect(inventory.hasAvailableSlots).toBe(false);
    });
  });

  describe('isFull', () => {
    it('should return false when inventory is not full', () => {
      const inventory = Inventory.create({
        inventoryId: validInventoryId,
        playerProfileId: validProfileId,
        capacity: InventoryCapacity.create(100),
      }).copyWith({ usedSlots: 50 });

      expect(inventory.isFull).toBe(false);
    });

    it('should return true when inventory is at capacity', () => {
      const inventory = Inventory.create({
        inventoryId: validInventoryId,
        playerProfileId: validProfileId,
        capacity: InventoryCapacity.create(100),
      }).copyWith({ usedSlots: 100 });

      expect(inventory.isFull).toBe(true);
    });
  });

  describe('utilizationPercentage', () => {
    it('should return 0 for empty inventory', () => {
      const inventory = Inventory.create({
        inventoryId: validInventoryId,
        playerProfileId: validProfileId,
        capacity: InventoryCapacity.create(100),
      });

      expect(inventory.utilizationPercentage).toBe(0);
    });

    it('should return 50 for half-full inventory', () => {
      const inventory = Inventory.create({
        inventoryId: validInventoryId,
        playerProfileId: validProfileId,
        capacity: InventoryCapacity.create(100),
      }).copyWith({ usedSlots: 50 });

      expect(inventory.utilizationPercentage).toBe(50);
    });

    it('should return 100 for full inventory', () => {
      const inventory = Inventory.create({
        inventoryId: validInventoryId,
        playerProfileId: validProfileId,
        capacity: InventoryCapacity.create(100),
      }).copyWith({ usedSlots: 100 });

      expect(inventory.utilizationPercentage).toBe(100);
    });

    it('should return 0 when capacity is minimum (usedSlots is 0)', () => {
      // When capacity is at minimum (1) and usedSlots is 0
      const inventory = Inventory.create({
        inventoryId: validInventoryId,
        playerProfileId: validProfileId,
        capacity: InventoryCapacity.create(1),
      });

      expect(inventory.utilizationPercentage).toBe(0);
    });
  });

  describe('copyWith', () => {
    it('should create a copy with updated fields', () => {
      const inventory = Inventory.create({
        inventoryId: validInventoryId,
        playerProfileId: validProfileId,
      });

      const updatedInventory = inventory.copyWith({
        usedSlots: 25,
      });

      expect(updatedInventory.usedSlots).toBe(25);
      expect(updatedInventory.inventoryId).toEqual(inventory.inventoryId);
      expect(updatedInventory.playerProfileId).toEqual(inventory.playerProfileId);
    });

    it('should preserve unchanged fields', () => {
      const inventory = Inventory.create({
        inventoryId: validInventoryId,
        playerProfileId: validProfileId,
        capacity: InventoryCapacity.create(200),
      });

      const updatedInventory = inventory.copyWith({
        usedSlots: 50,
      });

      expect(updatedInventory.capacity.value).toBe(200);
      expect(updatedInventory.inventoryId).toEqual(inventory.inventoryId);
    });

    it('should update the updatedAt timestamp', () => {
      const inventory = Inventory.create({
        inventoryId: validInventoryId,
        playerProfileId: validProfileId,
      });

      const originalUpdatedAt = inventory.updatedAt;

      const updatedInventory = inventory.copyWith({
        usedSlots: 10,
      });

      expect(updatedInventory.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('expandCapacity', () => {
    it('should create a copy with expanded capacity', () => {
      const inventory = Inventory.create({
        inventoryId: validInventoryId,
        playerProfileId: validProfileId,
        capacity: InventoryCapacity.create(100),
      });

      const expandedInventory = inventory.expandCapacity(InventoryCapacity.create(200));

      expect(expandedInventory.capacity.value).toBe(200);
      expect(expandedInventory.usedSlots).toBe(inventory.usedSlots);
    });

    it('should preserve other fields when expanding', () => {
      const inventory = Inventory.create({
        inventoryId: validInventoryId,
        playerProfileId: validProfileId,
        capacity: InventoryCapacity.create(100),
      }).copyWith({ usedSlots: 50 });

      const expandedInventory = inventory.expandCapacity(InventoryCapacity.create(200));

      expect(expandedInventory.usedSlots).toBe(50);
      expect(expandedInventory.inventoryId).toEqual(inventory.inventoryId);
    });
  });

  describe('incrementUsedSlots', () => {
    it('should increment used slots by 1', () => {
      const inventory = Inventory.create({
        inventoryId: validInventoryId,
        playerProfileId: validProfileId,
      });

      const updatedInventory = inventory.incrementUsedSlots();

      expect(updatedInventory.usedSlots).toBe(1);
    });

    it('should increment multiple times correctly', () => {
      let inventory = Inventory.create({
        inventoryId: validInventoryId,
        playerProfileId: validProfileId,
      });

      inventory = inventory.incrementUsedSlots();
      inventory = inventory.incrementUsedSlots();
      inventory = inventory.incrementUsedSlots();

      expect(inventory.usedSlots).toBe(3);
    });
  });

  describe('decrementUsedSlots', () => {
    it('should decrement used slots by 1', () => {
      const inventory = Inventory.create({
        inventoryId: validInventoryId,
        playerProfileId: validProfileId,
        capacity: InventoryCapacity.create(100),
      }).copyWith({ usedSlots: 5 });

      const updatedInventory = inventory.decrementUsedSlots();

      expect(updatedInventory.usedSlots).toBe(4);
    });

    it('should not go below 0', () => {
      const inventory = Inventory.create({
        inventoryId: validInventoryId,
        playerProfileId: validProfileId,
      });

      const updatedInventory = inventory.decrementUsedSlots();

      expect(updatedInventory.usedSlots).toBe(0);
    });
  });

  describe('toJSON', () => {
    it('should serialize inventory to JSON', () => {
      const inventory = Inventory.create({
        inventoryId: validInventoryId,
        playerProfileId: validProfileId,
        capacity: InventoryCapacity.create(100),
      });

      const json = inventory.toJSON();

      expect(json.inventoryId).toBe(validInventoryId.value);
      expect(json.playerProfileId).toBe(validProfileId.value);
      expect(json.capacity).toBe(100);
      expect(json.usedSlots).toBe(0);
      expect(json.availableSlots).toBe(100);
      expect(json.isFull).toBe(false);
      expect(json.utilizationPercentage).toBe(0);
      expect(typeof json.createdAt).toBe('string');
      expect(typeof json.updatedAt).toBe('string');
    });
  });
});

describe('InventoryId', () => {
  const VALID_UUID = '123e4567-e89b-12d3-a456-426614174000';

  describe('reconstruct', () => {
    it('should reconstruct valid UUID', () => {
      const id = InventoryId.reconstruct(VALID_UUID);
      expect(id.value).toBe(VALID_UUID);
    });

    it('should reconstruct even invalid-looking string (reconstruct bypasses validation)', () => {
      const id = InventoryId.reconstruct('invalid-uuid');
      expect(id.value).toBe('invalid-uuid');
    });
  });

  describe('generate', () => {
    it('should generate valid UUID', () => {
      const id = InventoryId.generate();
      expect(id.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });
});

describe('InventoryCapacity', () => {
  const MIN_CAPACITY = 1;
  const MAX_CAPACITY = 1000;

  describe('create', () => {
    it('should create capacity with valid value', () => {
      const capacity = InventoryCapacity.create(100);
      expect(capacity.value).toBe(100);
    });

    it('should reject capacity below minimum', () => {
      expect(() => InventoryCapacity.create(0)).toThrow();
      expect(() => InventoryCapacity.create(-1)).toThrow();
    });

    it('should reject capacity above maximum', () => {
      expect(() => InventoryCapacity.create(MAX_CAPACITY + 1)).toThrow();
    });

    it('should floor non-integer values (not reject)', () => {
      const capacity = InventoryCapacity.create(100.5);
      expect(capacity.value).toBe(100);
    });
  });

  describe('reconstruct', () => {
    it('should reconstruct valid capacity', () => {
      const capacity = InventoryCapacity.reconstruct(150);
      expect(capacity.value).toBe(150);
    });
  });

  describe('isDefault', () => {
    it('should return true for default capacity', () => {
      const capacity = InventoryCapacity.create(DEFAULT_INVENTORY_CAPACITY);
      expect(capacity.isDefault()).toBe(true);
    });

    it('should return false for non-default capacity', () => {
      const capacity = InventoryCapacity.create(200);
      expect(capacity.isDefault()).toBe(false);
    });
  });

  describe('isMaxCapacity', () => {
    it('should return true for maximum capacity', () => {
      const capacity = InventoryCapacity.create(MAX_CAPACITY);
      expect(capacity.isMaxCapacity()).toBe(true);
    });

    it('should return false for lower capacity', () => {
      const capacity = InventoryCapacity.create(100);
      expect(capacity.isMaxCapacity()).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true for equal capacities', () => {
      const c1 = InventoryCapacity.create(100);
      const c2 = InventoryCapacity.create(100);
      expect(c1.equals(c2)).toBe(true);
    });

    it('should return false for different capacities', () => {
      const c1 = InventoryCapacity.create(100);
      const c2 = InventoryCapacity.create(200);
      expect(c1.equals(c2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return string representation', () => {
      const capacity = InventoryCapacity.create(250);
      expect(capacity.toString()).toBe('250');
    });
  });
});