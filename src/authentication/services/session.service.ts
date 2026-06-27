/**
 * Session Service
 *
 * Manages user sessions including creation, refresh, validation, and revocation.
 */

import { randomBytes } from 'crypto';
import { SessionStatus } from '../types';
import type {
  Session,
  SessionToken,
  AuthProvider,
} from '../types';
import type { ISessionRepository } from '../repositories';
import { SessionValidator, SessionValidatorConfig } from '../validators';

/**
 * Session service configuration.
 */
export interface SessionServiceConfig {
  /** Default session TTL in seconds. Default: 86400 (24 hours) */
  defaultTtlSeconds?: number;
  /** Maximum session TTL in seconds. Default: 604800 (7 days) */
  maxTtlSeconds?: number;
  /** Enable session refresh on activity. Default: true */
  refreshOnActivity?: boolean;
  /** Session token length in bytes. Default: 32 */
  tokenLengthBytes?: number;
}

/**
 * Input for creating a session.
 */
export interface CreateSessionInput {
  internalUserId: string;
  provider: AuthProvider;
  telegramId?: number;
  deviceInfo?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Default session service configuration.
 */
const DEFAULT_CONFIG: Required<SessionServiceConfig> = {
  defaultTtlSeconds: 86400,
  maxTtlSeconds: 604800,
  refreshOnActivity: true,
  tokenLengthBytes: 32,
};

/**
 * Result type for session operations.
 */
export type SessionResult<T> =
  | { success: true; data: T }
  | { success: false; error: Error };

/**
 * Session service for managing user sessions.
 */
export class SessionService {
  private readonly config: Required<SessionServiceConfig>;
  private readonly sessionRepository: ISessionRepository;
  private readonly validator: SessionValidator;

  constructor(
    sessionRepository: ISessionRepository,
    config?: SessionServiceConfig
  ) {
    this.sessionRepository = sessionRepository;
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    const validatorConfig: SessionValidatorConfig = {
      maxSessionAgeSeconds: this.config.defaultTtlSeconds,
      allowExpiredSessions: false,
    };
    this.validator = new SessionValidator(validatorConfig);
  }

  /**
   * Create a new session.
   */
  async create(input: CreateSessionInput): Promise<SessionResult<Session>> {
    try {
      const token = this.generateToken();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + this.config.defaultTtlSeconds * 1000);

      const session = await this.sessionRepository.create({
        id: token,
        internalUserId: input.internalUserId,
        token,
        provider: input.provider,
        status: SessionStatus.ACTIVE,
        createdAt: now,
        updatedAt: now,
        expiresAt,
        lastAccessedAt: now,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        deviceInfo: input.deviceInfo,
        telegramId: input.telegramId,
      });

      if (!session.success) {
        return { success: false, error: session.error };
      }

      return { success: true, data: session.data };
    } catch (err) {
      return { success: false, error: err as Error };
    }
  }

  /**
   * Get session by token.
   */
  async get(token: string): Promise<SessionResult<Session>> {
    const result = await this.sessionRepository.findByToken(token);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    if (!result.data) {
      return { success: false, error: new Error('Session not found') };
    }
    return { success: true, data: result.data };
  }

  /**
   * Validate session token.
   */
  async validate(token: string): Promise<SessionResult<Session>> {
    const result = await this.sessionRepository.findByToken(token);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    if (!result.data) {
      return { success: false, error: new Error('Session not found') };
    }
    
    const validation = this.validator.validate(result.data);
    if (!validation.valid || !validation.session) {
      return { success: false, error: validation.error || new Error('Session validation failed') };
    }
    return { success: true, data: validation.session };
  }

  /**
   * Refresh session TTL.
   */
  async refresh(token: string, extendTtl?: number): Promise<SessionResult<Session>> {
    const ttl = extendTtl ?? this.config.defaultTtlSeconds;
    const clampedTtl = Math.min(ttl, this.config.maxTtlSeconds);

    const newExpiresAt = new Date(Date.now() + clampedTtl * 1000);
    const result = await this.sessionRepository.update(token, {
      expiresAt: newExpiresAt,
      refreshedAt: new Date(),
      lastAccessedAt: new Date(),
    });

    if (!result.success) {
      return { success: false, error: result.error };
    }
    if (!result.data) {
      return { success: false, error: new Error('Session not found') };
    }

    return { success: true, data: result.data };
  }

  /**
   * Revoke session (logout).
   */
  async revoke(token: string): Promise<SessionResult<void>> {
    const result = await this.sessionRepository.updateStatus(token, SessionStatus.REVOKED);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return { success: true, data: undefined };
  }

  /**
   * Revoke all sessions for a user.
   */
  async revokeAll(userId: string): Promise<SessionResult<number>> {
    const result = await this.sessionRepository.revokeAllForUser(userId);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return { success: true, data: result.data };
  }

  /**
   * Expire sessions that have passed their expiration time.
   */
  async expireStale(): Promise<SessionResult<number>> {
    const result = await this.sessionRepository.deleteExpired(new Date());
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return { success: true, data: result.data };
  }

  /**
   * Get active sessions for a user.
   */
  async getActiveSessions(userId: string): Promise<SessionResult<Session[]>> {
    const result = await this.sessionRepository.findActiveByUserId(userId);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return { success: true, data: result.data };
  }

  /**
   * Generate a secure session token.
   */
  private generateToken(): string {
    return `sess_${randomBytes(this.config.tokenLengthBytes).toString('hex')}`;
  }
}

/**
 * Create a session service instance.
 */
export function createSessionService(
  sessionRepository: ISessionRepository,
  config?: SessionServiceConfig
): SessionService {
  return new SessionService(sessionRepository, config);
}
