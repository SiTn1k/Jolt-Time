/**
 * Admin Domain Module
 *
 * Production-ready Admin Domain for Jolt Time.
 * This module encapsulates all admin-related functionality including
 * entities, repositories, DTOs, mappers, validators, events, types,
 * interfaces, value objects, services, and dependency injection.
 *
 * ## Module Structure
 *
 * ```
 * src/domains/admin/
 * ├── entities/        # Domain entities (AdminAccount, AdminRole, AdminPermission)
 * ├── repositories/   # Data access layer interfaces and implementations
 * ├── dto/            # Data Transfer Objects
 * ├── mappers/        # Entity-DTO mappers
 * ├── validators/     # Input validation
 * ├── events/         # Domain events
 * ├── types/          # Type definitions
 * ├── interfaces/     # Abstract interfaces
 * ├── value-objects/  # Immutable value objects
 * ├── services/       # Business logic services
 * │   ├── AdminService.ts
 * │   ├── PermissionEngine.ts
 * │   ├── AuditService.ts
 * │   ├── commands/
 * │   └── subscribers/
 * ├── di.ts           # Dependency injection setup
 * └── index.ts        # Module exports
 * ```
 *
 * ## Design Principles
 *
 * - Admin is an independent domain
 * - Admin manages administration only
 * - Admin NEVER contains gameplay logic
 * - Admin NEVER modifies gameplay (rewards, balances, inventory, quests, museums)
 * - Admin ONLY issues validated commands; target domains execute their own logic
 *
 * ## Services
 *
 * - AdminService: Core business logic for admin operations
 * - PermissionEngine: RBAC permission validation and checking
 * - AuditService: Comprehensive audit logging
 * - AdminEventSubscribers: Event handlers for admin domain events
 * - AdminCommands: Command interfaces for cross-domain operations
 *
 * ## Usage
 *
 * ```typescript
 * import { AdminAccount, AdminService, PermissionEngine } from './domains/admin';
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
 * export { registerAdminDependencies, ADMIN_TOKENS, setupAdminDomain } from './di';
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
export { registerAdminDependencies, ADMIN_TOKENS, setupAdminDomain } from './di';