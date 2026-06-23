/**
 * DailyRewardRepository
 * 
 * Repository for database operations related to daily rewards.
 * Provides data access layer separating DB logic from business logic.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  DailyReward,
  UserDailyReward,
  DailyRewardHistory,
  DailyRewardAnalytics
} from '../types/daily-rewards';

export class DailyRewardRepository {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // =========================================================================
  // DAILY REWARDS (Template) OPERATIONS
  // =========================================================================

  /**
   * Get all daily reward templates.
   */
  async getAllRewardTemplates(eventId?: string): Promise<DailyReward[]> {
    let query = this.supabase
      .from('daily_rewards')
      .select('*')
      .order('day_number', { ascending: true });

    if (eventId) {
      query = query.eq('event_id', eventId);
    } else {
      query = query.is('event_id', null);
    }

    const { data, error } = await query;

    if (error) {
      console.error('DailyRewardRepository: Error getting reward templates:', error);
      return [];
    }

    return (data || []).map(row => this.mapDailyReward(row));
  }

  /**
   * Get reward template for a specific day.
   */
  async getRewardTemplate(dayNumber: number, eventId?: string): Promise<DailyReward | null> {
    let query = this.supabase
      .from('daily_rewards')
      .select('*')
      .eq('day_number', dayNumber);

    if (eventId) {
      query = query.eq('event_id', eventId);
    } else {
      query = query.is('event_id', null);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return null;
    }

    return this.mapDailyReward(data);
  }

  /**
   * Create or update a reward template.
   */
  async upsertRewardTemplate(reward: {
    dayNumber: number;
    coinsReward: number;
    energyReward: number;
    timeShardsReward: number;
    boosterType?: string;
    boosterAmount?: number;
    eventId?: string;
    isPremiumOnly?: boolean;
  }): Promise<boolean> {
    const { error } = await this.supabase
      .from('daily_rewards')
      .upsert({
        day_number: reward.dayNumber,
        coins_reward: reward.coinsReward,
        energy_reward: reward.energyReward,
        time_shards_reward: reward.timeShardsReward,
        booster_type: reward.boosterType,
        booster_amount: reward.boosterAmount || 0,
        event_id: reward.eventId,
        is_premium_only: reward.isPremiumOnly || false
      }, {
        onConflict: 'day_number,event_id'
      });

    if (error) {
      console.error('DailyRewardRepository: Error upserting reward template:', error);
      return false;
    }

    return true;
  }

  // =========================================================================
  // USER DAILY REWARDS OPERATIONS
  // =========================================================================

  /**
   * Get user's daily reward status.
   */
  async getUserRewardStatus(userId: string): Promise<UserDailyReward | null> {
    const { data, error } = await this.supabase
      .from('user_daily_rewards')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapUserDailyReward(data);
  }

  /**
   * Create or update user's reward status.
   */
  async upsertUserRewardStatus(
    userId: string,
    data: {
      currentStreak?: number;
      lastClaimDate?: Date;
      totalClaims?: number;
      highestStreak?: number;
    }
  ): Promise<boolean> {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };

    if (data.currentStreak !== undefined) {
      updateData.current_streak = data.currentStreak;
    }
    if (data.lastClaimDate !== undefined) {
      updateData.last_claim_date = data.lastClaimDate.toISOString().split('T')[0];
    }
    if (data.totalClaims !== undefined) {
      updateData.total_claims = data.totalClaims;
    }
    if (data.highestStreak !== undefined) {
      updateData.highest_streak = data.highestStreak;
    }

    const { error } = await this.supabase
      .from('user_daily_rewards')
      .upsert({
        user_id: userId,
        ...updateData
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('DailyRewardRepository: Error upserting user reward status:', error);
      return false;
    }

    return true;
  }

  /**
   * Reset user's streak.
   */
  async resetUserStreak(userId: string): Promise<boolean> {
    return this.upsertUserRewardStatus(userId, {
      currentStreak: 0,
      lastClaimDate: undefined
    });
  }

  /**
   * Get users who haven't claimed today (for notifications).
   */
  async getUsersWhoHaventClaimedToday(): Promise<string[]> {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    // Get all users
    const { data: allUsers } = await this.supabase
      .from('user_daily_rewards')
      .select('user_id, last_claim_date');

    if (!allUsers) return [];

    return allUsers
      .filter(u => {
        if (!u.last_claim_date) return true; // Never claimed
        return u.last_claim_date !== todayStr;
      })
      .map(u => u.user_id);
  }

  // =========================================================================
  // DAILY REWARD HISTORY OPERATIONS
  // =========================================================================

  /**
   * Check if user has claimed a specific day.
   */
  async hasUserClaimedDay(userId: string, rewardDay: number): Promise<boolean> {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    const { data } = await this.supabase
      .from('daily_reward_history')
      .select('id')
      .eq('user_id', userId)
      .eq('reward_day', rewardDay)
      .gte('claimed_at', today.toISOString())
      .lt('claimed_at', tomorrow.toISOString())
      .limit(1);

    return !!data && data.length > 0;
  }

  /**
   * Record a claimed reward.
   */
  async recordClaim(data: {
    userId: string;
    rewardDay: number;
    streakAtClaim: number;
    coinsAmount: number;
    energyAmount: number;
    timeShardsAmount: number;
    boosterType?: string;
    boosterAmount?: number;
    totalValue: number;
    multiplier: number;
    eventId?: string;
  }): Promise<string | null> {
    const { data: result, error } = await this.supabase
      .from('daily_reward_history')
      .insert({
        user_id: data.userId,
        reward_day: data.rewardDay,
        streak_at_claim: data.streakAtClaim,
        coins_amount: data.coinsAmount,
        energy_amount: data.energyAmount,
        time_shards_amount: data.timeShardsAmount,
        booster_type: data.boosterType,
        booster_amount: data.boosterAmount || 0,
        total_value: data.totalValue,
        multiplier: data.multiplier,
        event_id: data.eventId
      })
      .select('id')
      .single();

    if (error) {
      console.error('DailyRewardRepository: Error recording claim:', error);
      return null;
    }

    return result.id;
  }

  /**
   * Get user's claim history.
   */
  async getUserHistory(userId: string, limit: number = 30): Promise<DailyRewardHistory[]> {
    const { data, error } = await this.supabase
      .from('daily_reward_history')
      .select('*')
      .eq('user_id', userId)
      .order('claimed_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('DailyRewardRepository: Error getting history:', error);
      return [];
    }

    return (data || []).map(row => this.mapHistory(row));
  }

  /**
   * Get total claims count.
   */
  async getTotalClaimsCount(): Promise<number> {
    const { count } = await this.supabase
      .from('daily_reward_history')
      .select('id', { count: 'exact', head: true });

    return count || 0;
  }

  // =========================================================================
  // ANALYTICS
  // =========================================================================

  /**
   * Get analytics data.
   */
  async getAnalytics(): Promise<DailyRewardAnalytics> {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Today's claims
    const { count: todayClaims } = await this.supabase
      .from('daily_reward_history')
      .select('id', { count: 'exact', head: true })
      .gte('claimed_at', today.toISOString());

    // Today's unique users
    const { data: todayData } = await this.supabase
      .from('daily_reward_history')
      .select('user_id, streak_at_claim')
      .gte('claimed_at', today.toISOString());

    const uniqueUsers = new Set(todayData?.map(d => d.user_id) || []).size;

    // All-time stats from user rewards
    const { data: allUserRewards } = await this.supabase
      .from('user_daily_rewards')
      .select('current_streak, highest_streak');

    let avgStreak = 0;
    let highestStreak = 0;

    if (allUserRewards && allUserRewards.length > 0) {
      const totalStreak = allUserRewards.reduce((sum, s) => sum + (s.current_streak || 0), 0);
      avgStreak = Math.round(totalStreak / allUserRewards.length);
      highestStreak = Math.max(...allUserRewards.map(s => s.highest_streak || 0));
    }

    // Most claimed day
    const { data: dayCounts } = await this.supabase
      .from('daily_reward_history')
      .select('reward_day');

    const dayFrequency: Record<number, number> = {};
    for (const row of dayCounts || []) {
      dayFrequency[row.reward_day] = (dayFrequency[row.reward_day] || 0) + 1;
    }

    let mostClaimedDay = 1;
    let maxCount = 0;
    for (const [day, cnt] of Object.entries(dayFrequency)) {
      if (cnt > maxCount) {
        maxCount = cnt;
        mostClaimedDay = parseInt(day);
      }
    }

    // Total rewards distributed
    const { data: totals } = await this.supabase
      .from('daily_reward_history')
      .select('coins_amount, energy_amount');

    let totalCoins = 0;
    let totalEnergy = 0;

    for (const row of totals || []) {
      totalCoins += row.coins_amount || 0;
      totalEnergy += row.energy_amount || 0;
    }

    return {
      totalClaims: await this.getTotalClaimsCount(),
      uniqueUsersToday: uniqueUsers,
      averageStreak: avgStreak,
      highestStreak,
      mostClaimedDay,
      totalCoinsDistributed: totalCoins,
      totalEnergyDistributed: totalEnergy
    };
  }

  // =========================================================================
  // MAPPING HELPERS
  // =========================================================================

  private mapDailyReward(row: Record<string, unknown>): DailyReward {
    return {
      id: row.id as string,
      dayNumber: row.day_number as number,
      coinsReward: row.coins_reward as number,
      energyReward: row.energy_reward as number,
      timeShardsReward: row.time_shards_reward as number,
      boosterType: row.booster_type as string | undefined,
      boosterAmount: row.booster_amount as number,
      eventId: row.event_id as string | undefined,
      isPremiumOnly: row.is_premium_only as boolean,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string)
    };
  }

  private mapUserDailyReward(row: Record<string, unknown>): UserDailyReward {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      currentStreak: row.current_streak as number,
      lastClaimDate: row.last_claim_date ? new Date(row.last_claim_date as string) : undefined,
      totalClaims: row.total_claims as number,
      highestStreak: row.highest_streak as number,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string)
    };
  }

  private mapHistory(row: Record<string, unknown>): DailyRewardHistory {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      rewardDay: row.reward_day as number,
      streakAtClaim: row.streak_at_claim as number,
      coinsAmount: row.coins_amount as number,
      energyAmount: row.energy_amount as number,
      timeShardsAmount: row.time_shards_amount as number,
      boosterType: row.booster_type as string | undefined,
      boosterAmount: row.booster_amount as number,
      totalValue: row.total_value as number,
      multiplier: row.multiplier as number,
      claimedAt: new Date(row.claimed_at as string),
      eventId: row.event_id as string | undefined
    };
  }
}

// Singleton instance
let dailyRewardRepositoryInstance: DailyRewardRepository | null = null;

export function getDailyRewardRepository(
  supabaseUrl?: string,
  supabaseKey?: string
): DailyRewardRepository {
  if (!dailyRewardRepositoryInstance) {
    const url = supabaseUrl || process.env.SUPABASE_URL;
    const key = supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error('Missing required environment variables for DailyRewardRepository');
    }

    dailyRewardRepositoryInstance = new DailyRewardRepository(url, key);
  }

  return dailyRewardRepositoryInstance;
}
