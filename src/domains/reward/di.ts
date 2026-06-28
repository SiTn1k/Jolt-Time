/**
 * Reward Domain Dependency Injection Registration
 *
 * Registers all reward domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseRewardRepository } from './repositories/SupabaseRewardRepository';
import { RewardMapper } from './mappers/RewardMapper';
import { PackageMapper } from './mappers/PackageMapper';
import { RequestMapper } from './mappers/RequestMapper';
import { RewardValidator } from './validators/RewardValidator';
import { RewardPackageValidator } from './validators/RewardPackageValidator';
import { RewardRequestValidator } from './validators/RewardRequestValidator';
import { RewardEngineService, createRewardEngineService } from '../../services/RewardEngineService';

/**
 * Reward Domain DI configuration keys.
 */
export const REWARD_TOKENS = {
  REWARD_REPOSITORY: Symbol.for('SupabaseRewardRepository'),
  REWARD_MAPPER: Symbol.for('RewardMapper'),
  PACKAGE_MAPPER: Symbol.for('PackageMapper'),
  REQUEST_MAPPER: Symbol.for('RequestMapper'),
  REWARD_VALIDATOR: Symbol.for('RewardValidator'),
  PACKAGE_VALIDATOR: Symbol.for('RewardPackageValidator'),
  REQUEST_VALIDATOR: Symbol.for('RewardRequestValidator'),
  REWARD_ENGINE_SERVICE: Symbol.for('RewardEngineService'),
} as const;

/**
 * Register all reward domain dependencies with the container.
 */
export function registerRewardDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(RewardValidator, new RewardValidator());
  container.registerInstance(RewardPackageValidator, new RewardPackageValidator());
  container.registerInstance(RewardRequestValidator, new RewardRequestValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(RewardMapper, new RewardMapper());
  container.registerInstance(PackageMapper, new PackageMapper());
  container.registerInstance(RequestMapper, new RequestMapper());

  // Repositories (Singleton)
  container.register(SupabaseRewardRepository, { lifetime: Lifetime.Singleton });

  // Services
  container.register(RewardEngineService, { lifetime: Lifetime.Singleton });
}

/**
 * Quick setup function for reward domain.
 * Creates and configures all reward domain components.
 */
export function setupRewardDomain(): {
  rewardRepository: SupabaseRewardRepository;
  rewardMapper: RewardMapper;
  packageMapper: PackageMapper;
  requestMapper: RequestMapper;
  rewardValidator: RewardValidator;
  packageValidator: RewardPackageValidator;
  requestValidator: RewardRequestValidator;
  rewardEngineService: RewardEngineService;
} {
  const rewardValidator = new RewardValidator();
  const packageValidator = new RewardPackageValidator();
  const requestValidator = new RewardRequestValidator();
  const rewardMapper = new RewardMapper();
  const packageMapper = new PackageMapper();
  const requestMapper = new RequestMapper();
  const rewardRepository = new SupabaseRewardRepository();
  const rewardEngineService = createRewardEngineService(rewardRepository);

  return {
    rewardRepository,
    rewardMapper,
    packageMapper,
    requestMapper,
    rewardValidator,
    packageValidator,
    requestValidator,
    rewardEngineService,
  };
}