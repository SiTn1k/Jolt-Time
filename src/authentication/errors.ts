/**
 * Authentication Errors
 *
 * Custom error classes for authentication-related errors.
 */

import { ApplicationError } from '../shared/errors/application.error';
import { ErrorCategory, ErrorSeverity } from '../shared/constants/enums';
import type { AuthErrorCode } from './types';

/**
 * Authentication error with full context support.
 */
export class AuthApplicationError extends ApplicationError {
  constructor(params: {
    message: string;
    code: string;
    details?: Record<string, unknown>;
    recoverable?: boolean;
    context?: Record<string, unknown>;
    cause?: Error;
  }) {
    super({
      message: params.message,
      code: params.code,
      category: ErrorCategory.SECURITY,
      severity: params.recoverable !== false ? ErrorSeverity.MEDIUM : ErrorSeverity.HIGH,
      details: params.details,
      recoverable: params.recoverable ?? true,
      context: params.context,
      cause: params.cause,
    });
    Object.defineProperty(this, 'name', { value: 'AuthApplicationError' });
  }
}

/**
 * Factory for creating authentication errors.
 */
export const AuthErrors = {
  /**
   * Invalid initData format.
   */
  invalidInitData(cause?: Error): AuthApplicationError {
    return new AuthApplicationError({
      message: 'Invalid initData format',
      code: 'AUTH_001',
      details: { field: 'initData' },
      recoverable: true,
      cause,
    });
  },

  /**
   * Invalid signature.
   */
  invalidSignature(cause?: Error): AuthApplicationError {
    return new AuthApplicationError({
      message: 'Telegram initData signature verification failed',
      code: 'AUTH_002',
      details: { validation: 'signature' },
      recoverable: true,
      cause,
    });
  },

  /**
   * Expired signature.
   */
  signatureExpired(authDate: Date, maxAge: number, cause?: Error): AuthApplicationError {
    return new AuthApplicationError({
      message: 'Telegram initData has expired',
      code: 'AUTH_003',
      details: { authDate: authDate.toISOString(), maxAgeSeconds: maxAge },
      recoverable: true,
      cause,
    });
  },

  /**
   * Replay attack detected.
   */
  replayDetected(nonce: string, cause?: Error): AuthApplicationError {
    return new AuthApplicationError({
      message: 'Replay attack detected - nonce has been used before',
      code: 'AUTH_004',
      details: { nonce: nonce.substring(0, 8) + '...' },
      recoverable: false,
      cause,
    });
  },

  /**
   * Session not found.
   */
  sessionNotFound(sessionId?: string, cause?: Error): AuthApplicationError {
    return new AuthApplicationError({
      message: 'Session not found',
      code: 'AUTH_005',
      details: { sessionId },
      recoverable: true,
      cause,
    });
  },

  /**
   * Session expired.
   */
  sessionExpired(sessionId?: string, cause?: Error): AuthApplicationError {
    return new AuthApplicationError({
      message: 'Session has expired',
      code: 'AUTH_006',
      details: { sessionId },
      recoverable: true,
      cause,
    });
  },

  /**
   * Session revoked.
   */
  sessionRevoked(sessionId?: string, cause?: Error): AuthApplicationError {
    return new AuthApplicationError({
      message: 'Session has been revoked',
      code: 'AUTH_007',
      details: { sessionId },
      recoverable: true,
      cause,
    });
  },

  /**
   * User not found.
   */
  userNotFound(identifier: string | number, cause?: Error): AuthApplicationError {
    return new AuthApplicationError({
      message: 'User not found',
      code: 'AUTH_008',
      details: { identifier: String(identifier).substring(0, 8) + '...' },
      recoverable: true,
      cause,
    });
  },

  /**
   * Rate limit exceeded.
   */
  rateLimited(retryAfter?: number, cause?: Error): AuthApplicationError {
    return new AuthApplicationError({
      message: 'Rate limit exceeded. Please try again later.',
      code: 'AUTH_009',
      details: { retryAfterSeconds: retryAfter },
      recoverable: true,
      cause,
    });
  },

  /**
   * Unauthorized access.
   */
  unauthorized(resource?: string, cause?: Error): AuthApplicationError {
    return new AuthApplicationError({
      message: 'Authentication required',
      code: 'AUTH_010',
      details: { resource },
      recoverable: true,
      cause,
    });
  },

  /**
   * Forbidden access.
   */
  forbidden(resource?: string, requiredPermissions?: string[], cause?: Error): AuthApplicationError {
    return new AuthApplicationError({
      message: 'Access denied - insufficient permissions',
      code: 'AUTH_011',
      details: { resource, requiredPermissions },
      recoverable: true,
      cause,
    });
  },

  /**
   * Invalid token.
   */
  invalidToken(tokenType: string, cause?: Error): AuthApplicationError {
    return new AuthApplicationError({
      message: 'Invalid authentication token',
      code: 'AUTH_012',
      details: { tokenType },
      recoverable: true,
      cause,
    });
  },

  /**
   * Authentication failed.
   */
  authenticationFailed(reason?: string, cause?: Error): AuthApplicationError {
    return new AuthApplicationError({
      message: reason ?? 'Authentication failed',
      code: 'AUTH_013',
      details: { reason },
      recoverable: true,
      cause,
    });
  },
} as const;

/**
 * Authorization error with permission context.
 */
export class AuthorizationApplicationError extends ApplicationError {
  public readonly requiredPermissions: readonly string[];

  constructor(params: {
    message: string;
    requiredPermissions: readonly string[];
    context?: Record<string, unknown>;
    cause?: Error;
  }) {
    super({
      message: params.message,
      code: 'AUTH_011',
      category: ErrorCategory.SECURITY,
      severity: ErrorSeverity.MEDIUM,
      details: { requiredPermissions: params.requiredPermissions },
      recoverable: true,
      context: params.context,
      cause: params.cause,
    });
    Object.defineProperty(this, 'name', { value: 'AuthorizationApplicationError' });
    this.requiredPermissions = params.requiredPermissions;
  }
}

/**
 * Factory for creating authorization errors.
 */
export const AuthorizationErrors = {
  /**
   * Access denied due to missing permissions.
   */
  accessDenied(requiredPermissions: readonly string[]): AuthorizationApplicationError {
    return new AuthorizationApplicationError({
      message: 'Access denied - insufficient permissions',
      requiredPermissions,
    });
  },

  /**
   * Role required but not found.
   */
  roleRequired(roleName: string): AuthorizationApplicationError {
    return new AuthorizationApplicationError({
      message: `Role '${roleName}' is required`,
      requiredPermissions: [],
    });
  },

  /**
   * Admin access required.
   */
  adminRequired(): AuthorizationApplicationError {
    return new AuthorizationApplicationError({
      message: 'Administrator access required',
      requiredPermissions: ['admin:access'],
    });
  },
} as const;

/**
 * Session error for session-related failures.
 */
export class SessionApplicationError extends ApplicationError {
  public readonly sessionId?: string;

  constructor(params: {
    message: string;
    sessionId?: string;
    context?: Record<string, unknown>;
    cause?: Error;
  }) {
    super({
      message: params.message,
      code: 'AUTH_005',
      category: ErrorCategory.SECURITY,
      severity: ErrorSeverity.MEDIUM,
      details: { sessionId: params.sessionId },
      recoverable: true,
      context: params.context,
      cause: params.cause,
    });
    Object.defineProperty(this, 'name', { value: 'SessionApplicationError' });
    this.sessionId = params.sessionId;
  }
}

/**
 * Factory for creating session errors.
 */
export const SessionErrors = {
  /**
   * Session not found.
   */
  notFound(sessionId?: string): SessionApplicationError {
    return new SessionApplicationError({
      message: 'Session not found',
      sessionId,
    });
  },

  /**
   * Session expired.
   */
  expired(sessionId?: string): SessionApplicationError {
    return new SessionApplicationError({
      message: 'Session has expired',
      sessionId,
    });
  },

  /**
   * Session revoked.
   */
  revoked(sessionId?: string): SessionApplicationError {
    return new SessionApplicationError({
      message: 'Session has been revoked',
      sessionId,
    });
  },

  /**
   * Session suspended.
   */
  suspended(sessionId?: string): SessionApplicationError {
    return new SessionApplicationError({
      message: 'Session has been suspended',
      sessionId,
    });
  },

  /**
   * Invalid session token.
   */
  invalidToken(): SessionApplicationError {
    return new SessionApplicationError({
      message: 'Invalid session token',
    });
  },
} as const;

/**
 * Security error for security-related violations.
 */
export class SecurityApplicationError extends ApplicationError {
  public readonly eventType: string;
  public override readonly severity: ErrorSeverity;

  constructor(params: {
    message: string;
    eventType: string;
    severity: ErrorSeverity;
    details?: Record<string, unknown>;
    context?: Record<string, unknown>;
    cause?: Error;
  }) {
    super({
      message: params.message,
      code: 'AUTH_004',
      category: ErrorCategory.SECURITY,
      severity: params.severity,
      details: params.details,
      recoverable: false,
      context: params.context,
      cause: params.cause,
    });
    Object.defineProperty(this, 'name', { value: 'SecurityApplicationError' });
    this.eventType = params.eventType;
    this.severity = params.severity;
  }
}

/**
 * Factory for creating security errors.
 */
export const SecurityErrors = {
  /**
   * Invalid signature detected.
   */
  invalidSignature(): SecurityApplicationError {
    return new SecurityApplicationError({
      message: 'Invalid cryptographic signature detected',
      eventType: 'invalid_signature',
      severity: ErrorSeverity.HIGH,
    });
  },

  /**
   * Replay attack detected.
   */
  replayAttack(nonce: string): SecurityApplicationError {
    return new SecurityApplicationError({
      message: 'Replay attack detected',
      eventType: 'replay_attack_detected',
      severity: ErrorSeverity.CRITICAL,
      details: { nonce: nonce.substring(0, 8) + '...' },
    });
  },

  /**
   * Rate limit exceeded.
   */
  rateLimitExceeded(endpoint: string, retryAfter?: number): SecurityApplicationError {
    return new SecurityApplicationError({
      message: 'Rate limit exceeded',
      eventType: 'rate_limit_exceeded',
      severity: ErrorSeverity.MEDIUM,
      details: { endpoint, retryAfterSeconds: retryAfter },
    });
  },

  /**
   * Suspicious activity detected.
   */
  suspiciousActivity(description: string, details?: Record<string, unknown>): SecurityApplicationError {
    return new SecurityApplicationError({
      message: 'Suspicious activity detected',
      eventType: 'suspicious_activity',
      severity: ErrorSeverity.HIGH,
      details: { description, ...details },
    });
  },

  /**
   * Authentication bypass attempt.
   */
  bypassAttempt(endpoint: string): SecurityApplicationError {
    return new SecurityApplicationError({
      message: 'Authentication bypass attempt detected',
      eventType: 'bypass_attempt',
      severity: ErrorSeverity.CRITICAL,
      details: { endpoint },
    });
  },
} as const;