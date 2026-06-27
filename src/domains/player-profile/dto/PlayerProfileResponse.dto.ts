/**
 * Player Profile Response DTO
 *
 * Data transfer object for returning player profile data to clients.
 * Contains sanitized profile data suitable for API responses.
 */

import type { PlayerProfileStatus } from '../types/PlayerProfileStatus';
import type { PlayerStatistics } from '../types/PlayerStatistics';
import type { PlayerPreferences } from '../types/PlayerPreferences';
import type { PlayerProfileMetadata } from '../types/PlayerProfileMetadata';

/**
 * Full player profile response DTO.
 */
export interface PlayerProfileResponseDto {
  /** Unique profile identifier */
  profileId: string;

  /** Associated user ID */
  userId: string;

  /** Player's in-game nickname */
  nickname: string;

  /** Current level */
  level: number;

  /** Current experience */
  experience: number;

  /** Experience progress within current level (0-999) */
  experienceWithinLevel: number;

  /** Experience required for next level */
  experienceForNextLevel: number;

  /** Progress to next level percentage (0-100) */
  progressToNextLevel: number;

  /** Current prestige level */
  prestige: number;

  /** Account age in days */
  accountAge: number;

  /** Whether tutorial is completed */
  tutorialCompleted: boolean;

  /** Profile version */
  profileVersion: number;

  /** Profile status */
  status: PlayerProfileStatus;

  /** Player statistics */
  statistics: PlayerStatistics;

  /** Player preferences */
  preferences: PlayerPreferences;

  /** Profile metadata */
  metadata: PlayerProfileMetadata;

  /** Creation timestamp */
  createdAt: string;

  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Summary player profile response DTO.
 * Lightweight version for lists and previews.
 */
export interface PlayerProfileSummaryDto {
  /** Unique profile identifier */
  profileId: string;

  /** Player's in-game nickname */
  nickname: string;

  /** Current level */
  level: number;

  /** Current prestige */
  prestige: number;

  /** Whether tutorial is completed */
  tutorialCompleted: boolean;

  /** Profile status */
  status: PlayerProfileStatus;
}