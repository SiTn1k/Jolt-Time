/**
 * Player Profile Interface
 *
 * Interface defining the contract for PlayerProfile entity.
 * All PlayerProfile implementations must adhere to this interface.
 */

import type { PlayerProfileId } from '../value-objects/PlayerProfileId';
import type { PlayerNickname } from '../value-objects/PlayerNickname';
import type { PlayerLevel } from '../value-objects/PlayerLevel';
import type { PlayerExperience } from '../value-objects/PlayerExperience';
import type { PrestigeLevel } from '../value-objects/PrestigeLevel';
import type { PlayerProfileStatus } from '../types/PlayerProfileStatus';
import type { PlayerStatistics } from '../types/PlayerStatistics';
import type { PlayerPreferences } from '../types/PlayerPreferences';
import type { PlayerProfileMetadata } from '../types/PlayerProfileMetadata';

/**
 * PlayerProfile entity interface.
 * Represents a player's gameplay profile in the Jolt Time system.
 */
export interface IPlayerProfile {
  /** Unique internal profile identifier */
  readonly profileId: PlayerProfileId;

  /** Associated user ID */
  readonly userId: string;

  /** Player's in-game nickname */
  readonly nickname: PlayerNickname;

  /** Current player level */
  readonly level: PlayerLevel;

  /** Total accumulated experience */
  readonly experience: PlayerExperience;

  /** Current prestige level */
  readonly prestige: PrestigeLevel;

  /** Account age in days */
  readonly accountAge: number;

  /** Whether tutorial has been completed */
  readonly tutorialCompleted: boolean;

  /** Profile schema version */
  readonly profileVersion: number;

  /** Profile status */
  readonly status: PlayerProfileStatus;

  /** Player statistics */
  readonly statistics: PlayerStatistics;

  /** Player preferences */
  readonly preferences: PlayerPreferences;

  /** Profile metadata */
  readonly metadata: PlayerProfileMetadata;

  /** Timestamp when profile was created */
  readonly createdAt: Date;

  /** Timestamp when profile was last updated */
  readonly updatedAt: Date;
}