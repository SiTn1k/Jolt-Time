/**
 * Academy Interface
 *
 * Interface defining the contract for Academy entity.
 * All Academy implementations must adhere to this interface.
 */

import type { AcademyId } from '../value-objects/AcademyId';
import type { PlayerProfileId } from '../../player-profile/value-objects/PlayerProfileId';
import type { ResearchPoints } from '../value-objects/ResearchPoints';
import type { AcademyMetadata } from '../types/AcademyMetadata';

/**
 * Academy entity interface.
 * Represents a player's Academy in the Jolt Time system.
 */
export interface IAcademy {
  /** Unique academy identifier */
  readonly academyId: AcademyId;

  /** Associated player profile ID */
  readonly playerProfileId: PlayerProfileId;

  /** Current academy level */
  readonly academyLevel: number;

  /** Current research points */
  readonly researchPoints: ResearchPoints;

  /** Extended metadata */
  readonly metadata: AcademyMetadata;

  /** Timestamp when academy was created */
  readonly createdAt: Date;

  /** Timestamp when academy was last updated */
  readonly updatedAt: Date;

  /**
   * Gets the research points amount.
   */
  getPoints(): number;
}