/**
 * Museum Domain Module
 *
 * Production-ready Museum Domain for Jolt Time.
 * This module encapsulates all museum-related functionality including
 * entities, repositories, DTOs, mappers, validators, events, types, interfaces,
 * value objects, and dependency injection.
 *
 * ## Module Structure
 *
 * ```
 * src/domains/museum/
 * ├── entities/        # Domain entities (Museum, MuseumHall, MuseumExhibit)
 * ├── repositories/    # Data access layer interfaces and implementations
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
 * ## Key Design Principles
 *
 * **Museum DOES NOT own artifacts**
 * - Museum displays Inventory Items (collected artifacts)
 * - MuseumExhibit references InventoryItemId
 * - MuseumExhibit references ArtifactId for display context
 * - Museum never duplicates artifact data
 *
 * **Separation of Concerns**
 * - Museum = player's virtual museum (display showcase)
 * - Inventory = player's collected items (ownership)
 * - Artifact = item definitions (master catalog)
 *
 * **Exhibits Reference Inventory Items**
 * - An exhibit is a display slot for an inventory item
 * - The inventory item provides the actual artifact data
 * - Exhibits can be placed/removed without affecting inventory
 *
 * ## Usage
 *
 * ```typescript
 * import { Museum, MuseumHall, MuseumExhibit, IMuseumRepository } from './domains/museum';
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
 * export { registerMuseumDependencies, MUSEUM_TOKENS, setupMuseumDomain } from './di';
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
export { registerMuseumDependencies, MUSEUM_TOKENS, setupMuseumDomain } from './di';
