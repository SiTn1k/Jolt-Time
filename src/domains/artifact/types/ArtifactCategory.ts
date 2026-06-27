/**
 * Artifact Category Type
 *
 * Defines the functional category of an artifact.
 */

/**
 * Artifact categories representing functional types.
 */
export enum ArtifactCategory {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  DOCUMENT = 'document',
  RELIC = 'relic',
  SCIENTIFIC_ITEM = 'scientific_item',
  ROYAL_ARTIFACT = 'royal_artifact',
  MILITARY_ARTIFACT = 'military_artifact',
  CULTURAL_ARTIFACT = 'cultural_artifact',
}

/**
 * Display labels for artifact categories.
 */
export const ARTIFACT_CATEGORY_LABELS: Record<ArtifactCategory, string> = {
  [ArtifactCategory.WEAPON]: 'Weapon',
  [ArtifactCategory.ARMOR]: 'Armor',
  [ArtifactCategory.DOCUMENT]: 'Document',
  [ArtifactCategory.RELIC]: 'Relic',
  [ArtifactCategory.SCIENTIFIC_ITEM]: 'Scientific Item',
  [ArtifactCategory.ROYAL_ARTIFACT]: 'Royal Artifact',
  [ArtifactCategory.MILITARY_ARTIFACT]: 'Military Artifact',
  [ArtifactCategory.CULTURAL_ARTIFACT]: 'Cultural Artifact',
} as const;

/**
 * Validates if a value is a valid ArtifactCategory.
 */
export function isArtifactCategory(value: unknown): value is ArtifactCategory {
  return Object.values(ArtifactCategory).includes(value as ArtifactCategory);
}