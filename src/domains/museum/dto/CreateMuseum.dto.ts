/**
 * Create Museum DTO
 *
 * Data transfer object for creating a new museum.
 * Contains all required and optional data for museum creation.
 */

import type { MuseumType } from '../types/MuseumType';

/**
 * Input for creating a new museum.
 */
export interface CreateMuseumDto {
  /** Museum display name */
  museumName: string;

  /** Associated player profile ID (owner) */
  playerProfileId: string;

  /** Museum type/classification */
  museumType?: MuseumType;

  /** Initial level */
  level?: number;
}

/**
 * Validation rules for CreateMuseumDto.
 */
export const CREATE_MUSEUM_VALIDATION = {
  museumName: {
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  playerProfileId: {
    required: true,
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  },
  museumType: {
    required: false,
    pattern: /^(classic|modern|themed)$/i,
    default: 'classic',
  },
  level: {
    required: false,
    min: 1,
    max: 100,
    default: 1,
  },
} as const;
