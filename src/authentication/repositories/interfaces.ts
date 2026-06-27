/**
 * Authentication Repository Interfaces
 *
 * Interface definitions for all authentication-related repositories.
 */

import type { RepositoryResult } from '../../database/repositories';
import type {
  Session,
  SessionStatus,
  LoginHistory,
  SecurityEvent,
  SecurityEventType,
  SecurityEventSeverity,
  AuthProvider,
  Permission,
  Role,
  UserRole,
  UserIdentity,
} from '../types';

/**
 * Session repository interface.
 */
export interface ISessionRepository {
  /**
   * Find session by ID.
   */
  findById(id: string): Promise<RepositoryResult<Session | null>>;

  /**
   * Find session by token.
   */
  findByToken(token: string): Promise<RepositoryResult<Session | null>>;

  /**
   * Find all sessions for a user.
   */
  findByUserId(
    userId: string,
    options?: { status?: SessionStatus }
  ): Promise<RepositoryResult<{ items: Session[]; total: number }>>;

  /**
   * Find active sessions for a user.
   */
  findActiveByUserId(userId: string): Promise<RepositoryResult<Session[]>>;

  /**
   * Create a new session.
   */
  create(session: Partial<Session>): Promise<RepositoryResult<Session>>;

  /**
   * Update a session.
   */
  update(id: string, data: Partial<Session>): Promise<RepositoryResult<Session>>;

  /**
   * Update session status.
   */
  updateStatus(id: string, status: SessionStatus): Promise<RepositoryResult<Session>>;

  /**
   * Revoke a session.
   */
  revoke(id: string): Promise<RepositoryResult<void>>;

  /**
   * Revoke all sessions for a user.
   */
  revokeAllForUser(userId: string): Promise<RepositoryResult<number>>;

  /**
   * Revoke all sessions except one.
   */
  revokeOthers(userId: string, exceptSessionId: string): Promise<RepositoryResult<number>>;

  /**
   * Delete expired sessions older than the specified date.
   */
  deleteExpired(olderThan: Date): Promise<RepositoryResult<number>>;
}

/**
 * Login history repository interface.
 */
export interface ILoginHistoryRepository {
  /**
   * Find login history by ID.
   */
  findById(id: string): Promise<RepositoryResult<LoginHistory | null>>;

  /**
   * Find login history for a user.
   */
  findByUserId(
    userId: string,
    limit?: number
  ): Promise<RepositoryResult<LoginHistory[]>>;

  /**
   * Find recent login history for a user.
   */
  findRecentByTelegramId(
    telegramId: number,
    limit?: number
  ): Promise<RepositoryResult<LoginHistory[]>>;

  /**
   * Create a login history entry.
   */
  create(entry: Partial<LoginHistory>): Promise<RepositoryResult<LoginHistory>>;

  /**
   * Delete login history older than the specified date.
   */
  deleteOld(olderThan: Date): Promise<RepositoryResult<number>>;
}

/**
 * Security event repository interface.
 */
export interface ISecurityEventRepository {
  /**
   * Find security event by ID.
   */
  findById(id: string): Promise<RepositoryResult<SecurityEvent | null>>;

  /**
   * Find security events for a user.
   */
  findByUserId(
    userId: string,
    limit?: number
  ): Promise<RepositoryResult<SecurityEvent[]>>;

  /**
   * Find security events by type.
   */
  findByType(
    eventType: SecurityEventType,
    limit?: number
  ): Promise<RepositoryResult<SecurityEvent[]>>;

  /**
   * Find security events within a time range.
   */
  findByTimeRange(
    startDate: Date,
    endDate: Date,
    limit?: number
  ): Promise<RepositoryResult<SecurityEvent[]>>;

  /**
   * Create a security event.
   */
  create(event: Partial<SecurityEvent>): Promise<RepositoryResult<SecurityEvent>>;

  /**
   * Count security events by type in a time window.
   */
  countByTypeAndTimeWindow(
    eventType: SecurityEventType,
    timeWindowMs: number
  ): Promise<RepositoryResult<number>>;

  /**
   * Delete security events older than the specified date.
   */
  deleteOld(olderThan: Date): Promise<RepositoryResult<number>>;
}

/**
 * Authentication state repository interface.
 */
export interface IAuthStateRepository {
  /**
   * Get stored authentication state.
   */
  getState(sessionToken: string): Promise<RepositoryResult<UserIdentity | null>>;

  /**
   * Store authentication state.
   */
  setState(
    sessionToken: string,
    identity: UserIdentity,
    ttlSeconds?: number
  ): Promise<RepositoryResult<void>>;

  /**
   * Delete authentication state.
   */
  deleteState(sessionToken: string): Promise<RepositoryResult<void>>;

  /**
   * Refresh state TTL.
   */
  refreshState(sessionToken: string, ttlSeconds?: number): Promise<RepositoryResult<void>>;
}

/**
 * User identity repository interface.
 */
export interface IUserIdentityRepository {
  /**
   * Find user identity by internal user ID.
   */
  findById(id: string): Promise<RepositoryResult<UserIdentity | null>>;

  /**
   * Find user identity by Telegram ID.
   */
  findByTelegramId(telegramId: number): Promise<RepositoryResult<UserIdentity | null>>;

  /**
   * Create a new user identity.
   */
  create(identity: Partial<UserIdentity>): Promise<RepositoryResult<UserIdentity>>;

  /**
   * Update user identity.
   */
  update(id: string, data: Partial<UserIdentity>): Promise<RepositoryResult<UserIdentity>>;

  /**
   * Check if identity exists for Telegram ID.
   */
  existsByTelegramId(telegramId: number): Promise<boolean>;
}

/**
 * Role repository interface.
 */
export interface IRoleRepository {
  /**
   * Find role by ID.
   */
  findById(id: string): Promise<RepositoryResult<Role | null>>;

  /**
   * Find role by name.
   */
  findByName(name: string): Promise<RepositoryResult<Role | null>>;

  /**
   * Find all roles.
   */
  findAll(): Promise<RepositoryResult<Role[]>>;

  /**
   * Find roles for a user.
   */
  findByUserId(userId: string): Promise<RepositoryResult<Role[]>>;
}

/**
 * User role repository interface.
 */
export interface IUserRoleRepository {
  /**
   * Find user role by ID.
   */
  findById(id: string): Promise<RepositoryResult<UserRole | null>>;

  /**
   * Find all roles for a user.
   */
  findByUserId(userId: string): Promise<RepositoryResult<UserRole[]>>;

  /**
   * Check if user has a specific role.
   */
  hasRole(userId: string, roleId: string): Promise<boolean>;

  /**
   * Check if user has any of the specified roles.
   */
  hasAnyRole(userId: string, roleIds: string[]): Promise<boolean>;

  /**
   * Assign a role to a user.
   */
  assignRole(assignment: Partial<UserRole>): Promise<RepositoryResult<UserRole>>;

  /**
   * Remove a role from a user.
   */
  removeRole(userId: string, roleId: string): Promise<RepositoryResult<void>>;

  /**
   * Remove all roles from a user.
   */
  removeAllRoles(userId: string): Promise<RepositoryResult<number>>;

  /**
   * Check if user's role assignment has expired.
   */
  isRoleExpired(assignment: UserRole): boolean;
}