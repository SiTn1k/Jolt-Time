/**
 * Security Domain
 *
 * Foundation layer for security incidents, policies, sessions, and protections.
 * Security NEVER modifies gameplay - it only detects, evaluates, protects, and tracks.
 *
 * @description
 * The Security domain is responsible for:
 * - Storing security incident records
 * - Managing security policies
 * - Tracking security sessions
 * - Providing session protection
 * - Providing brute force protection
 * - Providing fraud detection
 * - Providing permission evaluation
 * - Providing data for security analysis
 *
 * The Security domain is NOT responsible for:
 * - Banning users (external systems)
 * - Rate limiting (external systems)
 * - IP blocking (external systems)
 * - Anti-cheat detection (external systems)
 * - Modifying gameplay, balances, or player state
 *
 * Security is a PROTECTION layer that ONLY:
 * - Detects threats
 * - Evaluates policies
 * - Creates incidents
 * - Manages sessions
 * - Tracks violations
 * - Protects against brute force
 * - Detects fraud
 * - Evaluates permissions
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
export { registerSecurityDependencies, setupSecurityDomain, SECURITY_TOKENS } from './di';
