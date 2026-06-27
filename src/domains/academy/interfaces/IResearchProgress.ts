/**
 * ResearchProgress Interface
 *
 * Interface defining the contract for ResearchProgress entity.
 * All ResearchProgress implementations must adhere to this interface.
 */

import type { AcademyId } from '../value-objects/AcademyId';
import type { ResearchNodeId } from '../value-objects/ResearchNodeId';
import type { ResearchProgressValue } from '../value-objects/ResearchProgressValue';
import type { ResearchStatus } from '../types/ResearchStatus';

/**
 * ResearchProgress entity interface.
 * Represents a player's progress on a specific research node.
 */
export interface IResearchProgress {
  /** Unique progress identifier */
  readonly progressId: string;

  /** Associated academy ID */
  readonly academyId: AcademyId;

  /** Research node ID being progressed */
  readonly nodeId: ResearchNodeId;

  /** Current research status */
  readonly status: ResearchStatus;

  /** Progress percentage (0-100) */
  readonly progress: ResearchProgressValue;

  /** Timestamp when research was completed */
  readonly completedAt: Date | null;

  /** Extended metadata */
  readonly metadata: Record<string, unknown>;

  /**
   * Checks if research is complete.
   */
  readonly isComplete: boolean;

  /**
   * Checks if research is in progress.
   */
  readonly isInProgress: boolean;

  /**
   * Checks if research is locked.
   */
  readonly isLocked: boolean;

  /**
   * Checks if research is available.
   */
  readonly isAvailable: boolean;
}