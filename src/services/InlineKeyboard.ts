/**
 * InlineKeyboard Helper
 * 
 * Utility for creating Telegram inline keyboard markups.
 * Supports:
 * - URL buttons (open URLs)
 * - Callback buttons (trigger callback_data)
 * - Combined layouts with multiple rows
 * 
 * Usage:
 * 
 * ```typescript
 * import { InlineKeyboard } from './InlineKeyboard';
 * 
 * // Simple URL button
 * const keyboard = InlineKeyboard.create()
 *   .addButton({ text: 'Open App', url: 'https://t.me/yourbot/app' });
 * 
 * // Callback button
 * const keyboard = InlineKeyboard.create()
 *   .addButton({ text: 'Settings', callbackData: 'settings' });
 * 
 * // Multiple rows
 * const keyboard = InlineKeyboard.create()
 *   .addRow([
 *     { text: '⚙️ Settings', callbackData: 'settings' },
 *     { text: '📊 Stats', callbackData: 'stats' }
 *   ])
 *   .addRow([
 *     { text: '🌐 English', callbackData: 'lang_en' },
 *     { text: '🌐 Українська', callbackData: 'lang_uk' }
 *   ])
 *   .addButton({ text: 'Open Mini App', url: 'https://t.me/yourbot/app' });
 * ```
 */

import { InlineKeyboardMarkup, InlineKeyboardButton } from './BotService';

export interface ButtonOptions {
  /** Button text displayed to user */
  text: string;
  /** URL to open when button is clicked */
  url?: string;
  /** Callback data sent back when button is clicked */
  callbackData?: string;
}

export class InlineKeyboard {
  private rows: InlineKeyboardButton[][] = [];

  /**
   * Create a new InlineKeyboard builder.
   */
  static create(): InlineKeyboard {
    return new InlineKeyboard();
  }

  /**
   * Add a single button to a new row.
   * 
   * @param options - Button options (text + url or callbackData)
   */
  addButton(options: ButtonOptions): this {
    this.rows.push([this.createButton(options)]);
    return this;
  }

  /**
   * Add multiple buttons to a new row.
   * 
   * @param buttons - Array of button options
   */
  addRow(buttons: ButtonOptions[]): this {
    this.rows.push(buttons.map(b => this.createButton(b)));
    return this;
  }

  /**
   * Add a URL button (opens web page).
   * 
   * @param text - Button text
   * @param url - Web URL
   */
  addUrlButton(text: string, url: string): this {
    return this.addButton({ text, url });
  }

  /**
   * Add a callback button (sends callback_data).
   * 
   * @param text - Button text
   * @param callbackData - Data sent back to bot
   */
  addCallbackButton(text: string, callbackData: string): this {
    return this.addButton({ text, callbackData });
  }

  /**
   * Build the final InlineKeyboardMarkup for Telegram API.
   */
  build(): InlineKeyboardMarkup {
    return { inlineKeyboard: this.rows };
  }

  /**
   * Convert to JSON-compatible object.
   */
  toJSON(): InlineKeyboardMarkup {
    return this.build();
  }

  /**
   * Create a single button object from options.
   */
  private createButton(options: ButtonOptions): InlineKeyboardButton {
    const button: InlineKeyboardButton = { text: options.text };

    if (options.url) {
      button.url = options.url;
    } else if (options.callbackData) {
      button.callbackData = options.callbackData;
    }

    return button;
  }
}

// =============================================================================
// PRE-BUILT KEYBOARDS
// =============================================================================

/**
 * Factory for common keyboard layouts.
 */
export class InlineKeyboards {
  /**
   * "Open Mini App" button keyboard.
   * 
   * @param appUrl - Mini App URL
   */
  static openMiniApp(appUrl: string): InlineKeyboardMarkup {
    return InlineKeyboard.create()
      .addButton({
        text: '🎮 Open Jolt Time',
        url: appUrl
      })
      .build();
  }

  /**
   * Yes/No confirmation keyboard.
   * 
   * @param yesData - Callback data for Yes button
   * @param noData - Callback data for No button
   */
  static confirm(yesData: string, noData: string): InlineKeyboardMarkup {
    return InlineKeyboard.create()
      .addRow([
        { text: '✅ Yes', callbackData: yesData },
        { text: '❌ No', callbackData: noData }
      ])
      .build();
  }

  /**
   * Language selection keyboard.
   */
  static languageSelect(): InlineKeyboardMarkup {
    return InlineKeyboard.create()
      .addRow([
        { text: '🇬🇧 English', callbackData: 'lang_en' },
        { text: '🇺🇦 Українська', callbackData: 'lang_uk' }
      ])
      .build();
  }

  /**
   * Settings menu keyboard.
   */
  static settingsMenu(): InlineKeyboardMarkup {
    return InlineKeyboard.create()
      .addRow([
        { text: '⚙️ Notifications', callbackData: 'settings_notifications' },
        { text: '🌐 Language', callbackData: 'settings_language' }
      ])
      .addRow([
        { text: '👤 Profile', callbackData: 'profile' },
        { text: '❓ Help', callbackData: 'help' }
      ])
      .build();
  }

  /**
   * Back to main menu keyboard.
   */
  static backToMain(): InlineKeyboardMarkup {
    return InlineKeyboard.create()
      .addButton({ text: '🔙 Back to Menu', callbackData: 'main_menu' })
      .build();
  }

  /**
   * Pagination keyboard for lists.
   * 
   * @param page - Current page (0-indexed)
   * @param totalPages - Total number of pages
   * @param prefix - Callback data prefix (e.g., 'expeditions')
   */
  static pagination(page: number, totalPages: number, prefix: string): InlineKeyboardMarkup {
    const keyboard = InlineKeyboard.create();
    
    const buttons: ButtonOptions[] = [];
    
    if (page > 0) {
      buttons.push({ text: '⬅️ Prev', callbackData: `${prefix}_page_${page - 1}` });
    }
    
    buttons.push({ text: `${page + 1}/${totalPages}`, callbackData: 'noop' });
    
    if (page < totalPages - 1) {
      buttons.push({ text: 'Next ➡️', callbackData: `${prefix}_page_${page + 1}` });
    }
    
    if (buttons.length > 1) {
      keyboard.addRow(buttons);
    }
    
    keyboard.addButton({ text: '🔙 Back', callbackData: 'main_menu' });
    
    return keyboard.build();
  }

  /**
   * Notification toggle keyboard.
   * 
   * @param category - Notification category
   * @param enabled - Current state
   */
  static notificationToggle(category: string, enabled: boolean): InlineKeyboardMarkup {
    const newState = enabled ? 'off' : 'on';
    const statusEmoji = enabled ? '🔔' : '🔕';
    
    return InlineKeyboard.create()
      .addRow([
        { 
          text: `${statusEmoji} ${enabled ? 'Disable' : 'Enable'}`, 
          callbackData: `notif_toggle_${category}_${newState}` 
        }
      ])
      .addButton({ text: '🔙 Back', callbackData: 'settings_notifications' })
      .build();
  }

  /**
   * Event notification keyboard with details.
   */
  static eventNotification(eventName: string, eventId: string): InlineKeyboardMarkup {
    return InlineKeyboard.create()
      .addRow([
        { text: '🎮 Play Now', callbackData: `event_join_${eventId}` },
        { text: '📋 Details', callbackData: `event_details_${eventId}` }
      ])
      .addButton({ text: '🔕 Hide', callbackData: `event_hide_${eventId}` })
      .build();
  }

  /**
   * Daily reward claim keyboard.
   */
  static dailyReward(): InlineKeyboardMarkup {
    return InlineKeyboard.create()
      .addRow([
        { text: '🎁 Claim Reward', callbackData: 'daily_claim' },
        { text: '📊 Streak Info', callbackData: 'daily_streak' }
      ])
      .build();
  }
}
