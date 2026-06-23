/**
 * NotificationService
 * 
 * Core service for managing notification scheduling and delivery.
 * Handles:
 * - Scheduling notifications with deduplication
 * - Cooldown management to prevent notification spam
 * - Sending notifications via Telegram Bot API
 * - Tracking delivery status
 * 
 * This service does NOT handle inactive player detection - see InactivePlayerService.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  NotificationType,
  NotificationStatus,
  NotificationCategory,
  NOTIFICATION_TYPE_TO_CATEGORY,
  NOTIFICATION_COOLDOWNS,
  ScheduleNotificationParams
} from '../types/notifications';
import { getNotificationMessage, generateDeduplicationKey } from './notification-messages';

// Telegram Bot API configuration
const TELEGRAM_API_URL = 'https://api.telegram.org';

// Cooldown durations in minutes for different notification categories
const CATEGORY_COOLDOWNS: Record<NotificationCategory, number> = {
  [NotificationCategory.DAILY_REMINDERS]: 60,      // 1 hour
  [NotificationCategory.EVENTS]: 30,               // 30 minutes
  [NotificationCategory.RESEARCH_COMPLETE]: 30,    // 30 minutes
  [NotificationCategory.ENERGY_RESTORED]: 30,      // 30 minutes
  [NotificationCategory.BUILDING_COMPLETE]: 30,    // 30 minutes
  [NotificationCategory.MARKETING]: 60 * 24       // 24 hours
};

export class NotificationService {
  private supabase: SupabaseClient;
  private telegramBotToken: string;

  constructor(supabaseUrl: string, supabaseKey: string, telegramBotToken: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.telegramBotToken = telegramBotToken;
  }

  /**
   * Schedule a notification for a user.
   * 
   * This method:
   * 1. Checks if user has notifications enabled
   * 2. Checks if user's notification category is enabled
   * 3. Checks for cooldown violations
   * 4. Checks for duplicate notifications
   * 5. Inserts notification into queue
   * 
   * @param params - ScheduleNotificationParams
   * @returns The created notification or null if skipped
   */
  async scheduleNotification(params: ScheduleNotificationParams): Promise<string | null> {
    const { userId, type, title, message, scheduledAt, deduplicationKey } = params;

    // 1. Fetch user data to check preferences
    const { data: user, error: userError } = await this.supabase
      .from('users')
      .select('id, chat_id, notifications_enabled')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      console.error('User not found:', userError);
      return null;
    }

    // 2. Check if global notifications are enabled
    if (!user.notifications_enabled) {
      console.log(`Notifications disabled for user ${userId}`);
      return null;
    }

    // 3. Check if user has a chat_id (required for Telegram)
    if (!user.chat_id) {
      console.log(`No chat_id for user ${userId}`);
      return null;
    }

    // 4. Check user's notification category preference
    const category = NOTIFICATION_TYPE_TO_CATEGORY[type];
    const prefsEnabled = await this.isCategoryEnabled(userId, category);
    if (!prefsEnabled) {
      console.log(`Category ${category} disabled for user ${userId}`);
      return null;
    }

    // 5. Check cooldown for this notification type
    const isInCooldown = await this.isInCooldown(userId, type);
    if (isInCooldown) {
      console.log(`Notification ${type} in cooldown for user ${userId}`);
      return null;
    }

    // 6. Check for duplicate notifications using deduplication key
    if (deduplicationKey) {
      const isDuplicate = await this.isDuplicate(userId, deduplicationKey);
      if (isDuplicate) {
        console.log(`Duplicate notification detected for user ${userId}: ${deduplicationKey}`);
        return null;
      }
    }

    // 7. Insert notification into queue
    const { data, error } = await this.supabase
      .from('notifications_queue')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        status: NotificationStatus.PENDING,
        scheduled_at: scheduledAt || new Date().toISOString(),
        deduplication_key: deduplicationKey || generateDeduplicationKey(type, userId)
      })
      .select('id')
      .single();

    if (error) {
      console.error('Failed to schedule notification:', error);
      return null;
    }

    console.log(`Notification scheduled: ${data.id}`);
    return data.id;
  }

  /**
   * Schedule a notification using type and automatic message generation.
   */
  async scheduleTypedNotification(
    userId: string,
    type: NotificationType,
    messageParams?: Record<string, string | number | boolean>,
    context?: string
  ): Promise<string | null> {
    const { title, message } = getNotificationMessage(type, messageParams || {});
    const deduplicationKey = generateDeduplicationKey(type, userId, context);

    return this.scheduleNotification({
      userId,
      type,
      title,
      message,
      deduplicationKey
    });
  }

  /**
   * Send a notification immediately to a user via Telegram.
   * 
   * This bypasses the queue and sends directly.
   * Used for time-critical notifications.
   * 
   * @param userId - User ID
   * @param type - Notification type
   * @param title - Notification title
   * @param message - Notification message
   * @returns true if sent successfully
   */
  async sendNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string
  ): Promise<boolean> {
    // Fetch user's chat_id
    const { data: user, error } = await this.supabase
      .from('users')
      .select('chat_id, notifications_enabled')
      .eq('id', userId)
      .single();

    if (error || !user || !user.chat_id) {
      console.error('Cannot send notification - user not found or no chat_id');
      return false;
    }

    if (!user.notifications_enabled) {
      console.log('Notifications disabled for user');
      return false;
    }

    try {
      // Send via Telegram Bot API
      const response = await fetch(
        `${TELEGRAM_API_URL}/bot${this.telegramBotToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: user.chat_id,
            text: `${title}\n\n${message}`,
            parse_mode: 'HTML'
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Telegram API error:', errorData);
        
        // Mark as failed if it's a valid Telegram error (not network issue)
        if (response.status >= 400 && response.status < 500) {
          await this.markAsFailedByUser(userId, type, errorData.description || 'Telegram API error');
        }
        return false;
      }

      // Update last_notification_at timestamp
      await this.supabase
        .from('users')
        .update({ last_notification_at: new Date().toISOString() })
        .eq('id', userId);

      // Set cooldown after successful send
      await this.setCooldown(userId, type);

      return true;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }

  /**
   * Mark a notification as sent in the database.
   * 
   * @param notificationId - The notification ID from notifications_queue
   */
  async markAsSent(notificationId: string): Promise<void> {
    const { error } = await this.supabase
      .from('notifications_queue')
      .update({
        status: NotificationStatus.SENT,
        sent_at: new Date().toISOString()
      })
      .eq('id', notificationId);

    if (error) {
      console.error('Failed to mark notification as sent:', error);
    }

    // Get notification details to update user and set cooldown
    const { data } = await this.supabase
      .from('notifications_queue')
      .select('user_id, type')
      .eq('id', notificationId)
      .single();

    if (data) {
      // Update user's last_notification_at
      await this.supabase
        .from('users')
        .update({ last_notification_at: new Date().toISOString() })
        .eq('id', data.user_id);

      // Set cooldown for this notification type
      await this.setCooldown(data.user_id, data.type as NotificationType);
    }
  }

  /**
   * Mark a notification as failed in the database.
   * 
   * @param notificationId - The notification ID from notifications_queue
   * @param errorMessage - Optional error message to store
   */
  async markAsFailed(notificationId: string, errorMessage?: string): Promise<void> {
    const { error } = await this.supabase
      .from('notifications_queue')
      .update({
        status: NotificationStatus.FAILED,
        error_message: errorMessage,
        retry_count: this.supabase
          .from('notifications_queue')
          .select('retry_count')
          .eq('id', notificationId)
      })
      .eq('id', notificationId);

    if (error) {
      console.error('Failed to mark notification as failed:', error);
    }
  }

  /**
   * Process pending notifications from the queue.
   * 
   * This should be called by a cron job periodically (e.g., every minute).
   * It fetches pending notifications scheduled for now or earlier and sends them.
   */
  async processPendingNotifications(batchSize: number = 100): Promise<{ sent: number; failed: number }> {
    const now = new Date().toISOString();
    let sent = 0;
    let failed = 0;

    // Fetch pending notifications that are due
    const { data: notifications, error } = await this.supabase
      .from('notifications_queue')
      .select('*')
      .eq('status', NotificationStatus.PENDING)
      .lte('scheduled_at', now)
      .order('scheduled_at', { ascending: true })
      .limit(batchSize);

    if (error) {
      console.error('Failed to fetch pending notifications:', error);
      return { sent, failed };
    }

    for (const notification of notifications || []) {
      const success = await this.sendNotification(
        notification.user_id,
        notification.type as NotificationType,
        notification.title,
        notification.message
      );

      if (success) {
        await this.markAsSent(notification.id);
        sent++;
      } else {
        failed++;
        // Only mark as failed after multiple attempts
        if (notification.retry_count >= 3) {
          await this.markAsFailed(notification.id, 'Max retries exceeded');
        }
      }
    }

    return { sent, failed };
  }

  /**
   * Check if a notification category is enabled for a user.
   */
  private async isCategoryEnabled(userId: string, category: NotificationCategory): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('notification_preferences')
      .select(category)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      // If no preferences found, default to enabled (true)
      return true;
    }

    return data[category] === true;
  }

  /**
   * Check if a notification type is in cooldown for a user.
   */
  private async isInCooldown(userId: string, type: NotificationType): Promise<boolean> {
    const cooldownMinutes = NOTIFICATION_COOLDOWNS[type];
    const cooldownExpiresAt = new Date(Date.now() - cooldownMinutes * 60 * 1000).toISOString();

    const { data } = await this.supabase
      .from('notification_cooldowns')
      .select('id')
      .eq('user_id', userId)
      .eq('notification_type', type)
      .gt('cooldown_expires_at', cooldownExpiresAt)
      .single();

    return !!data;
  }

  /**
   * Set a cooldown for a notification type after successful send.
   */
  private async setCooldown(userId: string, type: NotificationType): Promise<void> {
    const cooldownMinutes = NOTIFICATION_COOLDOWNS[type];
    const cooldownExpiresAt = new Date(Date.now() + cooldownMinutes * 60 * 1000).toISOString();

    await this.supabase
      .from('notification_cooldowns')
      .upsert({
        user_id: userId,
        notification_type: type,
        cooldown_expires_at: cooldownExpiresAt
      }, {
        onConflict: 'user_id,notification_type'
      });
  }

  /**
   * Check if a notification is a duplicate using deduplication key.
   */
  private async isDuplicate(userId: string, deduplicationKey: string): Promise<boolean> {
    // Check if a notification with the same deduplication key exists in recent time
    // (within the cooldown period)
    const recentWindow = new Date(Date.now() - 60 * 60 * 1000).toISOString(); // 1 hour window

    const { data } = await this.supabase
      .from('notifications_queue')
      .select('id')
      .eq('user_id', userId)
      .eq('deduplication_key', deduplicationKey)
      .gte('created_at', recentWindow)
      .single();

    return !!data;
  }

  /**
   * Mark a user's notification as failed (used for direct sends).
   */
  private async markAsFailedByUser(userId: string, type: NotificationType, errorMessage: string): Promise<void> {
    // Find the most recent pending notification of this type for this user
    const { data } = await this.supabase
      .from('notifications_queue')
      .select('id')
      .eq('user_id', userId)
      .eq('type', type)
      .eq('status', NotificationStatus.PENDING)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      await this.markAsFailed(data.id, errorMessage);
    }
  }
}

// Singleton instance for use throughout the app
let notificationServiceInstance: NotificationService | null = null;

export function getNotificationService(
  supabaseUrl?: string,
  supabaseKey?: string,
  telegramBotToken?: string
): NotificationService {
  if (!notificationServiceInstance) {
    const url = supabaseUrl || process.env.SUPABASE_URL;
    const key = supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY;
    const token = telegramBotToken || process.env.TELEGRAM_BOT_TOKEN;

    if (!url || !key || !token) {
      throw new Error('Missing required environment variables for NotificationService');
    }

    notificationServiceInstance = new NotificationService(url, key, token);
  }

  return notificationServiceInstance;
}
