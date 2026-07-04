/**
 * Audit Domain
 *
 * Immutable history layer for recording important system actions.
 * Audit NEVER modifies gameplay - it only stores records.
 *
 * @description
 * The Audit domain is responsible for:
 * - Storing immutable audit records of all important system actions
 * - Managing audit categories for organizing records
 * - Tracking actors (players, admins, systems) that perform actions
 * - Subscribing to domain events for automatic audit collection
 * - Providing search and query capabilities for audit history
 *
 * The Audit domain is NOT responsible for:
 * - Modifying gameplay, balances, or player state
 * - Distributing rewards
 * - Managing inventory or currency
 * - Any state-changing operations
 *
 * Audit is a FOUNDATION layer that enables:
 * - Compliance and regulatory reporting
 * - Security monitoring
 * - Debugging and troubleshooting
 * - User activity tracking
 */

// Entities
export * from './entities';

// Value Objects
export * from './value-objects';

// Types
export * from './types';

// Interfaces
export * from './interfaces';

// DTOs
export * from './dto';

// Validators
export * from './validators';

// Mappers
export * from './mappers';

// Events
export * from './events';

// Constants (Audit Categories)
export * from './constants/AuditCategories';

// Repositories
export * from './repositories';

// Services
export { AuditService } from './services/AuditService';

// Subscribers
export { AuditEventSubscriber, createAuditEventSubscriber } from './subscribers/AuditEventSubscriber';

// DI Registration
export { registerAuditDependencies, setupAuditDomain, AUDIT_TOKENS } from './di';
