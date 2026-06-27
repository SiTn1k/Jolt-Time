/**
 * Telegram Notification Foundation
 *
 * Provides abstractions for:
 * - Bot notifications
 * - Mini App notifications
 * - System notifications
 * - Future push support
 *
 * Note: This is infrastructure only - no notification business logic.
 */

import type { BotMessage } from '../types/bot.types';

/**
 * Notification configuration.
 */
export interface NotificationConfig {
  botToken?: string;
  defaultParseMode?: 'HTML' | 'Markdown';
}

/**
 * Notification priority levels.
 */
export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * Notification result.
 */
export interface NotificationResult {
  success: boolean;
  messageId?: number;
  error?: string;
}

/**
 * Bot notification options.
 */
export interface BotNotificationOptions {
  chatId: number;
  text: string;
  parseMode?: 'HTML' | 'Markdown';
  disableNotification?: boolean;
  replyToMessageId?: number;
  replyMarkup?: unknown;
  priority?: NotificationPriority;
}

/**
 * Mini app notification options.
 */
export interface MiniAppNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown>;
}

/**
 * System notification options.
 */
export interface SystemNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  tag?: string;
  data?: Record<string, unknown>;
}

/**
 * Telegram Notification Foundation
 *
 * Infrastructure for sending notifications through Telegram and system channels.
 * All notification business logic should be handled by upper layers.
 */
export class TelegramNotificationFoundation {
  private static instance: TelegramNotificationFoundation | null = null;
  private botToken: string | null = null;
  private defaultParseMode: 'HTML' | 'Markdown' = 'HTML';
  private pushPermissionGranted = false;

  private constructor(config?: NotificationConfig) {
    this.botToken = config?.botToken ?? null;
    this.defaultParseMode = config?.defaultParseMode ?? 'HTML';
  }

  /**
   * Get singleton instance.
   */
  static getInstance(config?: NotificationConfig): TelegramNotificationFoundation {
    if (!TelegramNotificationFoundation.instance) {
      TelegramNotificationFoundation.instance = new TelegramNotificationFoundation(config);
    }
    return TelegramNotificationFoundation.instance;
  }

  /**
   * Reset singleton instance.
   */
  static resetInstance(): void {
    TelegramNotificationFoundation.instance = null;
  }

  /**
   * Configure the foundation.
   */
  configure(config: NotificationConfig): void {
    this.botToken = config.botToken ?? this.botToken;
    this.defaultParseMode = config.defaultParseMode ?? this.defaultParseMode;
  }

  /**
   * Check if bot token is configured.
   */
  hasBotToken(): boolean {
    return this.botToken !== null && this.botToken !== '';
  }

  /**
   * Send bot notification.
   */
  async sendBotNotification(options: BotNotificationOptions): Promise<NotificationResult> {
    if (!this.hasBotToken()) {
      return { success: false, error: 'Bot token not configured' };
    }

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${this.botToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: options.chatId,
            text: options.text,
            parse_mode: options.parseMode ?? this.defaultParseMode,
            disable_notification: options.disableNotification ?? false,
            reply_to_message_id: options.replyToMessageId,
            reply_markup: options.replyMarkup,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.description };
      }

      const result = await response.json();
      return { success: true, messageId: result.result.message_id };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Send simple bot message.
   */
  async sendBotMessage(chatId: number, text: string): Promise<NotificationResult> {
    return this.sendBotNotification({ chatId, text });
  }

  /**
   * Send HTML bot message.
   */
  async sendBotHTML(chatId: number, html: string): Promise<NotificationResult> {
    return this.sendBotNotification({ chatId, text: html, parseMode: 'HTML' });
  }

  /**
   * Send Markdown bot message.
   */
  async sendBotMarkdown(chatId: number, markdown: string): Promise<NotificationResult> {
    return this.sendBotNotification({ chatId, text: markdown, parseMode: 'Markdown' });
  }

  /**
   * Send silent bot notification.
   */
  async sendSilentBotNotification(chatId: number, text: string): Promise<NotificationResult> {
    return this.sendBotNotification({
      chatId,
      text,
      disableNotification: true,
    });
  }

  /**
   * Request notification permission (for push notifications).
   */
  async requestPushPermission(): Promise<boolean> {
    if (typeof Notification === 'undefined') {
      return false;
    }

    if (Notification.permission === 'granted') {
      this.pushPermissionGranted = true;
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    this.pushPermissionGranted = permission === 'granted';
    return this.pushPermissionGranted;
  }

  /**
   * Check if push notifications are supported.
   */
  isPushSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'Notification' in window;
  }

  /**
   * Check if push permission is granted.
   */
  isPushPermissionGranted(): boolean {
    if (!this.isPushSupported()) return false;
    return Notification.permission === 'granted';
  }

  /**
   * Send system notification (browser push).
   */
  async sendSystemNotification(options: SystemNotificationOptions): Promise<boolean> {
    if (!this.isPushPermissionGranted()) {
      const granted = await this.requestPushPermission();
      if (!granted) return false;
    }

    if (typeof ServiceWorker === 'undefined') {
      // Fallback to regular notification
      new Notification(options.title, {
        body: options.body,
        icon: options.icon,
        tag: options.tag,
        requireInteraction: options.requireInteraction,
        silent: options.silent,
      });
      return true;
    }

    // Use service worker for push notification
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(options.title, {
      body: options.body,
      icon: options.icon,
      tag: options.tag,
      requireInteraction: options.requireInteraction,
      silent: options.silent,
      data: options.data,
    });

    return true;
  }

  /**
   * Send Telegram Mini App notification via SDK.
   */
  async sendMiniAppNotification(options: MiniAppNotificationOptions): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    const tg = (window as unknown as { Telegram?: { WebApp?: { showNotification: (title: string, message: string) => void } } }).Telegram;
    if (!tg?.WebApp) return false;

    try {
      tg.WebApp.showNotification(options.title, options.body);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Show Telegram popup notification.
   */
  async showTelegramPopup(title: string, message: string): Promise<void> {
    if (typeof window === 'undefined') return;

    const tg = (window as unknown as { Telegram?: { WebApp?: { showPopup: (config: unknown, cb: (id: string) => void) => void } } }).Telegram;
    if (!tg?.WebApp) return;

    return new Promise((resolve) => {
      tg?.WebApp?.showPopup(
        {
          title,
          message,
          buttons: [{ type: 'ok' }],
        },
        () => resolve()
      );
    });
  }

  /**
   * Show Telegram confirmation.
   */
  async showTelegramConfirm(message: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    const tg = (window as unknown as { Telegram?: { WebApp?: { showConfirm: (message: string, cb: (confirmed: boolean) => void) => void } } }).Telegram;
    if (!tg?.WebApp) return false;

    return new Promise((resolve) => {
      tg?.WebApp?.showConfirm(message, (confirmed) => resolve(confirmed));
    });
  }

  /**
   * Show Telegram alert.
   */
  async showTelegramAlert(message: string): Promise<void> {
    if (typeof window === 'undefined') return;

    const tg = (window as unknown as { Telegram?: { WebApp?: { showAlert: (message: string, cb: () => void) => void } } }).Telegram;
    if (!tg?.WebApp) return;

    return new Promise((resolve) => {
      tg.WebApp!.showAlert(message, () => resolve());
    });
  }

  /**
   * Get notification statistics interface.
   */
  createNotificationTracker() {
    const sent: number[] = [];
    const delivered: number[] = [];
    const failed: number[] = [];

    return {
      trackSent: (id: number) => sent.push(id),
      trackDelivered: (id: number) => delivered.push(id),
      trackFailed: (id: number) => failed.push(id),
      getStats: () => ({
        sent: sent.length,
        delivered: delivered.length,
        failed: failed.length,
        deliveryRate: sent.length > 0 ? delivered.length / sent.length : 0,
      }),
    };
  }
}

/**
 * Get notification foundation instance.
 */
export function getNotificationFoundation(config?: NotificationConfig): TelegramNotificationFoundation {
  return TelegramNotificationFoundation.getInstance(config);
}
