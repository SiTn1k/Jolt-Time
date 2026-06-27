/**
 * User Domain Module
 *
 * Production-ready User Domain for Jolt Time.
 * This module encapsulates all user-related functionality including
 * entities, repositories, services, DTOs, mappers, validators,
 * events, types, interfaces, value objects, factories, and exceptions.
 *
 * ## Module Structure
 *
 * ```
 * src/domains/user/
 * ├── entities/        # Domain entities (User, UserProfile)
 * ├── repositories/   # Data access layer interfaces
 * ├── services/        # Business logic services
 * ├── dto/            # Data Transfer Objects
 * ├── mappers/        # Entity-DTO mappers
 * ├── validators/     # Input validation
 * ├── events/         # Domain events
 * ├── types/          # Type definitions
 * ├── interfaces/     # Abstract interfaces
 * ├── value-objects/  # Immutable value objects
 * ├── factories/      # Entity factories
 * ├── exceptions/     # Domain exceptions
 * └── tests/          # Unit tests
 * ```
 *
 * ## Usage
 *
 * ```typescript
 * import { User, IUser, UserStatus } from './domains/user';
 *
 * // Domain types and interfaces are exported
 * export * from './types';
 * export * from './interfaces';
 *
 * // Concrete implementations are exported by each folder
 * export * from './entities';
 * export * from './repositories';
 * export * from './services';
 * export * from './dto';
 * export * from './mappers';
 * export * from './validators';
 * export * from './events';
 * export * from './value-objects';
 * export * from './factories';
 * export * from './exceptions';
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
 * Services
 */
export * from './services';

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
 * Factories
 */
export * from './factories';

/**
 * Exceptions
 */
export * from './exceptions';