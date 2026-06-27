/**
 * Create Inventory DTO
 *
 * Data transfer object for creating a new inventory.
 * Contains all required and optional data for inventory creation.
 */

/**
 * Input for creating a new inventory.
 */
export interface CreateInventoryDto {
  /** Associated player profile ID */
  playerProfileId: string;

  /** Initial inventory capacity (optional) */
  capacity?: number;
}

/**
 * Validation rules for CreateInventoryDto.
 */
export const CREATE_INVENTORY_VALIDATION = {
  playerProfileId: {
    required: true,
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  },
  capacity: {
    required: false,
    min: 1,
    max: 1000,
    default: 100,
  },
} as const;