/**
 * Error Handling Domain Module
 *
 * Production-ready Error Handling Domain for Jolt Time.
 * This module encapsulates all error-handling-related functionality including
 * entities, repositories, DTOs, mappers, validators, events, types, interfaces,
 * value objects, services, subscribers, and dependency injection.
 *
 * ## Module Structure
 *
 * ```
 * src/domains/error-handling/
 * ├── entities/        # Domain entities (SystemError, ErrorCategory, ErrorContext)
 * ├── repositories/    # Data access layer interfaces and implementations
 * ├── dto/             # Data Transfer Objects
 * ├── mappers/         # Entity-DTO mappers
 * ├── validators/      # Input validation
 * ├── events/          # Domain events
 * ├── types/           # Type definitions
 * ├── interfaces/      # Abstract interfaces
 * ├── value-objects/   # Immutable value objects
 * ├── di.ts            # Dependency injection setup
 * └── index.ts         # Module exports
 * ```
 *
 * ## Key Principle
 *
 * **Error Handling NEVER modifies gameplay**
 * - Error Handling ONLY stores errors, categories, and contexts
 * - Error Handling does NOT retry operations
 * - Error Handling does NOT modify Currency, Inventory, Museum, Academy,
 *   Quest, Achievement, Guild, Rewards, or Notifications
 * - Error Handling does NOT grant rewards
 * - Error Handling does NOT modify balances
 * - Error Handling does NOT modify inventory
 * - Error Handling is a pure error storage and tracking layer
 *
 * ## Error Severity Levels
 *
 * - Info: Informational message - no action required
 * - Warning: Warning condition - may require attention
 * - Error: Error condition - something failed
 * - Critical: Critical condition - immediate attention required
 * - Fatal: Fatal condition - system cannot continue
 *
 * ## Error Categories
 *
 * - UI: User interface and rendering issues
 * - Validation: Input validation failures
 * - Service: Business logic failures
 * - Repository: Data access failures
 * - API: External API communication failures
 * - Database: Supabase and database failures
 * - Telegram: Telegram API failures
 * - ExternalService: Third-party service failures
 * - System: Internal system failures
 * - Security: Security-related failures
 * - Configuration: Configuration-related failures
 * - Network: Network connectivity failures
 *
 * ## Usage
 *
 * ```typescript
 * import {
 *   SystemError,
 *   ErrorCategory,
 *   ErrorContext,
 *   IErrorRepository,
 *   ErrorSeverity,
 *   ErrorCategoryType
 * } from './domains/error-handling';
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
 * export { registerErrorHandlingDependencies, ERROR_HANDLING_TOKENS, setupErrorHandlingDomain } from './di';
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
export { registerErrorHandlingDependencies, ERROR_HANDLING_TOKENS, setupErrorHandlingDomain } from './di';
