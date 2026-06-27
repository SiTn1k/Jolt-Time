/**
 * Authentication Provider
 *
 * Main provider that orchestrates authentication operations.
 * This is the primary entry point for authentication functionality.
 */

import {
  UserIdentity,
  Session,
  AuthProvider,
  TelegramUser,
  AuthenticationRequest,
  AuthContext,
  SecurityEventType,
  SecurityEventSeverity,
  SessionStatus,
} from '../types';
import type { ISessionRepository, IUserIdentityRepository, ILoginHistoryRepository, ISecurityEventRepository } from '../repositories';
import type { TelegramInitData } from '../types';
import { TelegramInitDataValidator } from '../validators';
import { SessionService } from '../services/session.service';
import { AuthErrors, SecurityErrors } from '../errors';
import { randomBytes } from 'crypto';

/**
 * Authentication provider configuration.
 */
export interface AuthenticationProviderConfig {
  sessionTtlSeconds?: number;
  maxSessionsPerUser?: number;
  requirePremium?: boolean;
}

/**
 * Authentication result with full context.
 */
export interface AuthenticationResult {
  success: boolean;
  user?: UserIdentity;
  session?: Session;
  error?: ReturnType<typeof AuthErrors.authenticationFailed>;
}

/**
 * Main authentication provider.
 */
export class AuthenticationProvider {
  private readonly sessionService: SessionService;
  private readonly sessionRepository: ISessionRepository;
  private readonly userIdentityRepository: IUserIdentityRepository;
  private readonly loginHistoryRepository: ILoginHistoryRepository;
  private readonly securityEventRepository: ISecurityEventRepository;
  private readonly telegramValidator: TelegramInitDataValidator;
  private readonly requirePremium: boolean;

  constructor(
    sessionService: SessionService,
    sessionRepository: ISessionRepository,
    userIdentityRepository: IUserIdentityRepository,
    loginHistoryRepository: ILoginHistoryRepository,
    securityEventRepository: ISecurityEventRepository,
    config: AuthenticationProviderConfig = {}
  ) {
    this.sessionService = sessionService;
    this.sessionRepository = sessionRepository;
    this.userIdentityRepository = userIdentityRepository;
    this.loginHistoryRepository = loginHistoryRepository;
    this.securityEventRepository = securityEventRepository;
    this.telegramValidator = new TelegramInitDataValidator({
      allowNonPremium: !config.requirePremium,
    });
    this.requirePremium = config.requirePremium ?? false;
  }

  /**
   * Authenticate a user using Telegram initData.
   */
  async authenticate(request: AuthenticationRequest): Promise<AuthenticationResult> {
    const { initData, deviceInfo } = request;

    try {
      // Validate initData
      const validation = this.telegramValidator.validate(initData);
      if (!validation.valid || !validation.initData) {
        await this.logSecurityEvent(
          SecurityEventType.INVALID_SIGNATURE,
          null,
          null,
          { reason: 'Invalid initData' },
          SecurityEventSeverity.HIGH
        );
        return {
          success: false,
          error: validation.error ?? AuthErrors.authenticationFailed('Invalid initData'),
        };
      }

      const initDataParsed = validation.initData;
      const telegramUser = TelegramInitDataValidator.extractUser(initDataParsed);

      // Find or create user identity
      let identity = await this.findOrCreateUserIdentity(telegramUser, AuthProvider.TELEGRAM);

      // Create session
      const sessionResult = await this.sessionService.create({
        internalUserId: identity.internalUserId,
        provider: AuthProvider.TELEGRAM,
        telegramId: telegramUser.id,
        deviceInfo,
      });

      if (!sessionResult.success || !sessionResult.data) {
        await this.logSecurityEvent(
          SecurityEventType.LOGIN_FAILED,
          identity.internalUserId,
          telegramUser.id,
          { reason: 'Failed to create session' },
          SecurityEventSeverity.ERROR
        );
        return {
          success: false,
          error: AuthErrors.authenticationFailed('Failed to create session'),
        };
      }

      const session = sessionResult.data;

      // Update last authenticated timestamp
      await this.userIdentityRepository.update(identity.id, {
        lastAuthenticatedAt: new Date(),
      });

      // Log successful login
      await this.logLoginHistory(identity.internalUserId, telegramUser.id, AuthProvider.TELEGRAM, true);
      await this.logSecurityEvent(
        SecurityEventType.LOGIN_SUCCESS,
        identity.internalUserId,
        telegramUser.id,
        { provider: AuthProvider.TELEGRAM },
        SecurityEventSeverity.INFO
      );

      // Refresh identity
      const identityResult = await this.userIdentityRepository.findById(identity.id);
      if (identityResult.success && identityResult.data) {
        identity = identityResult.data;
      }

      return {
        success: true,
        user: identity,
        session,
      };
    } catch (err) {
      const error = err as Error;
      await this.logSecurityEvent(
        SecurityEventType.LOGIN_FAILED,
        null,
        null,
        { error: error.message },
        SecurityEventSeverity.ERROR
      );
      return {
        success: false,
        error: AuthErrors.authenticationFailed(error.message, error),
      };
    }
  }

  /**
   * Authenticate from existing session token.
   */
  async authenticateFromSession(sessionToken: string): Promise<AuthenticationResult> {
    try {
      const sessionResult = await this.sessionService.validate(sessionToken);
      
      if (!sessionResult.success) {
        return {
          success: false,
          error: AuthErrors.authenticationFailed(sessionResult.error.message),
        };
      }
      
      const session = sessionResult.data;

      // Get user identity
      const identityResult = await this.userIdentityRepository.findById(session.internalUserId);
      if (!identityResult.success || !identityResult.data) {
        return {
          success: false,
          error: AuthErrors.userNotFound(session.internalUserId),
        };
      }

      return {
        success: true,
        user: identityResult.data,
        session,
      };
    } catch (err) {
      return {
        success: false,
        error: AuthErrors.authenticationFailed((err as Error).message, err as Error),
      };
    }
  }

  /**
   * Get the current authentication context.
   */
  async getContext(sessionToken: string): Promise<AuthContext> {
    try {
      const sessionResult = await this.sessionService.validate(sessionToken);
      
      if (!sessionResult.success || !sessionResult.data) {
        return {
          user: null,
          session: null,
          isAuthenticated: false,
          isPremium: false,
        };
      }
      
      const session = sessionResult.data;
      const identityResult = await this.userIdentityRepository.findById(session.internalUserId);

      if (!identityResult.success || !identityResult.data) {
        return {
          user: null,
          session: null,
          isAuthenticated: false,
          isPremium: false,
        };
      }

      return {
        user: identityResult.data,
        session,
        isAuthenticated: true,
        isPremium: identityResult.data.isPremium,
      };
    } catch {
      return {
        user: null,
        session: null,
        isAuthenticated: false,
        isPremium: false,
      };
    }
  }

  /**
   * Logout a session.
   */
  async logout(sessionToken: string): Promise<void> {
    try {
      const session = await this.sessionRepository.findByToken(sessionToken);
      if (session.success && session.data) {
        await this.logSecurityEvent(
          SecurityEventType.SESSION_REVOKED,
          session.data.internalUserId,
          session.data.telegramId,
          { sessionId: session.data.id },
          SecurityEventSeverity.INFO
        );
      }
      await this.sessionService.revoke(sessionToken);
    } catch {
      // Ignore errors during logout
    }
  }

  /**
   * Logout from all sessions.
   */
  async logoutAll(internalUserId: string): Promise<number> {
    const result = await this.sessionService.revokeAll(internalUserId);
    const count = result.success ? result.data : 0;
    await this.logSecurityEvent(
      SecurityEventType.SESSION_REVOKED,
      internalUserId,
      null,
      { allSessions: true, count },
      SecurityEventSeverity.INFO
    );
    return count;
  }

  /**
   * Find or create user identity from Telegram user.
   */
  private async findOrCreateUserIdentity(
    telegramUser: TelegramUser,
    provider: AuthProvider
  ): Promise<UserIdentity> {
    // Try to find existing identity by Telegram ID
    const existingResult = await this.userIdentityRepository.findByTelegramId(telegramUser.id);

    if (existingResult.success && existingResult.data) {
      return existingResult.data;
    }

    // Create new identity
    const now = new Date();
    const identityData: Partial<UserIdentity> = {
      id: `uid_${randomBytes(16).toString('hex')}`,
      internalUserId: `user_${randomBytes(16).toString('hex')}`,
      telegramId: telegramUser.id,
      provider,
      username: telegramUser.username ?? null,
      displayName: this.buildDisplayName(telegramUser),
      isPremium: telegramUser.isPremium ?? false,
      createdAt: now,
      lastAuthenticatedAt: now,
    };

    const createResult = await this.userIdentityRepository.create(identityData);
    if (!createResult.success || !createResult.data) {
      throw AuthErrors.authenticationFailed('Failed to create user identity');
    }

    return createResult.data;
  }

  /**
   * Build display name from Telegram user.
   */
  private buildDisplayName(telegramUser: TelegramUser): string {
    if (telegramUser.lastName) {
      return `${telegramUser.firstName} ${telegramUser.lastName}`;
    }
    return telegramUser.firstName;
  }

  /**
   * Log a login history entry.
   */
  private async logLoginHistory(
    internalUserId: string,
    telegramId: number | null,
    provider: AuthProvider,
    success: boolean,
    failureReason?: string
  ): Promise<void> {
    try {
      await this.loginHistoryRepository.create({
        id: `lh_${randomBytes(16).toString('hex')}`,
        internalUserId,
        telegramId,
        provider,
        success,
        ipAddress: null,
        userAgent: null,
        deviceInfo: null,
        failureReason: failureReason ?? null,
        createdAt: new Date(),
      });
    } catch {
      // Ignore logging errors
    }
  }

  /**
   * Log a security event.
   */
  private async logSecurityEvent(
    eventType: SecurityEventType,
    internalUserId: string | null,
    telegramId: number | null,
    details: Record<string, unknown>,
    severity: SecurityEventSeverity
  ): Promise<void> {
    try {
      await this.securityEventRepository.create({
        eventType,
        internalUserId,
        telegramId,
        ipAddress: null,
        userAgent: null,
        details,
        severity,
        createdAt: new Date(),
      });
    } catch {
      // Ignore logging errors
    }
  }
}