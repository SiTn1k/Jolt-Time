/**
 * AdsGram Types and Interfaces
 * 
 * This file defines all types for the AdsGram monetization system.
 * 
 * IMPORTANT: AdsGram revenue belongs to Jolt Time, NOT to players.
 * Players earn in-game rewards (coins, energy, etc.) from watching ads,
 * but do not receive any real money.
 * 
 * This architecture is designed to allow seamless integration with the
 * AdsGram SDK when ready, without rewriting existing code.
 */

/**
 * Ad categories that map to different user experiences.
 * Each category has different daily limits and reward types.
 */
export enum AdCategory {
  /**
   * Rewarded ads - user explicitly chooses to watch for reward
   * Examples: Double coins, speed up wait times
   */
  REWARDED = 'rewarded',
  
  /**
   * Bonus reward ads - special bonus rewards
   * Examples: Daily login bonus, event rewards
   */
  BONUS_REWARD = 'bonus_reward',
  
  /**
   * Daily bonus ads - one-time daily rewards
   * Examples: Daily free spins, daily chest
   */
  DAILY_BONUS = 'daily_bonus',
  
  /**
   * Extra energy ads - get bonus energy
   * Examples: +50 energy, refill stamina
   */
  EXTRA_ENERGY = 'extra_energy',
  
  /**
   * Expedition speed-up ads - speed up expeditions
   * Examples: 2x expedition speed, instant completion
   */
  EXPEDITION_SPEEDUP = 'expedition_speedup'
}

/**
 * Types of rewards that can be earned from ads.
 * These are IN-GAME rewards only, not real money.
 */
export enum RewardType {
  /**
   * In-game currency
   */
  COINS = 'coins',
  
  /**
   * Game energy resource
   */
  ENERGY = 'energy',
  
  /**
   * Special currency for time-related upgrades
   */
  TIME_SHARDS = 'time_shards',
  
  /**
   * Expedition completion boost
   */
  EXPEDITION_BOOST = 'expedition_boost',
  
  /**
   * Temporary multiplier for earnings
   */
  TEMPORARY_MULTIPLIER = 'temporary_multiplier',
  
  /**
   * Lucky spin result
   */
  LUCKY_SPIN = 'lucky_spin'
}

/**
 * Ad view record from database.
 */
export interface AdView {
  id: string;
  user_id: string;
  ad_type: string;
  reward_type: string;
  reward_amount: number;
  shown_at: Date;
  adsgram_ad_id?: string;
  session_id?: string;
}

/**
 * Ad statistics aggregated by date.
 */
export interface AdStatistics {
  id: string;
  date: Date;
  impressions: number;
  reward_claims: number;
  unique_users: number;
  estimated_revenue_cents: number;
  breakdown_by_type: Record<string, number>;
  created_at: Date;
  updated_at: Date;
}

/**
 * User ad settings.
 */
export interface UserAdSettings {
  id: string;
  user_id: string;
  ads_enabled: boolean;
  reward_ads_enabled: boolean;
  is_premium: boolean;
  last_ad_shown_at?: Date;
  consecutive_ad_days: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * Result of checking if an ad can be shown.
 */
export interface CanShowAdResult {
  canShow: boolean;
  reason?: string;
  nextAvailableAt?: Date;
  remainingToday?: number;
}

/**
 * Result of registering an ad view.
 */
export interface RegisterAdViewResult {
  success: boolean;
  error?: string;
  adViewId?: string;
  rewardAmount?: number;
}

/**
 * Reward definition for an ad category.
 */
export interface AdReward {
  type: RewardType;
  amount: number;
  description: string;
}

/**
 * Daily limits configuration for ad categories.
 * Can be overridden per-user (premium users get different limits).
 */
export interface DailyLimits {
  [AdCategory.REWARDED]: number;
  [AdCategory.BONUS_REWARD]: number;
  [AdCategory.DAILY_BONUS]: number;
  [AdCategory.EXTRA_ENERGY]: number;
  [AdCategory.EXPEDITION_SPEEDUP]: number;
}

/**
 * Default daily limits for regular users.
 * Premium users may have reduced limits (to show them fewer ads).
 */
export const DEFAULT_DAILY_LIMITS: DailyLimits = {
  [AdCategory.REWARDED]: 20,        // 20 rewarded ads per day
  [AdCategory.BONUS_REWARD]: 5,     // 5 bonus reward ads per day
  [AdCategory.DAILY_BONUS]: 1,      // 1 daily bonus ad per day
  [AdCategory.EXTRA_ENERGY]: 5,      // 5 energy ads per day
  [AdCategory.EXPEDITION_SPEEDUP]: 3  // 3 expedition boost ads per day
};

/**
 * Premium user daily limits (fewer ads).
 */
export const PREMIUM_DAILY_LIMITS: DailyLimits = {
  [AdCategory.REWARDED]: 10,         // Half the normal limit
  [AdCategory.BONUS_REWARD]: 2,      // 2 bonus reward ads per day
  [AdCategory.DAILY_BONUS]: 1,       // 1 daily bonus ad per day
  [AdCategory.EXTRA_ENERGY]: 3,      // 3 energy ads per day
  [AdCategory.EXPEDITION_SPEEDUP]: 1 // 1 expedition boost ad per day
};

/**
 * Cooldown periods between ads (in seconds).
 * Prevents spam clicking.
 */
export const AD_COOLDOWNS: Record<AdCategory, number> = {
  [AdCategory.REWARDED]: 30,          // 30 seconds between rewarded ads
  [AdCategory.BONUS_REWARD]: 60,      // 1 minute between bonus ads
  [AdCategory.DAILY_BONUS]: 3600,     // 1 hour (daily bonus)
  [AdCategory.EXTRA_ENERGY]: 60,      // 1 minute between energy ads
  [AdCategory.EXPEDITION_SPEEDUP]: 120 // 2 minutes between speedup ads
};

/**
 * Interface for the AdsGram SDK adapter.
 * This allows swapping the actual SDK implementation without changing code.
 * 
 * Usage:
 * ```typescript
 * interface IAdsGramAdapter {
 *   async initialize(): Promise<void>;
 *   async showAd(category: AdCategory): Promise<boolean>;
 *   async getReward(): Promise<AdReward>;
 * }
 * ```
 */
export interface IAdsGramAdapter {
  /**
   * Initialize the AdsGram SDK.
   */
  initialize(): Promise<void>;
  
  /**
   * Request to show an ad of the given category.
   * Returns true if an ad was shown successfully.
   */
  showAd(category: AdCategory): Promise<boolean>;
  
  /**
   * Get the reward earned from the last ad view.
   */
  getReward(): AdReward;
  
  /**
   * Check if ads are available.
   */
  isAdAvailable(category: AdCategory): Promise<boolean>;
}

/**
 * User statistics for ads.
 */
export interface UserAdStatistics {
  userId: string;
  lifetimeAdsViewed: number;
  todayAdsViewed: number;
  lifetimeCoinsEarned: number;
  lifetimeEnergyEarned: number;
  currentStreak: number;
}

/**
 * A/B Test configuration for ad experiments.
 */
export interface ABTestConfig {
  testId: string;
  testName: string;
  variant: 'control' | 'variant_a' | 'variant_b';
  parameters: Record<string, unknown>;
}
