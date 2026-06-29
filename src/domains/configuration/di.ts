/**
 * Configuration Domain Dependency Injection Registration
 *
 * Registers all configuration domain services with the DI container.
 */

import type { Container } from '../../core/di/container';
import { Lifetime } from '../../core/di/container';
import { SupabaseConfigurationRepository } from './repositories/SupabaseConfigurationRepository';
import { ConfigurationMapper } from './mappers/ConfigurationMapper';
import { GroupMapper } from './mappers/GroupMapper';
import { FeatureFlagMapper } from './mappers/FeatureFlagMapper';
import { ConfigurationValidator } from './validators/ConfigurationValidator';
import { GroupValidator } from './validators/GroupValidator';
import { FeatureFlagValidator } from './validators/FeatureFlagValidator';

/**
 * Configuration Domain DI configuration keys.
 */
export const CONFIGURATION_TOKENS = {
  CONFIGURATION_REPOSITORY: Symbol.for('SupabaseConfigurationRepository'),
  CONFIGURATION_MAPPER: Symbol.for('ConfigurationMapper'),
  GROUP_MAPPER: Symbol.for('GroupMapper'),
  FEATURE_FLAG_MAPPER: Symbol.for('FeatureFlagMapper'),
  CONFIGURATION_VALIDATOR: Symbol.for('ConfigurationValidator'),
  GROUP_VALIDATOR: Symbol.for('GroupValidator'),
  FEATURE_FLAG_VALIDATOR: Symbol.for('FeatureFlagValidator'),
} as const;

/**
 * Register all configuration domain dependencies with the container.
 */
export function registerConfigurationDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(ConfigurationValidator, new ConfigurationValidator());
  container.registerInstance(GroupValidator, new GroupValidator());
  container.registerInstance(FeatureFlagValidator, new FeatureFlagValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(ConfigurationMapper, new ConfigurationMapper());
  container.registerInstance(GroupMapper, new GroupMapper());
  container.registerInstance(FeatureFlagMapper, new FeatureFlagMapper());

  // Repository (Singleton - skeleton, full implementation in P-182.2)
  container.register(SupabaseConfigurationRepository, { lifetime: Lifetime.Singleton });
}

/**
 * Quick setup function for configuration domain.
 * Creates and configures all configuration domain components.
 */
export function setupConfigurationDomain(): {
  configurationRepository: SupabaseConfigurationRepository;
  configurationMapper: ConfigurationMapper;
  groupMapper: GroupMapper;
  featureFlagMapper: FeatureFlagMapper;
  configurationValidator: ConfigurationValidator;
  groupValidator: GroupValidator;
  featureFlagValidator: FeatureFlagValidator;
} {
  const configurationRepository = new SupabaseConfigurationRepository();
  const configurationMapper = new ConfigurationMapper();
  const groupMapper = new GroupMapper();
  const featureFlagMapper = new FeatureFlagMapper();
  const configurationValidator = new ConfigurationValidator();
  const groupValidator = new GroupValidator();
  const featureFlagValidator = new FeatureFlagValidator();

  return {
    configurationRepository,
    configurationMapper,
    groupMapper,
    featureFlagMapper,
    configurationValidator,
    groupValidator,
    featureFlagValidator,
  };
}
