/**
 * Create Museum Hall DTO
 *
 * Data transfer object for creating a new museum hall.
 * Contains all required and optional data for hall creation.
 */

import type { HallType } from '../types/HallType';

/**
 * Input for creating a new museum hall.
 */
export interface CreateHallDto {
  /** Associated museum ID */
  museumId: string;

  /** Hall type (era/category) */
  hallType: HallType;

  /** Hall display name */
  hallName: string;

  /** Hall position/order */
  position: number;

  /** Hall capacity (optional, defaults based on hall type) */
  capacity?: number;
}

/**
 * Validation rules for CreateHallDto.
 */
export const CREATE_HALL_VALIDATION = {
  museumId: {
    required: true,
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  },
  hallType: {
    required: true,
    pattern: /^(ancient|classical|medieval|renaissance|industrial|modern|future|special)$/i,
  },
  hallName: {
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  position: {
    required: true,
    min: 0,
    max: 9999,
  },
  capacity: {
    required: false,
    min: 1,
    max: 100,
  },
} as const;
