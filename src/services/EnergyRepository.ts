/**
 * EnergyRepository
 * 
 * Repository for database operations related to energy.
 * Provides data access layer separating DB logic from business logic.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { EnergyHistory, EnergyBooster, UserEnergyBooster, EnergyOperationType } from '../types/energy';

export class EnergyRepository {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // =========================================================================
  // USER ENERGY OPERATIONS
  // =========================================================================

  /**
   * Get user's energy data.
   */
  async getUserEnergy(userId: string): Promise<{
    currentEnergy: number;
    maxEnergy: number;
    lastEnergyUpdate: Date;
    totalSpent: number;
    totalRestored: number;
  } | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('current_energy, max_energy, last_energy_update, total_energy_spent, total_energy_restored')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      currentEnergy: data.current_energy,
      maxEnergy: data.max_energy,
      lastEnergyUpdate: new Date(data.last_energy_update),
      totalSpent: data.total_energy_spent,
      totalRestored: data.total_energy_restored
    };
  }

  /**
   * Update user's energy.
   */
  async updateUserEnergy(
    userId: string,
    updates: {
      currentEnergy?: number;
      maxEnergy?: number;
      lastEnergyUpdate?: Date;
      totalSpent?: number;
      totalRestored?: number;
    }
  ): Promise<boolean> {
    const updateData: Record<string, unknown> = {};

    if (updates.currentEnergy !== undefined) {
      updateData.current_energy = updates.currentEnergy;
    }
    if (updates.maxEnergy !== undefined) {
      updateData.max_energy = updates.maxEnergy;
    }
    if (updates.lastEnergyUpdate !== undefined) {
      updateData.last_energy_update = updates.lastEnergyUpdate.toISOString();
    }
    if (updates.totalSpent !== undefined) {
      updateData.total_energy_spent = updates.totalSpent;
    }
    if (updates.totalRestored !== undefined) {
      updateData.total_energy_restored = updates.totalRestored;
    }

    const { error } = await this.supabase
      .from('users')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.error('EnergyRepository: Error updating user energy:', error);
      return false;
    }

    return true;
  }

  // =========================================================================
  // ENERGY HISTORY OPERATIONS
  // =========================================================================

  /**
   * Create energy history record.
   */
  async createHistory(data: {
    userId: string;
    operationType: EnergyOperationType;
    amount: number;
    balanceAfter: number;
    context?: string;
  }): Promise<string | null> {
    const { data: result, error } = await this.supabase
      .from('energy_history')
      .insert({
        user_id: data.userId,
        operation_type: data.operationType,
        amount: data.amount,
        balance_after: data.balanceAfter,
        context: data.context
      })
      .select('id')
      .single();

    if (error) {
      console.error('EnergyRepository: Error creating history:', error);
      return null;
    }

    return result.id;
  }

  /**
   * Get user's energy history.
   */
  async getHistory(
    userId: string,
    options?: {
      operationType?: EnergyOperationType;
      limit?: number;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<EnergyHistory[]> {
    let query = this.supabase
      .from('energy_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (options?.operationType) {
      query = query.eq('operation_type', options.operationType);
    }

    if (options?.startDate) {
      query = query.gte('created_at', options.startDate.toISOString());
    }

    if (options?.endDate) {
      query = query.lte('created_at', options.endDate.toISOString());
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('EnergyRepository: Error getting history:', error);
      return [];
    }

    return (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      operationType: row.operation_type,
      amount: row.amount,
      balanceAfter: row.balance_after,
      context: row.context,
      createdAt: new Date(row.created_at)
    })));
  }

  /**
   * Get user's last energy operation.
   */
  async getLastOperation(userId: string): Promise<EnergyHistory | null> {
    const { data, error } = await this.supabase
      .from('energy_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      operationType: data.operation_type,
      amount: data.amount,
      balanceAfter: data.balance_after,
      context: data.context,
      createdAt: new Date(data.created_at)
    };
  }

  // =========================================================================
  // ENERGY BOOSTERS
  // =========================================================================

  /**
   * Get all available boosters.
   */
  async getAvailableBoosters(options?: {
    boosterType?: string;
    isPremium?: boolean;
    eventId?: string;
  }): Promise<EnergyBooster[]> {
    let query = this.supabase
      .from('energy_boosters')
      .select('*')
      .order('energy_amount', { ascending: true });

    if (options?.boosterType) {
      query = query.eq('booster_type', options.boosterType);
    }

    if (options?.isPremium !== undefined) {
      query = query.eq('is_premium', options.isPremium);
    }

    if (options?.eventId) {
      query = query.eq('event_id', options.eventId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('EnergyRepository: Error getting boosters:', error);
      return [];
    }

    return (data || []).map(row => this.mapBooster(row));
  }

  /**
   * Get booster by ID.
   */
  async getBooster(boosterId: string): Promise<EnergyBooster | null> {
    const { data, error } = await this.supabase
      .from('energy_boosters')
      .select('*')
      .eq('id', boosterId)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapBooster(data);
  }

  /**
   * Get user's active boosters.
   */
  async getUserBoosters(userId: string): Promise<UserEnergyBooster[]> {
    const { data, error } = await this.supabase
      .from('user_energy_boosters')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('granted_at', { ascending: false });

    if (error) {
      console.error('EnergyRepository: Error getting user boosters:', error);
      return [];
    }

    return (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      boosterId: row.booster_id,
      expiresAt: row.expires_at ? new Date(row.expires_at) : undefined,
      energyRemaining: row.energy_remaining,
      isActive: row.is_active,
      grantedAt: new Date(row.granted_at)
    }));
  }

  /**
   * Grant booster to user.
   */
  async grantBooster(
    userId: string,
    boosterId: string,
    expiresAt?: Date
  ): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('user_energy_boosters')
      .insert({
        user_id: userId,
        booster_id: boosterId,
        expires_at: expiresAt?.toISOString()
      })
      .select('id')
      .single();

    if (error) {
      console.error('EnergyRepository: Error granting booster:', error);
      return null;
    }

    return data.id;
  }

  /**
   * Deactivate user's booster.
   */
  async deactivateBooster(userBoosterId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('user_energy_boosters')
      .update({ is_active: false })
      .eq('id', userBoosterId);

    if (error) {
      console.error('EnergyRepository: Error deactivating booster:', error);
      return false;
    }

    return true;
  }

  // =========================================================================
  // ANALYTICS
  // =========================================================================

  /**
   * Get energy analytics.
   */
  async getAnalytics(startDate?: Date, endDate?: Date): Promise<{
    totalSpent: number;
    totalRestored: number;
    totalOperations: number;
    uniqueUsers: number;
  }> {
    let query = this.supabase
      .from('energy_history')
      .select('operation_type, amount, user_id');

    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }

    if (endDate) {
      query = query.lte('created_at', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('EnergyRepository: Error getting analytics:', error);
      return { totalSpent: 0, totalRestored: 0, totalOperations: 0, uniqueUsers: 0 };
    }

    let totalSpent = 0;
    let totalRestored = 0;
    const uniqueUsers = new Set<string>();

    for (const row of data || []) {
      uniqueUsers.add(row.user_id);
      if (row.operation_type === 'consume') {
        totalSpent += row.amount;
      } else {
        totalRestored += row.amount;
      }
    }

    return {
      totalSpent,
      totalRestored,
      totalOperations: data?.length || 0,
      uniqueUsers: uniqueUsers.size
    };
  }

  // =========================================================================
  // MAPPING HELPERS
  // =========================================================================

  private mapBooster(row: Record<string, unknown>): EnergyBooster {
    return {
      id: row.id as string,
      name: row.name as string,
      description: row.description as string | undefined,
      energyAmount: row.energy_amount as number,
      durationMinutes: row.duration_minutes as number,
      boosterType: row.booster_type as string as any,
      costCoins: row.cost_coins as number | undefined,
      costGems: row.cost_gems as number | undefined,
      isPremium: row.is_premium as boolean,
      isLimited: row.is_limited as boolean,
      eventId: row.event_id as string | undefined,
      availableUntil: row.available_until ? new Date(row.available_until as string) : undefined,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string)
    };
  }
}

// Singleton instance
let energyRepositoryInstance: EnergyRepository | null = null;

export function getEnergyRepository(
  supabaseUrl?: string,
  supabaseKey?: string
): EnergyRepository {
  if (!energyRepositoryInstance) {
    const url = supabaseUrl || process.env.SUPABASE_URL;
    const key = supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error('Missing required environment variables for EnergyRepository');
    }

    energyRepositoryInstance = new EnergyRepository(url, key);
  }

  return energyRepositoryInstance;
}
