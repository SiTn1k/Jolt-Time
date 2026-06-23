/**
 * DailyRewardService
 * 
 * Core service for managing daily login rewards.
 * 
 * Features:
 * - Weekly reward cycle (7 days)
 * - Streak tracking (progress continues even if missed - per requirements)
 * - Duplicate claim prevention
 * - Event support for special reward cycles
 * - Premium user variants
 * 
 * Reward Calendar:
 * Day 1: 50 Energy
 * Day 2: 100 Coins
 * Day 3: 1 Common Capsule
 * Day 4: 150 Coins
 * Day 5: 100 Energy
 * Day 6: 1 Rare Capsule
 * Day 7: Chrono Chest (Special)
 * 
 * Rules:
 * - Rewards collected once per day
 * - If player misses one day, progress does NOT reset (per requirements)
 * - After Day 7, cycle starts again from Day 1
 * - Server validates rewards
 * - Impossible to claim twice in one day
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  DailyReward,
  DailyRewardType,
  UserDailyReward,
  CanClaimResult,
  ClaimResult,
  ClaimedRewards,
  RewardCycleConfig,
  calculateStreak,
  getDayInCycle,
  DEFAULT_WEEKLY_REWARDS,
  getRewardDisplayInfo
} from '../types/daily-rewards';

/**
 * Configuration for the daily reward service.
 */
export interface DailyRewardConfig {
  supabaseUrl: string;
  supabaseKey: string;
  /**
   * Default cycle length (default: 7 for weekly)
   */
  cycleLength?: number;
  /**
   * Streak multiplier (e.g., 1.5x for premium users)
   */
  streakMultiplier?: number;
}

export class DailyRewardService {
  private supabase: SupabaseClient;
  private cycleLength: number;
  private streakMultiplier: number;

  constructor(config: DailyRewardConfig) {
    this.supabase = createClient(config.supabaseUrl, config.supabaseKey);
    this.cycleLength = config.cycleLength || 7;
    this.streakMultiplier = config.streakMultiplier || 1.0;
  }

  // =========================================================================
  // CORE METHODS
  // =========================================================================

  /**
   * Get the current day number in the reward cycle for a user.
   * 
   * This considers:
   * - User's current day in the cycle (stored in user_daily_rewards)
   * - Cycle length
   * 
   * @param userId - User ID
   * @returns Current day number (1-7)
   */
  async getCurrentDay(userId: string): Promise<number> {
    const userReward = await this.getUserRewardStatus(userId);
    
    if (!userReward) {
      return 1;
    }

    // Use the currentDay field from user record
    return userReward.currentDay || 1;
  }

  /**
   * Check if a user can claim their daily reward.
   * 
   * Checks:
   * 1. User hasn't already claimed today (server validation)
   * 2. User is within claim window (reset at midnight UTC)
   * 
   * Note: Progress does NOT reset if player misses a day (per requirements)
   * 
   * @param userId - User ID
   * @returns CanClaimResult with details
   */
  async canClaimReward(userId: string): Promise<CanClaimResult> {
    // Get user's current status
    const userReward = await this.getUserRewardStatus(userId);
    
    // If no record exists, user can claim Day 1
    if (!userReward) {
      return {
        canClaim: true,
        currentDay: 1,
        currentStreak: 0
      };
    }

    // Check if already claimed today (server-side validation)
    const now = new Date();
    const today = new Date(now.getTime());
    today.setUTCHours(0, 0, 0, 0);

    const lastClaim = userReward.lastClaimDate ? new Date(userReward.lastClaimDate) : null;
    
    if (lastClaim) {
      lastClaim.setUTCHours(0, 0, 0, 0);
      
      if (lastClaim.getTime() === today.getTime()) {
        // Already claimed today - impossible to claim twice
        const tomorrow = new Date(today);
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

        return {
          canClaim: false,
          reason: 'Already claimed today',
          currentDay: userReward.currentDay,
          currentStreak: userReward.currentStreak,
          nextClaimTime: tomorrow
        };
      }
    }

    // Note: We do NOT reset progress if player missed a day
    // Progress continues regardless (per requirements)
    
    return {
      canClaim: true,
      currentDay: userReward.currentDay || 1,
      currentStreak: userReward.currentStreak || 0
    };
  }

  /**
   * Claim the daily reward.
   * 
   * This method:
   * 1. Validates user can claim
   * 2. Calculates rewards based on day in cycle
   * 3. Updates user streak
   * 4. Records history
   * 5. Returns reward details
   * 
   * @param userId - User ID
   * @param multiplier - Optional reward multiplier (from events, AdsGram)
   * @returns ClaimResult with reward details
   */
  async claimReward(userId: string, multiplier: number = 1.0): Promise<ClaimResult> {
    // Check if can claim
    const canClaim = await this.canClaimReward(userId);
    
    if (!canClaim.canClaim) {
      return {
        success: false,
        error: canClaim.reason || 'Cannot claim reward'
      };
    }

    // Get user's current status
    let userReward = await this.getUserRewardStatus(userId);
    
    // Calculate new streak
    const now = new Date();
    const streakCalc = calculateStreak(
      userReward?.lastClaimDate || null,
      now
    );

    let newStreak: number;
    let shouldReset = streakCalc.shouldReset;

    if (!userReward) {
      // First claim ever
      newStreak = 1;
      shouldReset = false;
    } else if (shouldReset) {
      // Missed a day - reset streak
      newStreak = 1;
    } else {
      // Continuing streak
      newStreak = (userReward.currentStreak || 0) + 1;
    }

    // Calculate day in cycle
    const totalClaims = userReward?.totalClaims || 0;
    const dayNumber = getDayInCycle(totalClaims, this.cycleLength);

    // Get reward definition for this day
    const reward = await this.getRewardForDay(dayNumber);
    
    if (!reward) {
      return {
        success: false,
        error: `No reward defined for day ${dayNumber}`
      };
    }

    // Calculate final rewards with multiplier
    const claimedRewards: ClaimedRewards = {
      coins: Math.floor(reward.coinsReward * multiplier * this.streakMultiplier),
      energy: Math.floor(reward.energyReward * multiplier * this.streakMultiplier),
      timeShards: Math.floor(reward.timeShardsReward * multiplier * this.streakMultiplier),
      totalValue: 0
    };

    // Add booster if present
    if (reward.boosterType && reward.boosterAmount > 0) {
      claimedRewards.booster = {
        type: reward.boosterType,
        amount: Math.floor(reward.boosterAmount * multiplier)
      };
    }

    // Calculate total value
    claimedRewards.totalValue = 
      claimedRewards.coins + 
      claimedRewards.energy + 
      claimedRewards.timeShards +
      (claimedRewards.booster?.amount || 0);

    try {
      // Update or create user reward record
      const today = new Date(now);
      today.setUTCHours(0, 0, 0, 0);

      if (!userReward) {
        // Create new record
        const { error } = await this.supabase
          .from('user_daily_rewards')
          .insert({
            user_id: userId,
            current_streak: newStreak,
            last_claim_date: today.toISOString().split('T')[0],
            total_claims: 1,
            highest_streak: newStreak
          });

        if (error) throw error;
      } else {
        // Update existing record
        const newHighestStreak = Math.max(userReward.highestStreak, newStreak);

        const { error } = await this.supabase
          .from('user_daily_rewards')
          .update({
            current_streak: newStreak,
            last_claim_date: today.toISOString().split('T')[0],
            total_claims: (userReward.totalClaims || 0) + 1,
            highest_streak: newHighestStreak
          })
          .eq('user_id', userId);

        if (error) throw error;
      }

      // Record history
      await this.recordClaimHistory(
        userId,
        dayNumber,
        newStreak,
        claimedRewards,
        multiplier
      );

      // Return success
      return {
        success: true,
        dayNumber,
        streak: newStreak,
        rewards: claimedRewards,
        message: this.getRewardMessage(dayNumber, claimedRewards)
      };
    } catch (error) {
      console.error('DailyRewardService: Error claiming reward:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to claim reward'
      };
    }
  }

  /**
   * Reset a user's streak.
   * 
   * Used for:
   * - Admin overrides
   * - Bug fixes
   * - Special events
   * 
   * @param userId - User ID
   */
  async resetStreak(userId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('user_daily_rewards')
        .update({
          current_streak: 0,
          last_claim_date: null
        })
        .eq('user_id', userId);

      if (error) {
        console.error('DailyRewardService: Error resetting streak:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('DailyRewardService: Exception resetting streak:', error);
      return false;
    }
  }

  // =========================================================================
  // NOTIFICATION COMPATIBILITY
  // =========================================================================

  /**
   * Get notification message for daily reward ready.
   * 
   * Used by notification system to remind users.
   */
  async getNotificationMessage(userId: string): Promise<{
    title: string;
    message: string;
    canClaim: boolean;
  }> {
    const canClaim = await this.canClaimReward(userId);
    const currentDay = await this.getCurrentDay(userId);
    const userReward = await this.getUserRewardStatus(userId);

    if (canClaim.canClaim) {
      return {
        title: '🎁 Daily Reward Ready!',
        message: `Day ${currentDay} reward is waiting for you! Click to claim${userReward?.currentStreak ? ` and keep your ${userReward.currentStreak} day streak!` : '!'}`,
        canClaim: true
      };
    } else {
      return {
        title: '⏰ Daily Reward',
        message: canClaim.reason || 'Come back tomorrow for your next reward!',
        canClaim: false
      };
    }
  }

  // =========================================================================
  // ANALYTICS
  // =========================================================================

  /**
   * Get analytics for daily rewards.
   */
  async getAnalytics(): Promise<{
    totalClaimsToday: number;
    uniqueUsersToday: number;
    averageStreak: number;
    highestStreak: number;
  }> {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Get today's claims
    const { count: todayClaims } = await this.supabase
      .from('daily_reward_history')
      .select('id', { count: 'exact', head: true })
      .gte('claimed_at', today.toISOString());

    // Get unique users today
    const { data: todayData } = await this.supabase
      .from('daily_reward_history')
      .select('user_id')
      .gte('claimed_at', today.toISOString());

    const uniqueUsers = new Set(todayData?.map(d => d.user_id) || []).size;

    // Get average and highest streak from user rewards
    const { data: streaks } = await this.supabase
      .from('user_daily_rewards')
      .select('current_streak, highest_streak');

    let avgStreak = 0;
    let highestStreak = 0;

    if (streaks && streaks.length > 0) {
      const totalStreak = streaks.reduce((sum, s) => sum + (s.current_streak || 0), 0);
      avgStreak = Math.round(totalStreak / streaks.length);
      highestStreak = Math.max(...streaks.map(s => s.highest_streak || 0));
    }

    return {
      totalClaimsToday: todayClaims || 0,
      uniqueUsersToday: uniqueUsers,
      averageStreak: avgStreak,
      highestStreak: highestStreak
    };
  }

  /**
   * Get user's reward history.
   */
  async getUserHistory(userId: string, limit: number = 30): Promise<{
    history: DailyRewardHistory[];
  }> {
    const { data, error } = await this.supabase
      .from('daily_reward_history')
      .select('*')
      .eq('user_id', userId)
      .order('claimed_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('DailyRewardService: Error getting history:', error);
      return { history: [] };
    }

    return {
      history: (data || []).map(row => ({
        id: row.id,
        userId: row.user_id,
        rewardDay: row.reward_day,
        streakAtClaim: row.streak_at_claim,
        coinsAmount: row.coins_amount,
        energyAmount: row.energy_amount,
        timeShardsAmount: row.time_shards_amount,
        boosterType: row.booster_type,
        boosterAmount: row.booster_amount,
        totalValue: row.total_value,
        multiplier: row.multiplier,
        claimedAt: new Date(row.claimed_at),
        eventId: row.event_id
      }))
    };
  }

  // =========================================================================
  // PRIVATE HELPERS
  // =========================================================================

  /**
   * Get user's current reward status.
   */
  private async getUserRewardStatus(userId: string): Promise<UserDailyReward | null> {
    const { data, error } = await this.supabase
      .from('user_daily_rewards')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      currentStreak: data.current_streak,
      lastClaimDate: data.last_claim_date ? new Date(data.last_claim_date) : undefined,
      totalClaims: data.total_claims,
      highestStreak: data.highest_streak,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  /**
   * Get reward definition for a specific day.
   */
  private async getRewardForDay(dayNumber: number): Promise<DailyReward | null> {
    // First check database for custom rewards
    const { data: dbReward } = await this.supabase
      .from('daily_rewards')
      .select('*')
      .eq('day_number', dayNumber)
      .is('event_id', null) // Exclude event-specific rewards
      .single();

    if (dbReward) {
      return {
        id: dbReward.id,
        dayNumber: dbReward.day_number,
        coinsReward: dbReward.coins_reward,
        energyReward: dbReward.energy_reward,
        timeShardsReward: dbReward.time_shards_reward,
        boosterType: dbReward.booster_type,
        boosterAmount: dbReward.booster_amount || 0,
        eventId: dbReward.event_id,
        isPremiumOnly: dbReward.is_premium_only,
        createdAt: new Date(dbReward.created_at),
        updatedAt: new Date(dbReward.updated_at)
      };
    }

    // Fall back to default rewards
    const defaultReward = DEFAULT_WEEKLY_REWARDS.find(r => r.dayNumber === dayNumber);
    
    if (!defaultReward) {
      return null;
    }

    return {
      id: '',
      dayNumber: defaultReward.dayNumber,
      coinsReward: defaultReward.coinsReward,
      energyReward: defaultReward.energyReward,
      timeShardsReward: defaultReward.timeShardsReward,
      boosterType: defaultReward.boosterType,
      boosterAmount: defaultReward.boosterAmount || 0,
      isPremiumOnly: defaultReward.isPremiumOnly,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Record claim in history table.
   */
  private async recordClaimHistory(
    userId: string,
    dayNumber: number,
    streak: number,
    rewards: ClaimedRewards,
    multiplier: number
  ): Promise<void> {
    await this.supabase
      .from('daily_reward_history')
      .insert({
        user_id: userId,
        reward_day: dayNumber,
        streak_at_claim: streak,
        coins_amount: rewards.coins,
        energy_amount: rewards.energy,
        time_shards_amount: rewards.timeShards,
        booster_type: rewards.booster?.type,
        booster_amount: rewards.booster?.amount || 0,
        total_value: rewards.totalValue,
        multiplier,
        event_id: null // TODO: Support event rewards
      });
  }

  /**
   * Get reward message based on day.
   */
  private getRewardMessage(day: number, rewards: ClaimedRewards): string {
    const parts: string[] = [];

    if (rewards.coins > 0) {
      parts.push(`${rewards.coins} coins`);
    }
    if (rewards.energy > 0) {
      parts.push(`${rewards.energy} energy`);
    }
    if (rewards.timeShards > 0) {
      parts.push(`${rewards.timeShards} Time Shards`);
    }
    if (rewards.booster) {
      parts.push(`${rewards.booster.amount} ${rewards.booster.type}`);
    }

    if (day === 7) {
      return `🎉 Day 7 Premium Chest! You've earned: ${parts.join(', ')}`;
    }

    return `Day ${day} reward claimed: ${parts.join(', ')}`;
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================

  /**
   * Initialize the daily rewards table with default rewards.
   * Should be run during setup or when resetting rewards.
   */
  async initializeDefaultRewards(): Promise<boolean> {
    try {
      // Clear existing non-event rewards
      await this.supabase
        .from('daily_rewards')
        .delete()
        .is('event_id', null);

      // Insert default weekly rewards
      const rewards = DEFAULT_WEEKLY_REWARDS.map(r => ({
        day_number: r.dayNumber,
        coins_reward: r.coinsReward,
        energy_reward: r.energyReward,
        time_shards_reward: r.timeShardsReward,
        booster_type: r.boosterType,
        booster_amount: r.boosterAmount,
        is_premium_only: r.isPremiumOnly
      }));

      const { error } = await this.supabase
        .from('daily_rewards')
        .insert(rewards);

      if (error) throw error;

      console.log('DailyRewardService: Default rewards initialized');
      return true;
    } catch (error) {
      console.error('DailyRewardService: Error initializing default rewards:', error);
      return false;
    }
  }
}

// Singleton instance
let dailyRewardServiceInstance: DailyRewardService | null = null;

export function getDailyRewardService(config?: DailyRewardConfig): DailyRewardService {
  if (!dailyRewardServiceInstance) {
    if (!config) {
      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      if (!url || !key) {
        throw new Error('Missing required environment variables for DailyRewardService');
      }
      
      config = { supabaseUrl: url, supabaseKey: key };
    }
    
    dailyRewardServiceInstance = new DailyRewardService(config);
  }

  return dailyRewardServiceInstance;
}
