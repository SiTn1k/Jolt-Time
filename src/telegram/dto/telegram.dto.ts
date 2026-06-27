/**
 * Telegram DTOs
 *
 * Data Transfer Objects for Telegram integration.
 */

import type {
  TelegramUser,
  TelegramPlatform,
  LaunchParams,
} from '../types/telegram.types';
import type { TelegramTheme } from '../types/theme.types';
import type { LifecycleState, ViewportState } from '../types/lifecycle.types';
import type { ParsedDeepLink } from '../types/deep-link.types';

/**
 * Telegram context DTO for API responses.
 */
export interface TelegramContextDTO {
  user: TelegramUserDTO | null;
  platform: TelegramPlatform;
  version: string | null;
  startParam: string | null;
  isMiniApp: boolean;
  isPremium: boolean;
}

/**
 * Telegram user DTO.
 */
export interface TelegramUserDTO {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  isPremium: boolean;
  isBot: boolean;
}

/**
 * Telegram init data DTO for authentication.
 */
export interface TelegramInitDataDTO {
  queryId: string | null;
  user: TelegramUserDTO | null;
  authDate: string | null;
  startParam: string | null;
  chatType: string | null;
  chatId: number | null;
  hash: string;
}

/**
 * Telegram theme DTO.
 */
export interface TelegramThemeDTO {
  colors: Record<string, string>;
  colorScheme: 'light' | 'dark';
  isDark: boolean;
  botVersion: string | null;
}

/**
 * Telegram viewport DTO.
 */
export interface TelegramViewportDTO {
  height: number;
  width: number;
  isExpanded: boolean;
  isStable: boolean;
  scrollTop: number;
}

/**
 * Telegram lifecycle event DTO.
 */
export interface TelegramLifecycleEventDTO {
  state: LifecycleState;
  timestamp: string;
  previousState: LifecycleState | null;
  viewport: TelegramViewportDTO | null;
}

/**
 * Deep link DTO for referral tracking.
 */
export interface DeepLinkDTO {
  type: string;
  campaign: string | null;
  referralUserId: number | null;
  additionalParams: Record<string, string>;
  raw: string;
}

/**
 * Bot update DTO from webhook.
 */
export interface BotUpdateDTO {
  updateId: number;
  message: BotMessageDTO | null;
  callbackQuery: BotCallbackQueryDTO | null;
  editedMessage: BotMessageDTO | null;
}

/**
 * Bot message DTO.
 */
export interface BotMessageDTO {
  messageId: number;
  from: TelegramUserDTO | null;
  chat: BotChatDTO;
  date: number;
  text: string | null;
  entities: BotMessageEntityDTO[];
}

/**
 * Bot chat DTO.
 */
export interface BotChatDTO {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Bot message entity DTO.
 */
export interface BotMessageEntityDTO {
  type: string;
  offset: number;
  length: number;
  url?: string;
  user?: TelegramUserDTO;
}

/**
 * Bot callback query DTO.
 */
export interface BotCallbackQueryDTO {
  id: string;
  from: TelegramUserDTO;
  chat: BotChatDTO | null;
  inlineMessageId: string | null;
  data: string | null;
}

/**
 * Stars transaction DTO.
 */
export interface StarsTransactionDTO {
  id: string;
  userId: number;
  amount: number;
  currency: string;
  type: 'payment' | 'refund' | 'withdrawal' | 'invoice';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  title: string | null;
  payload: string | null;
  telegramPaymentChargeId: string | null;
  createdAt: string;
}

/**
 * Notification DTO.
 */
export interface NotificationDTO {
  id: string;
  userId: number;
  type: string;
  title: string;
  body: string;
  sentAt: string;
  deliveredAt: string | null;
  readAt: string | null;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
}

/**
 * Convert Telegram user to DTO.
 */
export function toTelegramUserDTO(user: TelegramUser | null): TelegramUserDTO | null {
  if (!user) return null;
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    isPremium: user.isPremium,
    isBot: user.isBot,
  };
}

/**
 * Convert theme to DTO.
 */
export function toThemeDTO(theme: TelegramTheme): TelegramThemeDTO {
  return {
    colors: theme.colors as unknown as Record<string, string>,
    colorScheme: theme.colorScheme === 'dark' ? 'dark' : 'light',
    isDark: theme.isDark,
    botVersion: theme.botVersion,
  };
}

/**
 * Convert deep link to DTO.
 */
export function toDeepLinkDTO(deepLink: ParsedDeepLink): DeepLinkDTO {
  return {
    type: deepLink.type,
    campaign: (deepLink.campaign as { campaign?: string })?.campaign ?? null,
    referralUserId: deepLink.referral?.userId ?? null,
    additionalParams: deepLink.additionalParams,
    raw: deepLink.raw,
  };
}

/**
 * Convert viewport to DTO.
 */
export function toViewportDTO(viewport: ViewportState): TelegramViewportDTO {
  return {
    height: viewport.height,
    width: viewport.width,
    isExpanded: viewport.isExpanded,
    isStable: viewport.isStable,
    scrollTop: viewport.scrollTop,
  };
}
