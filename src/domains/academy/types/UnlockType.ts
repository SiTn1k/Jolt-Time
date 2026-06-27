/**
 * Unlock Type
 *
 * Defines how a research node can be unlocked.
 */

export enum UnlockType {
  /** Unlocked by default for all players */
  DEFAULT = 'default',
  /** Unlocked by completing other research nodes */
  RESEARCH_COMPLETION = 'research_completion',
  /** Unlocked by reaching a specific academy level */
  LEVEL_REQUIREMENT = 'level_requirement',
  /** Unlocked by spending research points */
  RESEARCH_POINTS = 'research_points',
  /** Unlocked by completing specific quests */
  QUEST_COMPLETION = 'quest_completion',
  /** Unlocked by collecting specific artifacts */
  ARTIFACT_COLLECTION = 'artifact_collection',
  /** Unlocked during special events */
  EVENT = 'event',
}

/**
 * Checks if an unlock type requires prerequisites.
 */
export function requiresPrerequisites(unlockType: UnlockType): boolean {
  return unlockType !== UnlockType.DEFAULT && unlockType !== UnlockType.EVENT;
}

/**
 * Checks if an unlock type requires spending resources.
 */
export function requiresResources(unlockType: UnlockType): boolean {
  return unlockType === UnlockType.RESEARCH_POINTS;
}