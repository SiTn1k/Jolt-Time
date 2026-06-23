/**
 * BotLogger Service
 * 
 * Service for logging bot interactions to the database.
 * 
 * Logged events:
 * - command_usage: When user invokes a command
 * - callback_usage: When user clicks an inline button
 * - message_sent: When bot sends a message
 * - message_error: When bot fails to send a message
 * - notification_sent: When a notification is sent
 * - notification_error: When a notification fails
 * 
 * Usage:
 * 
 * ```typescript
 * import { BotLogger } from './BotLogger';
 * 
 * const logger = new BotLogger(supabaseUrl, supabaseKey);
 * 
 * // Log a command
 * await logger.logCommand(telegramId, '/start', chatId);
 * 
 * // Log a callback
 * await logger.logCallback(telegramId, 'settings_notifications', messageId);
 * 
 * // Log an error
 * await logger.logError(telegramId, 'send_failed', { error: 'Chat not found' });
 * ```
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Event types that can be logged
export type BotEventType = 
  | 'command'
  | 'callback'
  | 'message'
  | 'error'
  | 'notification_sent'
  | 'notification_error'
  | 'mini_app_opened'
  | 'mini_app_linked'
  | 'settings_changed'
  | 'language_changed';

// Payload types for each event type
export interface CommandPayload {
  command: string;
  args?: string;
}

export interface CallbackPayload {
  data: string;
  messageId?: number;
}

export interface MessagePayload {
  messageId: number;
  text?: string;
  type: 'text' | 'photo' | 'animation' | 'video' | 'dice';
}

export interface ErrorPayload {
  error: string;
  context?: string;
  stack?: string;
}

export interface NotificationPayload {
  notificationType: string;
  notificationId?: string;
}

export interface SettingsChangePayload {
  setting: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface LanguageChangePayload {
  oldLanguage: string;
  newLanguage: string;
}

export type EventPayload = 
  | CommandPayload
  | CallbackPayload
  | MessagePayload
  | ErrorPayload
  | NotificationPayload
  | SettingsChangePayload
  | LanguageChangePayload
  | Record<string, unknown>;

export class BotLogger {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Log an event to the database.
   * 
   * @param telegramId - User's Telegram ID
   * @param eventType - Type of event
   * @param payload - Event data
   * @param chatId - Optional chat ID
   * @param messageId - Optional message ID
   */
  async log(
    telegramId: number,
    eventType: BotEventType,
    payload: EventPayload = {},
    chatId?: number,
    messageId?: number
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('bot_logs')
        .insert({
          telegram_id: telegramId,
          event_type: eventType,
          payload,
          chat_id: chatId,
          message_id: messageId
        });

      if (error) {
        console.error('BotLogger: Failed to log event', error);
      }
    } catch (error) {
      // Never throw - logging should not break the application
      console.error('BotLogger: Exception while logging', error);
    }
  }

  /**
   * Log a command invocation.
   */
  async logCommand(telegramId: number, command: string, chatId: number, args?: string): Promise<void> {
    await this.log(telegramId, 'command', { command, args }, chatId);
  }

  /**
   * Log a callback button press.
   */
  async logCallback(telegramId: number, data: string, messageId?: number, chatId?: number): Promise<void> {
    await this.log(telegramId, 'callback', { data, messageId }, chatId, messageId);
  }

  /**
   * Log a message sent by the bot.
   */
  async logMessage(
    telegramId: number,
    messageId: number,
    type: 'text' | 'photo' | 'animation' | 'video' | 'dice' = 'text',
    text?: string,
    chatId?: number
  ): Promise<void> {
    await this.log(telegramId, 'message', { messageId, text, type }, chatId, messageId);
  }

  /**
   * Log a bot error.
   */
  async logError(telegramId: number, error: string, context?: string, stack?: string, chatId?: number): Promise<void> {
    await this.log(telegramId, 'error', { error, context, stack }, chatId);
  }

  /**
   * Log a notification sent.
   */
  async logNotification(telegramId: number, notificationType: string, notificationId?: string, chatId?: number): Promise<void> {
    await this.log(telegramId, 'notification_sent', { notificationType, notificationId }, chatId);
  }

  /**
   * Log a notification error.
   */
  async logNotificationError(telegramId: number, notificationType: string, error: string, chatId?: number): Promise<void> {
    await this.log(telegramId, 'notification_error', { notificationType, error }, chatId);
  }

  /**
   * Log Mini App opened.
   */
  async logMiniAppOpened(telegramId: number, chatId: number): Promise<void> {
    await this.log(telegramId, 'mini_app_opened', {}, chatId);
  }

  /**
   * Log Mini App account linked.
   */
  async logMiniAppLinked(telegramId: number, userId: string, chatId: number): Promise<void> {
    await this.log(telegramId, 'mini_app_linked', { userId }, chatId);
  }

  /**
   * Log a settings change.
   */
  async logSettingsChanged(telegramId: number, setting: string, oldValue: unknown, newValue: unknown, chatId?: number): Promise<void> {
    await this.log(telegramId, 'settings_changed', { setting, oldValue, newValue }, chatId);
  }

  /**
   * Log a language change.
   */
  async logLanguageChanged(telegramId: number, oldLanguage: string, newLanguage: string, chatId: number): Promise<void> {
    await this.log(telegramId, 'language_changed', { oldLanguage, newLanguage }, chatId);
  }

  /**
   * Get logs for a specific user.
   */
  async getUserLogs(
    telegramId: number,
    options?: {
      eventType?: BotEventType;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ id: string; event_type: string; payload: unknown; created_at: string }[]> {
    let query = this.supabase
      .from('bot_logs')
      .select('id, event_type, payload, created_at')
      .eq('telegram_id', telegramId)
      .order('created_at', { ascending: false });

    if (options?.eventType) {
      query = query.eq('event_type', options.eventType);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('BotLogger: Failed to fetch user logs', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get statistics for bot usage.
   */
  async getStats(days: number = 7): Promise<{
    totalCommands: number;
    totalCallbacks: number;
    totalErrors: number;
    uniqueUsers: number;
    topCommands: { command: string; count: number }[];
    topCallbacks: { data: string; count: number }[];
  }> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const [commands, callbacks, errors, users, commandCounts, callbackCounts] = await Promise.all([
      this.supabase.from('bot_logs').select('id', { count: 'exact', head: true })
        .eq('event_type', 'command')
        .gte('created_at', since),
      
      this.supabase.from('bot_logs').select('id', { count: 'exact', head: true })
        .eq('event_type', 'callback')
        .gte('created_at', since),
      
      this.supabase.from('bot_logs').select('id', { count: 'exact', head: true })
        .eq('event_type', 'error')
        .gte('created_at', since),
      
      this.supabase.from('bot_logs').select('telegram_id', { count: 'exact', head: true })
        .gte('created_at', since),
      
      this.supabase.from('bot_logs')
        .select('payload')
        .eq('event_type', 'command')
        .gte('created_at', since),
      
      this.supabase.from('bot_logs')
        .select('payload')
        .eq('event_type', 'callback')
        .gte('created_at', since)
    ]);

    // Count command occurrences
    const commandMap = new Map<string, number>();
    for (const log of commandCounts.data || []) {
      const payload = log.payload as { command?: string };
      if (payload?.command) {
        commandMap.set(payload.command, (commandMap.get(payload.command) || 0) + 1);
      }
    }
    const topCommands = Array.from(commandMap.entries())
      .map(([command, count]) => ({ command, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Count callback occurrences
    const callbackMap = new Map<string, number>();
    for (const log of callbackCounts.data || []) {
      const payload = log.payload as { data?: string };
      if (payload?.data) {
        callbackMap.set(payload.data, (callbackMap.get(payload.data) || 0) + 1);
      }
    }
    const topCallbacks = Array.from(callbackMap.entries())
      .map(([data, count]) => ({ data, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalCommands: commands.count || 0,
      totalCallbacks: callbacks.count || 0,
      totalErrors: errors.count || 0,
      uniqueUsers: users.count || 0,
      topCommands,
      topCallbacks
    };
  }
}

// Singleton instance
let botLoggerInstance: BotLogger | null = null;

export function getBotLogger(
  supabaseUrl?: string,
  supabaseKey?: string
): BotLogger {
  if (!botLoggerInstance) {
    const url = supabaseUrl || process.env.SUPABASE_URL;
    const key = supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error('Missing required environment variables for BotLogger');
    }

    botLoggerInstance = new BotLogger(url, key);
  }

  return botLoggerInstance;
}
