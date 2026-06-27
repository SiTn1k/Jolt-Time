/**
 * User Identity Repository
 *
 * Repository implementation for user identity management.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../database/supabase-types';
import type { UserIdentity, AuthProvider } from '../types';
import type { IUserIdentityRepository } from '../repositories';
import type { RepositoryResult } from '../../database/repositories';
import { DatabaseTable } from '../../database/types';
import { RepositoryError } from '../../database/errors';

/**
 * User identity repository implementation.
 */
export class UserIdentityRepository implements IUserIdentityRepository {
  private readonly client: SupabaseClient<Database>;

  constructor(client: SupabaseClient<Database>) {
    this.client = client;
  }

  /**
   * Find user identity by internal user ID.
   */
  async findById(id: string): Promise<RepositoryResult<UserIdentity | null>> {
    try {
      const { data, error } = await this.client
        .from(DatabaseTable.USER_IDENTITIES)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: true, data: null };
        }
        return { success: false, error: new RepositoryError({ message: 'findById failed: ' + error.message, operation: 'findById', cause: error }) };
      }

      return { success: true, data: this.mapToEntity(data) };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: 'findById failed: ' + (err as Error).message, operation: 'findById', cause: err as Error }) };
    }
  }

  /**
   * Find user identity by Telegram ID.
   */
  async findByTelegramId(telegramId: number): Promise<RepositoryResult<UserIdentity | null>> {
    try {
      const { data, error } = await this.client
        .from(DatabaseTable.USER_IDENTITIES)
        .select('*')
        .eq('telegram_id', telegramId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: true, data: null };
        }
        return { success: false, error: new RepositoryError({ message: 'findByTelegramId failed: ' + error.message, operation: 'findByTelegramId', cause: error }) };
      }

      return { success: true, data: this.mapToEntity(data) };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: 'findByTelegramId failed: ' + (err as Error).message, operation: 'findByTelegramId', cause: err as Error }) };
    }
  }

  /**
   * Create a new user identity.
   */
  async create(identity: Partial<UserIdentity>): Promise<RepositoryResult<UserIdentity>> {
    try {
      const dbIdentity = this.mapToDb(identity);
      const { data, error } = await (this.client
        .from(DatabaseTable.USER_IDENTITIES) as any)
        .insert(dbIdentity)
        .select()
        .single();

      if (error) {
        return { success: false, error: new RepositoryError({ message: 'create failed: ' + error.message, operation: 'create', cause: error }) };
      }

      return { success: true, data: this.mapToEntity(data) };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: 'create failed: ' + (err as Error).message, operation: 'create', cause: err as Error }) };
    }
  }

  /**
   * Update user identity.
   */
  async update(id: string, data: Partial<UserIdentity>): Promise<RepositoryResult<UserIdentity>> {
    try {
      const dbIdentity = this.mapToDbPartial(data);
      const { data: updated, error } = await (this.client
        .from(DatabaseTable.USER_IDENTITIES) as any)
        .update({ ...dbIdentity, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { success: false, error: new RepositoryError({ message: 'update failed: ' + error.message, operation: 'update', cause: error }) };
      }

      return { success: true, data: this.mapToEntity(updated) };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: 'update failed: ' + (err as Error).message, operation: 'update', cause: err as Error }) };
    }
  }

  /**
   * Check if identity exists for Telegram ID.
   */
  async existsByTelegramId(telegramId: number): Promise<boolean> {
    try {
      const { data, error } = await this.client
        .from(DatabaseTable.USER_IDENTITIES)
        .select('id', { count: 'exact', head: true })
        .eq('telegram_id', telegramId);

      if (error) {
        return false;
      }

      return (data as unknown as { count: number }).count > 0;
    } catch {
      return false;
    }
  }

  /**
   * Map database row to UserIdentity entity.
   */
  private mapToEntity(row: Record<string, unknown>): UserIdentity {
    return {
      id: row.id as string,
      internalUserId: row.internal_user_id as string,
      telegramId: row.telegram_id as number | null,
      provider: row.provider as AuthProvider,
      username: row.username as string | null,
      displayName: row.display_name as string,
      isPremium: row.is_premium as boolean,
      createdAt: new Date(row.created_at as string),
      lastAuthenticatedAt: new Date(row.last_authenticated_at as string),
    };
  }

  /**
   * Map UserIdentity entity to database row.
   */
  private mapToDb(identity: Partial<UserIdentity>): Record<string, unknown> {
    return {
      id: identity.id,
      internal_user_id: identity.internalUserId,
      telegram_id: identity.telegramId,
      provider: identity.provider,
      username: identity.username,
      display_name: identity.displayName,
      is_premium: identity.isPremium,
      created_at: identity.createdAt?.toISOString(),
      updated_at: identity.lastAuthenticatedAt?.toISOString(),
    };
  }

  /**
   * Map partial UserIdentity entity to database row (for updates).
   */
  private mapToDbPartial(identity: Partial<UserIdentity>): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    if (identity.internalUserId !== undefined) result.internal_user_id = identity.internalUserId;
    if (identity.telegramId !== undefined) result.telegram_id = identity.telegramId;
    if (identity.provider !== undefined) result.provider = identity.provider;
    if (identity.username !== undefined) result.username = identity.username;
    if (identity.displayName !== undefined) result.display_name = identity.displayName;
    if (identity.isPremium !== undefined) result.is_premium = identity.isPremium;
    if (identity.lastAuthenticatedAt !== undefined) {
      result.last_authenticated_at = identity.lastAuthenticatedAt.toISOString();
    }

    return result;
  }
}
