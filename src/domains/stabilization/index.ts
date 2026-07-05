/**
 * Stabilization Domain
 *
 * Foundation layer for production stabilization monitoring.
 * Stabilization NEVER modifies gameplay - it only stores issues, reports, and health snapshots.
 *
 * @description
 * The Stabilization domain is responsible for:
 * - Storing detected stabilization issues
 * - Managing issue severity and status tracking
 * - Recording system health snapshots
 * - Generating stabilization reports
 * - Providing data for monitoring and alerting
 *
 * The Stabilization domain is NOT responsible for:
 * - Modifying gameplay, balances, or player state
 * - Distributing rewards
 * - Managing inventory or currency
 * - Health scanning, stress testing, or auto-repair (belong to P-195.2)
 * - Any state-changing operations
 *
 * Stabilization is a FOUNDATION layer that enables:
 * - Production monitoring and alerting
 * - Issue tracking and resolution
 * - System health visibility
 * - Debugging and troubleshooting
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

// Repositories
export * from './repositories';

// DI Registration
export { registerStabilizationDependencies, setupStabilizationDomain, STABILIZATION_TOKENS } from './di';
