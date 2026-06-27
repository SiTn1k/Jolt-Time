/**
 * Session Validator
 *
 * Validates session tokens and session state.
 */

import { SessionStatus } from '../types';
import type { Session, SessionToken } from '../types';
import { SessionErrors } from '../errors';

/**
 * Session validation result.
 */
export interface SessionValidationResult {
  valid: boolean;
  session?: Session;
  error?: ReturnType<typeof SessionErrors.notFound>;
}

/**
 * Session validator configuration.
 */
export interface SessionValidatorConfig {
  maxSessionAgeSeconds?: number;
  allowExpiredSessions?: boolean;
}

/**
 * Session validator class.
 */
export class SessionValidator {
  private readonly maxSessionAgeSeconds: number;
  private readonly allowExpiredSessions: boolean;

  constructor(config: SessionValidatorConfig = {}) {
    this.maxSessionAgeSeconds = config.maxSessionAgeSeconds ?? 86400; // 24 hours default
    this.allowExpiredSessions = config.allowExpiredSessions ?? false;
  }

  /**
   * Validate a session token and return the session if valid.
   */
  validate(session: Session | null): SessionValidationResult {
    if (!session) {
      return {
        valid: false,
        error: SessionErrors.notFound(),
      };
    }

    // Check session status
    if (session.status === SessionStatus.REVOKED) {
      return {
        valid: false,
        error: SessionErrors.revoked(session.id),
      };
    }

    if (session.status === SessionStatus.SUSPENDED) {
      return {
        valid: false,
        error: SessionErrors.suspended(session.id),
      };
    }

    // Check expiration
    const now = new Date();
    if (session.expiresAt <= now) {
      if (this.allowExpiredSessions) {
        // Mark as expired but still allow validation
        const expiredSession: Session = {
          ...session,
          status: SessionStatus.EXPIRED,
        };
        return {
          valid: true,
          session: expiredSession,
        };
      }
      return {
        valid: false,
        error: SessionErrors.expired(session.id),
      };
    }

    return {
      valid: true,
      session,
    };
  }

  /**
   * Check if a session token format is valid.
   */
  isValidTokenFormat(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }

    // Basic format validation: should be a non-empty string
    // In production, this could be JWT or a secure random string
    if (token.length < 32) {
      return false;
    }

    // Check for valid characters (alphanumeric, dash, underscore)
    return /^[A-Za-z0-9_-]+$/.test(token);
  }

  /**
   * Calculate remaining time until session expiration.
   */
  getRemainingTTL(session: Session): number {
    const now = Date.now();
    const expiresAt = session.expiresAt.getTime();
    return Math.max(0, expiresAt - now);
  }

  /**
   * Check if a session needs refresh.
   */
  needsRefresh(session: Session, refreshThresholdSeconds = 3600): boolean {
    const remainingTTL = this.getRemainingTTL(session);
    return remainingTTL < refreshThresholdSeconds * 1000;
  }
}

/**
 * Global session validator instance.
 */
let globalSessionValidator: SessionValidator | null = null;

/**
 * Get the global session validator.
 */
export function getSessionValidator(config?: SessionValidatorConfig): SessionValidator {
  if (!globalSessionValidator) {
    globalSessionValidator = new SessionValidator(config);
  }
  return globalSessionValidator;
}

/**
 * Reset the global session validator (for testing).
 */
export function resetSessionValidator(): void {
  globalSessionValidator = null;
}