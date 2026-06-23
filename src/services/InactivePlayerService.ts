/**
 * InactivePlayerService
 * 
 * Service for detecting inactive players and sending reminder notifications.
 * 
 * Inactivity is tracked based on the last_active_at timestamp on the users table.
 * This service should be run periodically via cron job to:
 * - Identify users who haven't been active in 24h, 72h, or 7 days
 * - Schedule appropriate reminder notifications
 * 
 * CRITICAL: Users who have been sent a reminder will not receive the same
 * reminder again until the cooldown expires (24 hours).
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NotificationType } from '../types/notifications';
import { NotificationService } from './NotificationService';

// Inactivity thresholds in hours
const INACTIVITY_THRESHOLDS = {
  24: 24,   // 24 hours
  72: 72,   // 72 hours (3 days)
  168: 168  // 168 hours (7 days)
};

export interface InactivePlayerResult {
  processed24h: number;
  processed72h: number;
  processed7d: number;
  errors: string[];
}

export class InactivePlayerService {
  private supabase: SupabaseClient;
  private notificationService: NotificationService;

  constructor(
    supabaseUrl: string,
    supabaseKey: string,
    telegramBotToken: string
  ) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.notificationService = new NotificationService(supabaseUrl, supabaseKey, telegramBotToken);
  }

  /**
   * Process inactive players and send reminder notifications.
   * 
   * This method:
   * 1. Finds users who are 24h, 72h, or 7d inactive
   * 2. Checks if they should receive reminders (based on cooldowns)
   * 3. Schedules appropriate notifications
   * 
   * @returns InactivePlayerResult with counts of processed users
   */
  async processInactivePlayers(): Promise<InactivePlayerResult> {
    const result: InactivePlayerResult = {
      processed24h: 0,
      processed72h: 0,
      processed7d: 0,
      errors: []
    };

    try {
      // Process each inactivity tier
      const processed24h = await this.processInactiveTier(24, NotificationType.INACTIVE_24H);
      result.processed24h = processed24h;

      const processed72h = await this.processInactiveTier(72, NotificationType.INACTIVE_72H);
      result.processed72h = processed72h;

      const processed7d = await this.processInactiveTier(168, NotificationType.INACTIVE_7D);
      result.processed7d = processed7d;

    } catch (error) {
      result.errors.push(`Failed to process inactive players: ${error}`);
      console.error('Failed to process inactive players:', error);
    }

    return result;
  }

  /**
   * Process a specific inactivity tier (e.g., 24h, 72h, 7d).
   * 
   * Logic:
   * 1. Find users who became inactive within this tier window
   *    (e.g., for 24h: users whose last_active_at is between 23h and 25h ago)
   * 2. Exclude users who already received this reminder (checked via cooldown)
   * 3. Schedule notification for eligible users
   * 
   * @param hoursAgo - Tier threshold in hours (24, 72, or 168)
   * @param notificationType - Type of notification to send
   * @returns Number of notifications scheduled
   */
  private async processInactiveTier(
    hoursAgo: number,
    notificationType: NotificationType
  ): Promise<number> {
    const now = new Date();
    const windowStart = new Date(now.getTime() - (hoursAgo + 1) * 60 * 60 * 1000); // e.g., 25h ago
    const windowEnd = new Date(now.getTime() - (hoursAgo - 1) * 60 * 60 * 1000);   // e.g., 23h ago

    // Find users who became inactive within this specific window
    // This prevents sending multiple reminders as time passes
    const { data: inactiveUsers, error } = await this.supabase
      .from('users')
      .select('id, telegram_id, chat_id, notifications_enabled, last_active_at')
      .eq('notifications_enabled', true)
      .not('chat_id', 'is', null)
      .gte('last_active_at', windowStart.toISOString())
      .lte('last_active_at', windowEnd.toISOString());

    if (error) {
      console.error(`Failed to fetch ${hoursAgo}h inactive users:`, error);
      throw error;
    }

    if (!inactiveUsers || inactiveUsers.length === 0) {
      return 0;
    }

    let scheduled = 0;

    for (const user of inactiveUsers) {
      try {
        // Check if user is already in cooldown for this notification type
        const isInCooldown = await this.isInCooldown(user.id, notificationType);
        if (isInCooldown) {
          continue; // Skip users who already received this reminder recently
        }

        // Schedule the notification
        const notificationId = await this.notificationService.scheduleTypedNotification(
          user.id,
          notificationType,
          {
            lastActive: new Date(user.last_active_at).toLocaleDateString()
          }
        );

        if (notificationId) {
          scheduled++;
        }
      } catch (error) {
        console.error(`Failed to schedule ${notificationType} for user ${user.id}:`, error);
      }
    }

    console.log(`Scheduled ${scheduled} ${notificationType} notifications for ${hoursAgo}h inactive users`);
    return scheduled;
  }

  /**
   * Check if a user is in cooldown for a specific notification type.
   * 
   * Uses the notification_cooldowns table to track when reminders were sent.
   */
  private async isInCooldown(userId: string, notificationType: NotificationType): Promise<boolean> {
    const now = new Date().toISOString();

    const { data } = await this.supabase
      .from('notification_cooldowns')
      .select('id')
      .eq('user_id', userId)
      .eq('notification_type', notificationType)
      .gt('cooldown_expires_at', now)
      .single();

    return !!data;
  }

  /**
   * Update last_active_at for a user.
   * 
   * Called when a user performs any activity in the app.
   * 
   * @param userId - User ID
   */
  async updateLastActive(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .update({ last_active_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('Failed to update last_active_at:', error);
    }
  }

  /**
   * Get inactivity statistics.
   * 
   * Useful for monitoring and debugging.
   * 
   * @returns Object with counts of inactive users at each tier
   */
  async getInactivityStats(): Promise<{
    inactive24h: number;
    inactive72h: number;
    inactive7d: number;
    totalActive: number;
  }> {
    const now = new Date();

    // Calculate thresholds
    const threshold24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const threshold72h = new Date(now.getTime() - 72 * 60 * 60 * 1000);
    const threshold7d = new Date(now.getTime() - 168 * 60 * 60 * 1000);

    // Count users inactive for each tier
    const [inactive24h, inactive72h, inactive7d, totalUsers] = await Promise.all([
      this.supabase.from('users').select('id', { count: 'exact', head: true })
        .eq('notifications_enabled', true)
        .lt('last_active_at', threshold24h.toISOString())
        .gte('last_active_at', threshold72h.toISOString()),
      
      this.supabase.from('users').select('id', { count: 'exact', head: true })
        .eq('notifications_enabled', true)
        .lt('last_active_at', threshold72h.toISOString())
        .gte('last_active_at', threshold7d.toISOString()),
      
      this.supabase.from('users').select('id', { count: 'exact', head: true })
        .eq('notifications_enabled', true)
        .lt('last_active_at', threshold7d.toISOString()),
      
      this.supabase.from('users').select('id', { count: 'exact', head: true })
        .eq('notifications_enabled', true)
    ]);

    return {
      inactive24h: inactive24h.count || 0,
      inactive72h: inactive72h.count || 0,
      inactive7d: inactive7d.count || 0,
      totalActive: totalUsers.count || 0
    };
  }
}

// Singleton instance
let inactivePlayerServiceInstance: InactivePlayerService | null = null;

export function getInactivePlayerService(
  supabaseUrl?: string,
  supabaseKey?: string,
  telegramBotToken?: string
): InactivePlayerService {
  if (!inactivePlayerServiceInstance) {
    const url = supabaseUrl || process.env.SUPABASE_URL;
    const key = supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY;
    const token = telegramBotToken || process.env.TELEGRAM_BOT_TOKEN;

    if (!url || !key || !token) {
      throw new Error('Missing required environment variables for InactivePlayerService');
    }

    inactivePlayerServiceInstance = new InactivePlayerService(url, key, token);
  }

  return inactivePlayerServiceInstance;
}
