/**
 * Achievement Domain Dependency Injection Registration
 *
 * Registers all achievement domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseAchievementRepository } from './repositories/SupabaseAchievementRepository';
import { SupabaseAchievementProgressRepository } from './repositories/SupabaseAchievementProgressRepository';
import { AchievementMapper } from './mappers/AchievementMapper';
import { ConditionMapper } from './mappers/ConditionMapper';
import { ProgressMapper } from './mappers/ProgressMapper';
import { AchievementValidator, ConditionValidator, ProgressValidator } from './validators';
import { AchievementService } from './services/AchievementService';
import type { IAchievementService } from './services/AchievementService';
import { AchievementEventProcessor } from './services/AchievementEventProcessor';
import type { IAchievementEventProcessor } from './services/AchievementEventProcessor';

/**
 * Achievement Domain DI configuration keys.
 */
export const ACHIEVEMENT_TOKENS = {
  ACHIEVEMENT_REPOSITORY: Symbol.for('SupabaseAchievementRepository'),
  ACHIEVEMENT_PROGRESS_REPOSITORY: Symbol.for('SupabaseAchievementProgressRepository'),
  ACHIEVEMENT_MAPPER: Symbol.for('AchievementMapper'),
  CONDITION_MAPPER: Symbol.for('ConditionMapper'),
  PROGRESS_MAPPER: Symbol.for('ProgressMapper'),
  ACHIEVEMENT_VALIDATOR: Symbol.for('AchievementValidator'),
  CONDITION_VALIDATOR: Symbol.for('ConditionValidator'),
  PROGRESS_VALIDATOR: Symbol.for('ProgressValidator'),
  ACHIEVEMENT_SERVICE: Symbol.for('AchievementService'),
  ACHIEVEMENT_EVENT_PROCESSOR: Symbol.for('AchievementEventProcessor'),
} as const;

/**
 * Register all achievement domain dependencies with the container.
 */
export function registerAchievementDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(AchievementValidator, new AchievementValidator());
  container.registerInstance(ConditionValidator, new ConditionValidator());
  container.registerInstance(ProgressValidator, new ProgressValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(AchievementMapper, new AchievementMapper());
  container.registerInstance(ConditionMapper, new ConditionMapper());
  container.registerInstance(ProgressMapper, new ProgressMapper());

  // Repositories (Singleton for simplicity - can be changed to Scoped if needed)
  container.register(SupabaseAchievementRepository, { lifetime: Lifetime.Singleton });
  container.register(SupabaseAchievementProgressRepository, { lifetime: Lifetime.Singleton });

  // Services - direct instantiation since the DI container doesn't support factory functions well
  const achievementRepository = container.resolve(SupabaseAchievementRepository);
  const achievementProgressRepository = container.resolve(SupabaseAchievementProgressRepository);
  const achievementService = new AchievementService(achievementRepository, achievementProgressRepository);
  container.registerInstance(AchievementService, achievementService);
}

/**
 * Quick setup function for achievement domain.
 * Creates and configures all achievement domain components.
 */
export function setupAchievementDomain(): {
  achievementRepository: SupabaseAchievementRepository;
  achievementProgressRepository: SupabaseAchievementProgressRepository;
  achievementMapper: AchievementMapper;
  conditionMapper: ConditionMapper;
  progressMapper: ProgressMapper;
  achievementValidator: AchievementValidator;
  conditionValidator: ConditionValidator;
  progressValidator: ProgressValidator;
  achievementService: AchievementService;
  achievementEventProcessor: AchievementEventProcessor;
} {
  const achievementValidator = new AchievementValidator();
  const conditionValidator = new ConditionValidator();
  const progressValidator = new ProgressValidator();
  const achievementMapper = new AchievementMapper();
  const conditionMapper = new ConditionMapper();
  const progressMapper = new ProgressMapper();
  const achievementRepository = new SupabaseAchievementRepository();
  const achievementProgressRepository = new SupabaseAchievementProgressRepository();
  const achievementService = new AchievementService(achievementRepository, achievementProgressRepository);
  const achievementEventProcessor = new AchievementEventProcessor(achievementService);

  return {
    achievementRepository,
    achievementProgressRepository,
    achievementMapper,
    conditionMapper,
    progressMapper,
    achievementValidator,
    conditionValidator,
    progressValidator,
    achievementService,
    achievementEventProcessor,
  };
}
