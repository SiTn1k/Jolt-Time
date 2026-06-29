/**
 * Configuration Domain Module
 *
 * Production-ready Configuration Domain for Jolt Time.
 * This module encapsulates all configuration-related functionality including
 * entities, repositories, DTOs, mappers, validators, events, types, interfaces,
 * value objects, services, and dependency injection.
 *
 * ## Module Structure
 *
 * ```
 * src/domains/configuration/
 * ├── entities/        # Domain entities (ConfigurationEntry, ConfigurationGroup, FeatureFlag)
 * ├── repositories/   # Data access layer interfaces and implementations
 * ├── dto/            # Data Transfer Objects
 * ├── mappers/        # Entity-DTO mappers
 * ├── validators/     # Input validation
 * ├── services/       # Configuration services (Cache, FeatureFlagEngine, Resolution, Service, Validation)
 * ├── events/         # Domain events
 * ├── types/          # Type definitions
 * ├── interfaces/     # Abstract interfaces
 * ├── value-objects/  # Immutable value objects
 * ├── di.ts           # Dependency injection setup
 * └── index.ts        # Module exports
 * ```
 *
 * ## Key Principles
 *
 * **Configuration IS:**
 * - Central runtime configuration system
 * - Shared across every domain
 * - A foundation layer for other systems
 *
 * **Configuration IS NOT:**
 * - Gameplay logic
 * - Balance modifications
 * - Reward granting
 * - Player state changes
 *
 * ## Usage
 *
 * ```typescript
 * import { ConfigurationEntry, IConfigurationRepository } from './domains/configuration';
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
 * export * from './services';
 *
 * // DI setup
 * export { registerConfigurationDependencies, CONFIGURATION_TOKENS, setupConfigurationDomain } from './di';
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
 * Services
 */
export * from './services';

/**
 * Dependency Injection
 */
export { registerConfigurationDependencies, CONFIGURATION_TOKENS, setupConfigurationDomain } from './di';
