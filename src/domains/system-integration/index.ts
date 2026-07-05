/**
 * System Integration Domain
 *
 * Domain module for system integration management.
 * Manages registration of system modules, integration state, and snapshots.
 *
 * IMPORTANT: System Integration Foundation is a METADATA management layer.
 * It ONLY stores registered modules, integration state, and integration snapshots.
 *
 * System Integration Foundation MUST NEVER:
 * - Perform health checks
 * - Resolve dependencies
 * - Execute auto-recovery
 * - Perform startup validation
 * - Load modules
 * - Synchronize runtime state
 * - Modify gameplay
 * - Grant rewards
 * - Modify balances
 * - Modify inventory
 *
 * All runtime logic (health checking, dependency resolution, etc.) belongs to P-194.2.
 *
 * @example
 * ```typescript
 * import { setupSystemIntegrationDomain } from './domains/system-integration';
 *
 * const {
 *   systemIntegrationRepository,
 *   moduleMapper,
 *   snapshotMapper,
 *   moduleValidator,
 *   snapshotValidator,
 * } = setupSystemIntegrationDomain();
 * ```
 */

// Types
export * from './types';

// Value Objects
export * from './value-objects';

// Entities
export * from './entities';

// Interfaces
export * from './interfaces';

// DTOs
export * from './dto';

// Events
export * from './events';

// Mappers
export * from './mappers';

// Validators
export * from './validators';

// Repositories
export { SupabaseSystemIntegrationRepository } from './repositories';

// Dependency Injection
export { SYSTEM_INTEGRATION_TOKENS, setupSystemIntegrationDomain } from './di';
