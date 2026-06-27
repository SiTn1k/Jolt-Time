/**
 * Inventory Domain Module
 *
 * Production-ready Inventory Domain for Jolt Time.
 * This module encapsulates all inventory-related functionality including
 * entities, repositories, DTOs, mappers, validators, events, types, interfaces,
 * value objects, and dependency injection.
 *
 * ## Module Structure
 *
 * ```
 * src/domains/inventory/
 * ├── entities/        # Domain entities (Inventory, InventoryItem)
 * ├── repositories/   # Data access layer interfaces and implementations
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
 * **Inventory IS NOT Museum**
 * - Inventory stores ownership of collectible objects
 * - Museum stores exhibition of artifacts
 * - They are separate concerns
 *
 * **Inventory IS NOT Artifacts**
 * - Artifacts define item data (name, rarity, type, etc.)
 * - Inventory stores ownership (who owns what, quantity, status)
 * - They are separate concerns
 *
 * ## Usage
 *
 * ```typescript
 * import { Inventory, InventoryItem, IInventoryRepository } from './domains/inventory';
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
 * export { registerInventoryDependencies, INVENTORY_TOKENS, setupInventoryDomain } from './di';
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
export { registerInventoryDependencies, INVENTORY_TOKENS, setupInventoryDomain } from './di';