/**
 * AdScheduler Service
 * 
 * Manages ad scheduling, cooldowns, and frequency balancing.
 * 
 * This service handles:
 * - Cooldown tracking between ads
 * - Frequency balancing (controlling how often users see ads)
 * - A/B testing support for ad frequency experiments
 * - Event multipliers for ad rewards
 * - Premium user handling (fewer ads)
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AdCategory, AD_COOLDOWNS, DailyLimits, DEFAULT_DAILY_LIMITS, PREMIUM_DAILY_LIMITS } from '../types/ads';

export interface ScheduleResult {
  canSchedule: boolean;
  nextAvailableAt?: Date;
  reason?: string;
}

/**
 * Cooldown tracking record.
 */
interface CooldownRecord {
  userId: string;
  category: AdCategory;
  lastShownAt: Date;
  expiresAt: Date;
}

export class AdScheduler {
  private supabase: SupabaseClient;
  
  // In-memory cache for cooldowns (in production, use Redis)
  private cooldownCache = new Map<string, CooldownRecord>();

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // =========================================================================
  // COOLDOWN MANAGEMENT
  // =========================================================================

  /**
   * Check if a user is in cooldown for a specific ad category.
   * 
   * @param userId - User ID
   * @param category - Ad category
   * @returns ScheduleResult with timing info
   */
  async checkCooldown(userId: string, category: AdCategory): Promise<ScheduleResult> {
    // Check memory cache first
    const cacheKey = `${userId}_${category}`;
    const cached = this.cooldownCache.get(cacheKey);
    
    if (cached && cached.expiresAt > new Date()) {
      return {
        canSchedule: false,
        nextAvailableAt: cached.expiresAt,
        reason: 'In cooldown period'
      };
    }

    // Check database
    const cooldownSeconds = AD_COOLDOWNS[category];
    const cooldownStart = new Date(Date.now() - cooldownSeconds * 1000);

    const { data } = await this.supabase
      .from('ads_views')
      .select('shown_at')
      .eq('user_id', userId)
      .eq('ad_type', category)
      .gte('shown_at', cooldownStart.toISOString())
      .order('shown_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      const lastShown = new Date(data.shown_at);
      const expiresAt = new Date(lastShown.getTime() + cooldownSeconds * 1000);
      
      if (expiresAt > new Date()) {
        // Cache the result
        this.cooldownCache.set(cacheKey, {
          userId,
          category,
          lastShownAt: lastShown,
          expiresAt
        });

        return {
          canSchedule: false,
          nextAvailableAt: expiresAt,
          reason: 'In cooldown period'
        };
      }
    }

    return { canSchedule: true };
  }

  /**
   * Record that an ad was shown, updating cooldown.
   * 
   * @param userId - User ID
   * @param category - Ad category
   */
  async recordAdShown(userId: string, category: AdCategory): Promise<void> {
    const cooldownSeconds = AD_COOLDOWNS[category];
    const expiresAt = new Date(Date.now() + cooldownSeconds * 1000);

    // Update cache
    const cacheKey = `${userId}_${category}`;
    this.cooldownCache.set(cacheKey, {
      userId,
      category,
      lastShownAt: new Date(),
      expiresAt
    });

    // Note: We don't need to persist cooldowns since they're based on ads_views
    // The database query in checkCooldown handles persistence
  }

  /**
   * Clear cooldown for a user and category.
   * Used for testing or admin override.
   */
  async clearCooldown(userId: string, category: AdCategory): Promise<void> {
    const cacheKey = `${userId}_${category}`;
    this.cooldownCache.delete(cacheKey);
  }

  // =========================================================================
  // FREQUENCY BALANCING
  // =========================================================================

  /**
   * Get the recommended time to wait before showing next ad.
   * 
   * This implements frequency balancing to avoid annoying users
   * while maximizing engagement.
   * 
   * @param userId - User ID
   * @param category - Ad category
   * @returns Recommended wait time in seconds
   */
  async getRecommendedWaitTime(userId: string, category: AdCategory): Promise<number> {
    // Get user's ad statistics
    const stats = await this.getUserAdStats(userId);
    
    // Base wait time from category
    const baseWait = AD_COOLDOWNS[category];

    // Adjust based on engagement
    if (stats.todayViews >= 10) {
      // Heavy user - increase wait time to avoid annoyance
      return Math.floor(baseWait * 1.5);
    } else if (stats.todayViews >= 5) {
      // Moderate user - normal wait
      return baseWait;
    } else {
      // Light user - can reduce wait slightly
      return Math.floor(baseWait * 0.75);
    }
  }

  /**
   * Get user's ad statistics for balancing.
   */
  private async getUserAdStats(userId: string): Promise<{
    todayViews: number;
    totalViews: number;
    consecutiveDays: number;
  }> {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Get today's count
    const { count: todayCount } = await this.supabase
      .from('ads_views')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('shown_at', today.toISOString());

    // Get total count
    const { count: totalCount } = await this.supabase
      .from('ads_views')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get consecutive days from settings
    const { data: settings } = await this.supabase
      .from('user_ad_settings')
      .select('consecutive_ad_days')
      .eq('user_id', userId)
      .single();

    return {
      todayViews: todayCount || 0,
      totalViews: totalCount || 0,
      consecutiveDays: settings?.consecutive_ad_days || 0
    };
  }

  // =========================================================================
  // DAILY LIMITS
  // =========================================================================

  /**
   * Get the daily limit for a user and category.
   * 
   * @param userId - User ID
   * @param category - Ad category
   * @returns Daily limit number
   */
  async getDailyLimit(userId: string, category: AdCategory): Promise<number> {
    // Check if user is premium
    const { data: settings } = await this.supabase
      .from('user_ad_settings')
      .select('is_premium')
      .eq('user_id', userId)
      .single();

    const isPremium = settings?.is_premium || false;
    
    const limits = isPremium ? PREMIUM_DAILY_LIMITS : DEFAULT_DAILY_LIMITS;
    
    return limits[category];
  }

  /**
   * Check if user has reached daily limit.
   * 
   * @param userId - User ID
   * @param category - Ad category
   * @returns ScheduleResult with remaining count
   */
  async checkDailyLimit(userId: string, category: AdCategory): Promise<ScheduleResult> {
    const limit = await this.getDailyLimit(userId, category);
    
    // Count today's views
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const { count } = await this.supabase
      .from('ads_views')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('ad_type', category)
      .gte('shown_at', today.toISOString());

    const todayCount = count || 0;

    if (todayCount >= limit) {
      // Calculate reset time (midnight UTC)
      const tomorrow = new Date(today);
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

      return {
        canSchedule: false,
        nextAvailableAt: tomorrow,
        reason: `Daily limit reached (${todayCount}/${limit})`
      };
    }

    return {
      canSchedule: true
    };
  }

  /**
   * Get remaining ads for a user and category today.
   * 
   * @param userId - User ID
   * @param category - Ad category
   * @returns Remaining ad count
   */
  async getRemainingAds(userId: string, category: AdCategory): Promise<number> {
    const limit = await this.getDailyLimit(userId, category);
    
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const { count } = await this.supabase
      .from('ads_views')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('ad_type', category)
      .gte('shown_at', today.toISOString());

    const todayCount = count || 0;
    return Math.max(0, limit - todayCount);
  }

  // =========================================================================
  // A/B TESTING SUPPORT
  // =========================================================================

  /**
   * Get adjusted parameters for a user based on A/B tests.
   * 
   * This is a placeholder for future A/B testing implementation.
   * 
   * @param userId - User ID
   * @param testId - Test identifier
   * @returns Test parameters
   */
  async getABTestParameters(
    userId: string,
    testId: string
  ): Promise<Record<string, unknown>> {
    // TODO: Implement A/B testing
    // For now, return empty
    return {};
  }

  /**
   * Get multiplier for ad rewards based on events or A/B tests.
   * 
   * @param userId - User ID
   * @returns Reward multiplier (default 1.0)
   */
  async getRewardMultiplier(userId: string): Promise<number> {
    // TODO: Implement event multipliers
    // TODO: Implement A/B test multipliers
    
    let multiplier = 1.0;

    // Check for active events (placeholder)
    // const hasActiveEvent = await this.checkActiveEvent();
    // if (hasActiveEvent) {
    //   multiplier *= 2.0;
    // }

    return multiplier;
  }

  // =========================================================================
  // SCHEDULING
  // =========================================================================

  /**
   * Get the next scheduled ad opportunity for a user.
   * 
   * This checks all constraints and returns when the next ad can be shown.
   * 
   * @param userId - User ID
   * @param categories - Categories to consider
   * @returns Next available time or null if no ads available today
   */
  async getNextAdTime(
    userId: string,
    categories: AdCategory[]
  ): Promise<Date | null> {
    let nextAvailable: Date | null = null;

    for (const category of categories) {
      // Check cooldown
      const cooldownResult = await this.checkCooldown(userId, category);
      if (cooldownResult.canSchedule && cooldownResult.nextAvailableAt) {
        if (!nextAvailable || cooldownResult.nextAvailableAt < nextAvailable) {
          nextAvailable = cooldownResult.nextAvailableAt;
        }
      }

      // Check daily limit
      const limitResult = await this.checkDailyLimit(userId, category);
      if (!limitResult.canSchedule && limitResult.nextAvailableAt) {
        if (!nextAvailable || limitResult.nextAvailableAt < nextAvailable) {
          nextAvailable = limitResult.nextAvailableAt;
        }
      }
    }

    return nextAvailable;
  }
}

// Singleton instance
let adSchedulerInstance: AdScheduler | null = null;

export function getAdScheduler(
  supabaseUrl?: string,
  supabaseKey?: string
): AdScheduler {
  if (!adSchedulerInstance) {
    const url = supabaseUrl || process.env.SUPABASE_URL;
    const key = supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error('Missing required environment variables for AdScheduler');
    }

    adSchedulerInstance = new AdScheduler(url, key);
  }

  return adSchedulerInstance;
}
