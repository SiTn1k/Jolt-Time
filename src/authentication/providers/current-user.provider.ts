/**
 * Current User Provider
 *
 * Provides access to the current authenticated user in the request context.
 */

import type { UserIdentity, AuthContext, Session } from '../types';
import type { AuthenticationProvider } from './authentication.provider';

/**
 * Current user provider for accessing the authenticated user.
 */
export class CurrentUserProvider {
  private readonly authProvider: AuthenticationProvider;
  private currentContext: AuthContext | null = null;

  constructor(authProvider: AuthenticationProvider) {
    this.authProvider = authProvider;
  }

  /**
   * Get the current user if authenticated.
   */
  getCurrentUser(): UserIdentity | null {
    return this.currentContext?.user ?? null;
  }

  /**
   * Get the current session if authenticated.
   */
  getCurrentSession(): Session | null {
    return this.currentContext?.session ?? null;
  }

  /**
   * Get the full authentication context.
   */
  getContext(): AuthContext | null {
    return this.currentContext;
  }

  /**
   * Check if the current user is authenticated.
   */
  isAuthenticated(): boolean {
    return this.currentContext?.isAuthenticated ?? false;
  }

  /**
   * Check if the current user has premium status.
   */
  isPremium(): boolean {
    return this.currentContext?.isPremium ?? false;
  }

  /**
   * Get the current user ID.
   */
  getUserId(): string | null {
    return this.currentContext?.user?.internalUserId ?? null;
  }

  /**
   * Get the current user Telegram ID.
   */
  getTelegramId(): number | null {
    return this.currentContext?.user?.telegramId ?? null;
  }

  /**
   * Set the authentication context for the current request.
   */
  setContext(context: AuthContext): void {
    this.currentContext = context;
  }

  /**
   * Clear the authentication context.
   */
  clearContext(): void {
    this.currentContext = null;
  }

  /**
   * Load authentication context from session token.
   */
  async loadContext(sessionToken: string): Promise<AuthContext> {
    const context = await this.authProvider.getContext(sessionToken);
    this.setContext(context);
    return context;
  }

  /**
   * Require authentication - throws if not authenticated.
   */
  requireAuthentication(): UserIdentity {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('Authentication required');
    }
    return user;
  }

  /**
   * Require premium status - throws if not premium.
   */
  requirePremium(): UserIdentity {
    const user = this.requireAuthentication();
    if (!user.isPremium) {
      throw new Error('Premium subscription required');
    }
    return user;
  }
}

/**
 * Global current user provider instance.
 */
let globalCurrentUserProvider: CurrentUserProvider | null = null;

/**
 * Get or create the global current user provider.
 */
export function getCurrentUserProvider(authProvider?: AuthenticationProvider): CurrentUserProvider {
  if (!globalCurrentUserProvider && authProvider) {
    globalCurrentUserProvider = new CurrentUserProvider(authProvider);
  }
  if (!globalCurrentUserProvider) {
    throw new Error('CurrentUserProvider not initialized. Provide authProvider.');
  }
  return globalCurrentUserProvider;
}

/**
 * Reset the global current user provider (for testing).
 */
export function resetCurrentUserProvider(): void {
  globalCurrentUserProvider = null;
}