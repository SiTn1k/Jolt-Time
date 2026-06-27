/**
 * Artifact Domain Index
 *
 * Main entry point for the Artifact domain module.
 * Exports all public-facing entities, interfaces, types, and utilities.
 *
 * ## Key Distinction
 *
 * **Artifact IS NOT Inventory**
 * - Artifact defines item data (name, description, rarity, etc.)
 * - Inventory stores ownership (who owns what, quantity, status)
 * - They are separate concerns
 *
 * **Artifact IS NOT Museum**
 * - Artifact defines item data
 * - Museum stores exhibition state
 * - They are separate concerns
 *
 * **Artifact IS NOT Gameplay State**
 * - Artifact is static, immutable game content
 * - No owner, no player association
 * - No inventory, wallet, quest, or guild
 */

// Value Objects
export {
  ArtifactId,
  ArtifactSlug,
  ArtifactTitle,
  ArtifactDescription,
} from './value-objects';

// Types
export type {
  ArtifactCategory,
  ArtifactRarity,
  ArtifactEra,
  ArtifactRegion,
  ArtifactCondition,
  ArtifactMaterial,
  ArtifactCulture,
  ArtifactMetadata,
  ArtifactStatistics,
} from './types';
export {
  ARTIFACT_CATEGORY_LABELS,
  isArtifactCategory,
  ARTIFACT_RARITY_LABELS,
  ARTIFACT_RARITY_COLORS,
  ARTIFACT_RARITY_MULTIPLIERS,
  ARTIFACT_RARITY_DROP_PROBABILITIES,
  isArtifactRarity,
  ARTIFACT_ERA_LABELS,
  ARTIFACT_ERA_PERIODS,
  ARTIFACT_ERA_ORDER,
  isArtifactEra,
  ARTIFACT_REGION_LABELS,
  isArtifactRegion,
  ARTIFACT_CONDITION_LABELS,
  ARTIFACT_MATERIAL_LABELS,
  INITIAL_ARTIFACT_METADATA,
  INITIAL_ARTIFACT_STATISTICS,
} from './types';

// Entities
export { Artifact } from './entities';
export type {
  ArtifactProps,
  ArtifactRecord,
  ArtifactJSON,
} from './entities';

// Interfaces
export type {
  IArtifact,
} from './interfaces';
export type {
  IArtifactRepository,
  ArtifactFilterParams,
} from './interfaces';

// DTOs
export type {
  CreateArtifactDto,
  UpdateArtifactDto,
  ArtifactResponseDto,
  ArtifactSummaryDto,
} from './dto';

// Validators
export {
  ArtifactValidator,
  ArtifactSlugValidator,
  ArtifactTitleValidator,
} from './validators';
export type {
  ArtifactValidationResult,
  ArtifactSlugValidationResult,
  ArtifactTitleValidationResult,
} from './validators';

// Events
export type {
  ArtifactCreatedEvent,
  ArtifactCreatedEventData,
  ArtifactUpdatedEvent,
  ArtifactUpdatedEventData,
  ArtifactArchivedEvent,
  ArtifactArchivedEventData,
} from './events';
export {
  createArtifactCreatedEvent,
  createArtifactUpdatedEvent,
  createArtifactArchivedEvent,
} from './events';

// Mappers
export { ArtifactMapper } from './mappers';

// Repositories
export { SupabaseArtifactRepository } from './repositories';

// DI
export {
  ARTIFACT_TOKENS,
  registerArtifactDependencies,
  setupArtifactDomain,
} from './di';