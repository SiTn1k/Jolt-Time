/**
 * Scheduler Domain Dependency Injection Registration
 *
 * Registers all scheduler domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseSchedulerRepository } from './repositories/SupabaseSchedulerRepository';
import { SchedulerMapper } from './mappers/SchedulerMapper';
import { ExecutionMapper } from './mappers/ExecutionMapper';
import { DefinitionMapper } from './mappers/DefinitionMapper';
import { SchedulerValidator, ExecutionValidator, DefinitionValidator } from './validators';

/**
 * Scheduler Domain DI configuration tokens.
 */
export const SCHEDULER_TOKENS = {
  SCHEDULER_REPOSITORY: Symbol.for('SupabaseSchedulerRepository'),
  SCHEDULER_MAPPER: Symbol.for('SchedulerMapper'),
  EXECUTION_MAPPER: Symbol.for('ExecutionMapper'),
  DEFINITION_MAPPER: Symbol.for('DefinitionMapper'),
  SCHEDULER_VALIDATOR: Symbol.for('SchedulerValidator'),
  EXECUTION_VALIDATOR: Symbol.for('ExecutionValidator'),
  DEFINITION_VALIDATOR: Symbol.for('DefinitionValidator'),
} as const;

/**
 * Register all scheduler domain dependencies with the container.
 */
export function registerSchedulerDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(SchedulerValidator, new SchedulerValidator());
  container.registerInstance(ExecutionValidator, new ExecutionValidator());
  container.registerInstance(DefinitionValidator, new DefinitionValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(SchedulerMapper, new SchedulerMapper());
  container.registerInstance(ExecutionMapper, new ExecutionMapper());
  container.registerInstance(DefinitionMapper, new DefinitionMapper());

  // Repositories (Singleton for simplicity)
  container.register(SupabaseSchedulerRepository, { lifetime: Lifetime.Singleton });
}

/**
 * Quick setup function for scheduler domain.
 * Creates and configures all scheduler domain components.
 */
export function setupSchedulerDomain(): {
  schedulerRepository: SupabaseSchedulerRepository;
  schedulerMapper: SchedulerMapper;
  executionMapper: ExecutionMapper;
  definitionMapper: DefinitionMapper;
  schedulerValidator: SchedulerValidator;
  executionValidator: ExecutionValidator;
  definitionValidator: DefinitionValidator;
} {
  const schedulerValidator = new SchedulerValidator();
  const executionValidator = new ExecutionValidator();
  const definitionValidator = new DefinitionValidator();
  const schedulerMapper = new SchedulerMapper();
  const executionMapper = new ExecutionMapper();
  const definitionMapper = new DefinitionMapper();
  const schedulerRepository = new SupabaseSchedulerRepository();

  return {
    schedulerRepository,
    schedulerMapper,
    executionMapper,
    definitionMapper,
    schedulerValidator,
    executionValidator,
    definitionValidator,
  };
}
