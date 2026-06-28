/**
 * Notification Domain Types
 *
 * Exports all type definitions for the notification domain.
 */

export { NotificationChannelType } from './NotificationChannelType';
export type { NotificationChannelTypeValue } from './NotificationChannelType';
export { NotificationPriority, NOTIFICATION_PRIORITY_CONFIGS } from './NotificationPriority';
export type { NotificationPriorityConfig } from './NotificationPriority';
export {
  NotificationStatus,
  NotificationStatusCategory,
  STATUS_TO_CATEGORY,
  TERMINAL_STATUSES,
  QUEUED_STATUSES,
} from './NotificationStatus';
export { DEFAULT_NOTIFICATION_METADATA } from './NotificationMetadata';
export type { NotificationMetadata } from './NotificationMetadata';
export { INITIAL_NOTIFICATION_STATISTICS } from './NotificationStatistics';
export type { NotificationStatistics, NotificationStatisticsSummary } from './NotificationStatistics';