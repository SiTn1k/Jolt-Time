/**
 * Game State Domain Module
 *
 * Production-ready Game State Domain for Jolt Time.
 * This module encapsulates all game state-related functionality including
 * entities, repositories, DTOs, mappers, validators, events, types, interfaces,
 * value objects, and dependency injection.
 *
 * ## Module Structure
 *
 * ```
 * src/domains/game-state/
 * ├── entities/        # Domain entities (GameState)
 * ├── repositories/   # Data access layer interfaces
 * ├── dto/            # Data Transfer Objects
 * ├── mappers/        # Entity-DTO mappers
 * ├── validators/     # Input validation
 * ├── events/         # Domain events
 * ├── types/          # Type definitions
 * ├── interfaces/     # Abstract interfaces
 * ├── value-objects/  # Immutable value objects
 * ├── di.ts           # Dependency injection setup
 * └── index.ts        # Module exports
 * ```
 *
 * ## Key Distinction
 *
 * **GameState IS NOT PlayerProfile**
 * - GameState represents current runtime gameplay state (energy, health, session)
 * - PlayerProfile represents persistent gameplay data (level, XP, prestige)
 * - They are separate concerns linked by playerProfileId
 *
 * ## Usage
 *
 * ```typescript
 * import { GameState, IGameState, IGameStateRepository } from './domains/game-state';
 *
 * // Domain types and interfaces are exported
 * export * from './types';
 * export * from './interfaces';
 *
 * // Concrete implementations are exported by each folder
 * export * from './entities';
 * export * from './repositories';
 * export * from './dto';
 * export * from './mappers';
 * export * from './validators';
 * export * from './events';
 * export * from './value-objects';
 *
 * // DI setup
 * export { registerGameStateDependencies, GAME_STATE_TOKENS, setupGameStateDomain } from './di';
 * ```
 */

/**
 * Types
 */
export * from './types';

/**
 * Interfaces
 */
export * from './interfaces';

/**
 * Entities
 */
export * from './entities';

/**
 * Repositories
 */
export * from './repositories';

/**
 * DTOs
 */
export * from './dto';

/**
 * Mappers
 */
export * from './mappers';

/**
 * Validators
 */
export * from './validators';

/**
 * Events
 */
export * from './events';

/**
 * Value Objects
 */
export * from './value-objects';

/**
 * Dependency Injection
 */
export { registerGameStateDependencies, GAME_STATE_TOKENS, setupGameStateDomain } from './di';