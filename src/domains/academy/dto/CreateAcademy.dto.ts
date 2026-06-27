/**
 * Create Academy DTO
 *
 * Data transfer object for creating a new Academy.
 */

import type { AcademyMetadata } from '../types/AcademyMetadata';

/**
 * Input for creating a new Academy.
 */
export interface CreateAcademyDto {
  /** Associated player profile ID */
  playerProfileId: string;

  /** Initial research points (optional, defaults to 0) */
  initialResearchPoints?: number;

  /** Extended metadata (optional) */
  metadata?: AcademyMetadata;
}

/**
 * Validation rules for CreateAcademyDto.
 */
export const CREATE_ACADEMY_VALIDATION = {
  playerProfileId: {
    required: true,
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    message: 'Player profile ID must be a valid UUID',
  },
  initialResearchPoints: {
    required: false,
    min: 0,
    max: 999999999,
  },
} as const;