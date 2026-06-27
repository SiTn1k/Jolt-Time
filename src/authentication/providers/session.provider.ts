/**
 * Session Provider
 *
 * Provides session management operations.
 */

import type { Session, SessionToken } from '../types';
import type { SessionService } from '../services/session.service';

/**
 * Session provider for managing user sessions.
 */
export class SessionProvider {
  private readonly sessionService: SessionService;

  constructor(sessionService: SessionService) {
    this.sessionService = sessionService;
  }

  /**
   * Validate a session token.
   */
  async validateSession(token: SessionToken): Promise<Session> {
    const result = await this.sessionService.validate(token);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  /**
   * Refresh a session.
   */
  async refreshSession(token: SessionToken): Promise<Session> {
    const result = await this.sessionService.refresh(token);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  /**
   * Revoke a session.
   */
  async revokeSession(sessionId: string): Promise<void> {
    const result = await this.sessionService.revoke(sessionId);
    if (!result.success) {
      throw result.error;
    }
  }

  /**
   * Revoke all sessions for a user.
   */
  async revokeAllSessions(userId: string): Promise<number> {
    const result = await this.sessionService.revokeAll(userId);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  /**
   * Get all active sessions for a user.
   */
  async getUserSessions(userId: string): Promise<Session[]> {
    const result = await this.sessionService.getActiveSessions(userId);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  /**
   * Get a session by ID.
   */
  async getSession(sessionId: string): Promise<Session | null> {
    const result = await this.sessionService.get(sessionId);
    if (!result.success) {
      return null;
    }
    return result.data;
  }

  /**
   * Touch a session to update last accessed time (refresh without extending TTL much).
   */
  async touchSession(token: SessionToken): Promise<void> {
    // Touch is just a refresh with the same TTL
    const result = await this.sessionService.refresh(token, 0);
    if (!result.success) {
      throw result.error;
    }
  }
}

/**
 * Global session provider instance.
 */
let globalSessionProvider: SessionProvider | null = null;

/**
 * Get or create the global session provider.
 */
export function getSessionProvider(sessionService?: SessionService): SessionProvider {
  if (!globalSessionProvider && sessionService) {
    globalSessionProvider = new SessionProvider(sessionService);
  }
  if (!globalSessionProvider) {
    throw new Error('SessionProvider not initialized. Provide sessionService.');
  }
  return globalSessionProvider;
}

/**
 * Reset the global session provider (for testing).
 */
export function resetSessionProvider(): void {
  globalSessionProvider = null;
}
