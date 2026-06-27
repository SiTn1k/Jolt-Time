/**
 * Update Player Profile DTO
 *
 * Data transfer object for updating an existing player profile.
 * Contains all optional update fields.
 */

import type { PlayerProfileStatus } from '../types/PlayerProfileStatus';
import type { PlayerStatistics } from '../types/PlayerStatistics';
import type { PlayerPreferences } from '../types/PlayerPreferences';
import type { PlayerProfileMetadata } from '../types/PlayerProfileMetadata';

/**
 * Input for updating a player profile.
 * All fields are optional - only provided fields will be updated.
 */
export interface UpdatePlayerProfileDto {
  /** Updated nickname */
  nickname?: string;

  /** Updated level */
  level?: number;

  /** Updated experience */
  experience?: number;

  /** Updated prestige */
  prestige?: number;

  /** Updated account age */
  accountAge?: number;

  /** Updated tutorial completion status */
  tutorialCompleted?: boolean;

  /** Updated status */
  status?: PlayerProfileStatus;

  /** Updated statistics */
  statistics?: PlayerStatistics;

  /** Updated preferences */
  preferences?: PlayerPreferences;

  /** Updated metadata */
  metadata?: PlayerProfileMetadata;

  /** Last client version */
  lastClientVersion?: string | null;

  /** Last platform */
  lastPlatform?: 'ios' | 'android' | 'web' | 'desktop' | null;
}

/**
 * Validation rules for UpdatePlayerProfileDto.
 */
export const UPDATE_PLAYER_PROFILE_VALIDATION = {
  nickname: {
    required: false,
    minLength: 3,
    maxLength: 32,
    pattern: /^[a-zA-Z0-9_]+$/,
  },
  level: {
    required: false,
    min: 1,
    max: 100,
  },
  experience: {
    required: false,
    min: 0,
    max: 999_999_999,
  },
  prestige: {
    required: false,
    min: 0,
    max: 100,
  },
  accountAge: {
    required: false,
    min: 0,
  },
  tutorialCompleted: {
    required: false,
  },
} as const;