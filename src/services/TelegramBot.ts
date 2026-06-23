/**
 * TelegramBot
 * 
 * Main bot class that handles all Telegram interactions.
 * 
 * Architecture:
 * - Receives updates via webhook (Supabase Edge Function)
 * - Processes commands and callbacks
 * - Integrates with BotService for sending messages
 * - Uses BotLogger for analytics
 * - Uses Localization for i18n
 * 
 * Commands implemented:
 * - /start - Welcome user, create/link account
 * - /profile - Show user profile (placeholder)
 * - /help - Show help (placeholder)
 * - /settings - Show settings menu (placeholder)
 * - /daily - Daily reward info (placeholder)
 * - /events - Show events (placeholder)
 * 
 * Scheduler compatibility:
 * - Designed to support scheduled notifications later:
 *   - Daily reminders
 *   - Expedition completion notifications
 *   - Academy completion notifications
 *   - Event announcements
 *   - AdsGram campaign notifications (placeholder, not implemented)
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BotService, InlineKeyboardMarkup } from './BotService';
import { InlineKeyboard, InlineKeyboards } from './InlineKeyboard';
import { BotLogger, BotLogger as LoggerClass } from './BotLogger';
import { Language, getUserLanguage, setUserLanguage, tl, getTranslation, isValidLanguage, DEFAULT_LANGUAGE } from './Localization';
import { TelegramUpdate, TelegramMessage, TelegramUser, TelegramCallbackQuery } from './BotService';

// Mini App URL - should be configured via environment
const MINI_APP_URL = process.env.TELEGRAM_MINI_APP_URL || 'https://t.me/yourbot/jolttime';

export interface BotConfig {
  supabaseUrl: string;
  supabaseKey: string;
  botToken: string;
  miniAppUrl?: string;
}

export interface ProcessedUpdate {
  success: boolean;
  error?: string;
}

/**
 * Error handling wrapper that ensures bot crashes never stop the application.
 */
async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorMessage: string,
  logger?: BotLogger,
  telegramId?: number
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    
    if (logger && telegramId) {
      await logger.logError(
        telegramId,
        error instanceof Error ? error.message : String(error),
        errorMessage,
        error instanceof Error ? error.stack : undefined
      );
    }
    
    return null;
  }
}

export class TelegramBot {
  private supabase: SupabaseClient;
  private botService: BotService;
  private botLogger: BotLogger;
  private miniAppUrl: string;

  constructor(config: BotConfig) {
    this.supabase = createClient(config.supabaseUrl, config.supabaseKey);
    this.botService = new BotService(config.supabaseUrl, config.supabaseKey, config.botToken);
    this.botLogger = new BotLogger(config.supabaseUrl, config.supabaseKey);
    this.miniAppUrl = config.miniAppUrl || MINI_APP_URL;
  }

  // =========================================================================
  // UPDATE PROCESSING
  // =========================================================================

  /**
   * Process an incoming Telegram update.
   * 
   * This is the main entry point for all bot updates.
   * Wrapped in error handling to ensure resilience.
   */
  async processUpdate(update: TelegramUpdate): Promise<ProcessedUpdate> {
    try {
      // Handle callback queries
      if (update.callback_query) {
        return await this.handleCallbackQuery(update.callback_query);
      }

      // Handle messages
      if (update.message) {
        return await this.handleMessage(update.message);
      }

      // Handle edited messages
      if (update.edited_message) {
        // For now, we don't process edited messages
        return { success: true };
      }

      return { success: true };
    } catch (error) {
      console.error('Bot: Unhandled error processing update:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Handle an incoming message.
   */
  private async handleMessage(message: TelegramMessage): Promise<ProcessedUpdate> {
    const { from, chat, text } = message;

    if (!from || !chat || !text) {
      return { success: true }; // Ignore messages without user or text
    }

    // Log the message
    await this.botLogger.log(
      from.id,
      'message',
      { messageId: message.message_id, text },
      chat.id,
      message.message_id
    );

    // Update last active
    await this.updateLastActive(from.id);

    // Check if it's a command
    if (text.startsWith('/')) {
      return await this.handleCommand(from, chat.id, text, message.message_id);
    }

    // For non-command messages, just update activity
    return { success: true };
  }

  /**
   * Handle a command message.
   */
  private async handleCommand(
    user: TelegramUser,
    chatId: number,
    text: string,
    messageId: number
  ): Promise<ProcessedUpdate> {
    const parts = text.slice(1).split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    // Log command usage
    await this.botLogger.logCommand(user.id, `/${command}`, chatId, args);

    // Route to appropriate handler
    switch (command) {
      case 'start':
        return await this.commandStart(user, chatId);
      
      case 'profile':
        return await this.commandProfile(user, chatId);
      
      case 'help':
        return await this.commandHelp(user, chatId);
      
      case 'settings':
        return await this.commandSettings(user, chatId);
      
      case 'daily':
        return await this.commandDaily(user, chatId);
      
      case 'events':
        return await this.commandEvents(user, chatId);
      
      default:
        return await this.commandUnknown(user, chatId, command);
    }
  }

  /**
   * Handle callback query from inline button.
   */
  private async handleCallbackQuery(query: TelegramCallbackQuery): Promise<ProcessedUpdate> {
    const { id, from, data, message } = query;

    if (!data) {
      return { success: true };
    }

    // Log callback
    await this.botLogger.logCallback(
      from.id,
      data,
      message?.message_id,
      message?.chat.id
    );

    // Answer callback immediately to stop loading indicator
    await this.botService.answerCallbackQuery(id);

    // Update last active
    await this.updateLastActive(from.id);

    // Route callback
    const chatId = message?.chat.id;
    if (!chatId) {
      return { success: true };
    }

    // Parse callback data
    const [prefix, ...rest] = data.split('_');
    const payload = rest.join('_');

    switch (prefix) {
      // Navigation
      case 'main':
        return await this.showMainMenu(from, chatId);
      
      case 'settings':
        return await this.callbackSettings(from, chatId, rest);
      
      case 'lang':
        return await this.callbackLanguage(from, chatId, data);
      
      case 'notif':
        return await this.callbackNotificationToggle(from, chatId, data);
      
      // Mini App
      case 'mini':
        return await this.callbackMiniApp(from, chatId, rest);
      
      // Placeholder for future callbacks
      default:
        // Answer with generic message
        await this.botService.answerCallbackQuery(id, 'Coming soon!', true);
        return { success: true };
    }
  }

  // =========================================================================
  // COMMAND HANDLERS
  // =========================================================================

  /**
   * /start command - Welcome user and create/link account.
   */
  private async commandStart(user: TelegramUser, chatId: number): Promise<ProcessedUpdate> {
    const language = (user.language_code && isValidLanguage(user.language_code)) 
      ? user.language_code as Language 
      : DEFAULT_LANGUAGE;

    // Register or update user
    await this.registerUser(user, chatId);

    // Get or create bot_user record
    const botUser = await this.getOrCreateBotUser(user, chatId, language);

    // Build welcome message
    const isNewUser = !botUser.is_bot_started;
    const title = tl(language, 'welcome.title');
    const message = tl(language, 'welcome.message');
    
    let welcomeText = `${title}\n\n${message}`;
    if (isNewUser) {
      welcomeText += `\n\n${tl(language, 'welcome.registered')}`;
    }

    // Create inline keyboard with Mini App button
    const keyboard = InlineKeyboards.openMiniApp(`${this.miniAppUrl}?start=bot`);

    // Send welcome message
    await this.botService.sendMessage(chatId, welcomeText, { replyMarkup: keyboard });

    // Mark bot as started for this user
    if (isNewUser) {
      await this.markBotStarted(user.id);
    }

    return { success: true };
  }

  /**
   * /profile command - Show user profile (placeholder).
   */
  private async commandProfile(user: TelegramUser, chatId: number): Promise<ProcessedUpdate> {
    const language = await getUserLanguage(user.id);
    const title = tl(language, 'profile.title');

    // Get linked game user data
    const { data: botUser } = await this.supabase
      .from('bot_users')
      .select('linked_user_id')
      .eq('telegram_id', user.id)
      .single();

    if (!botUser?.linked_user_id) {
      await this.botService.sendMessage(chatId, tl(language, 'profile.notFound'));
      return { success: true };
    }

    // TODO: Fetch actual game profile data
    const profileText = `
${title}

👤 ${user.first_name}
🌐 @${user.username || 'Not set'}
📅 ${tl(language, 'profile.joined')}: ${new Date().toLocaleDateString()}

⚙️ Profile coming soon!
    `.trim();

    const keyboard = InlineKeyboard.create()
      .addButton({ text: '🔙 Back to Menu', callbackData: 'main_menu' })
      .build();

    await this.botService.sendMessage(chatId, profileText, { replyMarkup: keyboard });

    return { success: true };
  }

  /**
   * /help command - Show help (placeholder).
   */
  private async commandHelp(user: TelegramUser, chatId: number): Promise<ProcessedUpdate> {
    const language = await getUserLanguage(user.id);
    
    const helpText = `
📖 <b>Jolt Time Bot Help</b>

<b>Commands:</b>
/start - Get started
/profile - View your profile
/settings - Manage settings
/daily - Daily reward info
/events - View active events
/help - Show this help

<b>How to Play:</b>
Open the Mini App using the button below to start playing Jolt Time!

<b>Notifications:</b>
The bot will send you notifications about:
⚡ Energy restoration
🏆 Expedition completion
🔬 Research completion
🏗️ Building upgrades
🎉 Special events

You can manage your notification preferences with /settings.
    `.trim();

    const keyboard = InlineKeyboards.openMiniApp(this.miniAppUrl);
    await this.botService.sendMessage(chatId, helpText, { replyMarkup: keyboard });

    return { success: true };
  }

  /**
   * /settings command - Show settings menu (placeholder).
   */
  private async commandSettings(user: TelegramUser, chatId: number): Promise<ProcessedUpdate> {
    return await this.showSettingsMenu(user, chatId);
  }

  /**
   * /daily command - Daily reward info (placeholder).
   */
  private async commandDaily(user: TelegramUser, chatId: number): Promise<ProcessedUpdate> {
    const language = await getUserLanguage(user.id);
    
    const dailyText = `
🎁 <b>${tl(language, 'daily.title')}</b>

⏰ Your daily reward is available!

🔥 ${tl(language, 'daily.streak')}: 5 days

Click below to claim your reward and keep your streak going!
    `.trim();

    const keyboard = InlineKeyboard.create()
      .addRow([
        { text: '🎁 Claim Now', url: `${this.miniAppUrl}?action=daily` },
        { text: '📊 Stats', callbackData: 'daily_stats' }
      ])
      .addButton({ text: '🔙 Back', callbackData: 'main_menu' })
      .build();

    await this.botService.sendMessage(chatId, dailyText, { replyMarkup: keyboard });

    return { success: true };
  }

  /**
   * /events command - Show events (placeholder).
   */
  private async commandEvents(user: TelegramUser, chatId: number): Promise<ProcessedUpdate> {
    const language = await getUserLanguage(user.id);
    
    const eventsText = `
🎉 <b>${tl(language, 'events.title')}</b>

${tl(language, 'events.noEvents')}

Stay tuned for upcoming events!
    `.trim();

    const keyboard = InlineKeyboard.create()
      .addButton({ text: '🔙 Back to Menu', callbackData: 'main_menu' })
      .build();

    await this.botService.sendMessage(chatId, eventsText, { replyMarkup: keyboard });

    return { success: true };
  }

  /**
   * Handle unknown command.
   */
  private async commandUnknown(user: TelegramUser, chatId: number, command: string): Promise<ProcessedUpdate> {
    const language = await getUserLanguage(user.id);
    await this.botService.sendMessage(chatId, `${tl(language, 'commands.unknown')}: /${command}`);
    return { success: true };
  }

  // =========================================================================
  // CALLBACK HANDLERS
  // =========================================================================

  /**
   * Show main menu.
   */
  private async showMainMenu(user: TelegramUser, chatId: number): Promise<ProcessedUpdate> {
    const language = await getUserLanguage(user.id);
    
    const menuText = `
🏠 <b>Main Menu</b>

Welcome back, ${user.first_name}!

What would you like to do?
    `.trim();

    const keyboard = InlineKeyboard.create()
      .addRow([
        { text: '👤 Profile', callbackData: 'profile' },
        { text: '🎁 Daily', callbackData: 'daily' }
      ])
      .addRow([
        { text: '🎉 Events', callbackData: 'events' },
        { text: '⚙️ Settings', callbackData: 'settings_main' }
      ])
      .addRow([
        { text: '❓ Help', callbackData: 'help' },
        { text: '🎮 Play', url: this.miniAppUrl }
      ])
      .build();

    await this.botService.sendMessage(chatId, menuText, { replyMarkup: keyboard });

    return { success: true };
  }

  /**
   * Show settings menu.
   */
  private async showSettingsMenu(user: TelegramUser, chatId: number): Promise<ProcessedUpdate> {
    const language = await getUserLanguage(user.id);

    // Get user's current preferences
    const { data: botUser } = await this.supabase
      .from('bot_users')
      .select('linked_user_id, language_code')
      .eq('telegram_id', user.id)
      .single();

    const settingsText = `
⚙️ <b>${tl(language, 'settings.title')}</b>

Manage your bot preferences below.
    `.trim();

    const keyboard = InlineKeyboard.create()
      .addRow([
        { text: '🔔 Notifications', callbackData: 'settings_notifications' },
        { text: '🌐 Language', callbackData: 'settings_language' }
      ])
      .addRow([
        { text: '🔗 Link Account', callbackData: 'settings_link' }
      ])
      .addButton({ text: '🔙 Back to Menu', callbackData: 'main_menu' })
      .build();

    await this.botService.sendMessage(chatId, settingsText, { replyMarkup: keyboard });

    return { success: true };
  }

  /**
   * Handle settings callback.
   */
  private async callbackSettings(user: TelegramUser, chatId: number, rest: string[]): Promise<ProcessedUpdate> {
    const action = rest[0];

    switch (action) {
      case 'main':
        return await this.showSettingsMenu(user, chatId);
      
      case 'notifications':
        return await this.showNotificationSettings(user, chatId);
      
      case 'language':
        return await this.showLanguageSettings(user, chatId);
      
      case 'link':
        return await this.showLinkAccount(user, chatId);
      
      default:
        return { success: true };
    }
  }

  /**
   * Show notification settings.
   */
  private async showNotificationSettings(user: TelegramUser, chatId: number): Promise<ProcessedUpdate> {
    const language = await getUserLanguage(user.id);

    // Get user preferences
    const { data: botUser } = await this.supabase
      .from('bot_users')
      .select('linked_user_id')
      .eq('telegram_id', user.id)
      .single();

    let notificationsEnabled = true;
    let eventsEnabled = true;
    let researchEnabled = true;
    let energyEnabled = true;
    let buildingEnabled = true;

    if (botUser?.linked_user_id) {
      const { data: prefs } = await this.supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', botUser.linked_user_id)
        .single();

      if (prefs) {
        notificationsEnabled = prefs.daily_reminders;
        eventsEnabled = prefs.events;
        researchEnabled = prefs.research_complete;
        energyEnabled = prefs.energy_restored;
        buildingEnabled = prefs.building_complete;
      }
    }

    const status = (enabled: boolean) => enabled ? '🔔' : '🔕';

    const text = `
🔔 <b>${tl(language, 'settings.notifications')}</b>

${status(notificationsEnabled)} ${tl(language, 'notifications.dailyReminders')}
${status(eventsEnabled)} ${tl(language, 'notifications.events')}
${status(researchEnabled)} ${tl(language, 'notifications.researchComplete')}
${status(energyEnabled)} ${tl(language, 'notifications.energyRestored')}
${status(buildingEnabled)} ${tl(language, 'notifications.buildingComplete')}

<i>Use the Mini App to change these settings.</i>
    `.trim();

    const keyboard = InlineKeyboard.create()
      .addButton({ text: '🔙 Back', callbackData: 'settings_main' })
      .build();

    await this.botService.sendMessage(chatId, text, { replyMarkup: keyboard });

    return { success: true };
  }

  /**
   * Show language settings.
   */
  private async showLanguageSettings(user: TelegramUser, chatId: number): Promise<ProcessedUpdate> {
    const currentLanguage = await getUserLanguage(user.id);

    const text = `
🌐 <b>${tl(currentLanguage, 'settings.language')}</b>

Select your preferred language.
    `.trim();

    const keyboard = InlineKeyboard.create()
      .addRow([
        { 
          text: `🇬🇧 English ${currentLanguage === 'en' ? '✅' : ''}`, 
          callbackData: 'lang_en' 
        },
        { 
          text: `🇺🇦 Українська ${currentLanguage === 'uk' ? '✅' : ''}`, 
          callbackData: 'lang_uk' 
        }
      ])
      .addButton({ text: '🔙 Back', callbackData: 'settings_main' })
      .build();

    await this.botService.sendMessage(chatId, text, { replyMarkup: keyboard });

    return { success: true };
  }

  /**
   * Show link account.
   */
  private async showLinkAccount(user: TelegramUser, chatId: number): Promise<ProcessedUpdate> {
    const language = await getUserLanguage(user.id);

    // Check if already linked
    const { data: botUser } = await this.supabase
      .from('bot_users')
      .select('linked_user_id')
      .eq('telegram_id', user.id)
      .single();

    let statusText: string;
    let keyboard: InlineKeyboardMarkup;

    if (botUser?.linked_user_id) {
      statusText = tl(language, 'miniApp.linked');
      keyboard = InlineKeyboard.create()
        .addButton({ text: '🔙 Back', callbackData: 'settings_main' })
        .build();
    } else {
      statusText = tl(language, 'miniApp.openToLink');
      keyboard = InlineKeyboard.create()
        .addButton({ text: '🔗 Open to Link', url: `${this.miniAppUrl}?action=link` })
        .addButton({ text: '🔙 Back', callbackData: 'settings_main' })
        .build();
    }

    await this.botService.sendMessage(chatId, statusText, { replyMarkup: keyboard });

    return { success: true };
  }

  /**
   * Handle language change callback.
   */
  private async callbackLanguage(user: TelegramUser, chatId: number, data: string): Promise<ProcessedUpdate> {
    const newLang = data.replace('lang_', '');
    
    if (!isValidLanguage(newLang)) {
      return { success: false, error: 'Invalid language' };
    }

    const oldLanguage = await getUserLanguage(user.id);
    
    // Update language in cache and database
    await setUserLanguage(user.id, newLang as Language);

    // Update bot_users table
    await this.supabase
      .from('bot_users')
      .update({ language_code: newLang })
      .eq('telegram_id', user.id);

    // Log the change
    await this.botLogger.logLanguageChanged(user.id, oldLanguage, newLang, chatId);

    // Show confirmation
    await this.botService.answerCallbackQuery(
      `callback_${user.id}`,
      `Language changed to ${newLang === 'en' ? 'English' : 'Українська'}`,
      false
    );

    return { success: true };
  }

  /**
   * Handle notification toggle callback.
   */
  private async callbackNotificationToggle(user: TelegramUser, chatId: number, data: string): Promise<ProcessedUpdate> {
    // TODO: Implement notification toggle
    // Format: notif_toggle_category_on/off
    await this.botService.answerCallbackQuery(`callback_${user.id}`, 'Coming soon!', true);
    return { success: true };
  }

  /**
   * Handle Mini App callback.
   */
  private async callbackMiniApp(user: TelegramUser, chatId: number, rest: string[]): Promise<ProcessedUpdate> {
    const action = rest[0];

    switch (action) {
      case 'open':
        await this.botLogger.logMiniAppOpened(user.id, chatId);
        break;
      // Add more Mini App actions here
    }

    return { success: true };
  }

  // =========================================================================
  // DATABASE HELPERS
  // =========================================================================

  /**
   * Register or update a game user.
   */
  private async registerUser(user: TelegramUser, chatId: number): Promise<void> {
    // Check if user exists by telegram_id
    const { data: existing } = await this.supabase
      .from('users')
      .select('id')
      .eq('telegram_id', user.id)
      .single();

    if (!existing) {
      // Create new user
      await this.supabase.from('users').insert({
        telegram_id: user.id,
        username: user.username,
        chat_id: chatId,
        notifications_enabled: true,
        last_active_at: new Date().toISOString()
      });
    } else {
      // Update existing user
      await this.supabase
        .from('users')
        .update({
          username: user.username,
          chat_id: chatId,
          last_active_at: new Date().toISOString()
        })
        .eq('telegram_id', user.id);
    }
  }

  /**
   * Get or create bot_user record.
   */
  private async getOrCreateBotUser(
    user: TelegramUser, 
    chatId: number, 
    language: Language
  ): Promise<{
    id: string;
    is_bot_started: boolean;
    linked_user_id: string | null;
  }> {
    const { data: existing } = await this.supabase
      .from('bot_users')
      .select('id, is_bot_started, linked_user_id')
      .eq('telegram_id', user.id)
      .single();

    if (existing) {
      // Update chat_id if changed
      if (existing.id) {
        await this.supabase
          .from('bot_users')
          .update({ chat_id: chatId })
          .eq('telegram_id', user.id);
      }
      return existing;
    }

    // Create new bot_user
    const languageCode = user.language_code || language;
    const { data: newUser } = await this.supabase
      .from('bot_users')
      .insert({
        telegram_id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        language_code: isValidLanguage(languageCode) ? languageCode : DEFAULT_LANGUAGE,
        chat_id: chatId,
        is_bot_started: false
      })
      .select('id, is_bot_started, linked_user_id')
      .single();

    return newUser || { id: '', is_bot_started: false, linked_user_id: null };
  }

  /**
   * Mark bot as started for a user.
   */
  private async markBotStarted(telegramId: number): Promise<void> {
    await this.supabase
      .from('bot_users')
      .update({ is_bot_started: true })
      .eq('telegram_id', telegramId);
  }

  /**
   * Update user's last active timestamp.
   */
  private async updateLastActive(telegramId: number): Promise<void> {
    await this.supabase
      .from('users')
      .update({ last_active_at: new Date().toISOString() })
      .eq('telegram_id', telegramId);
  }

  // =========================================================================
  // SCHEDULER COMPATIBILITY (Future)
  // =========================================================================

  /**
   * Send a notification to a user.
   * 
   * This method is designed to be called by the scheduler for:
   * - Daily reminders
   * - Expedition completion
   * - Academy completion
   * - Event announcements
   * - AdsGram campaign notifications (placeholder)
   */
  async sendScheduledNotification(
    telegramId: number,
    type: 'daily_reminder' | 'expedition_complete' | 'research_complete' | 'event_announcement' | 'adsgram',
    data: Record<string, unknown>
  ): Promise<boolean> {
    try {
      // Get user's chat_id
      const { data: botUser } = await this.supabase
        .from('bot_users')
        .select('chat_id, is_blocked')
        .eq('telegram_id', telegramId)
        .single();

      if (!botUser || !botUser.chat_id || botUser.is_blocked) {
        return false;
      }

      const language = await getUserLanguage(telegramId);
      let message: string;
      let keyboard: InlineKeyboardMarkup | undefined;

      switch (type) {
        case 'daily_reminder':
          message = `⏰ ${tl(language, 'daily.notAvailable')}`;
          keyboard = InlineKeyboards.dailyReward();
          break;

        case 'expedition_complete':
          message = `🏆 Expedition "${data.name}" is complete!`;
          break;

        case 'research_complete':
          message = `🔬 Research complete! New technologies available.`;
          break;

        case 'event_announcement':
          message = `🎉 ${data.message}`;
          if (data.eventId) {
            keyboard = InlineKeyboards.eventNotification(String(data.name), String(data.eventId));
          }
          break;

        case 'adsgram':
          // Placeholder for AdsGram integration
          message = `📢 ${data.message}`;
          break;

        default:
          return false;
      }

      const result = await this.botService.sendMessage(botUser.chat_id, message, { replyMarkup: keyboard });

      if (result) {
        await this.botLogger.logNotification(telegramId, type);
      }

      return !!result;
    } catch (error) {
      console.error('Bot: Failed to send scheduled notification:', error);
      await this.botLogger.logNotificationError(
        telegramId, 
        type, 
        error instanceof Error ? error.message : String(error)
      );
      return false;
    }
  }

  // =========================================================================
  // UTILITY METHODS
  // =========================================================================

  /**
   * Set up bot commands menu.
   */
  async setupCommands(): Promise<void> {
    const commands = [
      { command: 'start', description: 'Get started with Jolt Time' },
      { command: 'profile', description: 'View your game profile' },
      { command: 'settings', description: 'Manage your settings' },
      { command: 'daily', description: 'Claim your daily reward' },
      { command: 'events', description: 'View active events' },
      { command: 'help', description: 'Get help' }
    ];

    await this.botService.setCommands(commands);
  }

  /**
   * Get bot information.
   */
  async getBotInfo(): Promise<{ id: number; username: string; first_name: string } | null> {
    return await this.botService.getMe();
  }
}

// Singleton instance
let telegramBotInstance: TelegramBot | null = null;

export function getTelegramBot(config: BotConfig): TelegramBot {
  if (!telegramBotInstance) {
    telegramBotInstance = new TelegramBot(config);
  }
  return telegramBotInstance;
}
