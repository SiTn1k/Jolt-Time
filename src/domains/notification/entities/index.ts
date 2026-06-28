/**
 * Notification Domain Entities
 *
 * Exports all entities for the notification domain.
 */

export { Notification } from './Notification';
export type { NotificationProps, NotificationRecord, NotificationJSON } from './Notification';

export { NotificationTemplate } from './NotificationTemplate';
export type {
  NotificationTemplateProps,
  NotificationTemplateRecord,
  NotificationTemplateJSON,
} from './NotificationTemplate';

export { NotificationChannel } from './NotificationChannel';
export type {
  NotificationChannelProps,
  NotificationChannelRecord,
  NotificationChannelJSON,
} from './NotificationChannel';