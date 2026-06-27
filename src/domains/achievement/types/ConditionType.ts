/**
 * Condition Type Type
 *
 * Defines the type of condition for achievement completion.
 */

/**
 * Condition types.
 */
export enum ConditionType {
  /** Simple count-based condition */
  COUNT = 'count',
  /** Accumulated value condition */
  ACCUMULATE = 'accumulate',
  /** Unique items collected */
  COLLECT_UNIQUE = 'collect_unique',
  /** milestones reached */
  MILESTONE = 'milestone',
  /** Streak-based condition */
  STREAK = 'streak',
  /** Time-based condition */
  TIME = 'time',
  /** Player level condition */
  LEVEL = 'level',
  /** Currency threshold condition */
  CURRENCY = 'currency',
  /** Artifact collection condition */
  ARTIFACT = 'artifact',
  /** Museum completion condition */
  MUSEUM = 'museum',
  /** Quest completion condition */
  QUEST = 'quest',
}

/**
 * Condition type display names.
 */
export const CONDITION_TYPE_DISPLAY: Record<ConditionType, string> = {
  [ConditionType.COUNT]: 'Count',
  [ConditionType.ACCUMULATE]: 'Accumulate',
  [ConditionType.COLLECT_UNIQUE]: 'Collect Unique',
  [ConditionType.MILESTONE]: 'Milestone',
  [ConditionType.STREAK]: 'Streak',
  [ConditionType.TIME]: 'Time',
  [ConditionType.LEVEL]: 'Level',
  [ConditionType.CURRENCY]: 'Currency',
  [ConditionType.ARTIFACT]: 'Artifact',
  [ConditionType.MUSEUM]: 'Museum',
  [ConditionType.QUEST]: 'Quest',
};

/**
 * Checks if a condition type requires a target identifier.
 */
export function requiresTargetIdentifier(conditionType: ConditionType): boolean {
  return [
    ConditionType.COLLECT_UNIQUE,
    ConditionType.ARTIFACT,
    ConditionType.MUSEUM,
    ConditionType.QUEST,
  ].includes(conditionType);
}

/**
 * Checks if a condition type is time-based.
 */
export function isTimeBasedCondition(conditionType: ConditionType): boolean {
  return conditionType === ConditionType.TIME || conditionType === ConditionType.STREAK;
}
