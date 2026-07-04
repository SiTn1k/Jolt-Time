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

export * from './entities';
export * from './value-objects';
export * from './types';
export * from './interfaces';
export * from './dto';
export * from './validators';
export * from './mappers';
export * from './events';
export * from './repositories';

export { registerAuditDependencies, setupAuditDomain, AUDIT_TOKENS } from './di';
