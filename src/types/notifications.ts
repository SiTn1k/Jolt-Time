/**
 * Notification Types and Enums
 * 
 * This file defines all notification-related types for the Jolt Time Telegram Mini App.
 * Notifications are categorized by their trigger source and mapped to user preferences.
 */

/**
 * Notification type identifiers.
 * Each type corresponds to a specific game event or reminder.
 */
export enum NotificationType {
  // Daily/Weekly Rewards
  DAILY_REWARD = 'daily_reward',
  WEEKLY_BONUS = 'weekly_bonus',
  
  // Game Events
  ENERGY_RESTORED = 'energy_restored',
  EXPEDITION_FINISHED = 'expedition_finished',
  RESEARCH_COMPLETED = 'research_completed',
  BUILDING_COMPLETED = 'building_completed',
  EVENT_STARTED = 'event_started',
  
  // Inactive Player Reminders
  INACTIVE_24H = 'inactive_24h',
  INACTIVE_72H = 'inactive_72h',
  INACTIVE_7D = 'inactive_7d',
  
  // System Notifications
  SYSTEM_MESSAGE = 'system_message'
}

/**
 * Notification status in the queue.
 * - pending: Scheduled but not yet sent
 * - sent: Successfully delivered to user
 * - failed: Delivery failed after all retries
 */
export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed'
}

/**
 * Notification categories that map to user preference switches.
 * Each category can be independently enabled/disabled by users.
 */
export enum NotificationCategory {
  DAILY_REMINDERS = 'daily_reminders',     // Daily reward, weekly bonus
  EVENTS = 'events',                       // Event started
  RESEARCH_COMPLETE = 'research_complete', // Academy research completed
  ENERGY_RESTORED = 'energy_restored',     // Energy restored
  BUILDING_COMPLETE = 'building_complete', // Building upgrade completed
  MARKETING = 'marketing'                   // Marketing notifications
}

/**
 * Maps notification types to their corresponding user preference categories.
 * Used to check if user has enabled a specific notification category.
 */
export const NOTIFICATION_TYPE_TO_CATEGORY: Record<NotificationType, NotificationCategory> = {
  [NotificationType.DAILY_REWARD]: NotificationCategory.DAILY_REMINDERS,
  [NotificationType.WEEKLY_BONUS]: NotificationCategory.DAILY_REMINDERS,
  [NotificationType.ENERGY_RESTORED]: NotificationCategory.ENERGY_RESTORED,
  [NotificationType.EXPEDITION_FINISHED]: NotificationCategory.EVENTS,
  [NotificationType.RESEARCH_COMPLETED]: NotificationCategory.RESEARCH_COMPLETE,
  [NotificationType.BUILDING_COMPLETED]: NotificationCategory.BUILDING_COMPLETE,
  [NotificationType.EVENT_STARTED]: NotificationCategory.EVENTS,
  [NotificationType.INACTIVE_24H]: NotificationCategory.DAILY_REMINDERS,
  [NotificationType.INACTIVE_72H]: NotificationCategory.DAILY_REMINDERS,
  [NotificationType.INACTIVE_7D]: NotificationCategory.DAILY_REMINDERS,
  [NotificationType.SYSTEM_MESSAGE]: NotificationCategory.DAILY_REMINDERS
};

/**
 * Cooldown periods for each notification type in minutes.
 * Prevents spamming the same notification type within the cooldown period.
 */
export const NOTIFICATION_COOLDOWNS: Record<NotificationType, number> = {
  [NotificationType.DAILY_REWARD]: 60 * 24,        // 24 hours
  [NotificationType.WEEKLY_BONUS]: 60 * 24 * 7,   // 7 days
  [NotificationType.ENERGY_RESTORED]: 30,          // 30 minutes
  [NotificationType.EXPEDITION_FINISHED]: 15,      // 15 minutes
  [NotificationType.RESEARCH_COMPLETED]: 30,       // 30 minutes
  [NotificationType.BUILDING_COMPLETED]: 15,       // 15 minutes
  [NotificationType.EVENT_STARTED]: 60 * 12,       // 12 hours
  [NotificationType.INACTIVE_24H]: 60 * 24,        // 24 hours
  [NotificationType.INACTIVE_72H]: 60 * 24,        // 24 hours
  [NotificationType.INACTIVE_7D]: 60 * 24,         // 24 hours
  [NotificationType.SYSTEM_MESSAGE]: 60            // 1 hour
};

/**
 * Interface for scheduled notification data.
 */
export interface ScheduleNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  scheduledAt?: Date;
  deduplicationKey?: string;
}

/**
 * Interface for notification queue item from database.
 */
export interface NotificationQueueItem {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  status: NotificationStatus;
  scheduled_at: Date | null;
  sent_at: Date | null;
  created_at: Date;
  deduplication_key: string | null;
  error_message: string | null;
  retry_count: number;
}

/**
 * Interface for user notification preferences.
 */
export interface NotificationPreferences {
  id: string;
  user_id: string;
  daily_reminders: boolean;
  events: boolean;
  research_complete: boolean;
  energy_restored: boolean;
  building_complete: boolean;
  marketing: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Interface for user telegram data.
 */
export interface UserTelegramData {
  id: string;
  telegram_id: number;
  username: string | null;
  chat_id: number;
  notifications_enabled: boolean;
  last_notification_at: Date | null;
  last_active_at: Date;
}
