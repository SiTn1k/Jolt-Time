/**
 * Game State Domain Dependency Injection Registration
 *
 * Registers all game state domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseGameStateRepository } from './repositories/SupabaseGameStateRepository';
import { GameStateMapper } from './mappers/GameStateMapper';
import { EnergyValidator, HealthValidator, SessionValidator } from './validators';
import { GameStateService } from '../../services/GameStateService';

/**
 * Game State Domain DI configuration keys.
 */
export const GAME_STATE_TOKENS = {
  GAME_STATE_REPOSITORY: Symbol.for('SupabaseGameStateRepository'),
  GAME_STATE_MAPPER: Symbol.for('GameStateMapper'),
  ENERGY_VALIDATOR: Symbol.for('EnergyValidator'),
  HEALTH_VALIDATOR: Symbol.for('HealthValidator'),
  SESSION_VALIDATOR: Symbol.for('SessionValidator'),
  GAME_STATE_SERVICE: Symbol.for('GameStateService'),
} as const;

/**
 * Register all game state domain dependencies with the container.
 */
export function registerGameStateDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(EnergyValidator, new EnergyValidator());
  container.registerInstance(HealthValidator, new HealthValidator());
  container.registerInstance(SessionValidator, new SessionValidator());

  // Mapper (Singleton - stateless)
  container.registerInstance(GameStateMapper, new GameStateMapper());

  // Repository (Singleton for simplicity - can be changed to Scoped if needed)
  container.register(SupabaseGameStateRepository, { lifetime: Lifetime.Singleton });

  // Service (Singleton - depends on repository, mapper, and validators)
  container.register(GameStateService, { lifetime: Lifetime.Singleton });
}

/**
 * Quick setup function for game state domain.
 * Creates and configures all game state domain components.
 */
export function setupGameStateDomain(): {
  gameStateRepository: SupabaseGameStateRepository;
  gameStateMapper: GameStateMapper;
  energyValidator: EnergyValidator;
  healthValidator: HealthValidator;
  sessionValidator: SessionValidator;
  gameStateService: GameStateService;
} {
  const gameStateRepository = new SupabaseGameStateRepository();
  const gameStateMapper = new GameStateMapper();
  const energyValidator = new EnergyValidator();
  const healthValidator = new HealthValidator();
  const sessionValidator = new SessionValidator();
  const gameStateService = new GameStateService(
    gameStateRepository,
    gameStateMapper,
    energyValidator,
    healthValidator,
    sessionValidator
  );

  return {
    gameStateRepository,
    gameStateMapper,
    energyValidator,
    healthValidator,
    sessionValidator,
    gameStateService,
  };
}