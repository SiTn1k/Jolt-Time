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

/**
 * DevOps Domain DI configuration keys.
 */
export const DEVOPS_TOKENS = {
  DEVOPS_REPOSITORY: Symbol.for('SupabaseDevOpsRepository'),
  DEPLOYMENT_MAPPER: Symbol.for('DeploymentMapper'),
  ENVIRONMENT_MAPPER: Symbol.for('EnvironmentMapper'),
  INFRASTRUCTURE_MAPPER: Symbol.for('InfrastructureMapper'),
  DEPLOYMENT_VALIDATOR: Symbol.for('DeploymentValidator'),
  ENVIRONMENT_VALIDATOR: Symbol.for('EnvironmentValidator'),
  INFRASTRUCTURE_VALIDATOR: Symbol.for('InfrastructureValidator'),
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

  // Repositories (Singleton for simplicity - can be changed to Scoped if needed)
  container.register(SupabaseDevOpsRepository, { lifetime: Lifetime.Singleton });
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
} {
  const deploymentValidator = new DeploymentValidator();
  const environmentValidator = new EnvironmentValidator();
  const infrastructureValidator = new InfrastructureValidator();
  const deploymentMapper = new DeploymentMapper();
  const environmentMapper = new EnvironmentMapper();
  const infrastructureMapper = new InfrastructureMapper();
  const devOpsRepository = new SupabaseDevOpsRepository();

  return {
    devOpsRepository,
    deploymentMapper,
    environmentMapper,
    infrastructureMapper,
    deploymentValidator,
    environmentValidator,
    infrastructureValidator,
  };
}