/**
 * AdsGramService
 * 
 * Main service for managing AdsGram ad integration.
 * 
 * IMPORTANT: AdsGram revenue belongs to Jolt Time, NOT to players.
 * Players earn in-game rewards (coins, energy, etc.) from watching ads.
 * 
 * Architecture:
 * - This service provides the interface for ad operations
 * - Actual AdsGram SDK integration is done via IAdsGramAdapter
 * - This allows easy swapping of SDK implementations
 * 
 * Features:
 * - Daily limits per ad category
 * - Cooldown protection to prevent spam
 * - Reward distribution tracking
 * - User preference respect
 * - A/B testing support (preparation)
 * - Premium user handling (fewer ads)
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  AdCategory,
  RewardType,
  CanShowAdResult,
  RegisterAdViewResult,
  UserAdStatistics,
  DEFAULT_DAILY_LIMITS,
  PREMIUM_DAILY_LIMITS,
  AD_COOLDOWNS,
  AdReward,
  IAdsGramAdapter
} from '../types/ads';

export interface AdsGramConfig {
  supabaseUrl: string;
  supabaseKey: string;
  // In production, this would be the actual AdsGram SDK adapter
  adsGramAdapter?: IAdsGramAdapter;
}

/**
 * Default reward amounts for each ad category.
 * These can be modified by A/B tests or events.
 */
const DEFAULT_REWARDS: Record<AdCategory, AdReward> = {
  [AdCategory.REWARDED]: {
    type: RewardType.COINS,
    amount: 100,
    description: '100 coins for watching an ad'
  },
  [AdCategory.BONUS_REWARD]: {
    type: RewardType.COINS,
    amount: 250,
    description: '250 bonus coins'
  },
  [AdCategory.DAILY_BONUS]: {
    type: RewardType.COINS,
    amount: 500,
    description: '500 daily bonus coins'
  },
  [AdCategory.EXTRA_ENERGY]: {
    type: RewardType.ENERGY,
    amount: 50,
    description: '+50 energy'
  },
  [AdCategory.EXPEDITION_SPEEDUP]: {
    type: RewardType.EXPEDITION_BOOST,
    amount: 1,
    description: '1 expedition speed boost'
  }
};

export class AdsGramService {
  private supabase: SupabaseClient;
  private adapter: IAdsGramAdapter | null;

  constructor(config: AdsGramConfig) {
    this.supabase = createClient(config.supabaseUrl, config.supabaseKey);
    this.adapter = config.adsGramAdapter || null;
  }

  /**
   * Set the AdsGram adapter.
   * This allows setting the adapter after construction.
   */
  setAdapter(adapter: IAdsGramAdapter): void {
    this.adapter = adapter;
  }

  // =========================================================================
  // AD AVAILABILITY CHECKS
  // =========================================================================

  /**
   * Check if an ad can be shown to a user.
   * 
   * Checks:
   * 1. User has ads enabled
   * 2. User hasn't hit daily limit for this category
   * 3. User isn't in cooldown period
   * 4. Premium user adjustments
   * 
   * @param userId - User ID
   * @param category - Ad category
   * @returns CanShowAdResult with reason if cannot show
   */
  async canShowAd(userId: string, category: AdCategory): Promise<CanShowAdResult> {
    // 1. Check user ad preferences
    const settings = await this.getUserAdSettings(userId);
    
    if (!settings.ads_enabled) {
      return { 
        canShow: false, 
        reason: 'User has ads disabled' 
      };
    }

    if (!settings.reward_ads_enabled && category === AdCategory.REWARDED) {
      return { 
        canShow: false, 
        reason: 'User has reward ads disabled' 
      };
    }

    // 2. Check daily limit
    const dailyLimit = settings.is_premium 
      ? PREMIUM_DAILY_LIMITS[category] 
      : DEFAULT_DAILY_LIMITS[category];

    const todayCount = await this.getTodayAdCount(userId, category);
    
    if (todayCount >= dailyLimit) {
      // Calculate when the limit resets (midnight UTC)
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setUTCHours(24, 0, 0, 0);
      
      return { 
        canShow: false, 
        reason: `Daily limit reached (${todayCount}/${dailyLimit})`,
        nextAvailableAt: tomorrow,
        remainingToday: 0
      };
    }

    // 3. Check cooldown
    const cooldownSeconds = AD_COOLDOWNS[category];
    const cooldownExpires = await this.getLastAdShownTime(userId, category);
    
    if (cooldownExpires) {
      const cooldownEnd = new Date(cooldownExpires.getTime() + cooldownSeconds * 1000);
      if (cooldownEnd > new Date()) {
        return { 
          canShow: false, 
          reason: `In cooldown period`,
          nextAvailableAt: cooldownEnd
        };
      }
    }

    // 4. Check with actual adapter if available
    if (this.adapter) {
      const adapterAvailable = await this.adapter.isAdAvailable(category);
      if (!adapterAvailable) {
        return { 
          canShow: false, 
          reason: 'No ad available from AdsGram' 
        };
      }
    }

    return { 
      canShow: true,
      remainingToday: dailyLimit - todayCount - 1
    };
  }

  /**
   * Get the number of ads a user has watched today.
   * 
   * @param userId - User ID
   * @param category - Optional ad category filter
   * @returns Number of ads watched today
   */
  async getTodayAdCount(userId: string, category?: AdCategory): Promise<number> {
    // Get start of today (midnight UTC)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    let query = this.supabase
      .from('ads_views')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('shown_at', today.toISOString());

    if (category) {
      query = query.eq('ad_type', category);
    }

    const { count, error } = await query;

    if (error) {
      console.error('AdsGramService: Error getting today ad count:', error);
      return 0;
    }

    return count || 0;
  }

  /**
   * Get the daily ad count for all categories.
   * 
   * @param userId - User ID
   * @returns Object with counts per category
   */
  async getDailyAdCount(userId: string): Promise<Record<AdCategory, number>> {
    const result: Record<AdCategory, number> = {
      [AdCategory.REWARDED]: 0,
      [AdCategory.BONUS_REWARD]: 0,
      [AdCategory.DAILY_BONUS]: 0,
      [AdCategory.EXTRA_ENERGY]: 0,
      [AdCategory.EXPEDITION_SPEEDUP]: 0
    };

    // Get start of today (midnight UTC)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const { data, error } = await this.supabase
      .from('ads_views')
      .select('ad_type')
      .eq('user_id', userId)
      .gte('shown_at', today.toISOString());

    if (error) {
      console.error('AdsGramService: Error getting daily ad count:', error);
      return result;
    }

    // Count by category
    for (const view of data || []) {
      const category = view.ad_type as AdCategory;
      if (category in result) {
        result[category]++;
      }
    }

    return result;
  }

  // =========================================================================
  // AD VIEW REGISTRATION
  // =========================================================================

  /**
   * Register that an ad was shown to a user.
   * 
   * @param userId - User ID
   * @param category - Ad category
   * @param sessionId - Optional session ID for deduplication
   * @returns RegisterAdViewResult
   */
  async registerAdView(
    userId: string,
    category: AdCategory,
    sessionId?: string
  ): Promise<RegisterAdViewResult> {
    // Get the reward for this ad
    const reward = this.getRewardForCategory(category);

    try {
      // Insert ad view record
      const { data, error } = await this.supabase
        .from('ads_views')
        .insert({
          user_id: userId,
          ad_type: category,
          reward_type: reward.type,
          reward_amount: reward.amount,
          session_id: sessionId
        })
        .select('id')
        .single();

      if (error) {
        console.error('AdsGramService: Error registering ad view:', error);
        return { success: false, error: error.message };
      }

      // Update last_ad_shown_at in user_ad_settings
      await this.updateLastAdShown(userId);

      return {
        success: true,
        adViewId: data.id,
        rewardAmount: reward.amount
      };
    } catch (error) {
      console.error('AdsGramService: Exception registering ad view:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Register that a reward was claimed by a user.
   * 
   * This is called after an ad is successfully watched and the
   * reward is delivered to the user.
   * 
   * @param userId - User ID
   * @param category - Ad category
   * @returns true if registered successfully
   */
  async registerReward(userId: string, category: AdCategory): Promise<boolean> {
    try {
      // The ads_views table already has the record from registerAdView
      // This method is for any additional tracking needed
      
      // Update consecutive_ad_days if this is first ad today
      const settings = await this.getUserAdSettings(userId);
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      // Check if user already watched an ad today
      const { data: todayViews } = await this.supabase
        .from('ads_views')
        .select('id')
        .eq('user_id', userId)
        .gte('shown_at', today.toISOString())
        .limit(1);

      if (!todayViews || todayViews.length === 0) {
        // First ad today - increment streak
        await this.supabase
          .from('user_ad_settings')
          .update({
            consecutive_ad_days: (settings.consecutive_ad_days || 0) + 1
          })
          .eq('user_id', userId);
      }

      return true;
    } catch (error) {
      console.error('AdsGramService: Error registering reward:', error);
      return false;
    }
  }

  // =========================================================================
  // USER SETTINGS
  // =========================================================================

  /**
   * Get user's ad settings.
   * Creates default settings if not exists.
   * 
   * @param userId - User ID
   * @returns UserAdSettings
   */
  async getUserAdSettings(userId: string): Promise<{
    ads_enabled: boolean;
    reward_ads_enabled: boolean;
    is_premium: boolean;
    last_ad_shown_at?: Date;
    consecutive_ad_days: number;
  }> {
    const { data, error } = await this.supabase
      .from('user_ad_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      // Return defaults if not found
      return {
        ads_enabled: true,
        reward_ads_enabled: true,
        is_premium: false,
        consecutive_ad_days: 0
      };
    }

    return {
      ads_enabled: data.ads_enabled,
      reward_ads_enabled: data.reward_ads_enabled,
      is_premium: data.is_premium,
      last_ad_shown_at: data.last_ad_shown_at ? new Date(data.last_ad_shown_at) : undefined,
      consecutive_ad_days: data.consecutive_ad_days || 0
    };
  }

  /**
   * Update user's ad settings.
   * 
   * @param userId - User ID
   * @param settings - Settings to update
   */
  async updateUserAdSettings(
    userId: string,
    settings: {
      ads_enabled?: boolean;
      reward_ads_enabled?: boolean;
      is_premium?: boolean;
    }
  ): Promise<boolean> {
    try {
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString()
      };

      if (settings.ads_enabled !== undefined) {
        updateData.ads_enabled = settings.ads_enabled;
      }
      if (settings.reward_ads_enabled !== undefined) {
        updateData.reward_ads_enabled = settings.reward_ads_enabled;
      }
      if (settings.is_premium !== undefined) {
        updateData.is_premium = settings.is_premium;
      }

      const { error } = await this.supabase
        .from('user_ad_settings')
        .upsert({
          user_id: userId,
          ...updateData
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('AdsGramService: Error updating user ad settings:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('AdsGramService: Exception updating user ad settings:', error);
      return false;
    }
  }

  /**
   * Get user statistics for ads.
   * 
   * @param userId - User ID
   * @returns UserAdStatistics
   */
  async getUserAdStatistics(userId: string): Promise<UserAdStatistics> {
    // Get lifetime stats
    const { data: lifetimeData } = await this.supabase
      .from('ads_views')
      .select('reward_type, reward_amount')
      .eq('user_id', userId);

    let lifetimeAds = 0;
    let lifetimeCoins = 0;
    let lifetimeEnergy = 0;

    for (const view of lifetimeData || []) {
      lifetimeAds++;
      if (view.reward_type === RewardType.COINS) {
        lifetimeCoins += view.reward_amount;
      } else if (view.reward_type === RewardType.ENERGY) {
        lifetimeEnergy += view.reward_amount;
      }
    }

    // Get today's count
    const todayAds = await this.getTodayAdCount(userId);

    // Get streak
    const settings = await this.getUserAdSettings(userId);

    return {
      userId,
      lifetimeAdsViewed: lifetimeAds,
      todayAdsViewed: todayAds,
      lifetimeCoinsEarned: lifetimeCoins,
      lifetimeEnergyEarned: lifetimeEnergy,
      currentStreak: settings.consecutive_ad_days
    };
  }

  // =========================================================================
  // AD VIEWING FLOW
  // =========================================================================

  /**
   * Show an ad to a user.
   * 
   * This is the main method for showing ads.
   * It handles the full flow:
   * 1. Check if ad can be shown
   * 2. Show ad via adapter
   * 3. Register the view
   * 4. Return reward info
   * 
   * @param userId - User ID
   * @param category - Ad category
   * @param sessionId - Optional session ID
   * @returns AdReward if successful, null if cannot show
   */
  async showAd(
    userId: string,
    category: AdCategory,
    sessionId?: string
  ): Promise<{ success: boolean; reward?: AdReward; error?: string }> {
    // Check if ad can be shown
    const canShow = await this.canShowAd(userId, category);
    
    if (!canShow.canShow) {
      return { success: false, error: canShow.reason };
    }

    // Show ad via adapter if available
    if (this.adapter) {
      const shown = await this.adapter.showAd(category);
      if (!shown) {
        return { success: false, error: 'Failed to show ad' };
      }
    }

    // Register the view
    const result = await this.registerAdView(userId, category, sessionId);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }

    // Get reward
    const reward = this.getRewardForCategory(category);

    return { success: true, reward };
  }

  /**
   * Get the reward definition for an ad category.
   * 
   * This can be modified by A/B tests or events.
   * 
   * @param category - Ad category
   * @returns AdReward
   */
  getRewardForCategory(category: AdCategory): AdReward {
    return DEFAULT_REWARDS[category];
  }

  // =========================================================================
  // PRIVATE HELPERS
  // =========================================================================

  /**
   * Get the last time an ad was shown for a category.
   */
  private async getLastAdShownTime(userId: string, category: AdCategory): Promise<Date | null> {
    const { data } = await this.supabase
      .from('ads_views')
      .select('shown_at')
      .eq('user_id', userId)
      .eq('ad_type', category)
      .order('shown_at', { ascending: false })
      .limit(1)
      .single();

    return data ? new Date(data.shown_at) : null;
  }

  /**
   * Update the last ad shown timestamp.
   */
  private async updateLastAdShown(userId: string): Promise<void> {
    await this.supabase
      .from('user_ad_settings')
      .upsert({
        user_id: userId,
        last_ad_shown_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });
  }
}

// Singleton instance
let adsGramServiceInstance: AdsGramService | null = null;

export function getAdsGramService(config?: AdsGramConfig): AdsGramService {
  if (!adsGramServiceInstance) {
    if (!config) {
      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      if (!url || !key) {
        throw new Error('Missing required environment variables for AdsGramService');
      }
      
      config = { supabaseUrl: url, supabaseKey: key };
    }
    
    adsGramServiceInstance = new AdsGramService(config);
  }

  return adsGramServiceInstance;
}
