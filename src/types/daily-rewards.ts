/**
 * Daily Reward Types and Interfaces
 * 
 * Defines all types for the daily login reward system.
 * 
 * Architecture supports:
 * - Weekly cycles (7 days) - default
 * - Monthly cycles (30 days)
 * - Seasonal cycles (90 days)
 * - Special event overrides
 * - Premium user variants
 * 
 * The cycle is configurable per event, allowing for flexible reward structures.
 */

/**
 * Reward types that can be awarded in daily rewards.
 */
export enum DailyRewardType {
  ENERGY = 'energy',
  COINS = 'coins',
  COMMON_CAPSULE = 'common_capsule',
  RARE_CAPSULE = 'rare_capsule',
  CHRONO_CHEST = 'chrono_chest'
}

/**
 * Daily reward definition from database.
 */
export interface DailyReward {
  id: string;
  dayNumber: number;
  rewardType: DailyRewardType;
  rewardAmount: number;
  coinsReward?: number;
  energyReward?: number;
  capsuleType?: 'common' | 'rare';
  isSpecial?: boolean;
  eventId?: string;
  isPremiumOnly: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User's daily reward progress.
 */
export interface UserDailyReward {
  id: string;
  userId: string;
  currentDay: number;
  currentStreak: number;
  lastClaimDate?: Date;
  totalClaims: number;
  highestStreak: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Record of a claimed reward.
 */
export interface DailyRewardHistory {
  id: string;
  userId: string;
  rewardDay: number;
  rewardType: DailyRewardType;
  coinsAmount: number;
  energyAmount: number;
  capsuleType?: 'common' | 'rare';
  isSpecial: boolean;
  totalValue: number;
  claimedAt: Date;
  eventId?: string;
}

/**
 * Result of checking if reward can be claimed.
 */
export interface CanClaimResult {
  canClaim: boolean;
  reason?: string;
  currentDay?: number;
  currentStreak?: number;
  nextClaimTime?: Date;
}

/**
 * Result of claiming a reward.
 */
export interface ClaimResult {
  success: boolean;
  error?: string;
  dayNumber?: number;
  streak?: number;
  rewards?: ClaimedRewards;
  message?: string;
}

/**
 * Rewards received from claiming.
 */
export interface ClaimedRewards {
  coins: number;
  energy: number;
  timeShards: number;
  booster?: {
    type: string;
    amount: number;
  };
  totalValue: number;
}

/**
 * Reward cycle configuration.
 */
export interface RewardCycleConfig {
  /**
   * Type of cycle: 'weekly', 'monthly', 'seasonal', 'event'
   */
  cycleType: 'weekly' | 'monthly' | 'seasonal' | 'event';
  
  /**
   * Number of days in the cycle
   */
  cycleLength: number;
  
  /**
   * Event ID if this is an event cycle
   */
  eventId?: string;
  
  /**
   * When the cycle started (for calculating day numbers)
   */
  startDate?: Date;
  
  /**
   * Custom reward multipliers (e.g., 2x for special events)
   */
  multiplier: number;
}

/**
 * Analytics data for daily rewards.
 */
export interface DailyRewardAnalytics {
  totalClaims: number;
  uniqueUsersToday: number;
  averageStreak: number;
  highestStreak: number;
  mostClaimedDay: number;
  totalCoinsDistributed: number;
  totalEnergyDistributed: number;
}

/**
 * Booster types that can be awarded.
 */
export enum BoosterType {
  EXPEDITION_BOOST = 'expedition_boost',
  MULTIPLIER = 'multiplier',
  LUCKY_SPIN = 'lucky_spin',
  TIME_WARPS = 'time_warps'
}

/**
 * Default weekly reward cycle.
 * Day 1-7 with specific rewards per requirements:
 * Day 1: 50 Energy
 * Day 2: 100 Coins
 * Day 3: 1 Common Capsule
 * Day 4: 150 Coins
 * Day 5: 100 Energy
 * Day 6: 1 Rare Capsule
 * Day 7: Chrono Chest (Special)
 */
export const DEFAULT_WEEKLY_REWARDS: Omit<DailyReward, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    dayNumber: 1,
    rewardType: DailyRewardType.ENERGY,
    rewardAmount: 50,
    energyReward: 50,
    isPremiumOnly: false
  },
  {
    dayNumber: 2,
    rewardType: DailyRewardType.COINS,
    rewardAmount: 100,
    coinsReward: 100,
    isPremiumOnly: false
  },
  {
    dayNumber: 3,
    rewardType: DailyRewardType.COMMON_CAPSULE,
    rewardAmount: 1,
    capsuleType: 'common',
    isPremiumOnly: false
  },
  {
    dayNumber: 4,
    rewardType: DailyRewardType.COINS,
    rewardAmount: 150,
    coinsReward: 150,
    isPremiumOnly: false
  },
  {
    dayNumber: 5,
    rewardType: DailyRewardType.ENERGY,
    rewardAmount: 100,
    energyReward: 100,
    isPremiumOnly: false
  },
  {
    dayNumber: 6,
    rewardType: DailyRewardType.RARE_CAPSULE,
    rewardAmount: 1,
    capsuleType: 'rare',
    isPremiumOnly: false
  },
  {
    dayNumber: 7,
    rewardType: DailyRewardType.CHRONO_CHEST,
    rewardAmount: 1,
    isSpecial: true,
    isPremiumOnly: false
  }
];

/**
 * Reward display information for UI.
 */
export interface RewardDisplayInfo {
  dayNumber: number;
  rewardType: DailyRewardType;
  rewardAmount: number;
  label: string;
  icon: string;
  isSpecial: boolean;
  description: string;
}

/**
 * Get display information for a reward.
 */
export function getRewardDisplayInfo(reward: DailyReward): RewardDisplayInfo {
  const info: Record<number, Omit<RewardDisplayInfo, 'dayNumber' | 'rewardType' | 'rewardAmount'>> = {
    1: { label: 'Energy', icon: '⚡', isSpecial: false, description: '50 Energy' },
    2: { label: 'Coins', icon: '🪙', isSpecial: false, description: '100 Coins' },
    3: { label: 'Common Capsule', icon: '📦', isSpecial: false, description: '1 Common Capsule' },
    4: { label: 'Coins', icon: '🪙', isSpecial: false, description: '150 Coins' },
    5: { label: 'Energy', icon: '⚡', isSpecial: false, description: '100 Energy' },
    6: { label: 'Rare Capsule', icon: '💎', isSpecial: false, description: '1 Rare Capsule' },
    7: { label: 'Chrono Chest', icon: '🏆', isSpecial: true, description: 'Special Reward' }
  };

  const dayInfo = info[reward.dayNumber] || { label: 'Unknown', icon: '❓', isSpecial: false, description: '' };

  return {
    dayNumber: reward.dayNumber,
    rewardType: reward.rewardType,
    rewardAmount: reward.rewardAmount,
    ...dayInfo
  };
}

/**
 * Streak calculation helper.
 */
export function calculateStreak(lastClaimDate: Date | null, currentDate: Date): {
  streak: number;
  shouldReset: boolean;
  isConsecutive: boolean;
} {
  if (!lastClaimDate) {
    return { streak: 1, shouldReset: false, isConsecutive: false };
  }

  const lastClaim = new Date(lastClaimDate);
  lastClaim.setHours(0, 0, 0, 0);
  
  const current = new Date(currentDate);
  current.setHours(0, 0, 0, 0);
  
  const diffTime = current.getTime() - lastClaim.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Same day - no change to streak
    return { streak: 0, shouldReset: false, isConsecutive: true };
  } else if (diffDays === 1) {
    // Consecutive day
    return { streak: 1, shouldReset: false, isConsecutive: true };
  } else {
    // Missed day(s) - streak resets
    return { streak: 1, shouldReset: true, isConsecutive: false };
  }
}

/**
 * Get the day number in the cycle based on total claims.
 */
export function getDayInCycle(totalClaims: number, cycleLength: number = 7): number {
  if (totalClaims === 0) return 1;
  return ((totalClaims - 1) % cycleLength) + 1;
}

/**
 * Check if user completed a full cycle.
 */
export function isCycleComplete(totalClaims: number, cycleLength: number = 7): boolean {
  return totalClaims > 0 && totalClaims % cycleLength === 0;
}
