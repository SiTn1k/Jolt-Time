/**
 * Authentication Module
 *
 * Production Authentication System for Jolt Time.
 * This module provides secure authentication using Telegram Mini App initData.
 *
 * ## Usage
 *
 * ```typescript
 * import { setupAuthentication, AuthMiddleware } from './authentication';
 *
 * // Setup authentication
 * const { authService, authMiddleware } = setupAuthentication();
 *
 * // Use middleware in Express routes
 * app.get('/protected', authMiddleware.requireAuth(), (req, res) => {
 *   const user = (req as AuthenticatedRequest).user;
 *   res.json({ userId: user.internalUserId });
 * });
 * ```
 *
 * ## Security Features
 *
 * - Telegram initData validation with signature verification
 * - Session management with secure tokens
 * - Replay attack protection via nonce validation
 * - Rate limiting
 * - Security event logging
 * - Multi-device session support
 */

 /**
 * Types
 */
export * from './types';

/**
 * DTOs
 */
export * from './dto';

/**
 * Errors
 */
export * from './errors';

/**
 * Validators
 */
export * from './validators';

/**
 * Repositories
 */
export * from './repositories';

/**
 * Services
 */
export * from './services';

/**
 * Providers
 */
export * from './providers';

/**
 * Guards
 */
export * from './guards';

/**
 * Middleware
 */
export * from './middleware';

/**
 * DI Registration
 */
export * from './di';

/**
 * Authenticated request type for middleware.
 */
export type { AuthenticatedRequest } from './middleware/auth.middleware';