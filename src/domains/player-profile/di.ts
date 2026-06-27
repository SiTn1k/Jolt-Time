/**
 * Player Profile Domain Dependency Injection Registration
 *
 * Registers all player profile domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabasePlayerProfileRepository } from './repositories/SupabasePlayerProfileRepository';
import { PlayerProfileMapper } from './mappers/PlayerProfileMapper';
import { NicknameValidator, PlayerLevelValidator, ExperienceValidator } from './validators';

/**
 * Player Profile Domain DI configuration keys.
 */
export const PLAYER_PROFILE_TOKENS = {
  PLAYER_PROFILE_REPOSITORY: Symbol.for('SupabasePlayerProfileRepository'),
  PLAYER_PROFILE_MAPPER: Symbol.for('PlayerProfileMapper'),
  NICKNAME_VALIDATOR: Symbol.for('NicknameValidator'),
  PLAYER_LEVEL_VALIDATOR: Symbol.for('PlayerLevelValidator'),
  EXPERIENCE_VALIDATOR: Symbol.for('ExperienceValidator'),
} as const;

/**
 * Register all player profile domain dependencies with the container.
 */
export function registerPlayerProfileDependencies(container: Container): void {
  // Repository (Scoped - one instance per request)
  container.registerFactory(
    SupabasePlayerProfileRepository,
    () => new SupabasePlayerProfileRepository(),
    { lifetime: Lifetime.Scoped }
  );

  // Mapper (Singleton - stateless)
  container.registerInstance(PlayerProfileMapper, new PlayerProfileMapper());

  // Validators (Singleton - stateless)
  container.registerInstance(NicknameValidator, new NicknameValidator());
  container.registerInstance(PlayerLevelValidator, new PlayerLevelValidator());
  container.registerInstance(ExperienceValidator, new ExperienceValidator());
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
} {
  const playerProfileRepository = new SupabasePlayerProfileRepository();
  const playerProfileMapper = new PlayerProfileMapper();
  const nicknameValidator = new NicknameValidator();
  const playerLevelValidator = new PlayerLevelValidator();
  const experienceValidator = new ExperienceValidator();

  return {
    playerProfileRepository,
    playerProfileMapper,
    nicknameValidator,
    playerLevelValidator,
    experienceValidator,
  };
}