/**
 * AdRewardService
 * 
 * Service for distributing rewards earned from watching ads.
 * 
 * IMPORTANT: These rewards are in-game items only.
 * Players do NOT receive any real money from AdsGram.
 * All AdsGram revenue belongs to Jolt Time.
 * 
 * This service handles:
 * - Validating and distributing rewards
 * - Coin rewards
 * - Energy rewards
 * - Time Shards rewards
 * - Expedition boost rewards
 * - Temporary multiplier rewards
 * - Lucky spin rewards
 * 
 * The actual game economy integration would be implemented here
 * by calling the appropriate game services.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AdCategory, RewardType, AdReward } from '../types/ads';

/**
 * Reward distribution result.
 */
export interface RewardResult {
  success: boolean;
  reward?: AdReward;
  error?: string;
  // Details of what was awarded
  coinsAwarded?: number;
  energyAwarded?: number;
  timeShardsAwarded?: number;
  expeditionBoostsAwarded?: number;
  multiplierAwarded?: boolean;
  luckySpinAwarded?: boolean;
}

/**
 * Ad reward configuration by category.
 * These values can be modified by events or A/B tests.
 */
const REWARD_CONFIGS: Record<AdCategory, {
  primaryType: RewardType;
  baseAmount: number;
  secondaryRewards?: { type: RewardType; chance: number; minAmount: number; maxAmount: number }[];
}> = {
  [AdCategory.REWARDED]: {
    primaryType: RewardType.COINS,
    baseAmount: 100,
    secondaryRewards: [
      { type: RewardType.ENERGY, chance: 0.3, minAmount: 10, maxAmount: 30 }
    ]
  },
  [AdCategory.BONUS_REWARD]: {
    primaryType: RewardType.COINS,
    baseAmount: 250
  },
  [AdCategory.DAILY_BONUS]: {
    primaryType: RewardType.COINS,
    baseAmount: 500,
    secondaryRewards: [
      { type: RewardType.TIME_SHARDS, chance: 0.1, minAmount: 1, maxAmount: 5 }
    ]
  },
  [AdCategory.EXTRA_ENERGY]: {
    primaryType: RewardType.ENERGY,
    baseAmount: 50
  },
  [AdCategory.EXPEDITION_SPEEDUP]: {
    primaryType: RewardType.EXPEDITION_BOOST,
    baseAmount: 1
  }
};

export class AdRewardService {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Distribute reward for watching an ad.
   * 
   * This method:
   * 1. Calculates the reward based on category and multipliers
   * 2. Awards primary reward
   * 3. May award secondary rewards based on chance
   * 4. Records the transaction
   * 
   * @param userId - User ID
   * @param category - Ad category watched
   * @param multiplier - Optional reward multiplier (from events, A/B tests)
   * @returns RewardResult with details of awarded items
   */
  async distributeReward(
    userId: string,
    category: AdCategory,
    multiplier: number = 1.0
  ): Promise<RewardResult> {
    try {
      // Get reward configuration for category
      const config = REWARD_CONFIGS[category];
      
      if (!config) {
        return { success: false, error: `Unknown ad category: ${category}` };
      }

      // Calculate primary reward
      const primaryAmount = Math.floor(config.baseAmount * multiplier);
      
      // Award primary reward
      const primaryResult = await this.awardReward(userId, config.primaryType, primaryAmount);
      
      if (!primaryResult.success) {
        return { success: false, error: primaryResult.error };
      }

      // Initialize result
      const result: RewardResult = {
        success: true,
        reward: {
          type: config.primaryType,
          amount: primaryAmount,
          description: `${primaryAmount} ${this.getRewardTypeName(config.primaryType)}`
        }
      };

      // Set result details based on reward type
      switch (config.primaryType) {
        case RewardType.COINS:
          result.coinsAwarded = primaryAmount;
          break;
        case RewardType.ENERGY:
          result.energyAwarded = primaryAmount;
          break;
        case RewardType.TIME_SHARDS:
          result.timeShardsAwarded = primaryAmount;
          break;
        case RewardType.EXPEDITION_BOOST:
          result.expeditionBoostsAwarded = primaryAmount;
          break;
      }

      // Process secondary rewards
      if (config.secondaryRewards) {
        for (const secondary of config.secondaryRewards) {
          // Roll for chance
          if (Math.random() < secondary.chance) {
            const amount = this.randomInt(secondary.minAmount, secondary.maxAmount);
            const secondaryResult = await this.awardReward(userId, secondary.type, amount);
            
            if (secondaryResult.success) {
              // Add to result
              switch (secondary.type) {
                case RewardType.COINS:
                  result.coinsAwarded = (result.coinsAwarded || 0) + amount;
                  break;
                case RewardType.ENERGY:
                  result.energyAwarded = (result.energyAwarded || 0) + amount;
                  break;
                case RewardType.TIME_SHARDS:
                  result.timeShardsAwarded = (result.timeShardsAwarded || 0) + amount;
                  break;
                case RewardType.EXPEDITION_BOOST:
                  result.expeditionBoostsAwarded = (result.expeditionBoostsAwarded || 0) + amount;
                  break;
              }
            }
          }
        }
      }

      // Record the reward transaction
      await this.recordRewardTransaction(userId, category, result);

      return result;
    } catch (error) {
      console.error('AdRewardService: Error distributing reward:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Award a specific reward type to a user.
   * 
   * This is where the actual game economy integration happens.
   * In a real implementation, this would call the game's economy service.
   */
  private async awardReward(
    userId: string,
    rewardType: RewardType,
    amount: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      switch (rewardType) {
        case RewardType.COINS:
          return await this.addCoins(userId, amount);
        
        case RewardType.ENERGY:
          return await this.addEnergy(userId, amount);
        
        case RewardType.TIME_SHARDS:
          return await this.addTimeShards(userId, amount);
        
        case RewardType.EXPEDITION_BOOST:
          return await this.addExpeditionBoost(userId, amount);
        
        case RewardType.TEMPORARY_MULTIPLIER:
          return await this.applyTemporaryMultiplier(userId, amount);
        
        case RewardType.LUCKY_SPIN:
          return await this.triggerLuckySpin(userId);
        
        default:
          return { success: false, error: `Unknown reward type: ${rewardType}` };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Add coins to user's balance.
   * 
   * TODO: Replace with actual game economy service call
   */
  private async addCoins(userId: string, amount: number): Promise<{ success: boolean; error?: string }> {
    // In production, this would:
    // 1. Call the game's economy service
    // 2. Record the transaction
    // 3. Emit an event for the game client
    
    // Example implementation:
    // const economyService = getEconomyService();
    // await economyService.addCoins(userId, amount);
    
    console.log(`Awarding ${amount} coins to user ${userId}`);
    
    // For now, just log it
    return { success: true };
  }

  /**
   * Add energy to user's pool.
   * 
   * TODO: Replace with actual game economy service call
   */
  private async addEnergy(userId: string, amount: number): Promise<{ success: boolean; error?: string }> {
    // In production, this would:
    // 1. Call the game's energy service
    // 2. Ensure it doesn't exceed max energy
    // 3. Record the transaction
    
    console.log(`Awarding ${amount} energy to user ${userId}`);
    
    return { success: true };
  }

  /**
   * Add time shards to user's inventory.
   * 
   * TODO: Replace with actual game economy service call
   */
  private async addTimeShards(userId: string, amount: number): Promise<{ success: boolean; error?: string }> {
    console.log(`Awarding ${amount} time shards to user ${userId}`);
    return { success: true };
  }

  /**
   * Add expedition boost to user's inventory.
   * 
   * TODO: Replace with actual game economy service call
   */
  private async addExpeditionBoost(userId: string, amount: number): Promise<{ success: boolean; error?: string }> {
    console.log(`Awarding ${amount} expedition boost(s) to user ${userId}`);
    return { success: true };
  }

  /**
   * Apply a temporary multiplier to user's earnings.
   * 
   * TODO: Replace with actual game economy service call
   */
  private async applyTemporaryMultiplier(userId: string, duration: number): Promise<{ success: boolean; error?: string }> {
    // duration is in minutes
    console.log(`Applying ${duration} minute(s) temporary multiplier to user ${userId}`);
    return { success: true };
  }

  /**
   * Trigger a lucky spin for the user.
   * 
   * TODO: Replace with actual game economy service call
   */
  private async triggerLuckySpin(userId: string): Promise<{ success: boolean; error?: string }> {
    console.log(`Triggering lucky spin for user ${userId}`);
    return { success: true };
  }

  /**
   * Record a reward transaction for analytics.
   */
  private async recordRewardTransaction(
    userId: string,
    category: AdCategory,
    result: RewardResult
  ): Promise<void> {
    try {
      // Record in ads_views (already done by AdsGramService)
      // Could add additional tracking here
      
      // TODO: Record in separate reward_transactions table for detailed analytics
    } catch (error) {
      // Don't fail the reward if logging fails
      console.error('AdRewardService: Error recording transaction:', error);
    }
  }

  /**
   * Get a human-readable name for a reward type.
   */
  private getRewardTypeName(type: RewardType): string {
    switch (type) {
      case RewardType.COINS:
        return 'coins';
      case RewardType.ENERGY:
        return 'energy';
      case RewardType.TIME_SHARDS:
        return 'Time Shards';
      case RewardType.EXPEDITION_BOOST:
        return 'Expedition Boost';
      case RewardType.TEMPORARY_MULTIPLIER:
        return 'Temporary Multiplier';
      case RewardType.LUCKY_SPIN:
        return 'Lucky Spin';
      default:
        return 'reward';
    }
  }

  /**
   * Generate a random integer between min and max (inclusive).
   */
  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // =========================================================================
  // REWARD QUERIES
  // =========================================================================

  /**
   * Get user's lifetime rewards from ads.
   */
  async getLifetimeRewards(userId: string): Promise<{
    totalCoins: number;
    totalEnergy: number;
    totalTimeShards: number;
    totalExpeditionBoosts: number;
  }> {
    const { data, error } = await this.supabase
      .from('ads_views')
      .select('reward_type, reward_amount')
      .eq('user_id', userId);

    if (error || !data) {
      return {
        totalCoins: 0,
        totalEnergy: 0,
        totalTimeShards: 0,
        totalExpeditionBoosts: 0
      };
    }

    const totals = {
      totalCoins: 0,
      totalEnergy: 0,
      totalTimeShards: 0,
      totalExpeditionBoosts: 0
    };

    for (const view of data) {
      switch (view.reward_type) {
        case RewardType.COINS:
          totals.totalCoins += view.reward_amount;
          break;
        case RewardType.ENERGY:
          totals.totalEnergy += view.reward_amount;
          break;
        case RewardType.TIME_SHARDS:
          totals.totalTimeShards += view.reward_amount;
          break;
        case RewardType.EXPEDITION_BOOST:
          totals.totalExpeditionBoosts += view.reward_amount;
          break;
      }
    }

    return totals;
  }

  /**
   * Get user's rewards for today.
   */
  async getTodayRewards(userId: string): Promise<{
    coins: number;
    energy: number;
    timeShards: number;
    expeditionBoosts: number;
  }> {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const { data, error } = await this.supabase
      .from('ads_views')
      .select('reward_type, reward_amount')
      .eq('user_id', userId)
      .gte('shown_at', today.toISOString());

    if (error || !data) {
      return { coins: 0, energy: 0, timeShards: 0, expeditionBoosts: 0 };
    }

    const totals = {
      coins: 0,
      energy: 0,
      timeShards: 0,
      expeditionBoosts: 0
    };

    for (const view of data) {
      switch (view.reward_type) {
        case RewardType.COINS:
          totals.coins += view.reward_amount;
          break;
        case RewardType.ENERGY:
          totals.energy += view.reward_amount;
          break;
        case RewardType.TIME_SHARDS:
          totals.timeShards += view.reward_amount;
          break;
        case RewardType.EXPEDITION_BOOST:
          totals.expeditionBoosts += view.reward_amount;
          break;
      }
    }

    return totals;
  }
}

// Singleton instance
let adRewardServiceInstance: AdRewardService | null = null;

export function getAdRewardService(
  supabaseUrl?: string,
  supabaseKey?: string
): AdRewardService {
  if (!adRewardServiceInstance) {
    const url = supabaseUrl || process.env.SUPABASE_URL;
    const key = supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error('Missing required environment variables for AdRewardService');
    }

    adRewardServiceInstance = new AdRewardService(url, key);
  }

  return adRewardServiceInstance;
}
