/**
 * Energy System Types and Interfaces
 * 
 * Defines all types for the player energy system.
 * 
 * Energy Regeneration Rules:
 * - +1 energy every 5 minutes
 * - Cannot exceed max_energy
 * - Offline recovery calculated when player returns
 * 
 * Future Extensions:
 * - VIP players with faster regen
 * - Temporary boosts
 * - Premium subscriptions
 * - Seasonal modifiers
 */

/**
 * Energy operation types for history tracking.
 */
export enum EnergyOperationType {
  CONSUME = 'consume',
  RESTORE = 'restore',
  DAILY_REWARD = 'daily_reward',
  ADS_REWARD = 'ads_reward',
  EVENT_REWARD = 'event_reward',
  ADMIN_REWARD = 'admin_reward',
  OFFLINE_RECOVERY = 'offline_recovery',
  BOOSTER_USED = 'booster_used'
}

/**
 * Booster types.
 */
export enum BoosterType {
  INSTANT = 'instant',
  PASSIVE = 'passive',
  MAX_BOOST = 'max_boost'
}

/**
 * Energy history record from database.
 */
export interface EnergyHistory {
  id: string;
  userId: string;
  operationType: EnergyOperationType;
  amount: number;
  balanceAfter: number;
  context?: string;
  createdAt: Date;
}

/**
 * Energy booster definition from database.
 */
export interface EnergyBooster {
  id: string;
  name: string;
  description?: string;
  energyAmount: number;
  durationMinutes: number;
  boosterType: BoosterType;
  costCoins?: number;
  costGems?: number;
  isPremium: boolean;
  isLimited: boolean;
  eventId?: string;
  availableUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User's active booster.
 */
export interface UserEnergyBooster {
  id: string;
  userId: string;
  boosterId: string;
  expiresAt?: Date;
  energyRemaining?: number;
  isActive: boolean;
  grantedAt: Date;
}

/**
 * User's complete energy state.
 */
export interface EnergyState {
  userId: string;
  currentEnergy: number;
  maxEnergy: number;
  lastEnergyUpdate: Date;
  totalSpent: number;
  totalRestored: number;
}

/**
 * Result of consuming energy.
 */
export interface ConsumeEnergyResult {
  success: boolean;
  error?: string;
  newBalance: number;
  amountConsumed: number;
}

/**
 * Result of restoring energy.
 */
export interface RestoreEnergyResult {
  success: boolean;
  error?: string;
  newBalance: number;
  amountRestored: number;
  wasCapped: boolean; // True if hit max_energy
}

/**
 * Offline recovery calculation result.
 */
export interface OfflineRecoveryResult {
  totalRecoverable: number; // Energy that would be recovered
  minutesAway: number;
  energyCapped: boolean;
  recoveredAmount: number; // Actual amount recovered (may be less due to cap)
}

/**
 * Energy cost definitions for game actions.
 * These are configurable and can be modified per action.
 */
export const DEFAULT_ENERGY_COSTS: Record<string, number> = {
  // Expeditions
  expedition_start: 20,
  expedition_complete: 0, // Energy is spent at start
  
  // Academy
  research_start: 15,
  
  // Battles (future)
  battle_start: 25,
  
  // General actions
  daily_challenge: 10,
  lucky_spin: 5
};

/**
 * Energy regeneration configuration.
 */
export const ENERGY_REGEN_CONFIG = {
  /**
   * Energy gained per tick.
   */
  ENERGY_PER_TICK: 1,
  
  /**
   * Minutes between each energy tick.
   */
  MINUTES_PER_TICK: 5,
  
  /**
   * Maximum offline recovery minutes (prevents abuse).
   * Even if away for 7 days, only recover up to this.
   */
  MAX_OFFLINE_MINUTES: 480, // 8 hours worth
  
  /**
   * Default starting energy for new players.
   */
  DEFAULT_STARTING_ENERGY: 100,
  
  /**
   * Default maximum energy.
   */
  DEFAULT_MAX_ENERGY: 100
};

/**
 * VIP multipliers for energy system.
 * These multipliers apply to VIP players.
 */
export const VIP_ENERGY_MULTIPLIERS = {
  /**
   * Multiplier for energy regen rate (e.g., 2.0 = 2x faster regen)
   */
  REGEN_RATE: 2.0,
  
  /**
   * Bonus to max energy for VIP players
   */
  MAX_ENERGY_BONUS: 50,
  
  /**
   * Multiplier for offline recovery
   */
  OFFLINE_RECOVERY: 1.5
};
