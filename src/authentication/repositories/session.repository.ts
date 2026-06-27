/**
 * Session Repository
 *
 * Repository implementation for session management.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../database/supabase-types';
import { Session, SessionStatus } from '../types';
import type { ISessionRepository } from './interfaces';
import { RepositoryError } from '../../database/errors';
import type { RepositoryResult } from '../../database/repositories';
import { DatabaseTable } from '../../database/types';

/**
 * Session repository implementation.
 */
export class SessionRepository implements ISessionRepository {
  private readonly client: SupabaseClient<Database>;

  constructor(client: SupabaseClient<Database>) {
    this.client = client;
  }

  /**
   * Find session by ID.
   */
  async findById(id: string): Promise<RepositoryResult<Session | null>> {
    try {
      const { data, error } = await this.client
        .from(DatabaseTable.SESSIONS)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: true, data: null };
        }
        return { success: false, error: new RepositoryError({ message: `findById failed: ${error.message}`, operation: 'findById', cause: error }) };
      }

      return { success: true, data: this.mapToEntity(data) };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: `findById failed`, operation: 'findById', cause: err as Error }) };
    }
  }

  /**
   * Find session by token.
   */
  async findByToken(token: string): Promise<RepositoryResult<Session | null>> {
    try {
      const { data, error } = await this.client
        .from(DatabaseTable.SESSIONS)
        .select('*')
        .eq('token', token)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: true, data: null };
        }
        return { success: false, error: new RepositoryError({ message: `findByToken failed: ${error.message}`, operation: 'findByToken', cause: error }) };
      }

      return { success: true, data: this.mapToEntity(data) };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: `findByToken failed`, operation: 'findByToken', cause: err as Error }) };
    }
  }

  /**
   * Find all sessions for a user.
   */
  async findByUserId(
    userId: string,
    options?: { status?: SessionStatus }
  ): Promise<RepositoryResult<{ items: Session[]; total: number }>> {
    try {
      let query = this.client
        .from(DatabaseTable.SESSIONS)
        .select('*', { count: 'exact' })
        .eq('internal_user_id', userId);

      if (options?.status) {
        query = query.eq('status', options.status);
      }

      const { data, error, count } = await query.order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: new RepositoryError({ message: `findByUserId failed: ${error.message}`, operation: 'findByUserId', cause: error }) };
      }

      return {
        success: true,
        data: {
          items: data.map((row) => this.mapToEntity(row)),
          total: count ?? 0,
        },
      };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: `findByUserId failed`, operation: 'findByUserId', cause: err as Error }) };
    }
  }

  /**
   * Find active sessions for a user.
   */
  async findActiveByUserId(userId: string): Promise<RepositoryResult<Session[]>> {
    try {
      const { data, error } = await this.client
        .from(DatabaseTable.SESSIONS)
        .select('*')
        .eq('internal_user_id', userId)
        .eq('status', SessionStatus.ACTIVE)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: new RepositoryError({ message: `findActiveByUserId failed: ${error.message}`, operation: 'findActiveByUserId', cause: error }) };
      }

      return { success: true, data: data.map((row) => this.mapToEntity(row)) };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: `findActiveByUserId failed`, operation: 'findActiveByUserId', cause: err as Error }) };
    }
  }

  /**
   * Create a new session.
   */
  async create(session: Partial<Session>): Promise<RepositoryResult<Session>> {
    try {
      const dbSession = this.mapToDb(session);
      const { data, error } = await (this.client
        .from(DatabaseTable.SESSIONS) as any)
        .insert(dbSession)
        .select()
        .single();

      if (error) {
        return { success: false, error: new RepositoryError({ message: `create failed: ${error.message}`, operation: 'create', cause: error }) };
      }

      return { success: true, data: this.mapToEntity(data) };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: `create failed`, operation: 'create', cause: err as Error }) };
    }
  }

  /**
   * Update a session.
   */
  async update(id: string, data: Partial<Session>): Promise<RepositoryResult<Session>> {
    try {
      const dbSession = this.mapToDbPartial(data);
      const { data: updated, error } = await (this.client
        .from(DatabaseTable.SESSIONS) as any)
        .update({ ...dbSession, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { success: false, error: new RepositoryError({ message: `update failed: ${error.message}`, operation: 'update', cause: error }) };
      }

      return { success: true, data: this.mapToEntity(updated) };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: `update failed`, operation: 'update', cause: err as Error }) };
    }
  }

  /**
   * Update session status.
   */
  async updateStatus(id: string, status: SessionStatus): Promise<RepositoryResult<Session>> {
    return this.update(id, { status });
  }

  /**
   * Revoke a session.
   */
  async revoke(id: string): Promise<RepositoryResult<void>> {
    try {
      const { error } = await (this.client
        .from(DatabaseTable.SESSIONS) as any)
        .update({
          status: SessionStatus.REVOKED,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        return { success: false, error: new RepositoryError({ message: `revoke failed: ${error.message}`, operation: 'revoke', cause: error }) };
      }

      return { success: true, data: undefined };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: `revoke failed`, operation: 'revoke', cause: err as Error }) };
    }
  }

  /**
   * Revoke all sessions for a user.
   */
  async revokeAllForUser(userId: string): Promise<RepositoryResult<number>> {
    try {
      const { error, count } = await (this.client
        .from(DatabaseTable.SESSIONS) as any)
        .update({
          status: SessionStatus.REVOKED,
          updated_at: new Date().toISOString(),
        })
        .eq('internal_user_id', userId)
        .eq('status', SessionStatus.ACTIVE);

      if (error) {
        return { success: false, error: new RepositoryError({ message: `revokeAllForUser failed: ${error.message}`, operation: 'revokeAllForUser', cause: error }) };
      }

      return { success: true, data: count ?? 0 };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: `revokeAllForUser failed`, operation: 'revokeAllForUser', cause: err as Error }) };
    }
  }

  /**
   * Revoke all sessions except one.
   */
  async revokeOthers(userId: string, exceptSessionId: string): Promise<RepositoryResult<number>> {
    try {
      const { error, count } = await (this.client
        .from(DatabaseTable.SESSIONS) as any)
        .update({
          status: SessionStatus.REVOKED,
          updated_at: new Date().toISOString(),
        })
        .eq('internal_user_id', userId)
        .neq('id', exceptSessionId)
        .eq('status', SessionStatus.ACTIVE);

      if (error) {
        return { success: false, error: new RepositoryError({ message: `revokeOthers failed: ${error.message}`, operation: 'revokeOthers', cause: error }) };
      }

      return { success: true, data: count ?? 0 };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: `revokeOthers failed`, operation: 'revokeOthers', cause: err as Error }) };
    }
  }

  /**
   * Delete expired sessions older than the specified date.
   */
  async deleteExpired(olderThan: Date): Promise<RepositoryResult<number>> {
    try {
      const { error, count } = await this.client
        .from(DatabaseTable.SESSIONS)
        .delete()
        .eq('status', SessionStatus.EXPIRED)
        .lt('updated_at', olderThan.toISOString());

      if (error) {
        return { success: false, error: new RepositoryError({ message: `deleteExpired failed: ${error.message}`, operation: 'deleteExpired', cause: error }) };
      }

      return { success: true, data: count ?? 0 };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: `deleteExpired failed`, operation: 'deleteExpired', cause: err as Error }) };
    }
  }

  /**
   * Map database row to Session entity.
   */
  private mapToEntity(row: Record<string, unknown>): Session {
    return {
      id: row.id as string,
      internalUserId: row.internal_user_id as string,
      token: row.token as string,
      provider: row.provider as Session['provider'],
      status: row.status as SessionStatus,
      telegramId: row.telegram_id as number | null,
      deviceInfo: row.device_info as string | null,
      ipAddress: row.ip_address as string | null,
      userAgent: row.user_agent as string | null,
      expiresAt: new Date(row.expires_at as string),
      refreshedAt: row.refreshed_at ? new Date(row.refreshed_at as string) : null,
      lastAccessedAt: new Date(row.last_accessed_at as string),
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  }

  /**
   * Map Session entity to database row.
   */
  private mapToDb(session: Partial<Session>): Record<string, unknown> {
    return {
      id: session.id,
      internal_user_id: session.internalUserId,
      token: session.token,
      provider: session.provider,
      status: session.status,
      telegram_id: session.telegramId,
      device_info: session.deviceInfo,
      ip_address: session.ipAddress,
      user_agent: session.userAgent,
      expires_at: session.expiresAt?.toISOString(),
      refreshed_at: session.refreshedAt?.toISOString(),
      last_accessed_at: session.lastAccessedAt?.toISOString(),
      created_at: session.createdAt?.toISOString(),
      updated_at: session.updatedAt?.toISOString(),
    };
  }

  /**
   * Map partial Session entity to database row (for updates).
   */
  private mapToDbPartial(session: Partial<Session>): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    if (session.internalUserId !== undefined) result.internal_user_id = session.internalUserId;
    if (session.token !== undefined) result.token = session.token;
    if (session.provider !== undefined) result.provider = session.provider;
    if (session.status !== undefined) result.status = session.status;
    if (session.telegramId !== undefined) result.telegram_id = session.telegramId;
    if (session.deviceInfo !== undefined) result.device_info = session.deviceInfo;
    if (session.ipAddress !== undefined) result.ip_address = session.ipAddress;
    if (session.userAgent !== undefined) result.user_agent = session.userAgent;
    if (session.expiresAt !== undefined) result.expires_at = session.expiresAt.toISOString();
    if (session.refreshedAt !== undefined) result.refreshed_at = session.refreshedAt?.toISOString();
    if (session.lastAccessedAt !== undefined) result.last_accessed_at = session.lastAccessedAt.toISOString();

    return result;
  }
}
