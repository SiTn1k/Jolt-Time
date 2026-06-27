/**
 * Player Profile Domain Dependency Injection Registration
 *
 * Registers all player profile domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabasePlayerProfileRepository } from './repositories/SupabasePlayerProfileRepository';
import { PlayerProfileMapper } from './mappers/PlayerProfileMapper';
import { NicknameValidator, PlayerLevelValidator, ExperienceValidator } from './validators';
import { PlayerProfileService } from '../../services/PlayerProfileService';

/**
 * Player Profile Domain DI configuration keys.
 */
export const PLAYER_PROFILE_TOKENS = {
  PLAYER_PROFILE_REPOSITORY: Symbol.for('SupabasePlayerProfileRepository'),
  PLAYER_PROFILE_MAPPER: Symbol.for('PlayerProfileMapper'),
  NICKNAME_VALIDATOR: Symbol.for('NicknameValidator'),
  PLAYER_LEVEL_VALIDATOR: Symbol.for('PlayerLevelValidator'),
  EXPERIENCE_VALIDATOR: Symbol.for('ExperienceValidator'),
  PLAYER_PROFILE_SERVICE: Symbol.for('PlayerProfileService'),
} as const;

/**
 * Register all player profile domain dependencies with the container.
 */
export function registerPlayerProfileDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(NicknameValidator, new NicknameValidator());
  container.registerInstance(PlayerLevelValidator, new PlayerLevelValidator());
  container.registerInstance(ExperienceValidator, new ExperienceValidator());

  // Mapper (Singleton - stateless)
  container.registerInstance(PlayerProfileMapper, new PlayerProfileMapper());

  // Repository (Singleton for simplicity - can be changed to Scoped if needed)
  container.register(SupabasePlayerProfileRepository, { lifetime: Lifetime.Singleton });

  // Service (Singleton for simplicity - depends on repository and validators)
  container.register(PlayerProfileService, { lifetime: Lifetime.Singleton });
}

/**
 * Quick setup function for player profile domain.
 * Creates and configures all player profile domain components.
 */
export function setupPlayerProfileDomain(): {
  playerProfileRepository: SupabasePlayerProfileRepository;
  playerProfileMapper: PlayerProfileMapper;
  nicknameValidator: NicknameValidator;
  playerLevelValidator: PlayerLevelValidator;
  experienceValidator: ExperienceValidator;
  playerProfileService: PlayerProfileService;
} {
  const playerProfileRepository = new SupabasePlayerProfileRepository();
  const playerProfileMapper = new PlayerProfileMapper();
  const nicknameValidator = new NicknameValidator();
  const playerLevelValidator = new PlayerLevelValidator();
  const experienceValidator = new ExperienceValidator();
  const playerProfileService = new PlayerProfileService(
    playerProfileRepository,
    playerProfileMapper,
    nicknameValidator,
    playerLevelValidator,
    experienceValidator
  );

  return {
    playerProfileRepository,
    playerProfileMapper,
    nicknameValidator,
    playerLevelValidator,
    experienceValidator,
    playerProfileService,
  };
}