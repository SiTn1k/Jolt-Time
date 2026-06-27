/**
 * Research Tier
 *
 * Defines the tier levels for research nodes.
 * Higher tiers require more research points and prerequisites.
 */

export enum ResearchTier {
  /** Basic research available to all players */
  TIER_1 = 1,
  /** Intermediate research requiring Tier 1 completion */
  TIER_2 = 2,
  /** Advanced research requiring Tier 2 completion */
  TIER_3 = 3,
  /** Expert research requiring Tier 3 completion */
  TIER_4 = 4,
  /** Master research requiring Tier 4 completion */
  TIER_5 = 5,
}

/**
 * Tier display information.
 */
export const RESEARCH_TIER_INFO: Record<ResearchTier, { displayName: string; minLevel: number }> = {
  [ResearchTier.TIER_1]: { displayName: 'Tier I - Novice', minLevel: 1 },
  [ResearchTier.TIER_2]: { displayName: 'Tier II - Apprentice', minLevel: 5 },
  [ResearchTier.TIER_3]: { displayName: 'Tier III - Scholar', minLevel: 10 },
  [ResearchTier.TIER_4]: { displayName: 'Tier IV - Expert', minLevel: 20 },
  [ResearchTier.TIER_5]: { displayName: 'Tier V - Master', minLevel: 35 },
};

/**
 * Gets the display name for a research tier.
 */
export function getResearchTierDisplayName(tier: ResearchTier): string {
  return RESEARCH_TIER_INFO[tier].displayName;
}

/**
 * Gets the minimum academy level required for a tier.
 */
export function getResearchTierMinLevel(tier: ResearchTier): number {
  return RESEARCH_TIER_INFO[tier].minLevel;
}

/**
 * Validates if a tier is valid.
 */
export function isValidResearchTier(tier: number): tier is ResearchTier {
  return tier >= ResearchTier.TIER_1 && tier <= ResearchTier.TIER_5 && Number.isInteger(tier);
}