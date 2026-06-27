/**
 * InventoryItem Entity Unit Tests
 *
 * Tests for InventoryItem entity and related functionality.
 */

import { describe, it, expect } from 'vitest';
import { InventoryItem, ItemRarity } from '../entities/InventoryItem';
import { InventoryItemId } from '../value-objects/InventoryItemId';
import { InventoryId } from '../value-objects/InventoryId';
import { InventoryQuantity, DEFAULT_ITEM_QUANTITY } from '../value-objects/InventoryQuantity';
import { InventoryItemStatus } from '../types/InventoryItemStatus';
import { INITIAL_INVENTORY_METADATA, ItemAcquisitionSource } from '../types/InventoryMetadata';

describe('InventoryItem Entity', () => {
  const validItemId = InventoryItemId.reconstruct('123e4567-e89b-12d3-a456-426614174000');
  const validInventoryId = InventoryId.reconstruct('223e4567-e89b-12d3-a456-426614174001');
  const validOwnerId = '323e4567-e89b-12d3-a456-426614174002';
  const validArtifactId = 'artifact-001';

  describe('create', () => {
    it('should create a new item with default values', () => {
      const item = InventoryItem.create({
        itemId: validItemId,
        inventoryId: validInventoryId,
        artifactId: validArtifactId,
        ownerId: validOwnerId,
        rarity: ItemRarity.COMMON,
      });

      expect(item.itemId).toEqual(validItemId);
      expect(item.inventoryId).toEqual(validInventoryId);
      expect(item.artifactId).toBe(validArtifactId);
      expect(item.ownerId).toBe(validOwnerId);
      expect(item.quantity.value).toBe(DEFAULT_ITEM_QUANTITY);
      expect(item.rarity).toBe(ItemRarity.COMMON);
      expect(item.status).toBe(InventoryItemStatus.ACTIVE);
      expect(item.metadata.source).toBe(ItemAcquisitionSource.MISSION_REWARD);
      expect(item.metadata.usageCount).toBe(0);
      expect(item.metadata.isFavorite).toBe(false);
      expect(item.metadata.version).toBe(1);
      expect(typeof item.metadata.acquiredAt).toBe('string');
    });

    it('should create item with custom quantity', () => {
      const item = InventoryItem.create({
        itemId: validItemId,
        inventoryId: validInventoryId,
        artifactId: validArtifactId,
        ownerId: validOwnerId,
        rarity: ItemRarity.RARE,
        quantity: InventoryQuantity.create(5),
      });

      expect(item.quantity.value).toBe(5);
      expect(item.rarity).toBe(ItemRarity.RARE);
    });

    it('should create item with expiration date', () => {
      const expiresAt = new Date('2025-12-31T23:59:59.000Z');
      const item = InventoryItem.create({
        itemId: validItemId,
        inventoryId: validInventoryId,
        artifactId: validArtifactId,
        ownerId: validOwnerId,
        rarity: ItemRarity.EPIC,
        expiresAt,
      });

      expect(item.expiresAt).toEqual(expiresAt);
    });

    it('should set timestamps correctly', () => {
      const beforeCreate = new Date();
      const item = InventoryItem.create({
        itemId: validItemId,
        inventoryId: validInventoryId,
        artifactId: validArtifactId,
        ownerId: validOwnerId,
        rarity: ItemRarity.COMMON,
      });
      const afterCreate = new Date();

      expect(item.obtainedAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(item.obtainedAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
      expect(item.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(item.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
      expect(item.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(item.updatedAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    });

    it('should set metadata.acquiredAt timestamp', () => {
      const beforeCreate = new Date();
      const item = InventoryItem.create({
        itemId: validItemId,
        inventoryId: validInventoryId,
        artifactId: validArtifactId,
        ownerId: validOwnerId,
        rarity: ItemRarity.COMMON,
      });
      const afterCreate = new Date();

      const acquiredAt = new Date(item.metadata.acquiredAt);
      expect(acquiredAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(acquiredAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    });
  });

  describe('fromDatabase', () => {
    it('should reconstruct item from database record', () => {
      const record = {
        item_id: '123e4567-e89b-12d3-a456-426614174000',
        inventory_id: '223e4567-e89b-12d3-a456-426614174001',
        artifact_id: 'artifact-001',
        owner_id: '323e4567-e89b-12d3-a456-426614174002',
        quantity: 10,
        rarity: 'rare',
        status: 'active',
        metadata: {
          ...INITIAL_INVENTORY_METADATA,
          usageCount: 5,
          isFavorite: true,
        },
        obtained_at: '2024-01-15T10:00:00.000Z',
        expires_at: null,
        created_at: '2024-01-15T10:00:00.000Z',
        updated_at: '2024-02-20T15:30:00.000Z',
      };

      const item = InventoryItem.fromDatabase(record);

      expect(item.itemId.value).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(item.inventoryId.value).toBe('223e4567-e89b-12d3-a456-426614174001');
      expect(item.artifactId).toBe('artifact-001');
      expect(item.ownerId).toBe('323e4567-e89b-12d3-a456-426614174002');
      expect(item.quantity.value).toBe(10);
      expect(item.rarity).toBe(ItemRarity.RARE);
      expect(item.status).toBe(InventoryItemStatus.ACTIVE);
      expect(item.metadata.usageCount).toBe(5);
      expect(item.metadata.isFavorite).toBe(true);
    });

    it('should handle expired items', () => {
      const record = {
        item_id: '123e4567-e89b-12d3-a456-426614174000',
        inventory_id: '223e4567-e89b-12d3-a456-426614174001',
        artifact_id: 'artifact-001',
        owner_id: '323e4567-e89b-12d3-a456-426614174002',
        quantity: 5,
        rarity: 'legendary',
        status: 'expired',
        metadata: { ...INITIAL_INVENTORY_METADATA },
        obtained_at: '2024-01-15T10:00:00.000Z',
        expires_at: '2024-01-20T10:00:00.000Z',
        created_at: '2024-01-15T10:00:00.000Z',
        updated_at: '2024-01-15T10:00:00.000Z',
      };

      const item = InventoryItem.fromDatabase(record);

      expect(item.status).toBe(InventoryItemStatus.EXPIRED);
      expect(item.expiresAt).toBeTruthy();
    });
  });

  describe('isExpired', () => {
    it('should return false for item without expiration', () => {
      const item = InventoryItem.create({
        itemId: validItemId,
        inventoryId: validInventoryId,
        artifactId: validArtifactId,
        ownerId: validOwnerId,
        rarity: ItemRarity.COMMON,
      });

      expect(item.isExpired).toBe(false);
    });

    it('should return false for item with future expiration', () => {
      const item = InventoryItem.create({
        itemId: validItemId,
        inventoryId: validInventoryId,
        artifactId: validArtifactId,
        ownerId: validOwnerId,
        rarity: ItemRarity.COMMON,
        expiresAt: new Date(Date.now() + 86400000), // 1 day from now
      });

      expect(item.isExpired).toBe(false);
    });

    it('should return true for item with past expiration', () => {
      const item = InventoryItem.create({
        itemId: validItemId,
        inventoryId: validInventoryId,
        artifactId: validArtifactId,
        ownerId: validOwnerId,
        rarity: ItemRarity.COMMON,
        expiresAt: new Date(Date.now() - 86400000), // 1 day ago
      });

      expect(item.isExpired).toBe(true);
    });
  });

  describe('isAvailable', () => {
    it('should return true for active non-expired item', () => {
      const item = InventoryItem.create({
        itemId: validItemId,
        inventoryId: validInventoryId,
        artifactId: validArtifactId,
        ownerId: validOwnerId,
        rarity: ItemRarity.COMMON,
      });

      expect(item.isAvailable).toBe(true);
    });

    it('should return false for locked item', () => {
      const item = InventoryItem.create({
        itemId: validItemId,
        inventoryId: validInventoryId,
        artifactId: validArtifactId,
        ownerId: validOwnerId,
        rarity: ItemRarity.COMMON,
      }).changeStatus(InventoryItemStatus.LOCKED);

      expect(item.isAvailable).toBe(false);
    });

    it('should return false for expired item', () => {
      const item = InventoryItem.create({
        itemId: validItemId,
        inventoryId: validInventoryId,
        artifactId: validArtifactId,
        ownerId: validOwnerId,
        rarity: ItemRarity.COMMON,
        expiresAt: new Date(Date.now() - 86400000),
      });

      expect(item.isAvailable).toBe(false);
    });
  });

  describe('isStackable', () => {
    it('should return false for single item', () => {
      const item = InventoryItem.create({
        itemId: validItemId,
        inventoryId: validInventoryId,
        artifactId: validArtifactId,
        ownerId: validOwnerId,
        rarity: ItemRarity.COMMON,
        quantity: InventoryQuantity.create(1),
      });

      expect(item.isStackable).toBe(false);
    });

    it('should return true for stacked items', () => {
      const item = InventoryItem.create({
        itemId: validItemId,
        inventoryId: validInventoryId,
        artifactId: validArtifactId,
        ownerId: validOwnerId,
        rarity: ItemRarity.COMMON,
        quantity: InventoryQuantity.create(5),
      });

      expect(item.isStackable).toBe(true);
    });
  });

  describe('copyWith', () => {
    it('should create a copy with updated fields', () => {
      const item = InventoryItem.create({
        itemId: validItemId,
        inventoryId: validInventoryId,
        artifactId: validArtifactId,
        ownerId: validOwnerId,
        rarity: ItemRarity.COMMON,
      });

      const updatedItem = item.copyWith({
        quantity: InventoryQuantity.create(10),
      });

      expect(updatedItem.quantity.value).toBe(10);
      expect(updatedItem.itemId).toEqual(item.itemId);
      expect(updatedItem.artifactId).toBe(item.artifactId);
    });

    it('should preserve unchanged fields', () => {
      const item = InventoryItem.create({
        itemId: validItemId,
        inventoryId: validInventoryId,
        artifactId: validArtifactId,
        ownerId: validOwnerId,
        rarity: ItemRarity.RARE,
      });

      const updatedItem = item.copyWith({
        quantity: InventoryQuantity.create(5),
      });

      expect(updatedItem.rarity).toBe(ItemRarity.RARE);
      expect(updatedItem.artifactId).toBe(validArtifactId);
    });

    it('should update the updatedAt timestamp', () => {
      const item = InventoryItem.create({
        itemId: validItemId,
        inventoryId: validInventoryId,
        artifactId: validArtifactId,
        ownerId: validOwnerId,
        rarity: ItemRarity.COMMON,
      });

      const originalUpdatedAt = item.updatedAt;

      const updatedItem = item.copyWith({
        quantity: InventoryQuantity.create(5),
      });

      expect(updatedItem.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  describe('changeStatus', () => {
    it('should change status to equipped', () => {
      const item = InventoryItem.create({
        itemId: validItemId,
        inventoryId: validInventoryId,
        artifactId: validArtifactId,
        ownerId: validOwnerId,
        rarity: ItemRarity.COMMON,
      });

      const equippedItem = item.changeStatus(InventoryItemStatus.EQUIPPED);

      expect(equippedItem.status).toBe(InventoryItemStatus.EQUIPPED);
      expect(equippedItem.itemId).toEqual(item.itemId);
    });

    it('should change status to vaulted', () => {
      const item = InventoryItem.create({
        itemId: validItemId,
        inventoryId: validInventoryId,
        artifactId: validArtifactId,
        ownerId: validOwnerId,
        rarity: ItemRarity.COMMON,
      });

      const vaultedItem = item.changeStatus(InventoryItemStatus.VAULTED);

      expect(vaultedItem.status).toBe(InventoryItemStatus.VAULTED);
    });
  });

  describe('toggleFavorite', () => {
    it('should mark item as favorite', () => {
      const item = InventoryItem.create({
        itemId: validItemId,
        inventoryId: validInventoryId,
        artifactId: validArtifactId,
        ownerId: validOwnerId,
        rarity: ItemRarity.COMMON,
      });

      const favoritedItem = item.toggleFavorite();

      expect(favoritedItem.metadata.isFavorite).toBe(true);
    });

    it('should unmark favorited item', () => {
      const item = InventoryItem.create({
        itemId: validItemId,
        inventoryId: validInventoryId,
        artifactId: validArtifactId,
        ownerId: validOwnerId,
        rarity: ItemRarity.COMMON,
      }).toggleFavorite();

      const unfavoritedItem = item.toggleFavorite();

      expect(unfavoritedItem.metadata.isFavorite).toBe(false);
    });
  });

  describe('recordUsage', () => {
    it('should increment usage count', () => {
      const item = InventoryItem.create({
        itemId: validItemId,
        inventoryId: validInventoryId,
        artifactId: validArtifactId,
        ownerId: validOwnerId,
        rarity: ItemRarity.COMMON,
      });

      const usedItem = item.recordUsage();

      expect(usedItem.metadata.usageCount).toBe(1);
      expect(usedItem.metadata.lastUsedAt).toBeTruthy();
    });

    it('should track multiple usages', () => {
      let item = InventoryItem.create({
        itemId: validItemId,
        inventoryId: validInventoryId,
        artifactId: validArtifactId,
        ownerId: validOwnerId,
        rarity: ItemRarity.COMMON,
      });

      item = item.recordUsage();
      item = item.recordUsage();
      item = item.recordUsage();

      expect(item.metadata.usageCount).toBe(3);
    });
  });

  describe('toJSON', () => {
    it('should serialize item to JSON', () => {
      const item = InventoryItem.create({
        itemId: validItemId,
        inventoryId: validInventoryId,
        artifactId: validArtifactId,
        ownerId: validOwnerId,
        rarity: ItemRarity.EPIC,
        quantity: InventoryQuantity.create(3),
      });

      const json = item.toJSON();

      expect(json.itemId).toBe(validItemId.value);
      expect(json.inventoryId).toBe(validInventoryId.value);
      expect(json.artifactId).toBe(validArtifactId);
      expect(json.ownerId).toBe(validOwnerId);
      expect(json.quantity).toBe(3);
      expect(json.rarity).toBe(ItemRarity.EPIC);
      expect(json.status).toBe(InventoryItemStatus.ACTIVE);
      expect(typeof json.obtainedAt).toBe('string');
      expect(typeof json.createdAt).toBe('string');
      expect(typeof json.updatedAt).toBe('string');
    });
  });
});

describe('ItemRarity', () => {
  it('should have all expected values', () => {
    expect(ItemRarity.COMMON).toBe('common');
    expect(ItemRarity.UNCOMMON).toBe('uncommon');
    expect(ItemRarity.RARE).toBe('rare');
    expect(ItemRarity.EPIC).toBe('epic');
    expect(ItemRarity.LEGENDARY).toBe('legendary');
    expect(ItemRarity.MYTHIC).toBe('mythic');
  });
});

describe('InventoryItemId', () => {
  const VALID_UUID = '123e4567-e89b-12d3-a456-426614174000';

  describe('reconstruct', () => {
    it('should reconstruct valid UUID', () => {
      const id = InventoryItemId.reconstruct(VALID_UUID);
      expect(id.value).toBe(VALID_UUID);
    });

    it('should reconstruct even invalid-looking string (reconstruct bypasses validation)', () => {
      const id = InventoryItemId.reconstruct('invalid-uuid');
      expect(id.value).toBe('invalid-uuid');
    });
  });

  describe('generate', () => {
    it('should generate valid UUID', () => {
      const id = InventoryItemId.generate();
      expect(id.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });
});

describe('InventoryQuantity', () => {
  const MIN_QUANTITY = 0;
  const MAX_QUANTITY = 99;

  describe('create', () => {
    it('should create quantity with valid value', () => {
      const quantity = InventoryQuantity.create(10);
      expect(quantity.value).toBe(10);
    });

    it('should reject quantity below minimum', () => {
      expect(() => InventoryQuantity.create(-1)).toThrow();
    });

    it('should reject quantity above maximum', () => {
      expect(() => InventoryQuantity.create(MAX_QUANTITY + 1)).toThrow();
    });

    it('should floor non-integer values (not reject)', () => {
      const quantity = InventoryQuantity.create(5.5);
      expect(quantity.value).toBe(5);
    });
  });

  describe('reconstruct', () => {
    it('should reconstruct valid quantity', () => {
      const quantity = InventoryQuantity.reconstruct(25);
      expect(quantity.value).toBe(25);
    });
  });

  describe('isZero', () => {
    it('should return true for zero quantity', () => {
      const quantity = InventoryQuantity.create(0);
      expect(quantity.isZero()).toBe(true);
    });

    it('should return false for non-zero quantity', () => {
      const quantity = InventoryQuantity.create(5);
      expect(quantity.isZero()).toBe(false);
    });
  });

  describe('isMaxStack', () => {
    it('should return true for max quantity', () => {
      const quantity = InventoryQuantity.create(MAX_QUANTITY);
      expect(quantity.isMaxStack()).toBe(true);
    });

    it('should return false for non-max quantity', () => {
      const quantity = InventoryQuantity.create(50);
      expect(quantity.isMaxStack()).toBe(false);
    });
  });

  describe('canAdd', () => {
    it('should return true for valid addition', () => {
      const quantity = InventoryQuantity.create(10);
      expect(quantity.canAdd(5)).toBe(true);
    });

    it('should return false when exceeding maximum', () => {
      const quantity = InventoryQuantity.create(95);
      expect(quantity.canAdd(10)).toBe(false);
    });

    it('should return true at exact maximum', () => {
      const quantity = InventoryQuantity.create(99);
      expect(quantity.canAdd(0)).toBe(true);
    });
  });

  describe('equals', () => {
    it('should return true for equal quantities', () => {
      const q1 = InventoryQuantity.create(10);
      const q2 = InventoryQuantity.create(10);
      expect(q1.equals(q2)).toBe(true);
    });

    it('should return false for different quantities', () => {
      const q1 = InventoryQuantity.create(10);
      const q2 = InventoryQuantity.create(20);
      expect(q1.equals(q2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return string representation', () => {
      const quantity = InventoryQuantity.create(42);
      expect(quantity.toString()).toBe('42');
    });
  });
});