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
 * Daily reward definition from database.
 */
export interface DailyReward {
  id: string;
  dayNumber: number;
  coinsReward: number;
  energyReward: number;
  timeShardsReward: number;
  boosterType?: string;
  boosterAmount: number;
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
  streakAtClaim: number;
  coinsAmount: number;
  energyAmount: number;
  timeShardsAmount: number;
  boosterType?: string;
  boosterAmount: number;
  totalValue: number;
  multiplier: number;
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
 * Day 1-7 with escalating rewards.
 */
export const DEFAULT_WEEKLY_REWARDS: Omit<DailyReward, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    dayNumber: 1,
    coinsReward: 100,
    energyReward: 0,
    timeShardsReward: 0,
    boosterAmount: 0,
    isPremiumOnly: false
  },
  {
    dayNumber: 2,
    coinsReward: 150,
    energyReward: 25,
    timeShardsReward: 0,
    boosterAmount: 0,
    isPremiumOnly: false
  },
  {
    dayNumber: 3,
    coinsReward: 200,
    energyReward: 0,
    timeShardsReward: 5,
    boosterAmount: 0,
    isPremiumOnly: false
  },
  {
    dayNumber: 4,
    coinsReward: 100,
    energyReward: 50,
    timeShardsReward: 0,
    boosterAmount: 0,
    isPremiumOnly: false
  },
  {
    dayNumber: 5,
    coinsReward: 250,
    energyReward: 25,
    timeShardsReward: 0,
    boosterType: BoosterType.EXPEDITION_BOOST,
    boosterAmount: 1,
    isPremiumOnly: false
  },
  {
    dayNumber: 6,
    coinsReward: 300,
    energyReward: 50,
    timeShardsReward: 10,
    boosterAmount: 0,
    isPremiumOnly: false
  },
  {
    dayNumber: 7,
    coinsReward: 500,
    energyReward: 100,
    timeShardsReward: 25,
    boosterType: BoosterType.MULTIPLIER,
    boosterAmount: 2,
    isPremiumOnly: false
  }
];

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
