/**
 * ScheduleType
 *
 * Defines the type of scheduling for a job.
 */

export type ScheduleType =
  | 'cron'
  | 'interval'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'manual'
  | 'startup';

export const SCHEDULE_TYPE_DISPLAY: Record<ScheduleType, string> = {
  cron: 'Cron Expression',
  interval: 'Interval',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  manual: 'Manual',
  startup: 'On Startup',
};

export const SCHEDULE_TYPE_DESCRIPTIONS: Record<ScheduleType, string> = {
  cron: 'Job runs based on a cron expression',
  interval: 'Job runs at fixed intervals',
  daily: 'Job runs once per day',
  weekly: 'Job runs once per week',
  monthly: 'Job runs once per month',
  manual: 'Job must be triggered manually',
  startup: 'Job runs on application startup',
};

/**
 * Checks if a schedule type requires a cron expression.
 */
export function requiresCronExpression(scheduleType: ScheduleType): boolean {
  return scheduleType === 'cron';
}

/**
 * Checks if a schedule type requires an interval value.
 */
export function requiresInterval(scheduleType: ScheduleType): boolean {
  return scheduleType === 'interval';
}

/**
 * Checks if a schedule type is time-based (daily, weekly, monthly).
 */
export function isTimeBasedSchedule(scheduleType: ScheduleType): boolean {
  return scheduleType === 'daily' || scheduleType === 'weekly' || scheduleType === 'monthly';
}

/**
 * Checks if a schedule type is dynamic (manual or startup).
 */
export function isDynamicSchedule(scheduleType: ScheduleType): boolean {
  return scheduleType === 'manual' || scheduleType === 'startup';
}
