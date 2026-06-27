/**
 * Telegram Core Types
 *
 * Core type definitions for Telegram integration.
 */

import type {
  TelegramPlatform,
} from './platform.types';
import type {
  TelegramTheme,
  ColorScheme,
} from './theme.types';
import type {
  LifecycleState,
  ViewportState,
} from './lifecycle.types';
import type {
  DeepLinkType,
  ParsedDeepLink,
  DeepLinkReferral,
} from './deep-link.types';
import type {
  MiniAppUser,
  MiniAppInitData,
  MiniAppCapabilities,
} from './miniapp.types';
import type {
  BotUser,
  BotChat,
  BotMessage,
  CallbackQuery,
} from './bot.types';

/**
 * Telegram SDK version constraint.
 */
export const TELEGRAM_SDK_VERSION = '7.0';
export const MIN_TELEGRAM_VERSION = '6.1';

/**
 * Core Telegram user (canonical).
 */
export interface TelegramUser extends BotUser {
  allowsWriteToPm: boolean;
}

/**
 * Current Telegram context information.
 */
export interface TelegramContext {
  user: TelegramUser | null;
  chat: BotChat | null;
  chatType: 'private' | 'group' | 'supergroup' | 'channel' | null;
  chatInstance: string | null;
  startParam: string | null;
  platform: TelegramPlatform;
  version: string | null;
  initData: string | null;
  initDataUnsafe: MiniAppInitData | null;
  isMiniApp: boolean;
  isBot: boolean;
}

/**
 * Launch parameters from Telegram.
 */
export interface LaunchParams {
  startParam?: string;
  startGroup?: boolean;
  chatType?: string;
  chatId?: number;
  userId?: number;
  hash?: string;
  authDate?: Date;
  rawQueryString?: string;
}

/**
 * Runtime context for Telegram environment.
 */
export interface RuntimeContext {
  isServer: boolean;
  isClient: boolean;
  isiframe: boolean;
  isTelegram: boolean;
  supportsViewportMeta: boolean;
  supportsDynamicMeta: boolean;
}

/**
 * SDK capabilities interface.
 */
export interface SDKCapabilities {
  hasSubscription: boolean;
  hasAccessibleTitle: boolean;
  hasSettingsButton: boolean;
  hasCloseButton: boolean;
  hasBackButton: boolean;
  hasMainButton: boolean;
  hasSwipeBehavior: boolean;
  hasNativeShare: boolean;
  hasFullscreen: boolean;
}

/**
 * Event names for Telegram SDK.
 */
export const TELEGRAM_EVENTS = {
  READY: 'ready',
  EXPAND: 'expand',
  COLLAPSE: 'collapse',
  VIEWPORT_CHANGED: 'viewport_changed',
  THEME_CHANGED: 'theme_changed',
  MAIN_BUTTON_CLICKED: 'main_button_clicked',
  BACK_BUTTON_CLICKED: 'back_button_clicked',
  SETTINGS_BUTTON_CLICKED: 'settings_button_clicked',
  INVOICE_CLOSED: 'invoice_closed',
  SETUP_CLOSE_BTN_CLICKED: 'setup_close_btn_clicked',
  CLOSE_BTN_CLICKED: 'close_btn_clicked',
  SWIPE_DOWN: 'swipe_down',
  SWIPE_UP: 'swipe_up',
} as const;

/**
 * Supported haptic feedback types.
 */
export const HAPTIC_FEEDBACK_TYPES = {
  IMPACT: 'impact',
  NOTIFICATION: 'notification',
  SELECTION: 'selection',
} as const;

/**
 * Impact feedback styles.
 */
export const IMPACT_FEEDBACK_STYLES = {
  LIGHT: 'light',
  MEDIUM: 'medium',
  HEAVY: 'heavy',
  RIGID: 'rigid',
  SOFT: 'soft',
} as const;

/**
 * Notification feedback types.
 */
export const NOTIFICATION_FEEDBACK_TYPES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

export type {
  TelegramPlatform,
  TelegramTheme,
  ColorScheme,
  LifecycleState,
  ViewportState,
  DeepLinkType,
  ParsedDeepLink,
  DeepLinkReferral,
  MiniAppUser,
  MiniAppInitData,
  MiniAppCapabilities,
  BotUser,
  BotChat,
  BotMessage,
  CallbackQuery,
};
