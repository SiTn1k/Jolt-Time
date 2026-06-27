/**
 * Artifact Domain Dependency Injection Registration
 *
 * Registers all artifact domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseArtifactRepository } from './repositories/SupabaseArtifactRepository';
import { ArtifactMapper } from './mappers/ArtifactMapper';
import { ArtifactValidator, ArtifactSlugValidator, ArtifactTitleValidator } from './validators';

/**
 * Artifact Domain DI configuration keys.
 */
export const ARTIFACT_TOKENS = {
  ARTIFACT_REPOSITORY: Symbol.for('SupabaseArtifactRepository'),
  ARTIFACT_MAPPER: Symbol.for('ArtifactMapper'),
  ARTIFACT_VALIDATOR: Symbol.for('ArtifactValidator'),
  ARTIFACT_SLUG_VALIDATOR: Symbol.for('ArtifactSlugValidator'),
  ARTIFACT_TITLE_VALIDATOR: Symbol.for('ArtifactTitleValidator'),
} as const;

/**
 * Register all artifact domain dependencies with the container.
 */
export function registerArtifactDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(ArtifactValidator, new ArtifactValidator());
  container.registerInstance(ArtifactSlugValidator, new ArtifactSlugValidator());
  container.registerInstance(ArtifactTitleValidator, new ArtifactTitleValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(ArtifactMapper, new ArtifactMapper());

  // Repositories (Singleton for simplicity - can be changed to Scoped if needed)
  container.register(SupabaseArtifactRepository, { lifetime: Lifetime.Singleton });
}

/**
 * Quick setup function for artifact domain.
 * Creates and configures all artifact domain components.
 */
export function setupArtifactDomain(): {
  artifactRepository: SupabaseArtifactRepository;
  artifactMapper: ArtifactMapper;
  artifactValidator: ArtifactValidator;
  artifactSlugValidator: ArtifactSlugValidator;
  artifactTitleValidator: ArtifactTitleValidator;
} {
  const artifactValidator = new ArtifactValidator();
  const artifactSlugValidator = new ArtifactSlugValidator();
  const artifactTitleValidator = new ArtifactTitleValidator();
  const artifactMapper = new ArtifactMapper();
  const artifactRepository = new SupabaseArtifactRepository();

  return {
    artifactRepository,
    artifactMapper,
    artifactValidator,
    artifactSlugValidator,
    artifactTitleValidator,
  };
}