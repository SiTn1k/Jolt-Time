/**
 * SchedulerPriority
 *
 * Defines the priority level for a scheduled job.
 */

export type SchedulerPriority =
  | 'low'
  | 'normal'
  | 'high'
  | 'critical';

export const SCHEDULER_PRIORITY_DISPLAY: Record<SchedulerPriority, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
  critical: 'Critical',
};

export const SCHEDULER_PRIORITY_VALUES: Record<SchedulerPriority, number> = {
  low: 1,
  normal: 5,
  high: 10,
  critical: 20,
};

export const SCHEDULER_PRIORITY_COLORS: Record<SchedulerPriority, string> = {
  low: '#9ca3af',
  normal: '#3b82f6',
  high: '#f59e0b',
  critical: '#ef4444',
};

/**
 * Gets the numeric value of a priority.
 */
export function getPriorityValue(priority: SchedulerPriority): number {
  return SCHEDULER_PRIORITY_VALUES[priority];
}

/**
 * Compares two priorities.
 * Returns negative if a < b, zero if equal, positive if a > b.
 */
export function comparePriorities(a: SchedulerPriority, b: SchedulerPriority): number {
  return SCHEDULER_PRIORITY_VALUES[a] - SCHEDULER_PRIORITY_VALUES[b];
}

/**
 * Checks if priority a is higher than priority b.
 */
export function isHigherPriority(a: SchedulerPriority, b: SchedulerPriority): boolean {
  return SCHEDULER_PRIORITY_VALUES[a] > SCHEDULER_PRIORITY_VALUES[b];
}

/**
 * Default priority for new jobs.
 */
export const DEFAULT_SCHEDULER_PRIORITY: SchedulerPriority = 'normal';
