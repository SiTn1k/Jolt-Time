/**
 * Inventory Validator Unit Tests
 *
 * Tests for inventory validators.
 */

import { describe, it, expect } from 'vitest';
import { InventoryCapacityValidator } from '../validators/InventoryCapacityValidator';
import { InventoryQuantityValidator } from '../validators/InventoryQuantityValidator';
import { InventoryItemValidator } from '../validators/InventoryItemValidator';
import { InventoryItemStatus } from '../types/InventoryItemStatus';
import { ItemRarity } from '../entities/InventoryItem';

describe('InventoryCapacityValidator', () => {
  const MIN_CAPACITY = 1;
  const MAX_CAPACITY = 1000;

  describe('validate', () => {
    it('should return valid for valid capacity', () => {
      const result = InventoryCapacityValidator.validate(100);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return valid for minimum capacity', () => {
      const result = InventoryCapacityValidator.validate(MIN_CAPACITY);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for maximum capacity', () => {
      const result = InventoryCapacityValidator.validate(MAX_CAPACITY);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for null', () => {
      const result = InventoryCapacityValidator.validate(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Capacity is required');
    });

    it('should return invalid for undefined', () => {
      const result = InventoryCapacityValidator.validate(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Capacity is required');
    });

    it('should return invalid for below minimum', () => {
      const result = InventoryCapacityValidator.validate(0);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(`Capacity must be at least ${MIN_CAPACITY}`);
    });

    it('should return invalid for above maximum', () => {
      const result = InventoryCapacityValidator.validate(MAX_CAPACITY + 1);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(`Capacity cannot exceed ${MAX_CAPACITY}`);
    });

    it('should return invalid for non-numeric value', () => {
      const result = InventoryCapacityValidator.validate('invalid' as unknown as number);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Capacity must be a valid number');
    });

    it('should return invalid for non-integer value', () => {
      const result = InventoryCapacityValidator.validate(100.5);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Capacity must be an integer');
    });
  });

  describe('validateOrThrow', () => {
    it('should not throw for valid capacity', () => {
      expect(() => InventoryCapacityValidator.validateOrThrow(100)).not.toThrow();
    });

    it('should throw for invalid capacity', () => {
      expect(() => InventoryCapacityValidator.validateOrThrow(null)).toThrow(
        'Inventory capacity validation failed: Capacity is required'
      );
    });
  });

  describe('validateExpansion', () => {
    it('should allow valid expansion', () => {
      const result = InventoryCapacityValidator.validateExpansion(100, 200);
      expect(result.isValid).toBe(true);
    });

    it('should not allow expansion to same value', () => {
      const result = InventoryCapacityValidator.validateExpansion(100, 100);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('New capacity must be greater than current capacity');
    });

    it('should not allow expansion to lower value', () => {
      const result = InventoryCapacityValidator.validateExpansion(200, 100);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('New capacity must be greater than current capacity');
    });

    it('should not allow expansion above maximum', () => {
      const result = InventoryCapacityValidator.validateExpansion(900, MAX_CAPACITY + 100);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(`Capacity cannot exceed ${MAX_CAPACITY}`);
    });
  });

  describe('isValidRange', () => {
    it('should return true for valid range', () => {
      expect(InventoryCapacityValidator.isValidRange(100)).toBe(true);
    });

    it('should return false for below minimum', () => {
      expect(InventoryCapacityValidator.isValidRange(0)).toBe(false);
    });

    it('should return false for above maximum', () => {
      expect(InventoryCapacityValidator.isValidRange(MAX_CAPACITY + 1)).toBe(false);
    });

    it('should return true for minimum boundary', () => {
      expect(InventoryCapacityValidator.isValidRange(MIN_CAPACITY)).toBe(true);
    });

    it('should return true for maximum boundary', () => {
      expect(InventoryCapacityValidator.isValidRange(MAX_CAPACITY)).toBe(true);
    });
  });
});

describe('InventoryQuantityValidator', () => {
  const MIN_QUANTITY = 0;
  const MAX_QUANTITY = 99;

  describe('validate', () => {
    it('should return valid for valid quantity', () => {
      const result = InventoryQuantityValidator.validate(10);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return valid for minimum quantity', () => {
      const result = InventoryQuantityValidator.validate(MIN_QUANTITY);
      expect(result.isValid).toBe(true);
    });

    it('should return valid for maximum quantity', () => {
      const result = InventoryQuantityValidator.validate(MAX_QUANTITY);
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for null', () => {
      const result = InventoryQuantityValidator.validate(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Quantity is required');
    });

    it('should return invalid for undefined', () => {
      const result = InventoryQuantityValidator.validate(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Quantity is required');
    });

    it('should return invalid for below minimum', () => {
      const result = InventoryQuantityValidator.validate(-1);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(`Quantity cannot be less than ${MIN_QUANTITY}`);
    });

    it('should return invalid for above maximum', () => {
      const result = InventoryQuantityValidator.validate(MAX_QUANTITY + 1);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(`Quantity cannot exceed ${MAX_QUANTITY}`);
    });

    it('should return invalid for non-numeric value', () => {
      const result = InventoryQuantityValidator.validate('invalid' as unknown as number);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Quantity must be a valid number');
    });

    it('should return invalid for non-integer value', () => {
      const result = InventoryQuantityValidator.validate(5.5);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Quantity must be an integer');
    });
  });

  describe('validateOrThrow', () => {
    it('should not throw for valid quantity', () => {
      expect(() => InventoryQuantityValidator.validateOrThrow(10)).not.toThrow();
    });

    it('should throw for invalid quantity', () => {
      expect(() => InventoryQuantityValidator.validateOrThrow(null)).toThrow(
        'Inventory quantity validation failed: Quantity is required'
      );
    });
  });

  describe('validateStackAddition', () => {
    it('should allow valid stack addition', () => {
      const result = InventoryQuantityValidator.validateStackAddition(10, 5);
      expect(result.isValid).toBe(true);
    });

    it('should not allow exceeding maximum', () => {
      const result = InventoryQuantityValidator.validateStackAddition(95, 10);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(`Stack would exceed maximum quantity of ${MAX_QUANTITY}`);
    });

    it('should not allow negative result', () => {
      const result = InventoryQuantityValidator.validateStackAddition(5, -10);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Resulting quantity cannot be negative');
    });

    it('should allow addition that results in maximum', () => {
      const result = InventoryQuantityValidator.validateStackAddition(90, 9);
      expect(result.isValid).toBe(true);
    });
  });

  describe('isValidRange', () => {
    it('should return true for valid range', () => {
      expect(InventoryQuantityValidator.isValidRange(50)).toBe(true);
    });

    it('should return false for below minimum', () => {
      expect(InventoryQuantityValidator.isValidRange(-1)).toBe(false);
    });

    it('should return false for above maximum', () => {
      expect(InventoryQuantityValidator.isValidRange(MAX_QUANTITY + 1)).toBe(false);
    });
  });

  describe('isMaxStack', () => {
    it('should return true for max stack', () => {
      expect(InventoryQuantityValidator.isMaxStack(MAX_QUANTITY)).toBe(true);
    });

    it('should return false for below max', () => {
      expect(InventoryQuantityValidator.isMaxStack(50)).toBe(false);
    });
  });

  describe('isZero', () => {
    it('should return true for zero', () => {
      expect(InventoryQuantityValidator.isZero(0)).toBe(true);
    });

    it('should return false for non-zero', () => {
      expect(InventoryQuantityValidator.isZero(5)).toBe(false);
    });
  });
});

describe('InventoryItemValidator', () => {
  // Valid UUID v4 format (third group starts with 4)
  const VALID_UUID = '123e4567-e89b-42d3-a456-426614174000';

  describe('isValidArtifactId', () => {
    it('should return true for valid artifact ID', () => {
      expect(InventoryItemValidator.isValidArtifactId('artifact-001')).toBe(true);
    });

    it('should return true for empty string', () => {
      expect(InventoryItemValidator.isValidArtifactId('')).toBe(false);
    });

    it('should return false for null', () => {
      expect(InventoryItemValidator.isValidArtifactId(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(InventoryItemValidator.isValidArtifactId(undefined)).toBe(false);
    });

    it('should return false for too long ID', () => {
      const longId = 'a'.repeat(51);
      expect(InventoryItemValidator.isValidArtifactId(longId)).toBe(false);
    });
  });

  describe('isValidRarity', () => {
    it('should return true for common', () => {
      expect(InventoryItemValidator.isValidRarity('common')).toBe(true);
    });

    it('should return true for uppercase RARITY', () => {
      expect(InventoryItemValidator.isValidRarity('RARE')).toBe(true);
    });

    it('should return false for invalid rarity', () => {
      expect(InventoryItemValidator.isValidRarity('invalid')).toBe(false);
    });

    it('should return false for null', () => {
      expect(InventoryItemValidator.isValidRarity(null)).toBe(false);
    });
  });

  describe('isValidStatus', () => {
    it('should return true for active', () => {
      expect(InventoryItemValidator.isValidStatus('active')).toBe(true);
    });

    it('should return true for equipped', () => {
      expect(InventoryItemValidator.isValidStatus('equipped')).toBe(true);
    });

    it('should return true for uppercase STATUS', () => {
      expect(InventoryItemValidator.isValidStatus('LOCKED')).toBe(true);
    });

    it('should return false for invalid status', () => {
      expect(InventoryItemValidator.isValidStatus('invalid')).toBe(false);
    });

    it('should return false for null', () => {
      expect(InventoryItemValidator.isValidStatus(null)).toBe(false);
    });
  });

  describe('validate', () => {
    it('should return valid for complete valid data', () => {
      const result = InventoryItemValidator.validate({
        itemId: VALID_UUID,
        inventoryId: VALID_UUID,
        artifactId: 'artifact-001',
        ownerId: VALID_UUID,
        rarity: 'rare',
        status: 'active',
        quantity: 5,
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return valid for minimal required data', () => {
      const result = InventoryItemValidator.validate({
        artifactId: 'artifact-001',
        rarity: 'common',
      });

      expect(result.isValid).toBe(true);
    });

    it('should return invalid for missing artifact ID', () => {
      const result = InventoryItemValidator.validate({
        rarity: 'common',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Artifact ID is required and must be at most 50 characters');
    });

    it('should return invalid for invalid item ID', () => {
      const result = InventoryItemValidator.validate({
        itemId: 'invalid-uuid',
        artifactId: 'artifact-001',
        rarity: 'common',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Item ID must be a valid UUID');
    });

    it('should return invalid for invalid rarity', () => {
      const result = InventoryItemValidator.validate({
        artifactId: 'artifact-001',
        rarity: 'super_rare',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Rarity must be one of'))).toBe(true);
    });

    it('should return invalid for quantity out of range', () => {
      const result = InventoryItemValidator.validate({
        artifactId: 'artifact-001',
        rarity: 'common',
        quantity: 100,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Quantity must be between 0 and 99');
    });

    it('should return invalid for negative quantity', () => {
      const result = InventoryItemValidator.validate({
        artifactId: 'artifact-001',
        rarity: 'common',
        quantity: -1,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Quantity must be between 0 and 99');
    });

    it('should return invalid for non-integer quantity', () => {
      const result = InventoryItemValidator.validate({
        artifactId: 'artifact-001',
        rarity: 'common',
        quantity: 5.5,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Quantity must be an integer');
    });

    it('should return invalid for invalid expiresAt', () => {
      const result = InventoryItemValidator.validate({
        artifactId: 'artifact-001',
        rarity: 'common',
        expiresAt: 'not-a-date',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ExpiresAt must be a valid date string');
    });

    it('should return multiple errors for multiple issues', () => {
      const result = InventoryItemValidator.validate({
        itemId: 'invalid',
        inventoryId: 'invalid',
        ownerId: 'invalid',
        artifactId: '',
        rarity: 'invalid',
        quantity: -1,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('validateOrThrow', () => {
    it('should not throw for valid data', () => {
      expect(() => InventoryItemValidator.validateOrThrow({
        artifactId: 'artifact-001',
        rarity: 'common',
      })).not.toThrow();
    });

    it('should throw for invalid data', () => {
      expect(() => InventoryItemValidator.validateOrThrow({
        artifactId: '',
        rarity: 'invalid',
      })).toThrow('Inventory item validation failed:');
    });
  });

  describe('isRarityValid', () => {
    it('should return true for valid rarity', () => {
      expect(InventoryItemValidator.isRarityValid('common')).toBe(true);
      expect(InventoryItemValidator.isRarityValid('rare')).toBe(true);
      expect(InventoryItemValidator.isRarityValid('legendary')).toBe(true);
    });

    it('should return false for invalid rarity', () => {
      expect(InventoryItemValidator.isRarityValid('invalid')).toBe(false);
    });
  });

  describe('isStatusValid', () => {
    it('should return true for valid status', () => {
      expect(InventoryItemValidator.isStatusValid('active')).toBe(true);
      expect(InventoryItemValidator.isStatusValid('equipped')).toBe(true);
      expect(InventoryItemValidator.isStatusValid('locked')).toBe(true);
    });

    it('should return false for invalid status', () => {
      expect(InventoryItemValidator.isStatusValid('invalid')).toBe(false);
    });
  });
});