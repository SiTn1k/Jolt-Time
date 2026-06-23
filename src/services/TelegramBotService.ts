/**
 * TelegramBotService
 * 
 * Service for interacting with the Telegram Bot API.
 * Handles:
 * - Sending messages to users
 * - Managing user chat_ids when they start the bot
 * - Setting up webhook for incoming updates (optional)
 * 
 * Note: This service uses the Bot API directly without external providers.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const TELEGRAM_API_URL = 'https://api.telegram.org';

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: {
    id: number;
    type: string;
    title?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
  };
  date: number;
  text?: string;
  entities?: TelegramMessageEntity[];
}

export interface TelegramMessageEntity {
  type: string;
  offset: number;
  length: number;
  url?: string;
  user?: TelegramUser;
}

export interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  chat?: {
    id: number;
    type: string;
    username?: string;
    first_name?: string;
    last_name?: string;
  };
  inline_message_id?: string;
  data?: string;
}

export interface TelegramBotCommand {
  command: string;
  description: string;
}

export class TelegramBotService {
  private supabase: SupabaseClient;
  private botToken: string;

  constructor(supabaseUrl: string, supabaseKey: string, botToken: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.botToken = botToken;
  }

  /**
   * Send a message to a user by their chat_id.
   * 
   * @param chatId - Telegram chat ID
   * @param text - Message text (supports HTML)
   * @param parseMode - Parse mode: 'HTML' or 'Markdown'
   * @returns true if sent successfully
   */
  async sendMessage(chatId: number, text: string, parseMode: 'HTML' | 'Markdown' = 'HTML'): Promise<boolean> {
    try {
      const response = await fetch(
        `${TELEGRAM_API_URL}/bot${this.botToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: parseMode
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Telegram sendMessage error:', errorData);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }

  /**
   * Register or update a user's Telegram data.
   * 
   * Called when a user starts the bot or sends /start.
   * 
   * @param telegramId - Telegram user ID
   * @param username - Telegram username (optional)
   * @param chatId - Telegram chat ID
   */
  async registerUser(telegramId: number, username: string | undefined, chatId: number): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .update({
        telegram_id: telegramId,
        username: username || null,
        chat_id: chatId,
        notifications_enabled: true, // Enable by default when they start the bot
        last_active_at: new Date().toISOString()
      })
      .eq('telegram_id', telegramId);

    if (error) {
      console.error('Failed to register user:', error);
    }
  }

  /**
   * Handle incoming /start command.
   * 
   * @param message - Telegram message object
   */
  async handleStartCommand(message: TelegramMessage): Promise<void> {
    if (!message.from || !message.chat) return;

    const { id: telegramId, username } = message.from;
    const chatId = message.chat.id;

    // Register or update user
    await this.registerUser(telegramId, username, chatId);

    // Send welcome message
    const welcomeText = `
👋 <b>Welcome to Jolt Time!</b>

Your notifications are now enabled. You'll receive updates about:

⚡ Energy restored
🏆 Expeditions completed
🔬 Research finished
🏗️ Buildings upgraded
🎉 Events

You can manage your notification preferences anytime using /settings.
    `.trim();

    await this.sendMessage(chatId, welcomeText);
  }

  /**
   * Handle incoming /settings command.
   * 
   * Shows current notification settings and allows user to change them.
   * 
   * @param message - Telegram message object
   */
  async handleSettingsCommand(message: TelegramMessage): Promise<void> {
    if (!message.from || !message.chat) return;

    const userId = message.from.id;
    const chatId = message.chat.id;

    // Get user's current preferences
    const { data: user } = await this.supabase
      .from('users')
      .select('id')
      .eq('telegram_id', userId)
      .single();

    if (!user) {
      await this.sendMessage(chatId, 'Please start the bot first with /start');
      return;
    }

    const { data: prefs } = await this.supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const dailyReminders = prefs?.daily_reminders ? '✅' : '❌';
    const events = prefs?.events ? '✅' : '❌';
    const research = prefs?.research_complete ? '✅' : '❌';
    const energy = prefs?.energy_restored ? '✅' : '❌';
    const building = prefs?.building_complete ? '✅' : '❌';
    const marketing = prefs?.marketing ? '✅' : '❌';

    const settingsText = `
⚙️ <b>Notification Settings</b>

Current status:
${dailyReminders} Daily reminders
${events} Events
${research} Research complete
${energy} Energy restored
${building} Building complete
${marketing} Marketing

Use the Mini App to change these settings.
    `.trim();

    await this.sendMessage(chatId, settingsText);
  }

  /**
   * Handle incoming /help command.
   */
  async handleHelpCommand(message: TelegramMessage): Promise<void> {
    if (!message.chat) return;

    const chatId = message.chat.id;
    const helpText = `
📖 <b>Jolt Time Bot Help</b>

Commands:
/start - Register with the bot
/settings - View your notification settings
/help - Show this help message

Your notifications are managed through the Jolt Time Mini App.
    `.trim();

    await this.sendMessage(chatId, helpText);
  }

  /**
   * Process an incoming update from Telegram.
   * 
   * @param update - Telegram update object
   */
  async processUpdate(update: TelegramUpdate): Promise<void> {
    // Handle /start command
    if (update.message?.text === '/start') {
      await this.handleStartCommand(update.message);
      return;
    }

    // Handle /settings command
    if (update.message?.text === '/settings') {
      await this.handleSettingsCommand(update.message);
      return;
    }

    // Handle /help command
    if (update.message?.text === '/help') {
      await this.handleHelpCommand(update.message);
      return;
    }

    // Update last_active_at for any message
    if (update.message?.from) {
      await this.updateLastActive(update.message.from.id);
    }
  }

  /**
   * Update last_active_at for a user based on their Telegram ID.
   */
  private async updateLastActive(telegramId: number): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .update({ last_active_at: new Date().toISOString() })
      .eq('telegram_id', telegramId);

    if (error) {
      console.error('Failed to update last_active_at:', error);
    }
  }

  /**
   * Set up bot commands menu.
   * 
   * This configures the bot's command list shown when typing /
   */
  async setCommands(): Promise<void> {
    const commands: TelegramBotCommand[] = [
      { command: 'start', description: 'Start receiving notifications' },
      { command: 'settings', description: 'View notification settings' },
      { command: 'help', description: 'Get help' }
    ];

    await fetch(
      `${TELEGRAM_API_URL}/bot${this.botToken}/setMyCommands`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commands })
      }
    );
  }

  /**
   * Get bot information.
   */
  async getMe(): Promise<{ ok: boolean; result?: { id: number; is_bot: boolean; first_name: string; username?: string } }> {
    const response = await fetch(`${TELEGRAM_API_URL}/bot${this.botToken}/getMe`);
    return response.json();
  }
}

// Singleton instance
let telegramBotServiceInstance: TelegramBotService | null = null;

export function getTelegramBotService(
  supabaseUrl?: string,
  supabaseKey?: string,
  botToken?: string
): TelegramBotService {
  if (!telegramBotServiceInstance) {
    const url = supabaseUrl || process.env.SUPABASE_URL;
    const key = supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY;
    const token = botToken || process.env.TELEGRAM_BOT_TOKEN;

    if (!url || !key || !token) {
      throw new Error('Missing required environment variables for TelegramBotService');
    }

    telegramBotServiceInstance = new TelegramBotService(url, key, token);
  }

  return telegramBotServiceInstance;
}
