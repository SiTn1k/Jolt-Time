/**
 * Achievement Rarity Type
 *
 * Defines the rarity tier of an achievement.
 */

/**
 * Achievement rarity tiers.
 */
export enum AchievementRarity {
  /** Common achievement */
  COMMON = 'common',
  /** Uncommon achievement */
  UNCOMMON = 'uncommon',
  /** Rare achievement */
  RARE = 'rare',
  /** Epic achievement */
  EPIC = 'epic',
  /** Legendary achievement */
  LEGENDARY = 'legendary',
}

/**
 * Rarity display names.
 */
export const ACHIEVEMENT_RARITY_DISPLAY: Record<AchievementRarity, string> = {
  [AchievementRarity.COMMON]: 'Common',
  [AchievementRarity.UNCOMMON]: 'Uncommon',
  [AchievementRarity.RARE]: 'Rare',
  [AchievementRarity.EPIC]: 'Epic',
  [AchievementRarity.LEGENDARY]: 'Legendary',
};

/**
 * Rarity colors for UI.
 */
export const ACHIEVEMENT_RARITY_COLORS: Record<AchievementRarity, string> = {
  [AchievementRarity.COMMON]: '#9CA3AF',
  [AchievementRarity.UNCOMMON]: '#22C55E',
  [AchievementRarity.RARE]: '#3B82F6',
  [AchievementRarity.EPIC]: '#A855F7',
  [AchievementRarity.LEGENDARY]: '#F59E0B',
};

/**
 * Rarity point multipliers.
 */
export const ACHIEVEMENT_RARITY_MULTIPLIERS: Record<AchievementRarity, number> = {
  [AchievementRarity.COMMON]: 1,
  [AchievementRarity.UNCOMMON]: 2,
  [AchievementRarity.RARE]: 3,
  [AchievementRarity.EPIC]: 5,
  [AchievementRarity.LEGENDARY]: 10,
};

/**
 * Gets the sort order for a rarity.
 */
export function getRarityOrder(rarity: AchievementRarity): number {
  const order: Record<AchievementRarity, number> = {
    [AchievementRarity.COMMON]: 1,
    [AchievementRarity.UNCOMMON]: 2,
    [AchievementRarity.RARE]: 3,
    [AchievementRarity.EPIC]: 4,
    [AchievementRarity.LEGENDARY]: 5,
  };
  return order[rarity];
}
