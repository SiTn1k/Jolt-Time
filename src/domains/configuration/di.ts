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
import { ConfigurationService } from './services/ConfigurationService';
import { ConfigurationCache } from './services/ConfigurationCache';
import { FeatureFlagEngine } from './services/FeatureFlagEngine';
import { ConfigurationResolution } from './services/ConfigurationResolution';
import { ConfigurationValidationService } from './services/ConfigurationValidationService';

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
  CONFIGURATION_SERVICE: Symbol.for('ConfigurationService'),
  CONFIGURATION_CACHE: Symbol.for('ConfigurationCache'),
  FEATURE_FLAG_ENGINE: Symbol.for('FeatureFlagEngine'),
  CONFIGURATION_RESOLUTION: Symbol.for('ConfigurationResolution'),
  CONFIGURATION_VALIDATION_SERVICE: Symbol.for('ConfigurationValidationService'),
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

  // Validation Service (Singleton)
  container.registerInstance(ConfigurationValidationService, new ConfigurationValidationService());

  // Cache (Singleton)
  container.registerInstance(ConfigurationCache, new ConfigurationCache());

  // Feature Flag Engine (Singleton)
  container.registerInstance(FeatureFlagEngine, new FeatureFlagEngine());

  // Configuration Resolution (Singleton)
  container.registerInstance(ConfigurationResolution, new ConfigurationResolution());

  // Repository (Singleton)
  container.register(SupabaseConfigurationRepository, { lifetime: Lifetime.Singleton });

  // Configuration Service (Singleton - depends on repository)
  container.register(ConfigurationService, { lifetime: Lifetime.Singleton });
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
  configurationService: ConfigurationService;
  configurationCache: ConfigurationCache;
  featureFlagEngine: FeatureFlagEngine;
  configurationResolution: ConfigurationResolution;
  configurationValidationService: ConfigurationValidationService;
} {
  const configurationRepository = new SupabaseConfigurationRepository();
  const configurationMapper = new ConfigurationMapper();
  const groupMapper = new GroupMapper();
  const featureFlagMapper = new FeatureFlagMapper();
  const configurationValidator = new ConfigurationValidator();
  const groupValidator = new GroupValidator();
  const featureFlagValidator = new FeatureFlagValidator();
  const configurationValidationService = new ConfigurationValidationService();
  const configurationCache = new ConfigurationCache();
  const featureFlagEngine = new FeatureFlagEngine();
  const configurationResolution = new ConfigurationResolution();
  const configurationService = new ConfigurationService(configurationRepository);

  return {
    configurationRepository,
    configurationMapper,
    groupMapper,
    featureFlagMapper,
    configurationValidator,
    groupValidator,
    featureFlagValidator,
    configurationService,
    configurationCache,
    featureFlagEngine,
    configurationResolution,
    configurationValidationService,
  };
}
