/**
 * Telegram Webhook Handler
 *
 * Handles incoming webhook updates from Telegram Bot API.
 */

import { BotUpdateDTO, TelegramUserDTO, BotChatDTO } from '../dto/telegram.dto';

/**
 * Webhook handler configuration.
 */
export interface WebhookHandlerConfig {
  botToken: string;
  secretToken?: string;
  allowedUpdates?: string[];
  dropPendingUpdates?: boolean;
}

/**
 * Webhook update handler callback.
 */
export type WebhookUpdateHandler = (update: BotUpdateDTO) => Promise<void> | void;

/**
 * Webhook error handler callback.
 */
export type WebhookErrorHandler = (error: Error, update?: BotUpdateDTO) => Promise<void> | void;

/**
 * Telegram Webhook Handler
 *
 * Processes incoming webhook updates from Telegram.
 */
export class TelegramWebhookHandler {
  private static instance: TelegramWebhookHandler | null = null;
  private botToken: string;
  private secretToken?: string;
  private allowedUpdates?: string[];
  private updateHandler?: WebhookUpdateHandler;
  private errorHandler?: WebhookErrorHandler;
  private apiUrl: string;

  private constructor(config: WebhookHandlerConfig) {
    this.botToken = config.botToken;
    this.secretToken = config.secretToken;
    this.allowedUpdates = config.allowedUpdates;
    this.apiUrl = 'https://api.telegram.org';
  }

  /**
   * Get singleton instance.
   */
  static getInstance(config: WebhookHandlerConfig): TelegramWebhookHandler {
    if (!TelegramWebhookHandler.instance) {
      TelegramWebhookHandler.instance = new TelegramWebhookHandler(config);
    }
    return TelegramWebhookHandler.instance;
  }

  /**
   * Reset singleton instance.
   */
  static resetInstance(): void {
    TelegramWebhookHandler.instance = null;
  }

  /**
   * Configure the handler.
   */
  static configure(config: WebhookHandlerConfig): TelegramWebhookHandler {
    TelegramWebhookHandler.instance = new TelegramWebhookHandler(config);
    return TelegramWebhookHandler.instance;
  }

  /**
   * Set the update handler callback.
   */
  onUpdate(handler: WebhookUpdateHandler): void {
    this.updateHandler = handler;
  }

  /**
   * Set the error handler callback.
   */
  onError(handler: WebhookErrorHandler): void {
    this.errorHandler = handler;
  }

  /**
   * Process an incoming webhook update.
   */
  async processUpdate(update: Record<string, unknown>): Promise<void> {
    try {
      const dto = this.mapUpdateToDTO(update);

      if (!this.updateHandler) {
        console.warn('No update handler registered');
        return;
      }

      await this.updateHandler(dto);
    } catch (error) {
      if (this.errorHandler) {
        await this.errorHandler(error as Error, this.mapUpdateToDTO(update));
      } else {
        throw error;
      }
    }
  }

  /**
   * Validate webhook secret token.
   */
  validateSecret(token: string | null): boolean {
    if (!this.secretToken) return true;
    return token === this.secretToken;
  }

  /**
   * Get webhook info from Telegram.
   */
  async getWebhookInfo(): Promise<{
    url: string;
    pendingUpdateCount: number;
    lastErrorDate?: number;
    lastErrorMessage?: string;
  } | null> {
    try {
      const response = await this.request<{
        ok: boolean;
        result: {
          url: string;
          pending_update_count: number;
          last_error_date?: number;
          last_error_message?: string;
        };
      }>('/getWebhookInfo', {});

      return {
        url: response.result.url,
        pendingUpdateCount: response.result.pending_update_count,
        lastErrorDate: response.result.last_error_date,
        lastErrorMessage: response.result.last_error_message,
      };
    } catch {
      return null;
    }
  }

  /**
   * Set the webhook URL.
   */
  async setWebhook(url: string): Promise<boolean> {
    try {
      await this.request('/setWebhook', {
        url,
        secret_token: this.secretToken,
        allowed_updates: this.allowedUpdates,
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Delete the webhook.
   */
  async deleteWebhook(): Promise<boolean> {
    try {
      await this.request('/deleteWebhook', {});
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Map raw update to DTO.
   */
  private mapUpdateToDTO(update: Record<string, unknown>): BotUpdateDTO {
    const dto: BotUpdateDTO = {
      updateId: update.update_id as number,
      message: null,
      callbackQuery: null,
      editedMessage: null,
    };

    if (update.message) {
      dto.message = this.mapMessage(update.message as Record<string, unknown>);
    }

    if (update.edited_message) {
      dto.editedMessage = this.mapMessage(update.edited_message as Record<string, unknown>);
    }

    if (update.callback_query) {
      dto.callbackQuery = this.mapCallbackQuery(update.callback_query as Record<string, unknown>);
    }

    return dto;
  }

  /**
   * Map message to DTO.
   */
  private mapMessage(message: Record<string, unknown>): BotUpdateDTO['message'] {
    return {
      messageId: message.message_id as number,
      from: message.from ? this.mapUser(message.from as Record<string, unknown>) : null,
      chat: this.mapChat(message.chat as Record<string, unknown>),
      date: message.date as number,
      text: (message.text as string) ?? null,
      entities: message.entities
        ? (message.entities as Record<string, unknown>[]).map((e) => ({
            type: e.type as string,
            offset: e.offset as number,
            length: e.length as number,
            url: e.url as string | undefined,
          }))
        : [],
    };
  }

  /**
   * Map user to DTO.
   */
  private mapUser(user: Record<string, unknown>): TelegramUserDTO {
    return {
      id: user.id as number,
      firstName: user.first_name as string,
      lastName: user.last_name as string | undefined,
      username: user.username as string | undefined,
      isPremium: (user.is_premium as boolean) ?? false,
      isBot: user.is_bot as boolean,
    };
  }

  /**
   * Map chat to DTO.
   */
  private mapChat(chat: Record<string, unknown>): BotChatDTO {
    return {
      id: chat.id as number,
      type: chat.type as 'private' | 'group' | 'supergroup' | 'channel',
      title: chat.title as string | undefined,
      username: chat.username as string | undefined,
      firstName: chat.first_name as string | undefined,
      lastName: chat.last_name as string | undefined,
    };
  }

  /**
   * Map callback query to DTO.
   */
  private mapCallbackQuery(
    query: Record<string, unknown>
  ): BotUpdateDTO['callbackQuery'] {
    return {
      id: query.id as string,
      from: this.mapUser(query.from as Record<string, unknown>),
      chat: query.chat ? this.mapChat(query.chat as Record<string, unknown>) : null,
      inlineMessageId: (query.inline_message_id as string) ?? null,
      data: (query.data as string) ?? null,
    };
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
 * Get webhook handler instance.
 */
export function getWebhookHandler(config: WebhookHandlerConfig): TelegramWebhookHandler {
  return TelegramWebhookHandler.getInstance(config);
}
