/**
 * Notification Channel Type
 *
 * Supported notification delivery channels.
 */

/**
 * Notification channel types enum.
 * Each channel represents a different delivery mechanism.
 */
export enum NotificationChannelType {
  /** Telegram Bot API push notifications */
  TELEGRAM = 'Telegram',

  /** In-application notification center */
  IN_APP = 'InApp',

  /** Toast/popup notifications */
  TOAST = 'Toast',

  /** Inbox-style notification list */
  INBOX = 'Inbox',

  /** Push notifications (device-level) */
  PUSH = 'Push',

  /** System notifications (internal use) */
  SYSTEM = 'System',
}

/**
 * All valid notification channel types as a union type.
 */
export type NotificationChannelTypeValue = `${NotificationChannelType}`;