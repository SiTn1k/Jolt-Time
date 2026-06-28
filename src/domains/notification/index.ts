/**
 * Notification Domain Module
 *
 * Production-ready Notification Domain for Jolt Time.
 * This module encapsulates all notification-related functionality including
 * entities, repositories, DTOs, mappers, validators, events, types, interfaces,
 * value objects, and dependency injection.
 *
 * ## Module Structure
 *
 * ```
 * src/domains/notification/
 * ├── entities/        # Domain entities (Notification, NotificationTemplate, NotificationChannel)
 * ├── repositories/   # Data access layer interfaces
 * ├── dto/            # Data Transfer Objects
 * ├── mappers/        # Entity-DTO mappers
 * ├── validators/     # Input validation
 * ├── events/         # Domain events
 * ├── types/          # Type definitions
 * ├── interfaces/     # Abstract interfaces
 * ├── value-objects/  # Immutable value objects
 * ├── di.ts           # Dependency injection setup
 * └── tests/          # Unit tests
 * ```
 *
 * ## Key Principles
 *
 * **Notifications only store messages**
 * - Notifications describe messages to be delivered
 * - No delivery logic, scheduling, or retries in this domain
 * - These belong to P-179.2 (Notification Implementation)
 *
 * **Notification System MUST NOT:**
 * - Send Telegram messages
 * - Call Telegram Bot
 * - Call Push Service
 * - Call Email
 * - Modify Player
 * - Modify Game State
 *
 * ## Usage
 *
 * ```typescript
 * import { Notification, NotificationTemplate, NotificationChannel } from './domains/notification';
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
 * export { registerNotificationDependencies, NOTIFICATION_TOKENS, setupNotificationDomain } from './di';
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
export { registerNotificationDependencies, NOTIFICATION_TOKENS, setupNotificationDomain } from './di';