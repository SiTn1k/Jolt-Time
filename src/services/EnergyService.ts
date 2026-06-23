/**
 * EnergyService
 * 
 * Core service for managing player energy.
 * 
 * Features:
 * - Energy consumption for game actions
 * - Natural regeneration (+1 every 5 minutes)
 * - Offline recovery calculation
 * - Maximum energy cap
 * - History tracking
 * - AdsGram integration support (architecture)
 * 
 * Energy Regeneration Rules:
 * - +1 energy every 5 minutes
 * - Cannot exceed max_energy
 * - Offline recovery calculated when player returns
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  EnergyOperationType,
  EnergyState,
  ConsumeEnergyResult,
  RestoreEnergyResult,
  OfflineRecoveryResult,
  ENERGY_REGEN_CONFIG,
  DEFAULT_ENERGY_COSTS
} from '../types/energy';

export interface EnergyConfig {
  supabaseUrl: string;
  supabaseKey: string;
  /**
   * Custom energy per tick (default: 1)
   */
  energyPerTick?: number;
  /**
   * Custom minutes per tick (default: 5)
   */
  minutesPerTick?: number;
}

export class EnergyService {
  private supabase: SupabaseClient;
  private energyPerTick: number;
  private minutesPerTick: number;

  constructor(config: EnergyConfig) {
    this.supabase = createClient(config.supabaseUrl, config.supabaseKey);
    this.energyPerTick = config.energyPerTick || ENERGY_REGEN_CONFIG.ENERGY_PER_TICK;
    this.minutesPerTick = config.minutesPerTick || ENERGY_REGEN_CONFIG.MINUTES_PER_TICK;
  }

  // =========================================================================
  // CORE METHODS
  // =========================================================================

  /**
   * Get current energy state for a user.
   * 
   * This automatically:
   * 1. Calculates offline recovery
   * 2. Updates current energy
   * 3. Returns current state
   * 
   * @param userId - User ID
   * @returns EnergyState with current values
   */
  async getCurrentEnergy(userId: string): Promise<EnergyState> {
    // First, calculate any offline recovery
    await this.calculateOfflineRecovery(userId);
    
    // Get user's current energy from database
    const { data, error } = await this.supabase
      .from('users')
      .select('current_energy, max_energy, last_energy_update, total_energy_spent, total_energy_restored')
      .eq('id', userId)
      .single();

    if (error || !data) {
      // Return default if user not found
      return {
        userId,
        currentEnergy: ENERGY_REGEN_CONFIG.DEFAULT_STARTING_ENERGY,
        maxEnergy: ENERGY_REGEN_CONFIG.DEFAULT_MAX_ENERGY,
        lastEnergyUpdate: new Date(),
        totalSpent: 0,
        totalRestored: 0
      };
    }

    return {
      userId,
      currentEnergy: data.current_energy,
      maxEnergy: data.max_energy,
      lastEnergyUpdate: new Date(data.last_energy_update),
      totalSpent: data.total_energy_spent,
      totalRestored: data.total_energy_restored
    };
  }

  /**
   * Consume energy for a game action.
   * 
   * @param userId - User ID
   * @param amount - Amount of energy to consume
   * @param context - Optional context (e.g., 'expedition_1')
   * @returns ConsumeEnergyResult
   */
  async consumeEnergy(userId: string, amount: number, context?: string): Promise<ConsumeEnergyResult> {
    // Validate amount
    if (amount <= 0) {
      return { success: false, error: 'Amount must be positive', newBalance: 0, amountConsumed: 0 };
    }

    // Get current energy (with offline recovery)
    const state = await this.getCurrentEnergy(userId);

    // Check if enough energy
    if (state.currentEnergy < amount) {
      return { 
        success: false, 
        error: `Not enough energy. Have ${state.currentEnergy}, need ${amount}`,
        newBalance: state.currentEnergy,
        amountConsumed: 0
      };
    }

    // Calculate new balance
    const newBalance = state.currentEnergy - amount;

    try {
      // Update user's energy
      const { error } = await this.supabase
        .from('users')
        .update({
          current_energy: newBalance,
          last_energy_update: new Date().toISOString(),
          total_energy_spent: state.totalSpent + amount
        })
        .eq('id', userId);

      if (error) throw error;

      // Record history
      await this.recordHistory(
        userId,
        EnergyOperationType.CONSUME,
        amount,
        newBalance,
        context
      );

      return {
        success: true,
        newBalance,
        amountConsumed: amount
      };
    } catch (error) {
      console.error('EnergyService: Error consuming energy:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to consume energy',
        newBalance: state.currentEnergy,
        amountConsumed: 0
      };
    }
  }

  /**
   * Restore energy to a user.
   * 
   * @param userId - User ID
   * @param amount - Amount of energy to restore
   * @param operationType - Type of operation (restore, ads_reward, etc.)
   * @param context - Optional context
   * @returns RestoreEnergyResult
   */
  async restoreEnergy(
    userId: string,
    amount: number,
    operationType: EnergyOperationType = EnergyOperationType.RESTORE,
    context?: string
  ): Promise<RestoreEnergyResult> {
    if (amount <= 0) {
      return { success: false, error: 'Amount must be positive', newBalance: 0, amountRestored: 0, wasCapped: false };
    }

    // Get current energy
    const state = await this.getCurrentEnergy(userId);
    
    // Calculate new balance (capped at max)
    let newBalance = state.currentEnergy + amount;
    let wasCapped = false;
    
    if (newBalance > state.maxEnergy) {
      newBalance = state.maxEnergy;
      wasCapped = true;
    }

    const actualRestored = newBalance - state.currentEnergy;

    try {
      // Update user's energy
      const { error } = await this.supabase
        .from('users')
        .update({
          current_energy: newBalance,
          last_energy_update: new Date().toISOString(),
          total_energy_restored: state.totalRestored + actualRestored
        })
        .eq('id', userId);

      if (error) throw error;

      // Record history
      await this.recordHistory(
        userId,
        operationType,
        actualRestored,
        newBalance,
        context
      );

      return {
        success: true,
        newBalance,
        amountRestored: actualRestored,
        wasCapped
      };
    } catch (error) {
      console.error('EnergyService: Error restoring energy:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to restore energy',
        newBalance: state.currentEnergy,
        amountRestored: 0,
        wasCapped: false
      };
    }
  }

  /**
   * Restore energy to maximum.
   * 
   * @param userId - User ID
   * @param operationType - Type of operation
   * @param context - Optional context
   * @returns RestoreEnergyResult
   */
  async restoreToMaximum(
    userId: string,
    operationType: EnergyOperationType = EnergyOperationType.ADMIN_REWARD,
    context?: string
  ): Promise<RestoreEnergyResult> {
    const state = await this.getCurrentEnergy(userId);
    const amountNeeded = state.maxEnergy - state.currentEnergy;
    
    if (amountNeeded <= 0) {
      return {
        success: true,
        newBalance: state.currentEnergy,
        amountRestored: 0,
        wasCapped: false
      };
    }

    return this.restoreEnergy(userId, amountNeeded, operationType, context);
  }

  /**
   * Calculate and apply offline recovery.
   * 
   * When a player returns after being away, their energy is restored
   * based on how long they were gone.
   * 
   * Rules:
   * - +1 energy per tick (default: 5 minutes)
   * - Maximum offline time: 8 hours (configurable)
   * - Cannot exceed max_energy
   * 
   * @param userId - User ID
   * @returns OfflineRecoveryResult
   */
  async calculateOfflineRecovery(userId: string): Promise<OfflineRecoveryResult> {
    // Get user's last update time
    const { data, error } = await this.supabase
      .from('users')
      .select('current_energy, max_energy, last_energy_update')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return {
        totalRecoverable: 0,
        minutesAway: 0,
        energyCapped: false,
        recoveredAmount: 0
      };
    }

    const lastUpdate = new Date(data.last_energy_update);
    const now = new Date();
    
    // Calculate minutes away
    const minutesAway = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60));
    
    // Cap at maximum offline minutes
    const cappedMinutes = Math.min(minutesAway, ENERGY_REGEN_CONFIG.MAX_OFFLINE_MINUTES);
    
    // Calculate energy that would be recovered
    const energyPerTick = this.energyPerTick;
    const minutesPerTick = this.minutesPerTick;
    const totalRecoverable = Math.floor(cappedMinutes / minutesPerTick) * energyPerTick;
    
    // Calculate new balance
    const currentEnergy = data.current_energy;
    const maxEnergy = data.max_energy;
    let newEnergy = currentEnergy + totalRecoverable;
    
    // Check if capped
    let energyCapped = false;
    if (newEnergy > maxEnergy) {
      newEnergy = maxEnergy;
      energyCapped = true;
    }
    
    const recoveredAmount = newEnergy - currentEnergy;

    // Only update if there's actually energy to recover
    if (recoveredAmount > 0) {
      const { error: updateError } = await this.supabase
        .from('users')
        .update({
          current_energy: newEnergy,
          last_energy_update: now.toISOString()
        })
        .eq('id', userId);

      if (!updateError) {
        // Record history for offline recovery
        await this.recordHistory(
          userId,
          EnergyOperationType.OFFLINE_RECOVERY,
          recoveredAmount,
          newEnergy,
          `offline_${minutesAway}_minutes`
        );
      }
    }

    return {
      totalRecoverable,
      minutesAway,
      energyCapped,
      recoveredAmount
    };
  }

  // =========================================================================
  // NATURAL REGENERATION
  // =========================================================================

  /**
   * Process natural energy regeneration for a user.
   * 
   * This should be called periodically (e.g., every minute via cron)
   * to update energy based on time elapsed.
   * 
   * @param userId - User ID
   * @returns RestoreEnergyResult
   */
  async processRegeneration(userId: string): Promise<RestoreEnergyResult> {
    const state = await this.getCurrentEnergy(userId);
    
    // Already at max
    if (state.currentEnergy >= state.maxEnergy) {
      return {
        success: true,
        newBalance: state.currentEnergy,
        amountRestored: 0,
        wasCapped: true
      };
    }

    // Add one tick of energy
    return this.restoreEnergy(
      userId,
      this.energyPerTick,
      EnergyOperationType.RESTORE,
      'natural_regeneration'
    );
  }

  /**
   * Process regeneration for all active users.
   * 
   * Called by cron job.
   * 
   * @returns Number of users processed
   */
  async processAllRegeneration(): Promise<number> {
    // Get all users (in production, batch this)
    const { data: users, error } = await this.supabase
      .from('users')
      .select('id, current_energy, max_energy, last_energy_update')
      .lt('current_energy', 'max_energy'); // Only users not at max

    if (error || !users) {
      return 0;
    }

    let processed = 0;

    for (const user of users) {
      const lastUpdate = new Date(user.last_energy_update);
      const now = new Date();
      const minutesPassed = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60));
      
      // Calculate ticks that should have happened
      const ticksDue = Math.floor(minutesPassed / this.minutesPerTick);
      
      if (ticksDue > 0) {
        const toRestore = Math.min(
          ticksDue * this.energyPerTick,
          user.max_energy - user.current_energy
        );
        
        if (toRestore > 0) {
          await this.restoreEnergy(
            user.id,
            toRestore,
            EnergyOperationType.RESTORE,
            'cron_regeneration'
          );
          processed++;
        }
      }
    }

    return processed;
  }

  // =========================================================================
  // ADSGRAM INTEGRATION
  // =========================================================================

  /**
   * Restore energy from watching an AdsGram ad.
   * 
   * This is the integration point for AdsGram rewarded ads.
   * 
   * @param userId - User ID
   * @param adId - AdsGram ad ID (for tracking)
   * @param amount - Energy amount to restore (from ad configuration)
   * @returns RestoreEnergyResult
   */
  async restoreFromAds(
    userId: string,
    adId: string,
    amount: number
  ): Promise<RestoreEnergyResult> {
    return this.restoreEnergy(
      userId,
      amount,
      EnergyOperationType.ADS_REWARD,
      `adsgram_${adId}`
    );
  }

  // =========================================================================
  // NOTIFICATION COMPATIBILITY
  // =========================================================================

  /**
   * Get notification message for energy fully restored.
   */
  async getNotificationMessage(userId: string): Promise<{
    title: string;
    message: string;
    isFull: boolean;
  }> {
    const state = await this.getCurrentEnergy(userId);
    const isFull = state.currentEnergy >= state.maxEnergy;

    return {
      title: isFull ? '⚡ Energy Fully Restored!' : '⚡ Energy Restored',
      message: isFull 
        ? 'Your energy is fully restored! Ready for action.'
        : `Your energy is now ${state.currentEnergy}/${state.maxEnergy}.`,
      isFull
    };
  }

  // =========================================================================
  // ENERGY COSTS
  // =========================================================================

  /**
   * Get energy cost for an action.
   * 
   * @param action - Action name (e.g., 'expedition_start')
   * @returns Energy cost, or 0 if action doesn't cost energy
   */
  getEnergyCost(action: string): number {
    return DEFAULT_ENERGY_COSTS[action] || 0;
  }

  /**
   * Check if user has enough energy for an action.
   * 
   * @param userId - User ID
   * @param action - Action name
   * @returns Object with canPerform and currentBalance
   */
  async canPerformAction(userId: string, action: string): Promise<{
    canPerform: boolean;
    cost: number;
    currentBalance: number;
  }> {
    const cost = this.getEnergyCost(action);
    const state = await this.getCurrentEnergy(userId);
    
    return {
      canPerform: state.currentEnergy >= cost,
      cost,
      currentBalance: state.currentEnergy
    };
  }

  // =========================================================================
  // PRIVATE HELPERS
  // =========================================================================

  /**
   * Record energy history.
   */
  private async recordHistory(
    userId: string,
    operationType: EnergyOperationType,
    amount: number,
    balanceAfter: number,
    context?: string
  ): Promise<void> {
    await this.supabase
      .from('energy_history')
      .insert({
        user_id: userId,
        operation_type: operationType,
        amount,
        balance_after: balanceAfter,
        context
      });
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================

  /**
   * Initialize energy for a new user.
   * 
   * @param userId - User ID
   */
  async initializeUser(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .update({
        current_energy: ENERGY_REGEN_CONFIG.DEFAULT_STARTING_ENERGY,
        max_energy: ENERGY_REGEN_CONFIG.DEFAULT_MAX_ENERGY,
        last_energy_update: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('EnergyService: Error initializing user energy:', error);
    }
  }

  /**
   * Get energy history for a user.
   */
  async getHistory(userId: string, limit: number = 50): Promise<EnergyHistory[]> {
    const { data, error } = await this.supabase
      .from('energy_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('EnergyService: Error getting history:', error);
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
    }));
  }
}

// Singleton instance
let energyServiceInstance: EnergyService | null = null;

export function getEnergyService(config?: EnergyConfig): EnergyService {
  if (!energyServiceInstance) {
    if (!config) {
      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      if (!url || !key) {
        throw new Error('Missing required environment variables for EnergyService');
      }
      
      config = { supabaseUrl: url, supabaseKey: key };
    }
    
    energyServiceInstance = new EnergyService(config);
  }

  return energyServiceInstance;
}
