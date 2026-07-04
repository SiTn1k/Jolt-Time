/**
 * Integration Domain Module
 *
 * Production-ready Integration Domain for Jolt Time.
 * This module encapsulates all integration-related functionality including
 * entities, repositories, DTOs, mappers, validators, events, types,
 * interfaces, value objects, services, and dependency injection.
 *
 * ## Module Structure
 *
 * ```
 * src/domains/integration/
 * ├── entities/           # Domain entities (IntegrationProvider, IntegrationRequest, IntegrationResponse)
 * ├── repositories/       # Data access layer interfaces and implementations
 * ├── dto/               # Data Transfer Objects
 * ├── mappers/           # Entity-DTO mappers
 * ├── validators/        # Input validation
 * ├── events/            # Domain events
 * ├── types/             # Type definitions
 * ├── interfaces/        # Abstract interfaces
 * ├── value-objects/     # Immutable value objects
 * ├── services/          # Service implementations (P-187.2)
 * ├── di.ts              # Dependency injection setup
 * └── index.ts           # Module exports
 * ```
 *
 * ## Design Principles
 *
 * - Integration is an independent domain
 * - Integration serves as a gateway for external services
 * - Integration NEVER contains gameplay logic
 * - Integration NEVER modifies gameplay (rewards, balances, inventory, quests, museums)
 * - Integration ONLY stores providers, requests, and responses as a foundation layer
 * - All external communication (HTTP clients, webhooks, retries, circuit breakers)
 *   belongs to P-187.2 — Production Integration Implementation
 *
 * ## Services (P-187.2)
 *
 * - IntegrationService: Main orchestration service
 * - HttpGateway: Abstract HTTP client
 * - RetryEngine: Retry with exponential backoff
 * - CircuitBreaker: Fault tolerance pattern
 * - RateLimiter: Rate limiting
 * - ProviderRegistry: Provider management
 * - FailureHandler: Failure handling with events
 *
 * ## Usage
 *
 * ```typescript
 * import { IntegrationProvider, IntegrationMapper, IntegrationService } from './domains/integration';
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
 * export { INTEGRATION_TOKENS, setupIntegrationDomain } from './di';
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
export { INTEGRATION_TOKENS, setupIntegrationDomain } from './di';
