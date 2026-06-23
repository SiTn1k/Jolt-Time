/**
 * Jolt Time - Telegram Bot & Notification System
 * 
 * This module exports all services for the Telegram Mini App platform.
 * 
 * @example
 * import { 
 *   TelegramBot,
 *   BotService,
 *   NotificationService,
 *   NotificationType,
 *   AdsGramService,
 *   DailyRewardService 
 * } from './src';
 */

// Types
export {
  NotificationType,
  NotificationStatus,
  NotificationCategory,
  NOTIFICATION_TYPE_TO_CATEGORY,
  NOTIFICATION_COOLDOWNS,
  ScheduleNotificationParams,
  NotificationQueueItem,
  NotificationPreferences,
  UserTelegramData
} from './types/notifications';

// Ads Types
export {
  AdCategory,
  RewardType,
  DEFAULT_DAILY_LIMITS,
  PREMIUM_DAILY_LIMITS,
  AD_COOLDOWNS,
  IAdsGramAdapter,
  CanShowAdResult,
  RegisterAdViewResult,
  AdReward,
  UserAdStatistics,
  ABTestConfig
} from './types/ads';

// Daily Reward Types
export {
  DailyReward,
  UserDailyReward,
  DailyRewardHistory,
  CanClaimResult,
  ClaimResult,
  ClaimedRewards,
  RewardCycleConfig,
  DailyRewardAnalytics,
  BoosterType,
  DEFAULT_WEEKLY_REWARDS,
  calculateStreak,
  getDayInCycle,
  isCycleComplete
} from './types/daily-rewards';

// Energy Types
export {
  EnergyOperationType,
  BoosterType,
  EnergyHistory,
  EnergyBooster,
  UserEnergyBooster,
  EnergyState,
  ConsumeEnergyResult,
  RestoreEnergyResult,
  OfflineRecoveryResult,
  DEFAULT_ENERGY_COSTS,
  ENERGY_REGEN_CONFIG,
  VIP_ENERGY_MULTIPLIERS
} from './types/energy';

export type { Database } from './database/supabase-types';

// Bot Services
export { BotService, getBotService } from './services/BotService';
export { TelegramBot, getTelegramBot } from './services/TelegramBot';
export { InlineKeyboard, InlineKeyboards } from './services/InlineKeyboard';
export { BotLogger, getBotLogger } from './services/BotLogger';
export { MiniAppIntegration, getMiniAppIntegration } from './services/MiniAppIntegration';

// Localization
export { 
  Language,
  t, tl, getTranslation,
  getUserLanguage, setUserLanguage,
  getAvailableLanguages, isValidLanguage,
  DEFAULT_LANGUAGE,
  LANGUAGE_NAMES, LANGUAGE_FLAGS
} from './services/Localization';

// Notification Services
export { NotificationService, getNotificationService } from './services/NotificationService';
export { UserPreferencesService, getUserPreferencesService } from './services/UserPreferencesService';
export { InactivePlayerService, getInactivePlayerService } from './services/InactivePlayerService';
export { TelegramBotService, getTelegramBotService } from './services/TelegramBotService';

// AdsGram Services
export { AdsGramService, getAdsGramService } from './services/AdsGramService';
export { AdRepository, getAdRepository } from './services/AdRepository';
export { AdScheduler, getAdScheduler } from './services/AdScheduler';
export { AdRewardService, getAdRewardService } from './services/AdRewardService';
export { MockAdsGramAdapter, RealAdsGramAdapterPlaceholder, createAdsGramAdapter, Adapters } from './services/AdsGramAdapter';

// Daily Reward Services
export { DailyRewardService, getDailyRewardService } from './services/DailyRewardService';
export { DailyRewardRepository, getDailyRewardRepository } from './services/DailyRewardRepository';

// Energy Services
export { EnergyService, getEnergyService } from './services/EnergyService';
export { EnergyRepository, getEnergyRepository } from './services/EnergyRepository';

// Message utilities
export { getNotificationMessage, generateDeduplicationKey } from './services/notification-messages';
