/**
 * Academy Domain Dependency Injection Registration
 *
 * Registers all academy domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseAcademyRepository } from './repositories/SupabaseAcademyRepository';
import { AcademyMapper } from './mappers/AcademyMapper';
import { ResearchMapper } from './mappers/ResearchMapper';
import { ResearchValidator, ResearchPointsValidator, ResearchTreeValidator } from './validators';
import { AcademyService } from '../../services/AcademyService';

/**
 * Academy Domain DI configuration keys.
 */
export const ACADEMY_TOKENS = {
  ACADEMY_REPOSITORY: Symbol.for('SupabaseAcademyRepository'),
  ACADEMY_MAPPER: Symbol.for('AcademyMapper'),
  RESEARCH_MAPPER: Symbol.for('ResearchMapper'),
  RESEARCH_VALIDATOR: Symbol.for('ResearchValidator'),
  RESEARCH_POINTS_VALIDATOR: Symbol.for('ResearchPointsValidator'),
  RESEARCH_TREE_VALIDATOR: Symbol.for('ResearchTreeValidator'),
  ACADEMY_SERVICE: Symbol.for('AcademyService'),
} as const;

/**
 * Register all academy domain dependencies with the container.
 */
export function registerAcademyDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(ResearchValidator, new ResearchValidator());
  container.registerInstance(ResearchPointsValidator, new ResearchPointsValidator());
  container.registerInstance(ResearchTreeValidator, new ResearchTreeValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(AcademyMapper, new AcademyMapper());
  container.registerInstance(ResearchMapper, new ResearchMapper());

  // Repositories (Singleton for simplicity - can be changed to Scoped if needed)
  container.register(SupabaseAcademyRepository, { lifetime: Lifetime.Singleton });

  // Services
  container.register(AcademyService, { lifetime: Lifetime.Singleton });
}

/**
 * Quick setup function for academy domain.
 * Creates and configures all academy domain components.
 */
export function setupAcademyDomain(): {
  academyRepository: SupabaseAcademyRepository;
  academyMapper: AcademyMapper;
  researchMapper: ResearchMapper;
  researchValidator: ResearchValidator;
  researchPointsValidator: ResearchPointsValidator;
  researchTreeValidator: ResearchTreeValidator;
  academyService: AcademyService;
} {
  const researchValidator = new ResearchValidator();
  const researchPointsValidator = new ResearchPointsValidator();
  const researchTreeValidator = new ResearchTreeValidator();
  const academyMapper = new AcademyMapper();
  const researchMapper = new ResearchMapper();
  const academyRepository = new SupabaseAcademyRepository();
  const academyService = new AcademyService(academyRepository);

  return {
    academyRepository,
    academyMapper,
    researchMapper,
    researchValidator,
    researchPointsValidator,
    researchTreeValidator,
    academyService,
  };
}