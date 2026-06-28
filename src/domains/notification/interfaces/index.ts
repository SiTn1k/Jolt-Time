/**
 * Notification Domain Interfaces
 *
 * Exports all interfaces for the notification domain.
 */

export type { INotification, NotificationPayload } from './INotification';
export type { INotificationTemplate, NotificationTemplateMetadata } from './INotificationTemplate';
export type {
  INotificationChannel,
  NotificationChannelConfiguration,
  NotificationChannelMetadata,
} from './INotificationChannel';
export type {
  INotificationRepository,
  NotificationQueryFilters,
  TemplateQueryFilters,
  ChannelQueryFilters,
} from './INotificationRepository';