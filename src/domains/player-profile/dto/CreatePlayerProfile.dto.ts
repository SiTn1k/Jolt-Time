/**
 * Create Player Profile DTO
 *
 * Data transfer object for creating a new player profile.
 * Contains all required and optional data for profile creation.
 */

import type { PlayerStatistics } from '../types/PlayerStatistics';
import type { PlayerPreferences } from '../types/PlayerPreferences';

/**
 * Input for creating a new player profile.
 */
export interface CreatePlayerProfileDto {
  /** Associated user ID */
  userId: string;

  /** Player's in-game nickname */
  nickname: string;

  /** Initial statistics (optional) */
  statistics?: PlayerStatistics;

  /** Initial preferences (optional) */
  preferences?: PlayerPreferences;

  /** Profile version for schema tracking */
  profileVersion?: number;
}

/**
 * Validation rules for CreatePlayerProfileDto.
 */
export const CREATE_PLAYER_PROFILE_VALIDATION = {
  userId: {
    required: true,
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  },
  nickname: {
    required: true,
    minLength: 3,
    maxLength: 32,
    pattern: /^[a-zA-Z0-9_]+$/,
  },
  profileVersion: {
    required: false,
    default: 1,
  },
} as const;