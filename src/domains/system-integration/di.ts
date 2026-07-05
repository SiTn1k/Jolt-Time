/**
 * System Integration Domain Dependency Injection Registration
 *
 * Registers all system-integration domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseSystemIntegrationRepository } from './repositories/SupabaseSystemIntegrationRepository';
import { IntegrationMapper, ModuleMapper, SnapshotMapper } from './mappers';
import { IntegrationValidator, ModuleValidator, SnapshotValidator } from './validators';
import { SystemIntegrationService, DependencyGraph, DOMAIN_MODULES, getAllModuleEntities } from './services';

/**
 * System Integration Domain DI configuration keys.
 */
export const SYSTEM_INTEGRATION_TOKENS = {
  // Repository
  SYSTEM_INTEGRATION_REPOSITORY: Symbol.for('SupabaseSystemIntegrationRepository'),

  // Service
  SYSTEM_INTEGRATION_SERVICE: Symbol.for('SystemIntegrationService'),

  // Mappers
  INTEGRATION_MAPPER: Symbol.for('IntegrationMapper'),
  MODULE_MAPPER: Symbol.for('ModuleMapper'),
  SNAPSHOT_MAPPER: Symbol.for('SnapshotMapper'),

  // Validators
  INTEGRATION_VALIDATOR: Symbol.for('IntegrationValidator'),
  MODULE_VALIDATOR: Symbol.for('ModuleValidator'),
  SNAPSHOT_VALIDATOR: Symbol.for('SnapshotValidator'),

  // Dependency Graph
  DEPENDENCY_GRAPH: Symbol.for('DependencyGraph'),
} as const;

/**
 * Register all system-integration domain dependencies with the container.
 */
export function registerSystemIntegrationDependencies(container: Container): void {
  // Repository (Singleton)
  container.register(SupabaseSystemIntegrationRepository, { lifetime: Lifetime.Singleton });

  // Validators (Singleton - stateless)
  container.registerInstance(IntegrationValidator, new IntegrationValidator());
  container.registerInstance(ModuleValidator, new ModuleValidator());
  container.registerInstance(SnapshotValidator, new SnapshotValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(IntegrationMapper, new IntegrationMapper());
  container.registerInstance(ModuleMapper, new ModuleMapper());
  container.registerInstance(SnapshotMapper, new SnapshotMapper());

  // Dependency Graph (Singleton)
  const modules = getAllModuleEntities();
  const dependencyGraph = new DependencyGraph(modules);
  container.registerInstance(DependencyGraph, dependencyGraph);

  // Service (Singleton - depends on repository, validators, and graph)
  container.registerFactory(
    SystemIntegrationService as unknown as new (...args: never[]) => SystemIntegrationService,
    (c: unknown) => {
      const resolved = c as { resolve: (token: unknown) => unknown };
      return new SystemIntegrationService(
        resolved.resolve(SupabaseSystemIntegrationRepository) as SupabaseSystemIntegrationRepository
      );
    },
    { lifetime: Lifetime.Singleton }
  );
}

/**
 * Quick setup function for system-integration domain.
 * Creates and configures all system-integration domain components.
 */
export function setupSystemIntegrationDomain(): {
  systemIntegrationRepository: SupabaseSystemIntegrationRepository;
  systemIntegrationService: SystemIntegrationService;
  integrationMapper: IntegrationMapper;
  moduleMapper: ModuleMapper;
  snapshotMapper: SnapshotMapper;
  integrationValidator: IntegrationValidator;
  moduleValidator: ModuleValidator;
  snapshotValidator: SnapshotValidator;
  dependencyGraph: DependencyGraph;
  registeredModules: string[];
} {
  const systemIntegrationRepository = new SupabaseSystemIntegrationRepository();
  const systemIntegrationService = new SystemIntegrationService(systemIntegrationRepository);
  const integrationMapper = new IntegrationMapper();
  const moduleMapper = new ModuleMapper();
  const snapshotMapper = new SnapshotMapper();
  const integrationValidator = new IntegrationValidator();
  const moduleValidator = new ModuleValidator();
  const snapshotValidator = new SnapshotValidator();

  // Build dependency graph with all domain modules
  const modules = getAllModuleEntities();
  const dependencyGraph = new DependencyGraph(modules);

  return {
    systemIntegrationRepository,
    systemIntegrationService,
    integrationMapper,
    moduleMapper,
    snapshotMapper,
    integrationValidator,
    moduleValidator,
    snapshotValidator,
    dependencyGraph,
    registeredModules: Object.keys(DOMAIN_MODULES),
  };
}
