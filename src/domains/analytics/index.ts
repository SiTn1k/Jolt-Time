/**
 * Analytics Domain Module
 *
 * Production-ready Analytics Domain for Jolt Time.
 * This module encapsulates all analytics-related functionality including
 * entities, repositories, DTOs, mappers, validators, events, types, interfaces,
 * value objects, services, subscribers, and dependency injection.
 *
 * ## Module Structure
 *
 * ```
 * src/domains/analytics/
 * ├── entities/        # Domain entities (AnalyticsEvent, AnalyticsSession, AnalyticsMetric)
 * ├── repositories/    # Data access layer interfaces and implementations
 * ├── services/         # Business logic (AnalyticsService)
 * ├── subscribers/     # Event subscribers for automatic collection
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
 * **Analytics NEVER modifies gameplay**
 * - Analytics ONLY records telemetry events and metrics
 * - Analytics does NOT modify Currency, Inventory, Museum, Academy,
 *   Quest, Achievement, Guild, Rewards, or Notifications
 * - Analytics is a pure telemetry layer
 *
 * ## Event Types Supported
 *
 * - Gameplay
 * - Economy
 * - Museum
 * - Academy
 * - Quest
 * - Achievement
 * - Guild
 * - Reward
 * - Notification
 * - System
 *
 * ## Usage
 *
 * ```typescript
 * import { 
 *   AnalyticsEvent, 
 *   AnalyticsService,
 *   IAnalyticsRepository, 
 *   AnalyticsEventType 
 * } from './domains/analytics';
 *
 * // Domain types and interfaces are exported
 * export * from './types';
 * export * from './interfaces';
 *
 * // Concrete implementations are exported by each folder
 * export * from './entities';
 * export * from './repositories';
 * export * from './services';
 * export * from './subscribers';
 * export * from './dto';
 * export * from './mappers';
 * export * from './validators';
 * export * from './events';
 * export * from './value-objects';
 *
 * // DI setup
 * export { registerAnalyticsDependencies, ANALYTICS_TOKENS, setupAnalyticsDomain } from './di';
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
 * Subscribers
 */
export * from './subscribers';

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
export { registerAnalyticsDependencies, ANALYTICS_TOKENS, setupAnalyticsDomain } from './di';
