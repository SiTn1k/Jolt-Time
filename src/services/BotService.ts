/**
 * BotService
 * 
 * Core service for interacting with the Telegram Bot API.
 * 
 * Responsibilities:
 * - Send various message types (text, photo, animation, markdown)
 * - Handle callback queries
 * - Provide low-level API access
 * 
 * This service is designed to be:
 * - Error-resilient: Never throws, always returns results
 * - Typed: Full TypeScript support for all API responses
 * - Stateless: Can be instantiated multiple times
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Telegram Bot API base URL
const TELEGRAM_API_URL = 'https://api.telegram.org';

export type ParseMode = 'HTML' | 'Markdown' | 'MarkdownV2';

export interface SendMessageOptions {
  parseMode?: ParseMode;
  disableWebPagePreview?: boolean;
  disableNotification?: boolean;
  replyToMessageId?: number;
  replyMarkup?: InlineKeyboardMarkup;
}

export interface InlineKeyboardButton {
  text: string;
  url?: string;
  callbackData?: string;
}

export interface InlineKeyboardMarkup {
  inlineKeyboard: InlineKeyboardButton[][];
}

export interface TelegramResponse<T> {
  ok: boolean;
  result?: T;
  error_code?: number;
  description?: string;
}

export class BotService {
  private readonly botToken: string;
  private readonly supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string, botToken: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.botToken = botToken;
  }

  /**
   * Get the full API URL for a method.
   */
  private getApiUrl(method: string): string {
    return `${TELEGRAM_API_URL}/bot${this.botToken}/${method}`;
  }

  /**
   * Make an API call to Telegram.
   * 
   * @param method - Telegram API method name
   * @param body - Request body
   * @returns TelegramResponse with result or error
   */
  private async apiCall<T>(method: string, body: Record<string, unknown>): Promise<TelegramResponse<T>> {
    try {
      const response = await fetch(this.getApiUrl(method), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json() as TelegramResponse<T>;
      return data;
    } catch (error) {
      // Network errors, JSON parse errors, etc.
      console.error(`BotService API call failed:`, error);
      return {
        ok: false,
        error_code: -1,
        description: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // =========================================================================
  // MESSAGE SENDING METHODS
  // =========================================================================

  /**
   * Send a text message using HTML parse mode (default).
   * 
   * @param chatId - Target chat ID
   * @param text - Message text
   * @param options - Optional message options
   * @returns Message object if successful, null otherwise
   */
  async sendMessage(
    chatId: number,
    text: string,
    options?: SendMessageOptions
  ): Promise<TelegramMessage | null> {
    const result = await this.apiCall<TelegramMessage>('sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: options?.parseMode || 'HTML',
      disable_web_page_preview: options?.disableWebPagePreview || false,
      disable_notification: options?.disableNotification || false,
      reply_to_message_id: options?.replyToMessageId,
      reply_markup: options?.replyMarkup
    });

    if (result.ok && result.result) {
      return result.result;
    }

    console.error(`sendMessage failed:`, result.description);
    return null;
  }

  /**
   * Send a text message with Markdown parse mode.
   * 
   * @param chatId - Target chat ID
   * @param text - Markdown-formatted text
   * @param options - Optional message options
   * @returns Message object if successful, null otherwise
   */
  async sendMarkdownMessage(
    chatId: number,
    text: string,
    options?: Omit<SendMessageOptions, 'parseMode'>
  ): Promise<TelegramMessage | null> {
    return this.sendMessage(chatId, text, { ...options, parseMode: 'Markdown' });
  }

  /**
   * Send a photo with optional caption.
   * 
   * @param chatId - Target chat ID
   * @param photo - Photo file_id, URL, or upload ID
   * @param caption - Optional photo caption
   * @param options - Optional message options
   * @returns Message object if successful, null otherwise
   */
  async sendPhoto(
    chatId: number,
    photo: string,
    caption?: string,
    options?: SendMessageOptions
  ): Promise<TelegramMessage | null> {
    const body: Record<string, unknown> = {
      chat_id: chatId,
      photo,
      disable_notification: options?.disableNotification || false,
      reply_markup: options?.replyMarkup
    };

    if (caption) {
      body.caption = caption;
      body.parse_mode = options?.parseMode || 'HTML';
    }

    const result = await this.apiCall<TelegramMessage>('sendPhoto', body);

    if (result.ok && result.result) {
      return result.result;
    }

    console.error(`sendPhoto failed:`, result.description);
    return null;
  }

  /**
   * Send an animation (GIF/video) with optional caption.
   * 
   * @param chatId - Target chat ID
   * @param animation - Animation file_id, URL, or upload ID
   * @param caption - Optional animation caption
   * @param options - Optional message options
   * @returns Message object if successful, null otherwise
   */
  async sendAnimation(
    chatId: number,
    animation: string,
    caption?: string,
    options?: SendMessageOptions
  ): Promise<TelegramMessage | null> {
    const body: Record<string, unknown> = {
      chat_id: chatId,
      animation,
      disable_notification: options?.disableNotification || false,
      reply_markup: options?.replyMarkup
    };

    if (caption) {
      body.caption = caption;
      body.parse_mode = options?.parseMode || 'HTML';
    }

    const result = await this.apiCall<TelegramMessage>('sendAnimation', body);

    if (result.ok && result.result) {
      return result.result;
    }

    console.error(`sendAnimation failed:`, result.description);
    return null;
  }

  /**
   * Send a video with optional caption.
   * 
   * @param chatId - Target chat ID
   * @param video - Video file_id, URL, or upload ID
   * @param caption - Optional video caption
   * @param options - Optional message options
   * @returns Message object if successful, null otherwise
   */
  async sendVideo(
    chatId: number,
    video: string,
    caption?: string,
    options?: SendMessageOptions
  ): Promise<TelegramMessage | null> {
    const body: Record<string, unknown> = {
      chat_id: chatId,
      video,
      disable_notification: options?.disableNotification || false,
      reply_markup: options?.replyMarkup
    };

    if (caption) {
      body.caption = caption;
      body.parse_mode = options?.parseMode || 'HTML';
    }

    const result = await this.apiCall<TelegramMessage>('sendVideo', body);

    if (result.ok && result.result) {
      return result.result;
    }

    console.error(`sendVideo failed:`, result.description);
    return null;
  }

  /**
   * Send a dice message ( 🎲, 🎯, 🏀, ⚽, 🎰, 🎳 ).
   * 
   * @param chatId - Target chat ID
   * @param emoji - Dice emoji type
   * @returns Message object if successful, null otherwise
   */
  async sendDice(chatId: number, emoji: string = '🎲'): Promise<TelegramMessage | null> {
    const result = await this.apiCall<TelegramMessage>('sendDice', {
      chat_id: chatId,
      emoji
    });

    if (result.ok && result.result) {
      return result.result;
    }

    console.error(`sendDice failed:`, result.description);
    return null;
  }

  /**
   * Send a venue location.
   * 
   * @param chatId - Target chat ID
   * @param latitude - Latitude
   * @param longitude - Longitude
   * @param title - Venue name
   * @param address - Venue address
   */
  async sendVenue(
    chatId: number,
    latitude: number,
    longitude: number,
    title: string,
    address: string
  ): Promise<TelegramMessage | null> {
    const result = await this.apiCall<TelegramMessage>('sendVenue', {
      chat_id: chatId,
      latitude,
      longitude,
      title,
      address
    });

    if (result.ok && result.result) {
      return result.result;
    }

    console.error(`sendVenue failed:`, result.description);
    return null;
  }

  // =========================================================================
  // CALLBACK QUERY METHODS
  // =========================================================================

  /**
   * Answer a callback query.
   * 
   * This is required to stop the "loading" state on buttons.
   * 
   * @param callbackQueryId - The callback query ID
   * @param text - Optional text to show in a toast
   * @param showAlert - If true, shows as alert instead of toast
   */
  async answerCallbackQuery(
    callbackQueryId: string,
    text?: string,
    showAlert: boolean = false
  ): Promise<boolean> {
    const result = await this.apiCall<boolean>('answerCallbackQuery', {
      callback_query_id: callbackQueryId,
      text,
      show_alert: showAlert
    });

    return result.ok;
  }

  /**
   * Edit an existing message's text.
   * 
   * @param chatId - Chat ID of the message
   * @param messageId - Message ID to edit
   * @param text - New text
   * @param options - Optional message options
   */
  async editMessageText(
    chatId: number,
    messageId: number,
    text: string,
    options?: Omit<SendMessageOptions, 'replyToMessageId'>
  ): Promise<TelegramMessage | null> {
    const result = await this.apiCall<TelegramMessage>('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: options?.parseMode || 'HTML',
      disable_web_page_preview: options?.disableWebPagePreview,
      reply_markup: options?.replyMarkup
    });

    if (result.ok && result.result) {
      return result.result;
    }

    console.error(`editMessageText failed:`, result.description);
    return null;
  }

  /**
   * Edit existing message's inline keyboard.
   * 
   * @param chatId - Chat ID of the message
   * @param messageId - Message ID to edit
   * @param replyMarkup - New inline keyboard
   */
  async editMessageReplyMarkup(
    chatId: number,
    messageId: number,
    replyMarkup: InlineKeyboardMarkup
  ): Promise<TelegramMessage | null> {
    const result = await this.apiCall<TelegramMessage>('editMessageReplyMarkup', {
      chat_id: chatId,
      message_id: messageId,
      reply_markup
    });

    if (result.ok && result.result) {
      return result.result;
    }

    console.error(`editMessageReplyMarkup failed:`, result.description);
    return null;
  }

  /**
   * Delete a message.
   * 
   * @param chatId - Chat ID of the message
   * @param messageId - Message ID to delete
   */
  async deleteMessage(chatId: number, messageId: number): Promise<boolean> {
    const result = await this.apiCall<boolean>('deleteMessage', {
      chat_id: chatId,
      message_id: messageId
    });

    return result.ok;
  }

  // =========================================================================
  // BOT INFORMATION METHODS
  // =========================================================================

  /**
   * Get bot information.
   */
  async getMe(): Promise<TelegramBotInfo | null> {
    const result = await this.apiCall<TelegramBotInfo>('getMe', {});

    if (result.ok && result.result) {
      return result.result;
    }

    console.error(`getMe failed:`, result.description);
    return null;
  }

  /**
   * Set the bot's commands menu.
   */
  async setCommands(commands: BotCommand[]): Promise<boolean> {
    const result = await this.apiCall<boolean>('setMyCommands', {
      commands: commands.map(c => ({ command: c.command, description: c.description }))
    });

    return result.ok;
  }

  /**
   * Get the bot's commands menu.
   */
  async getCommands(): Promise<BotCommand[]> {
    const result = await this.apiCall<BotCommand[]>('getMyCommands', {});

    if (result.ok && result.result) {
      return result.result;
    }

    return [];
  }

  /**
   * Set bot description (shown in chat with bot).
   */
  async setDescription(description: string): Promise<boolean> {
    const result = await this.apiCall<boolean>('setMyDescription', {
      description
    });

    return result.ok;
  }

  /**
   * Set bot short description (shown in profile).
   */
  async setShortDescription(shortDescription: string): Promise<boolean> {
    const result = await this.apiCall<boolean>('setMyShortDescription', {
      short_description: shortDescription
    });

    return result.ok;
  }
}

// =========================================================================
// TYPE DEFINITIONS (Telegram Bot API Types)
// =========================================================================

export interface TelegramBotInfo {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username: string;
  can_join_groups?: boolean;
  can_read_all_group_messages?: boolean;
  supports_inline_queries?: boolean;
}

export interface BotCommand {
  command: string;
  description: string;
}

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramChat {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
  caption?: string;
  entities?: TelegramMessageEntity[];
  photo?: TelegramPhoto[];
  animation?: TelegramAnimation;
  video?: TelegramVideo;
  dice?: TelegramDice;
  venue?: TelegramVenue;
  successful_payment?: unknown;
  reply_to_message?: TelegramMessage;
}

export interface TelegramMessageEntity {
  type: string;
  offset: number;
  length: number;
  url?: string;
  user?: TelegramUser;
}

export interface TelegramPhoto {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size?: number;
}

export interface TelegramAnimation {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  duration: number;
  thumb?: TelegramPhoto;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
}

export interface TelegramVideo {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  duration: number;
  thumb?: TelegramPhoto;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
}

export interface TelegramDice {
  emoji: string;
  value: number;
}

export interface TelegramVenue {
  location: {
    latitude: number;
    longitude: number;
  };
  title: string;
  address: string;
  foursquare_id?: string;
  foursquare_type?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  channel_post?: TelegramMessage;
  edited_channel_post?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
  inline_query?: unknown;
  chosen_inline_result?: unknown;
}

export interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  inline_message_id?: string;
  chat_instance?: string;
  data?: string;
  game_short_name?: string;
}

// Singleton instance
let botServiceInstance: BotService | null = null;

export function getBotService(
  supabaseUrl?: string,
  supabaseKey?: string,
  botToken?: string
): BotService {
  if (!botServiceInstance) {
    const url = supabaseUrl || process.env.SUPABASE_URL;
    const key = supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY;
    const token = botToken || process.env.TELEGRAM_BOT_TOKEN;

    if (!url || !key || !token) {
      throw new Error('Missing required environment variables for BotService');
    }

    botServiceInstance = new BotService(url, key, token);
  }

  return botServiceInstance;
}
