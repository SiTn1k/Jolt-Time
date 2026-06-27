/**
 * Quest Domain Dependency Injection Registration
 *
 * Registers all quest domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseQuestRepository } from './repositories/SupabaseQuestRepository';
import { QuestMapper } from './mappers/QuestMapper';
import { ObjectiveMapper } from './mappers/ObjectiveMapper';
import { ProgressMapper } from './mappers/ProgressMapper';
import { QuestValidator, ObjectiveValidator, ProgressValidator } from './validators';

/**
 * Quest Domain DI configuration keys.
 */
export const QUEST_TOKENS = {
  QUEST_REPOSITORY: Symbol.for('SupabaseQuestRepository'),
  QUEST_MAPPER: Symbol.for('QuestMapper'),
  OBJECTIVE_MAPPER: Symbol.for('ObjectiveMapper'),
  PROGRESS_MAPPER: Symbol.for('ProgressMapper'),
  QUEST_VALIDATOR: Symbol.for('QuestValidator'),
  OBJECTIVE_VALIDATOR: Symbol.for('ObjectiveValidator'),
  PROGRESS_VALIDATOR: Symbol.for('ProgressValidator'),
} as const;

/**
 * Register all quest domain dependencies with the container.
 */
export function registerQuestDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(QuestValidator, new QuestValidator());
  container.registerInstance(ObjectiveValidator, new ObjectiveValidator());
  container.registerInstance(ProgressValidator, new ProgressValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(QuestMapper, new QuestMapper());
  container.registerInstance(ObjectiveMapper, new ObjectiveMapper());
  container.registerInstance(ProgressMapper, new ProgressMapper());

  // Repositories (Singleton for simplicity - can be changed to Scoped if needed)
  container.register(SupabaseQuestRepository, { lifetime: Lifetime.Singleton });
}

/**
 * Quick setup function for quest domain.
 * Creates and configures all quest domain components.
 */
export function setupQuestDomain(): {
  questRepository: SupabaseQuestRepository;
  questMapper: QuestMapper;
  objectiveMapper: ObjectiveMapper;
  progressMapper: ProgressMapper;
  questValidator: QuestValidator;
  objectiveValidator: ObjectiveValidator;
  progressValidator: ProgressValidator;
} {
  const questValidator = new QuestValidator();
  const objectiveValidator = new ObjectiveValidator();
  const progressValidator = new ProgressValidator();
  const questMapper = new QuestMapper();
  const objectiveMapper = new ObjectiveMapper();
  const progressMapper = new ProgressMapper();
  const questRepository = new SupabaseQuestRepository();

  return {
    questRepository,
    questMapper,
    objectiveMapper,
    progressMapper,
    questValidator,
    objectiveValidator,
    progressValidator,
  };
}
