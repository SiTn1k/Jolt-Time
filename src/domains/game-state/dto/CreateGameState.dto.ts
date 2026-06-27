/**
 * Create Game State DTO
 *
 * Data transfer object for creating a new game state.
 * Contains all required and optional data for state creation.
 */

/**
 * Input for creating a new game state.
 */
export interface CreateGameStateDto {
  /** Associated player profile ID */
  playerProfileId: string;

  /** Initial maximum energy (optional, defaults to 100) */
  maximumEnergy?: number;

  /** Initial maximum health (optional, defaults to 100) */
  maximumHealth?: number;
}

/**
 * Validation rules for CreateGameStateDto.
 */
export const CREATE_GAME_STATE_VALIDATION = {
  playerProfileId: {
    required: true,
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  },
  maximumEnergy: {
    required: false,
    min: 1,
    max: 999,
    default: 100,
  },
  maximumHealth: {
    required: false,
    min: 1,
    max: 9999,
    default: 100,
  },
} as const;