/**
 * Create Museum Exhibit DTO
 *
 * Data transfer object for creating a new museum exhibit.
 * Contains all required and optional data for exhibit creation.
 *
 * IMPORTANT: Exhibit references InventoryItemId, not ArtifactId directly.
 * The artifact data is fetched from the Inventory domain.
 */

import type { ExhibitCondition } from '../types/ExhibitCondition';

/**
 * Input for creating a new museum exhibit.
 */
export interface CreateExhibitDto {
  /** Associated hall ID */
  hallId: string;

  /** Associated inventory item ID (the item being displayed) */
  inventoryItemId: string;

  /** Associated artifact ID (for display context) */
  artifactId: string;

  /** Display order within the hall */
  displayOrder: number;

  /** Exhibit condition (optional, defaults to GOOD) */
  condition?: ExhibitCondition;

  /** Initial popularity score (optional, defaults to 0) */
  popularity?: number;
}

/**
 * Validation rules for CreateExhibitDto.
 */
export const CREATE_EXHIBIT_VALIDATION = {
  hallId: {
    required: true,
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  },
  inventoryItemId: {
    required: true,
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  },
  artifactId: {
    required: true,
    minLength: 1,
    maxLength: 50,
  },
  displayOrder: {
    required: true,
    min: 0,
    max: 9999,
  },
  condition: {
    required: false,
    pattern: /^(excellent|good|fair|poor|restoration_needed)$/i,
    default: 'good',
  },
  popularity: {
    required: false,
    min: 0,
    max: 100,
    default: 0,
  },
} as const;
