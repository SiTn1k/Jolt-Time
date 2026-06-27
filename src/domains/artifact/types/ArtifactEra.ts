/**
 * Artifact Era Type
 *
 * Defines the historical era of an artifact.
 */

/**
 * Historical eras for artifact classification.
 */
export enum ArtifactEra {
  ANCIENT_WORLD = 'ancient_world',
  CLASSICAL_ERA = 'classical_era',
  MIDDLE_AGES = 'middle_ages',
  RENAISSANCE = 'renaissance',
  INDUSTRIAL_AGE = 'industrial_age',
  MODERN_ERA = 'modern_era',
}

/**
 * Display labels for artifact eras.
 */
export const ARTIFACT_ERA_LABELS: Record<ArtifactEra, string> = {
  [ArtifactEra.ANCIENT_WORLD]: 'Ancient World',
  [ArtifactEra.CLASSICAL_ERA]: 'Classical Era',
  [ArtifactEra.MIDDLE_AGES]: 'Middle Ages',
  [ArtifactEra.RENAISSANCE]: 'Renaissance',
  [ArtifactEra.INDUSTRIAL_AGE]: 'Industrial Age',
  [ArtifactEra.MODERN_ERA]: 'Modern Era',
} as const;

/**
 * Time period descriptions for eras.
 */
export const ARTIFACT_ERA_PERIODS: Record<ArtifactEra, string> = {
  [ArtifactEra.ANCIENT_WORLD]: 'Before 500 BCE',
  [ArtifactEra.CLASSICAL_ERA]: '500 BCE – 500 CE',
  [ArtifactEra.MIDDLE_AGES]: '500 – 1400 CE',
  [ArtifactEra.RENAISSANCE]: '1400 – 1700 CE',
  [ArtifactEra.INDUSTRIAL_AGE]: '1700 – 1900 CE',
  [ArtifactEra.MODERN_ERA]: '1900 – Present',
} as const;

/**
 * Sort order for eras (chronological).
 */
export const ARTIFACT_ERA_ORDER: Record<ArtifactEra, number> = {
  [ArtifactEra.ANCIENT_WORLD]: 1,
  [ArtifactEra.CLASSICAL_ERA]: 2,
  [ArtifactEra.MIDDLE_AGES]: 3,
  [ArtifactEra.RENAISSANCE]: 4,
  [ArtifactEra.INDUSTRIAL_AGE]: 5,
  [ArtifactEra.MODERN_ERA]: 6,
} as const;

/**
 * Validates if a value is a valid ArtifactEra.
 */
export function isArtifactEra(value: unknown): value is ArtifactEra {
  return Object.values(ArtifactEra).includes(value as ArtifactEra);
}