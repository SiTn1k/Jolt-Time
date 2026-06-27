/**
 * Authentication Service
 *
 * High-level authentication service that orchestrates all auth operations.
 */

import type {
  UserIdentity,
  Session,
  AuthenticationRequest,
  AuthContext,
  AuthProvider,
} from '../types';
import type { AuthenticationProvider, AuthenticationResult } from '../providers/authentication.provider';
import type { SessionProvider } from '../providers/session.provider';
import type { IdentityProvider } from '../providers/identity.provider';

/**
 * Authentication service configuration.
 */
export interface AuthServiceConfig {
  defaultSessionTtlSeconds?: number;
  requirePremiumForFeatures?: boolean;
}

/**
 * Result of logout operation.
 */
export interface LogoutResult {
  success: boolean;
  sessionsRevoked: number;
}

/**
 * High-level authentication service.
 */
export class AuthService {
  private readonly authProvider: AuthenticationProvider;
  private readonly sessionProvider: SessionProvider;
  private readonly identityProvider: IdentityProvider;
  private readonly requirePremium: boolean;

  constructor(
    authProvider: AuthenticationProvider,
    sessionProvider: SessionProvider,
    identityProvider: IdentityProvider,
    config: AuthServiceConfig = {}
  ) {
    this.authProvider = authProvider;
    this.sessionProvider = sessionProvider;
    this.identityProvider = identityProvider;
    this.requirePremium = config.requirePremiumForFeatures ?? false;
  }

  /**
   * Authenticate a user with Telegram initData.
   */
  async authenticate(request: AuthenticationRequest): Promise<AuthenticationResult> {
    return this.authProvider.authenticate(request);
  }

  /**
   * Authenticate from existing session token.
   */
  async authenticateFromSession(sessionToken: string): Promise<AuthenticationResult> {
    return this.authProvider.authenticateFromSession(sessionToken);
  }

  /**
   * Get authentication context for a session.
   */
  async getContext(sessionToken: string): Promise<AuthContext> {
    return this.authProvider.getContext(sessionToken);
  }

  /**
   * Validate a session token and return the session.
   */
  async validateSession(sessionToken: string): Promise<Session> {
    return this.sessionProvider.validateSession(sessionToken);
  }

  /**
   * Refresh a session.
   */
  async refreshSession(sessionToken: string): Promise<Session> {
    return this.sessionProvider.refreshSession(sessionToken);
  }

  /**
   * Logout a session.
   */
  async logout(sessionToken: string): Promise<void> {
    await this.authProvider.logout(sessionToken);
  }

  /**
   * Logout from all sessions.
   */
  async logoutAll(internalUserId: string): Promise<number> {
    return this.authProvider.logoutAll(internalUserId);
  }

  /**
   * Get the current user identity.
   */
  async resolveCurrentUser(sessionToken: string): Promise<UserIdentity | null> {
    const context = await this.getContext(sessionToken);
    return context.user;
  }

  /**
   * Get user identity by internal ID.
   */
  async getUserById(id: string): Promise<UserIdentity | null> {
    return this.identityProvider.getById(id);
  }

  /**
   * Get user identity by Telegram ID.
   */
  async getUserByTelegramId(telegramId: number): Promise<UserIdentity | null> {
    return this.identityProvider.getByTelegramId(telegramId);
  }

  /**
   * Check if user has premium status.
   */
  async isPremium(sessionToken: string): Promise<boolean> {
    const context = await this.getContext(sessionToken);
    return context.isPremium;
  }

  /**
   * Get all sessions for a user.
   */
  async getUserSessions(internalUserId: string): Promise<Session[]> {
    return this.sessionProvider.getUserSessions(internalUserId);
  }

  /**
   * Revoke a specific session.
   */
  async revokeSession(sessionId: string): Promise<void> {
    await this.sessionProvider.revokeSession(sessionId);
  }

  /**
   * Revoke all sessions except the current one.
   */
  async revokeOtherSessions(internalUserId: string, currentSessionId: string): Promise<number> {
    const sessions = await this.getUserSessions(internalUserId);
    let revoked = 0;

    for (const session of sessions) {
      if (session.id !== currentSessionId) {
        await this.sessionProvider.revokeSession(session.id);
        revoked++;
      }
    }

    return revoked;
  }
}

/**
 * Global auth service instance.
 */
let globalAuthService: AuthService | null = null;

/**
 * Get or create the global auth service.
 */
export function getAuthService(
  authProvider?: AuthenticationProvider,
  sessionProvider?: SessionProvider,
  identityProvider?: IdentityProvider
): AuthService {
  if (!globalAuthService && authProvider && sessionProvider && identityProvider) {
    globalAuthService = new AuthService(authProvider, sessionProvider, identityProvider);
  }
  if (!globalAuthService) {
    throw new Error('AuthService not initialized. Provide all providers.');
  }
  return globalAuthService;
}

/**
 * Reset the global auth service (for testing).
 */
export function resetAuthService(): void {
  globalAuthService = null;
}