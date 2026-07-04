/**
 * Security Domain
 *
 * Foundation layer for storing security incidents, policies, and sessions.
 * Security NEVER modifies gameplay - it only stores records.
 *
 * @description
 * The Security domain is responsible for:
 * - Storing security incident records
 * - Managing security policies
 * - Tracking security sessions
 * - Providing data for security analysis
 *
 * The Security domain is NOT responsible for:
 * - Banning users (P-188.2)
 * - Rate limiting (P-188.2)
 * - IP blocking (P-188.2)
 * - Anti-cheat detection (P-188.2)
 * - Fraud detection (P-188.2)
 * - Permission enforcement
 * - JWT rotation
 * - Modifying gameplay, balances, or player state
 *
 * Security is a FOUNDATION layer that enables:
 * - Security incident tracking
 * - Policy configuration storage
 * - Session monitoring
 * - Compliance and regulatory reporting
 * - Security analysis and auditing
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
export { registerSecurityDependencies, setupSecurityDomain, SECURITY_TOKENS } from './di';
