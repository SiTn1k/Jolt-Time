/**
 * Artifact Types
 *
 * Exports all artifact type definitions.
 */

export { ArtifactCategory, ARTIFACT_CATEGORY_LABELS, isArtifactCategory } from './ArtifactCategory';
export { ArtifactRarity, ARTIFACT_RARITY_LABELS, ARTIFACT_RARITY_COLORS, ARTIFACT_RARITY_MULTIPLIERS, ARTIFACT_RARITY_DROP_PROBABILITIES, isArtifactRarity } from './ArtifactRarity';
export { ArtifactEra, ARTIFACT_ERA_LABELS, ARTIFACT_ERA_PERIODS, ARTIFACT_ERA_ORDER, isArtifactEra } from './ArtifactEra';
export { ArtifactRegion, ARTIFACT_REGION_LABELS, isArtifactRegion } from './ArtifactRegion';
export {
  ArtifactCondition,
  ARTIFACT_CONDITION_LABELS,
  ArtifactMaterial,
  ARTIFACT_MATERIAL_LABELS,
  type ArtifactCulture,
  type ArtifactMetadata,
  INITIAL_ARTIFACT_METADATA,
} from './ArtifactMetadata';
export {
  type ArtifactStatistics,
  INITIAL_ARTIFACT_STATISTICS,
} from './ArtifactStatistics';