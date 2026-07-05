/**
 * DevOps Domain Dependency Injection Registration
 *
 * Registers all DevOps domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseDevOpsRepository } from './repositories/SupabaseDevOpsRepository';
import { DeploymentMapper } from './mappers/DeploymentMapper';
import { EnvironmentMapper } from './mappers/EnvironmentMapper';
import { InfrastructureMapper } from './mappers/InfrastructureMapper';
import { DeploymentValidator } from './validators/DeploymentValidator';
import { EnvironmentValidator } from './validators/EnvironmentValidator';
import { InfrastructureValidator } from './validators/InfrastructureValidator';
import {
  DevOpsService,
  DeploymentEngine,
  EnvironmentManager,
  InfrastructureManager,
  DeploymentValidationService,
  DevOpsFailureHandler,
} from './services';

/**
 * DevOps Domain DI configuration keys.
 */
export const DEVOPS_TOKENS = {
  // Repository
  DEVOPS_REPOSITORY: Symbol.for('SupabaseDevOpsRepository'),

  // Mappers
  DEPLOYMENT_MAPPER: Symbol.for('DeploymentMapper'),
  ENVIRONMENT_MAPPER: Symbol.for('EnvironmentMapper'),
  INFRASTRUCTURE_MAPPER: Symbol.for('InfrastructureMapper'),

  // Validators
  DEPLOYMENT_VALIDATOR: Symbol.for('DeploymentValidator'),
  ENVIRONMENT_VALIDATOR: Symbol.for('EnvironmentValidator'),
  INFRASTRUCTURE_VALIDATOR: Symbol.for('InfrastructureValidator'),

  // Services
  DEVOPS_SERVICE: Symbol.for('DevOpsService'),
  DEPLOYMENT_ENGINE: Symbol.for('DeploymentEngine'),
  ENVIRONMENT_MANAGER: Symbol.for('EnvironmentManager'),
  INFRASTRUCTURE_MANAGER: Symbol.for('InfrastructureManager'),
  DEPLOYMENT_VALIDATION_SERVICE: Symbol.for('DeploymentValidationService'),
  DEVOPS_FAILURE_HANDLER: Symbol.for('DevOpsFailureHandler'),
} as const;

/**
 * Register all DevOps domain dependencies with the container.
 */
export function registerDevOpsDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(DeploymentValidator, new DeploymentValidator());
  container.registerInstance(EnvironmentValidator, new EnvironmentValidator());
  container.registerInstance(InfrastructureValidator, new InfrastructureValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(DeploymentMapper, new DeploymentMapper());
  container.registerInstance(EnvironmentMapper, new EnvironmentMapper());
  container.registerInstance(InfrastructureMapper, new InfrastructureMapper());

  // Repository (Singleton)
  container.register(SupabaseDevOpsRepository, { lifetime: Lifetime.Singleton });

  // Services
  container.registerSingleton(DevOpsService);
  container.registerSingleton(DeploymentEngine);
  container.registerSingleton(EnvironmentManager);
  container.registerSingleton(InfrastructureManager);
  container.registerSingleton(DeploymentValidationService);
  container.registerSingleton(DevOpsFailureHandler);
}

/**
 * Quick setup function for DevOps domain.
 * Creates and configures all DevOps domain components.
 */
export function setupDevOpsDomain(): {
  devOpsRepository: SupabaseDevOpsRepository;
  deploymentMapper: DeploymentMapper;
  environmentMapper: EnvironmentMapper;
  infrastructureMapper: InfrastructureMapper;
  deploymentValidator: DeploymentValidator;
  environmentValidator: EnvironmentValidator;
  infrastructureValidator: InfrastructureValidator;
  devOpsService: DevOpsService;
  deploymentEngine: DeploymentEngine;
  environmentManager: EnvironmentManager;
  infrastructureManager: InfrastructureManager;
  deploymentValidationService: DeploymentValidationService;
  failureHandler: DevOpsFailureHandler;
} {
  // Validators
  const deploymentValidator = new DeploymentValidator();
  const environmentValidator = new EnvironmentValidator();
  const infrastructureValidator = new InfrastructureValidator();

  // Mappers
  const deploymentMapper = new DeploymentMapper();
  const environmentMapper = new EnvironmentMapper();
  const infrastructureMapper = new InfrastructureMapper();

  // Repository
  const devOpsRepository = new SupabaseDevOpsRepository();

  // Services
  const devOpsService = new DevOpsService(devOpsRepository);
  const deploymentEngine = new DeploymentEngine(devOpsRepository);
  const environmentManager = new EnvironmentManager(devOpsRepository);
  const infrastructureManager = new InfrastructureManager(devOpsRepository);
  const deploymentValidationService = new DeploymentValidationService(devOpsRepository);
  const failureHandler = new DevOpsFailureHandler();

  return {
    devOpsRepository,
    deploymentMapper,
    environmentMapper,
    infrastructureMapper,
    deploymentValidator,
    environmentValidator,
    infrastructureValidator,
    devOpsService,
    deploymentEngine,
    environmentManager,
    infrastructureManager,
    deploymentValidationService,
    failureHandler,
  };
}