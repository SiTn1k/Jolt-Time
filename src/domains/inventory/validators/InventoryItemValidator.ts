/**
 * Inventory Item Validator
 *
 * Validates inventory item data according to game rules.
 */

import { InventoryItemStatus } from '../types/InventoryItemStatus';
import { ItemRarity } from '../entities/InventoryItem';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const VALID_RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
const VALID_STATUSES = ['active', 'equipped', 'vaulted', 'listed', 'trading', 'locked', 'expired', 'pending'];

/**
 * Result of inventory item validation.
 */
export interface InventoryItemValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for inventory item data.
 */
export class InventoryItemValidator {
  /**
   * Validates artifact ID format.
   * @param artifactId The artifact ID to validate
   * @returns true if valid
   */
  public static isValidArtifactId(artifactId: string | null | undefined): boolean {
    if (!artifactId || artifactId.trim().length === 0) {
      return false;
    }
    return artifactId.trim().length <= 50;
  }

  /**
   * Validates rarity value.
   * @param rarity The rarity to validate
   * @returns true if valid
   */
  public static isValidRarity(rarity: string | null | undefined): boolean {
    if (!rarity) return false;
    return VALID_RARITIES.includes(rarity.toLowerCase());
  }

  /**
   * Validates status value.
   * @param status The status to validate
   * @returns true if valid
   */
  public static isValidStatus(status: string | null | undefined): boolean {
    if (!status) return false;
    return VALID_STATUSES.includes(status.toLowerCase());
  }

  /**
   * Validates a complete inventory item.
   * @param data The item data to validate
   * @returns Validation result with all errors
   */
  public static validate(data: {
    itemId?: string;
    inventoryId?: string;
    artifactId?: string;
    ownerId?: string;
    rarity?: string;
    status?: string;
    quantity?: number;
    expiresAt?: string | null;
  }): InventoryItemValidationResult {
    const errors: string[] = [];

    // Validate itemId
    if (data.itemId !== undefined && !UUID_REGEX.test(data.itemId)) {
      errors.push('Item ID must be a valid UUID');
    }

    // Validate inventoryId
    if (data.inventoryId !== undefined && !UUID_REGEX.test(data.inventoryId)) {
      errors.push('Inventory ID must be a valid UUID');
    }

    // Validate ownerId
    if (data.ownerId !== undefined && !UUID_REGEX.test(data.ownerId)) {
      errors.push('Owner ID must be a valid UUID');
    }

    // Validate artifactId
    if (!this.isValidArtifactId(data.artifactId)) {
      errors.push('Artifact ID is required and must be at most 50 characters');
    }

    // Validate rarity
    if (!this.isValidRarity(data.rarity)) {
      errors.push(`Rarity must be one of: ${VALID_RARITIES.join(', ')}`);
    }

    // Validate status
    if (data.status !== undefined && !this.isValidStatus(data.status)) {
      errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    // Validate quantity
    if (data.quantity !== undefined) {
      if (typeof data.quantity !== 'number' || isNaN(data.quantity)) {
        errors.push('Quantity must be a valid number');
      } else if (data.quantity < 0 || data.quantity > 99) {
        errors.push('Quantity must be between 0 and 99');
      } else if (!Number.isInteger(data.quantity)) {
        errors.push('Quantity must be an integer');
      }
    }

    // Validate expiresAt
    if (data.expiresAt !== undefined && data.expiresAt !== null) {
      const expiresDate = new Date(data.expiresAt);
      if (isNaN(expiresDate.getTime())) {
        errors.push('ExpiresAt must be a valid date string');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates inventory item data and throws if invalid.
   * @param data The item data to validate
   * @throws Error with validation details if invalid
   */
  public static validateOrThrow(data: {
    itemId?: string;
    inventoryId?: string;
    artifactId?: string;
    ownerId?: string;
    rarity?: string;
    status?: string;
    quantity?: number;
    expiresAt?: string | null;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Inventory item validation failed: ${result.errors.join('; ')}`);
    }
  }

  /**
   * Checks if a rarity string is valid.
   * @param rarity The rarity string to check
   * @returns true if valid
   */
  public static isRarityValid(rarity: string): boolean {
    return VALID_RARITIES.includes(rarity.toLowerCase());
  }

  /**
   * Checks if a status string is valid.
   * @param status The status string to check
   * @returns true if valid
   */
  public static isStatusValid(status: string): boolean {
    return VALID_STATUSES.includes(status.toLowerCase());
  }
}