/**
 * AdRepository
 * 
 * Repository for database operations related to ads.
 * Provides data access layer for ads_views, ads_statistics, and user_ad_settings tables.
 * 
 * This separates database logic from business logic, making it easier to:
 * - Test database operations
 * - Modify data access without affecting business logic
 * - Add caching layer in the future
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AdCategory, AdView, AdStatistics, UserAdSettings } from '../types/ads';

export class AdRepository {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // =========================================================================
  // ADS VIEWS OPERATIONS
  // =========================================================================

  /**
   * Create a new ad view record.
   */
  async createAdView(data: {
    userId: string;
    adType: AdCategory;
    rewardType: string;
    rewardAmount: number;
    sessionId?: string;
    adsgramAdId?: string;
  }): Promise<string | null> {
    const { data: result, error } = await this.supabase
      .from('ads_views')
      .insert({
        user_id: data.userId,
        ad_type: data.adType,
        reward_type: data.rewardType,
        reward_amount: data.rewardAmount,
        session_id: data.sessionId,
        adsgram_ad_id: data.adsgramAdId
      })
      .select('id')
      .single();

    if (error) {
      console.error('AdRepository: Error creating ad view:', error);
      return null;
    }

    return result.id;
  }

  /**
   * Get ad views for a user within a time range.
   */
  async getAdViewsByUser(
    userId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      adType?: AdCategory;
      limit?: number;
    }
  ): Promise<AdView[]> {
    let query = this.supabase
      .from('ads_views')
      .select('*')
      .eq('user_id', userId)
      .order('shown_at', { ascending: false });

    if (options?.startDate) {
      query = query.gte('shown_at', options.startDate.toISOString());
    }

    if (options?.endDate) {
      query = query.lte('shown_at', options.endDate.toISOString());
    }

    if (options?.adType) {
      query = query.eq('ad_type', options.adType);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('AdRepository: Error getting ad views:', error);
      return [];
    }

    return (data || []).map(row => ({
      id: row.id,
      user_id: row.user_id,
      ad_type: row.ad_type,
      reward_type: row.reward_type,
      reward_amount: row.reward_amount,
      shown_at: new Date(row.shown_at),
      adsgram_ad_id: row.adsgram_ad_id,
      session_id: row.session_id
    }));
  }

  /**
   * Count ad views for a user on a specific date.
   */
  async countAdViewsByDate(
    userId: string,
    date: Date,
    adType?: AdCategory
  ): Promise<number> {
    // Start of day
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    // End of day
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    let query = this.supabase
      .from('ads_views')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('shown_at', startOfDay.toISOString())
      .lte('shown_at', endOfDay.toISOString());

    if (adType) {
      query = query.eq('ad_type', adType);
    }

    const { count, error } = await query;

    if (error) {
      console.error('AdRepository: Error counting ad views:', error);
      return 0;
    }

    return count || 0;
  }

  /**
   * Get the last ad view for a user and category.
   */
  async getLastAdView(
    userId: string,
    adType: AdCategory
  ): Promise<AdView | null> {
    const { data, error } = await this.supabase
      .from('ads_views')
      .select('*')
      .eq('user_id', userId)
      .eq('ad_type', adType)
      .order('shown_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      user_id: data.user_id,
      ad_type: data.ad_type,
      reward_type: data.reward_type,
      reward_amount: data.reward_amount,
      shown_at: new Date(data.shown_at),
      adsgram_ad_id: data.adsgram_ad_id,
      session_id: data.session_id
    };
  }

  // =========================================================================
  // ADS STATISTICS OPERATIONS
  // =========================================================================

  /**
   * Get or create statistics for a date.
   */
  async getOrCreateStatistics(date: Date): Promise<AdStatistics | null> {
    const dateStr = date.toISOString().split('T')[0];

    // Try to get existing
    const { data: existing } = await this.supabase
      .from('ads_statistics')
      .select('*')
      .eq('date', dateStr)
      .single();

    if (existing) {
      return {
        id: existing.id,
        date: new Date(existing.date),
        impressions: existing.impressions,
        reward_claims: existing.reward_claims,
        unique_users: existing.unique_users,
        estimated_revenue_cents: existing.estimated_revenue_cents,
        breakdown_by_type: existing.breakdown_by_type,
        created_at: new Date(existing.created_at),
        updated_at: new Date(existing.updated_at)
      };
    }

    // Create new
    const { data: created, error } = await this.supabase
      .from('ads_statistics')
      .insert({ date: dateStr })
      .select('*')
      .single();

    if (error || !created) {
      console.error('AdRepository: Error creating statistics:', error);
      return null;
    }

    return {
      id: created.id,
      date: new Date(created.date),
      impressions: created.impressions,
      reward_claims: created.reward_claims,
      unique_users: created.unique_users,
      estimated_revenue_cents: created.estimated_revenue_cents,
      breakdown_by_type: created.breakdown_by_type,
      created_at: new Date(created.created_at),
      updated_at: new Date(created.updated_at)
    };
  }

  /**
   * Update statistics for a date.
   */
  async updateStatistics(
    date: Date,
    updates: {
      impressions?: number;
      reward_claims?: number;
      unique_users?: number;
      estimated_revenue_cents?: number;
      breakdown_by_type?: Record<string, number>;
    }
  ): Promise<boolean> {
    const dateStr = date.toISOString().split('T')[0];

    const { error } = await this.supabase
      .from('ads_statistics')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('date', dateStr);

    if (error) {
      console.error('AdRepository: Error updating statistics:', error);
      return false;
    }

    return true;
  }

  /**
   * Increment statistics counters.
   */
  async incrementStatistics(
    date: Date,
    increments: {
      impressions?: number;
      reward_claims?: number;
      estimated_revenue_cents?: number;
    },
    adType?: AdCategory
  ): Promise<boolean> {
    const stats = await this.getOrCreateStatistics(date);
    if (!stats) return false;

    const newBreakdown = { ...stats.breakdown_by_type };
    if (adType) {
      newBreakdown[adType] = (newBreakdown[adType] || 0) + 1;
    }

    return this.updateStatistics(date, {
      impressions: (stats.impressions || 0) + (increments.impressions || 0),
      reward_claims: (stats.reward_claims || 0) + (increments.reward_claims || 0),
      estimated_revenue_cents: (stats.estimated_revenue_cents || 0) + (increments.estimated_revenue_cents || 0),
      breakdown_by_type: newBreakdown
    });
  }

  /**
   * Get statistics for a date range.
   */
  async getStatisticsRange(
    startDate: Date,
    endDate: Date
  ): Promise<AdStatistics[]> {
    const { data, error } = await this.supabase
      .from('ads_statistics')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) {
      console.error('AdRepository: Error getting statistics range:', error);
      return [];
    }

    return (data || []).map(row => ({
      id: row.id,
      date: new Date(row.date),
      impressions: row.impressions,
      reward_claims: row.reward_claims,
      unique_users: row.unique_users,
      estimated_revenue_cents: row.estimated_revenue_cents,
      breakdown_by_type: row.breakdown_by_type,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at)
    }));
  }

  // =========================================================================
  // USER AD SETTINGS OPERATIONS
  // =========================================================================

  /**
   * Get user ad settings.
   */
  async getUserAdSettings(userId: string): Promise<UserAdSettings | null> {
    const { data, error } = await this.supabase
      .from('user_ad_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      user_id: data.user_id,
      ads_enabled: data.ads_enabled,
      reward_ads_enabled: data.reward_ads_enabled,
      is_premium: data.is_premium,
      last_ad_shown_at: data.last_ad_shown_at ? new Date(data.last_ad_shown_at) : undefined,
      consecutive_ad_days: data.consecutive_ad_days,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at)
    };
  }

  /**
   * Create or update user ad settings.
   */
  async upsertUserAdSettings(
    userId: string,
    settings: {
      ads_enabled?: boolean;
      reward_ads_enabled?: boolean;
      is_premium?: boolean;
      last_ad_shown_at?: Date;
      consecutive_ad_days?: number;
    }
  ): Promise<boolean> {
    const updateData: Record<string, unknown> = {
      user_id: userId,
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
    if (settings.last_ad_shown_at !== undefined) {
      updateData.last_ad_shown_at = settings.last_ad_shown_at.toISOString();
    }
    if (settings.consecutive_ad_days !== undefined) {
      updateData.consecutive_ad_days = settings.consecutive_ad_days;
    }

    const { error } = await this.supabase
      .from('user_ad_settings')
      .upsert(updateData, { onConflict: 'user_id' });

    if (error) {
      console.error('AdRepository: Error upserting user ad settings:', error);
      return false;
    }

    return true;
  }

  /**
   * Get all users with ads enabled.
   */
  async getUsersWithAdsEnabled(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('user_ad_settings')
      .select('user_id')
      .eq('ads_enabled', true);

    if (error) {
      console.error('AdRepository: Error getting users with ads enabled:', error);
      return [];
    }

    return (data || []).map(row => row.user_id);
  }

  /**
   * Update last ad shown timestamp.
   */
  async updateLastAdShown(userId: string, timestamp?: Date): Promise<boolean> {
    return this.upsertUserAdSettings(userId, {
      last_ad_shown_at: timestamp || new Date()
    });
  }

  // =========================================================================
  // ANALYTICS QUERIES
  // =========================================================================

  /**
   * Get unique users who watched ads on a date.
   */
  async getUniqueUsersForDate(date: Date): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const { data, error } = await this.supabase
      .from('ads_views')
      .select('user_id', { count: 'exact', distinct: true })
      .gte('shown_at', startOfDay.toISOString())
      .lte('shown_at', endOfDay.toISOString());

    if (error) {
      console.error('AdRepository: Error getting unique users:', error);
      return 0;
    }

    return data?.length || 0;
  }

  /**
   * Get total ads watched for a date range.
   */
  async getTotalAdsForRange(startDate: Date, endDate: Date): Promise<number> {
    const { data, error } = await this.supabase
      .from('ads_views')
      .select('id', { count: 'exact', head: true })
      .gte('shown_at', startDate.toISOString())
      .lte('shown_at', endDate.toISOString());

    if (error) {
      console.error('AdRepository: Error getting total ads:', error);
      return 0;
    }

    return data?.length || 0;
  }
}

// Singleton instance
let adRepositoryInstance: AdRepository | null = null;

export function getAdRepository(
  supabaseUrl?: string,
  supabaseKey?: string
): AdRepository {
  if (!adRepositoryInstance) {
    const url = supabaseUrl || process.env.SUPABASE_URL;
    const key = supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error('Missing required environment variables for AdRepository');
    }

    adRepositoryInstance = new AdRepository(url, key);
  }

  return adRepositoryInstance;
}
