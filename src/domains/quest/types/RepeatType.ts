/**
 * Repeat Type
 *
 * Defines how a quest repeats.
 */

/**
 * Repeat type values.
 */
export enum RepeatType {
  /** Quest does not repeat */
  NONE = 'none',
  /** Quest resets daily */
  DAILY = 'daily',
  /** Quest resets weekly */
  WEEKLY = 'weekly',
  /** Quest resets monthly */
  MONTHLY = 'monthly',
  /** Quest is seasonal */
  SEASONAL = 'seasonal',
}

/**
 * Repeat type display names.
 */
export const REPEAT_TYPE_DISPLAY: Record<RepeatType, string> = {
  [RepeatType.NONE]: 'No Repeat',
  [RepeatType.DAILY]: 'Daily',
  [RepeatType.WEEKLY]: 'Weekly',
  [RepeatType.MONTHLY]: 'Monthly',
  [RepeatType.SEASONAL]: 'Seasonal',
};

/**
 * Checks if a repeat type indicates a repeating quest.
 */
export function isRepeating(repeatType: RepeatType): boolean {
  return repeatType !== RepeatType.NONE;
}
