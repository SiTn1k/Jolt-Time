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
import { SchedulerService } from './services/SchedulerService';
import { JobExecutorService } from './services/JobExecutorService';
import { RetryEngineService } from './services/RetryEngineService';
import { ExecutionQueueService } from './services/ExecutionQueueService';
import { BuiltInJobsService, getBuiltInJobsService } from './services/BuiltInJobsService';

/**
 * Scheduler Domain DI configuration tokens.
 */
export const SCHEDULER_TOKENS = {
  // Repository
  SCHEDULER_REPOSITORY: Symbol.for('SupabaseSchedulerRepository'),

  // Mappers
  SCHEDULER_MAPPER: Symbol.for('SchedulerMapper'),
  EXECUTION_MAPPER: Symbol.for('ExecutionMapper'),
  DEFINITION_MAPPER: Symbol.for('DefinitionMapper'),

  // Validators
  SCHEDULER_VALIDATOR: Symbol.for('SchedulerValidator'),
  EXECUTION_VALIDATOR: Symbol.for('ExecutionValidator'),
  DEFINITION_VALIDATOR: Symbol.for('DefinitionValidator'),

  // Services
  SCHEDULER_SERVICE: Symbol.for('SchedulerService'),
  JOB_EXECUTOR_SERVICE: Symbol.for('JobExecutorService'),
  RETRY_ENGINE_SERVICE: Symbol.for('RetryEngineService'),
  EXECUTION_QUEUE_SERVICE: Symbol.for('ExecutionQueueService'),
  BUILT_IN_JOBS_SERVICE: Symbol.for('BuiltInJobsService'),
} as const;

/**
 * Register all scheduler domain dependencies with the container.
 */
export function registerSchedulerDependencies(container: Container): void {
  // Validators (Singleton - stateless)
  container.registerInstance(SchedulerValidator, new SchedulerValidator());
  container.registerInstance(ExecutionValidator, new ExecutionValidator());
  container.registerInstance(DefinitionValidator, new DefinitionValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(SchedulerMapper, new SchedulerMapper());
  container.registerInstance(ExecutionMapper, new ExecutionMapper());
  container.registerInstance(DefinitionMapper, new DefinitionMapper());

  // Repository (Singleton)
  container.register(SupabaseSchedulerRepository, { lifetime: Lifetime.Singleton });

  // Services
  container.register(SchedulerService, { lifetime: Lifetime.Singleton });
  container.register(RetryEngineService, { lifetime: Lifetime.Singleton });
  container.register(ExecutionQueueService, { lifetime: Lifetime.Singleton });
  container.register(BuiltInJobsService, { lifetime: Lifetime.Singleton });

  // JobExecutorService depends on SchedulerService, so it needs special handling
  // It will be instantiated on demand
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
  schedulerService: SchedulerService;
  jobExecutorService: JobExecutorService;
  retryEngineService: RetryEngineService;
  executionQueueService: ExecutionQueueService;
  builtInJobsService: BuiltInJobsService;
} {
  const schedulerValidator = new SchedulerValidator();
  const executionValidator = new ExecutionValidator();
  const definitionValidator = new DefinitionValidator();
  const schedulerMapper = new SchedulerMapper();
  const executionMapper = new ExecutionMapper();
  const definitionMapper = new DefinitionMapper();
  const schedulerRepository = new SupabaseSchedulerRepository();
  const schedulerService = new SchedulerService(schedulerRepository);
  const retryEngineService = new RetryEngineService(schedulerService);
  const executionQueueService = new ExecutionQueueService();
  const builtInJobsService = getBuiltInJobsService();
  const jobExecutorService = new JobExecutorService(schedulerService);

  return {
    schedulerRepository,
    schedulerMapper,
    executionMapper,
    definitionMapper,
    schedulerValidator,
    executionValidator,
    definitionValidator,
    schedulerService,
    jobExecutorService,
    retryEngineService,
    executionQueueService,
    builtInJobsService,
  };
}
