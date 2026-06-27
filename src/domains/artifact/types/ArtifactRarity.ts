/**
 * Artifact Rarity Type
 *
 * Defines the rarity tier of an artifact affecting availability and power.
 */

/**
 * Artifact rarity tiers.
 */
export enum ArtifactRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  MYTHIC = 'mythic',
}

/**
 * Display labels for artifact rarities.
 */
export const ARTIFACT_RARITY_LABELS: Record<ArtifactRarity, string> = {
  [ArtifactRarity.COMMON]: 'Common',
  [ArtifactRarity.RARE]: 'Rare',
  [ArtifactRarity.EPIC]: 'Epic',
  [ArtifactRarity.LEGENDARY]: 'Legendary',
  [ArtifactRarity.MYTHIC]: 'Mythic',
} as const;

/**
 * Hex color codes for rarity display.
 */
export const ARTIFACT_RARITY_COLORS: Record<ArtifactRarity, string> = {
  [ArtifactRarity.COMMON]: '#9CA3AF',
  [ArtifactRarity.RARE]: '#3B82F6',
  [ArtifactRarity.EPIC]: '#8B5CF6',
  [ArtifactRarity.LEGENDARY]: '#F97316',
  [ArtifactRarity.MYTHIC]: '#FBBF24',
} as const;

/**
 * Power multipliers by rarity.
 */
export const ARTIFACT_RARITY_MULTIPLIERS: Record<ArtifactRarity, number> = {
  [ArtifactRarity.COMMON]: 1.0,
  [ArtifactRarity.RARE]: 1.5,
  [ArtifactRarity.EPIC]: 2.0,
  [ArtifactRarity.LEGENDARY]: 3.0,
  [ArtifactRarity.MYTHIC]: 5.0,
} as const;

/**
 * Drop probabilities by rarity (0-100).
 */
export const ARTIFACT_RARITY_DROP_PROBABILITIES: Record<ArtifactRarity, number> = {
  [ArtifactRarity.COMMON]: 50,
  [ArtifactRarity.RARE]: 25,
  [ArtifactRarity.EPIC]: 15,
  [ArtifactRarity.LEGENDARY]: 8,
  [ArtifactRarity.MYTHIC]: 2,
} as const;

/**
 * Validates if a value is a valid ArtifactRarity.
 */
export function isArtifactRarity(value: unknown): value is ArtifactRarity {
  return Object.values(ArtifactRarity).includes(value as ArtifactRarity);
}