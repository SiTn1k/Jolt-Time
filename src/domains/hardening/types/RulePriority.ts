/**
 * RulePriority Enum
 *
 * Priority levels for hardening rules.
 */

/**
 * Possible priority levels for a hardening rule.
 */
export enum RulePriority {
  /** Critical priority - must be implemented before release */
  CRITICAL = 1,
  /** High priority - should be implemented before release */
  HIGH = 2,
  /** Medium priority - should be implemented post-release */
  MEDIUM = 3,
  /** Low priority - nice to have */
  LOW = 4,
}

/**
 * Display labels for rule priorities.
 */
export const RULE_PRIORITY_DISPLAY: Record<RulePriority, string> = {
  [RulePriority.CRITICAL]: 'Critical',
  [RulePriority.HIGH]: 'High',
  [RulePriority.MEDIUM]: 'Medium',
  [RulePriority.LOW]: 'Low',
};

/**
 * Descriptions for rule priorities.
 */
export const RULE_PRIORITY_DESCRIPTIONS: Record<RulePriority, string> = {
  [RulePriority.CRITICAL]: 'Must be implemented before production release',
  [RulePriority.HIGH]: 'Should be implemented before production release',
  [RulePriority.MEDIUM]: 'Should be implemented post-release',
  [RulePriority.LOW]: 'Nice to have, can be deferred',
};

/**
 * Checks if a priority is considered high (critical or high).
 */
export function isHighPriority(priority: RulePriority): boolean {
  return priority === RulePriority.CRITICAL || priority === RulePriority.HIGH;
}

/**
 * Compares two priorities for sorting (lower number = higher priority).
 */
export function comparePriority(a: RulePriority, b: RulePriority): number {
  return a - b;
}
