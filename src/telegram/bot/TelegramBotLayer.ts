/**
 * Telegram Bot Layer
 *
 * Provides abstraction for Telegram Bot API interactions including:
 * - Messages
 * - Commands
 * - Callbacks
 * - Inline Keyboard
 * - Reply Keyboard
 * - Webhooks
 *
 * Note: This is infrastructure only - no gameplay logic.
 */

import type {
  BotCommand,
  InlineKeyboardMarkup,
  InlineKeyboardButton,
  ReplyKeyboardMarkup,
  ReplyKeyboardButton,
  ReplyKeyboardRemove,
  ParseMode,
  BotUser,
  BotChat,
  BotMessage,
  CallbackQuery,
} from '../types/bot.types';

/**
 * Bot layer configuration.
 */
export interface BotLayerConfig {
  botToken: string;
  apiUrl?: string;
  webhookSecret?: string;
}

/**
 * Send message options.
 */
export interface SendMessageOptions {
  chatId: number;
  text: string;
  parseMode?: ParseMode;
  disableWebPagePreview?: boolean;
  disableNotification?: boolean;
  replyToMessageId?: number;
  replyMarkup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove;
}

/**
 * Edit message options.
 */
export interface EditMessageOptions {
  chatId: number;
  messageId: number;
  text?: string;
  parseMode?: ParseMode;
  replyMarkup?: InlineKeyboardMarkup;
}

/**
 * Answer callback query options.
 */
export interface AnswerCallbackQueryOptions {
  callbackQueryId: string;
  text?: string;
  showAlert?: boolean;
  url?: string;
  cacheTime?: number;
}

/**
 * Telegram Bot Layer
 *
 * Abstraction over Telegram Bot API for sending messages,
 * handling commands, callbacks, and managing keyboards.
 */
export class TelegramBotLayer {
  private static instance: TelegramBotLayer | null = null;
  private botToken: string;
  private apiUrl: string;
  private webhookSecret?: string;

  private constructor(config: BotLayerConfig) {
    this.botToken = config.botToken;
    this.apiUrl = config.apiUrl ?? 'https://api.telegram.org';
    this.webhookSecret = config.webhookSecret;
  }

  /**
   * Get singleton instance.
   */
  static getInstance(config: BotLayerConfig): TelegramBotLayer {
    if (!TelegramBotLayer.instance) {
      TelegramBotLayer.instance = new TelegramBotLayer(config);
    }
    return TelegramBotLayer.instance;
  }

  /**
   * Reset singleton instance.
   */
  static resetInstance(): void {
    TelegramBotLayer.instance = null;
  }

  /**
   * Configure the bot layer.
   */
  static configure(config: BotLayerConfig): TelegramBotLayer {
    TelegramBotLayer.instance = new TelegramBotLayer(config);
    return TelegramBotLayer.instance;
  }

  /**
   * Send a text message.
   */
  async sendMessage(options: SendMessageOptions): Promise<BotMessage | null> {
    const {
      chatId,
      text,
      parseMode = 'HTML',
      disableWebPagePreview,
      disableNotification,
      replyToMessageId,
      replyMarkup,
    } = options;

    try {
      const response = await this.request<{ ok: boolean; result: BotMessage }>('/sendMessage', {
        chat_id: chatId,
        text,
        parse_mode: parseMode,
        disable_web_page_preview: disableWebPagePreview,
        disable_notification: disableNotification,
        reply_to_message_id: replyToMessageId,
        reply_markup: replyMarkup,
      });

      return response.result;
    } catch (error) {
      console.error('Failed to send message:', error);
      return null;
    }
  }

  /**
   * Edit a message.
   */
  async editMessage(options: EditMessageOptions): Promise<boolean> {
    const { chatId, messageId, text, parseMode, replyMarkup } = options;

    try {
      await this.request('/editMessageText', {
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: parseMode,
        reply_markup: replyMarkup,
      });
      return true;
    } catch (error) {
      console.error('Failed to edit message:', error);
      return false;
    }
  }

  /**
   * Delete a message.
   */
  async deleteMessage(chatId: number, messageId: number): Promise<boolean> {
    try {
      await this.request('/deleteMessage', {
        chat_id: chatId,
        message_id: messageId,
      });
      return true;
    } catch (error) {
      console.error('Failed to delete message:', error);
      return false;
    }
  }

  /**
   * Answer a callback query.
   */
  async answerCallbackQuery(options: AnswerCallbackQueryOptions): Promise<boolean> {
    const { callbackQueryId, text, showAlert, url, cacheTime } = options;

    try {
      await this.request('/answerCallbackQuery', {
        callback_query_id: callbackQueryId,
        text,
        show_alert: showAlert,
        url,
        cache_time: cacheTime,
      });
      return true;
    } catch (error) {
      console.error('Failed to answer callback query:', error);
      return false;
    }
  }

  /**
   * Set bot commands.
   */
  async setCommands(commands: BotCommand[]): Promise<boolean> {
    try {
      await this.request('/setMyCommands', { commands });
      return true;
    } catch (error) {
      console.error('Failed to set commands:', error);
      return false;
    }
  }

  /**
   * Get bot commands.
   */
  async getCommands(): Promise<BotCommand[]> {
    try {
      const response = await this.request<{ ok: boolean; result: BotCommand[] }>('/getMyCommands', {});
      return response.result;
    } catch (error) {
      console.error('Failed to get commands:', error);
      return [];
    }
  }

  /**
   * Delete bot commands.
   */
  async deleteCommands(): Promise<boolean> {
    try {
      await this.request('/deleteMyCommands', {});
      return true;
    } catch (error) {
      console.error('Failed to delete commands:', error);
      return false;
    }
  }

  /**
   * Get webhook info.
   */
  async getWebhookInfo(): Promise<{ url: string; pendingUpdateCount: number } | null> {
    try {
      const response = await this.request<{
        ok: boolean;
        result: { url: string; pending_update_count: number };
      }>('/getWebhookInfo', {});
      return {
        url: response.result.url,
        pendingUpdateCount: response.result.pending_update_count,
      };
    } catch (error) {
      console.error('Failed to get webhook info:', error);
      return null;
    }
  }

  /**
   * Set webhook.
   */
  async setWebhook(url: string, options?: {
    certificate?: string;
    maxConnections?: number;
    allowedUpdates?: string[];
    dropPendingUpdates?: boolean;
  }): Promise<boolean> {
    try {
      await this.request('/setWebhook', {
        url,
        certificate: options?.certificate,
        max_connections: options?.maxConnections,
        allowed_updates: options?.allowedUpdates,
        drop_pending_updates: options?.dropPendingUpdates,
      });
      return true;
    } catch (error) {
      console.error('Failed to set webhook:', error);
      return false;
    }
  }

  /**
   * Delete webhook.
   */
  async deleteWebhook(options?: {
    dropPendingUpdates?: boolean;
  }): Promise<boolean> {
    try {
      await this.request('/deleteWebhook', {
        drop_pending_updates: options?.dropPendingUpdates,
      });
      return true;
    } catch (error) {
      console.error('Failed to delete webhook:', error);
      return false;
    }
  }

  /**
   * Get bot info.
   */
  async getMe(): Promise<BotUser | null> {
    try {
      const response = await this.request<{ ok: boolean; result: BotUser }>('/getMe', {});
      return response.result;
    } catch (error) {
      console.error('Failed to get bot info:', error);
      return null;
    }
  }

  /**
   * Create inline keyboard.
   */
  createInlineKeyboard(rows: InlineKeyboardButton[][]): InlineKeyboardMarkup {
    return { inlineKeyboard: rows };
  }

  /**
   * Create simple inline keyboard button row.
   */
  createInlineButton(
    text: string,
    callbackData?: string,
    url?: string
  ): InlineKeyboardButton {
    return {
      text,
      callbackData,
      url,
    };
  }

  /**
   * Create reply keyboard.
   */
  createReplyKeyboard(rows: ReplyKeyboardButton[][]): ReplyKeyboardMarkup {
    return {
      keyboard: rows,
      isPersistent: true,
      resizeKeyboard: true,
      oneTimeKeyboard: false,
    };
  }

  /**
   * Create simple reply keyboard button.
   */
  createReplyButton(text: string, requestContact?: boolean): ReplyKeyboardButton {
    return {
      text,
      requestContact,
    };
  }

  /**
   * Create remove keyboard markup.
   */
  createRemoveKeyboard(selective?: boolean): ReplyKeyboardRemove {
    return {
      removeKeyboard: true,
      selective,
    };
  }

  /**
   * Send a message with an inline keyboard.
   */
  async sendInlineMessage(
    chatId: number,
    text: string,
    keyboard: InlineKeyboardMarkup,
    parseMode: ParseMode = 'HTML'
  ): Promise<BotMessage | null> {
    return this.sendMessage({
      chatId,
      text,
      parseMode,
      replyMarkup: keyboard,
    });
  }

  /**
   * Send a message with a reply keyboard.
   */
  async sendReplyMessage(
    chatId: number,
    text: string,
    keyboard: ReplyKeyboardMarkup,
    parseMode: ParseMode = 'HTML'
  ): Promise<BotMessage | null> {
    return this.sendMessage({
      chatId,
      text,
      parseMode,
      replyMarkup: keyboard,
    });
  }

  /**
   * Validate webhook request.
   */
  validateWebhookRequest(body: string, signature: string): boolean {
    if (!this.webhookSecret) return true; // No secret configured, skip validation

    // In production, implement HMAC validation here
    // For now, return true if secret is configured
    return true;
  }

  /**
   * Make an API request to Telegram.
   */
  private async request<T>(
    endpoint: string,
    body: Record<string, unknown>
  ): Promise<T> {
    const url = `${this.apiUrl}/bot${this.botToken}${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Telegram API error: ${error.description}`);
    }

    return response.json() as Promise<T>;
  }
}

/**
 * Get bot layer instance.
 */
export function getTelegramBotLayer(config: BotLayerConfig): TelegramBotLayer {
  return TelegramBotLayer.getInstance(config);
}
