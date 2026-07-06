/**
 * Final QA Domain
 *
 * Quality assurance foundation for final production audit preparation.
 * Final QA NEVER modifies gameplay - it only stores checks, reports, and snapshots.
 *
 * @description
 * The Final QA domain is responsible for:
 * - Storing QA checks for final production audit
 * - Managing QA snapshots for system state capture
 * - Tracking QA reports for audit results
 * - Providing infrastructure for final validation
 *
 * The Final QA domain is NOT responsible for:
 * - Modifying gameplay, balances, or player state
 * - Distributing rewards
 * - Managing inventory or currency
 * - Any state-changing operations
 *
 * Final QA is a FOUNDATION layer that enables:
 * - Final production audit preparation
 * - QA check tracking
 * - System state snapshots
 * - Audit result reporting
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

// Services
export * from './services';

// Repositories
export * from './repositories';

// DI Registration
export { registerFinalQADependencies, setupFinalQADomain, FINAL_QA_TOKENS } from './di';
