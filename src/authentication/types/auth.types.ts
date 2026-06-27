/**
 * Authentication Types
 *
 * Core type definitions for the authentication system.
 */

import type { BaseEntity, Result, AsyncResult } from '../../shared/types';

/**
 * Telegram user information extracted from initData.
 */
export interface TelegramUser {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  isPremium?: boolean;
}

/**
 * Parsed Telegram initData fields.
 */
export interface TelegramInitData {
  user: TelegramUser;
  chatInstance?: string;
  chatType?: string;
  startParam?: string;
  authDate: Date;
  hash: string;
}

/**
 * Raw initData string from Telegram Mini App.
 */
export type InitDataRaw = string;

/**
 * Session token type.
 */
export type SessionToken = string;

/**
 * Authentication provider types supported.
 */
export enum AuthProvider {
  TELEGRAM = 'telegram',
  ANONYMOUS = 'anonymous',
}

/**
 * Session status.
 */
export enum SessionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
  SUSPENDED = 'suspended',
}

/**
 * User identity - abstraction layer over different auth providers.
 */
export interface UserIdentity {
  id: string;
  internalUserId: string;
  telegramId: number | null;
  provider: AuthProvider;
  username: string | null;
  displayName: string;
  isPremium: boolean;
  createdAt: Date;
  lastAuthenticatedAt: Date;
}

/**
 * Session entity for tracking user sessions.
 */
export interface Session extends BaseEntity {
  id: string;
  internalUserId: string;
  token: string;
  provider: AuthProvider;
  status: SessionStatus;
  telegramId: number | null;
  deviceInfo: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: Date;
  refreshedAt: Date | null;
  lastAccessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Login history entry.
 */
export interface LoginHistory {
  id: string;
  internalUserId: string;
  telegramId: number | null;
  provider: AuthProvider;
  success: boolean;
  ipAddress: string | null;
  userAgent: string | null;
  deviceInfo: string | null;
  failureReason: string | null;
  createdAt: Date;
}

/**
 * Security event types.
 */
export enum SecurityEventType {
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILED = 'login_failed',
  SESSION_CREATED = 'session_created',
  SESSION_REFRESHED = 'session_refreshed',
  SESSION_REVOKED = 'session_revoked',
  SESSION_EXPIRED = 'session_expired',
  INVALID_SIGNATURE = 'invalid_signature',
  REPLAY_ATTACK_DETECTED = 'replay_attack_detected',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  TOKEN_REFRESH_FAILED = 'token_refresh_failed',
}

/**
 * Security event entity.
 */
export interface SecurityEvent extends BaseEntity {
  id: string;
  eventType: SecurityEventType;
  internalUserId: string | null;
  telegramId: number | null;
  ipAddress: string | null;
  userAgent: string | null;
  details: Record<string, unknown>;
  severity: SecurityEventSeverity;
  createdAt: Date;
}

/**
 * Security event severity levels.
 */
export enum SecurityEventSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Authentication result with user identity.
 */
export type AuthResult = AsyncResult<UserIdentity, AuthenticationError>;

 /**
 * Session validation result.
 */

/**
 * Current user context.
 */
export interface AuthContext {
  user: UserIdentity | null;
  session: Session | null;
  isAuthenticated: boolean;
  isPremium: boolean;
}

/**
 * Authentication request from client.
 */
export interface AuthenticationRequest {
  initData: InitDataRaw;
  deviceInfo?: string;
}

/**
 * Session refresh request.
 */
export interface RefreshSessionRequest {
  sessionToken: SessionToken;
}

/**
 * Logout request.
 */
export interface LogoutRequest {
  sessionToken?: SessionToken;
  allSessions?: boolean;
}

/**
 * Permission types for authorization.
 */
export enum Permission {
  // User permissions
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  
  // Game permissions
  GAME_PLAY = 'game:play',
  GAME_ADMIN = 'game:admin',
  
  // Admin permissions
  ADMIN_ACCESS = 'admin:access',
  ADMIN_USERS = 'admin:users',
  ADMIN_SYSTEM = 'admin:system',
}

/**
 * Role definition for authorization.
 */
export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: Date;
}

/**
 * User role assignment.
 */
export interface UserRole extends BaseEntity {
  id: string;
  internalUserId: string;
  roleId: string;
  assignedBy: string | null;
  expiresAt: Date | null;
  createdAt: Date;
}

/**
 * Access guard result.
 */
export interface AccessCheckResult {
  allowed: boolean;
  reason?: string;
  requiredPermissions?: Permission[];
}

/**
 * Authentication error codes.
 */
export enum AuthErrorCode {
  INVALID_INIT_DATA = 'AUTH_001',
  SIGNATURE_INVALID = 'AUTH_002',
  SIGNATURE_EXPIRED = 'AUTH_003',
  REPLAY_DETECTED = 'AUTH_004',
  SESSION_NOT_FOUND = 'AUTH_005',
  SESSION_EXPIRED = 'AUTH_006',
  SESSION_REVOKED = 'AUTH_007',
  USER_NOT_FOUND = 'AUTH_008',
  RATE_LIMITED = 'AUTH_009',
  UNAUTHORIZED = 'AUTH_010',
  FORBIDDEN = 'AUTH_011',
  INVALID_TOKEN = 'AUTH_012',
  AUTHENTICATION_FAILED = 'AUTH_013',
}

/**
 * Base authentication error class.
 */
export class AuthenticationError extends Error {
  public readonly code: AuthErrorCode;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: AuthErrorCode,
    isOperational = true,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AuthenticationError';
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      isOperational: this.isOperational,
      details: this.details,
    };
  }
}

/**
 * Session error class.
 */
export class SessionError extends Error {
  public readonly code: AuthErrorCode;
  public readonly sessionId?: string;

  constructor(message: string, code: AuthErrorCode, sessionId?: string) {
    super(message);
    this.name = 'SessionError';
    this.code = code;
    this.sessionId = sessionId;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Authorization error class.
 */
export class AuthorizationError extends Error {
  public readonly code: AuthErrorCode;
  public readonly requiredPermissions: Permission[];

  constructor(
    message: string,
    code: AuthErrorCode,
    requiredPermissions: Permission[] = []
  ) {
    super(message);
    this.name = 'AuthorizationError';
    this.code = code;
    this.requiredPermissions = requiredPermissions;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Security error class for security-related issues.
 */
export class SecurityError extends Error {
  public readonly eventType: SecurityEventType;
  public readonly severity: SecurityEventSeverity;

  constructor(
    message: string,
    eventType: SecurityEventType,
    severity: SecurityEventSeverity
  ) {
    super(message);
    this.name = 'SecurityError';
    this.eventType = eventType;
    this.severity = severity;
    Error.captureStackTrace(this, this.constructor);
  }
}