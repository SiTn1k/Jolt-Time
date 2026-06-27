/**
 * Player Profile Domain Module
 *
 * Production-ready Player Profile Domain for Jolt Time.
 * This module encapsulates all player profile-related functionality including
 * entities, repositories, DTOs, mappers, validators, events, types, interfaces,
 * value objects, and dependency injection.
 *
 * ## Module Structure
 *
 * ```
 * src/domains/player-profile/
 * ├── entities/        # Domain entities (PlayerProfile)
 * ├── repositories/   # Data access layer interfaces
 * ├── dto/            # Data Transfer Objects
 * ├── mappers/        # Entity-DTO mappers
 * ├── validators/     # Input validation
 * ├── events/         # Domain events
 * ├── types/          # Type definitions
 * ├── interfaces/     # Abstract interfaces
 * ├── value-objects/  # Immutable value objects
 * ├── factories/      # Entity factories
 * ├── exceptions/     # Domain exceptions
 * ├── di.ts           # Dependency injection setup
 * └── tests/          # Unit tests
 * ```
 *
 * ## Key Distinction
 *
 * **PlayerProfile IS NOT User**
 * - User represents authentication identity
 * - PlayerProfile represents gameplay identity
 * - They are separate concerns linked by userId
 *
 * ## Usage
 *
 * ```typescript
 * import { PlayerProfile, IPlayerProfile, PlayerProfileStatus } from './domains/player-profile';
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
 * export { registerPlayerProfileDependencies, PLAYER_PROFILE_TOKENS, setupPlayerProfileDomain } from './di';
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
export { registerPlayerProfileDependencies, PLAYER_PROFILE_TOKENS, setupPlayerProfileDomain } from './di';