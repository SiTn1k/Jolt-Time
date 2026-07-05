/**
 * System Integration Domain Dependency Injection Registration
 *
 * Registers all system-integration domain services with the DI container.
 */

import { SupabaseSystemIntegrationRepository } from './repositories/SupabaseSystemIntegrationRepository';
import { IntegrationMapper, ModuleMapper, SnapshotMapper } from './mappers';
import { IntegrationValidator, ModuleValidator, SnapshotValidator } from './validators';

/**
 * System Integration Domain DI configuration keys.
 */
export const SYSTEM_INTEGRATION_TOKENS = {
  // Repository
  SYSTEM_INTEGRATION_REPOSITORY: Symbol.for('SupabaseSystemIntegrationRepository'),

  // Mappers
  INTEGRATION_MAPPER: Symbol.for('IntegrationMapper'),
  MODULE_MAPPER: Symbol.for('ModuleMapper'),
  SNAPSHOT_MAPPER: Symbol.for('SnapshotMapper'),

  // Validators
  INTEGRATION_VALIDATOR: Symbol.for('IntegrationValidator'),
  MODULE_VALIDATOR: Symbol.for('ModuleValidator'),
  SNAPSHOT_VALIDATOR: Symbol.for('SnapshotValidator'),
} as const;

/**
 * Quick setup function for system-integration domain.
 * Creates and configures all system-integration domain components.
 */
export function setupSystemIntegrationDomain(): {
  systemIntegrationRepository: SupabaseSystemIntegrationRepository;
  integrationMapper: IntegrationMapper;
  moduleMapper: ModuleMapper;
  snapshotMapper: SnapshotMapper;
  integrationValidator: IntegrationValidator;
  moduleValidator: ModuleValidator;
  snapshotValidator: SnapshotValidator;
} {
  const systemIntegrationRepository = new SupabaseSystemIntegrationRepository();
  const integrationMapper = new IntegrationMapper();
  const moduleMapper = new ModuleMapper();
  const snapshotMapper = new SnapshotMapper();
  const integrationValidator = new IntegrationValidator();
  const moduleValidator = new ModuleValidator();
  const snapshotValidator = new SnapshotValidator();

  return {
    systemIntegrationRepository,
    integrationMapper,
    moduleMapper,
    snapshotMapper,
    integrationValidator,
    moduleValidator,
    snapshotValidator,
  };
}
