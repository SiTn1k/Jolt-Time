/**
 * Security Event Repository
 *
 * Repository implementation for tracking security events.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../database/supabase-types';
import type { SecurityEvent, SecurityEventType } from '../types';
import type { ISecurityEventRepository } from '../repositories';
import type { RepositoryResult } from '../../database/repositories';
import { DatabaseTable } from '../../database/types';
import { RepositoryError } from '../../database/errors';
import { randomBytes } from 'crypto';

/**
 * Security event repository implementation.
 */
export class SecurityEventRepository implements ISecurityEventRepository {
  private readonly client: SupabaseClient<Database>;

  constructor(client: SupabaseClient<Database>) {
    this.client = client;
  }

  /**
   * Find security event by ID.
   */
  async findById(id: string): Promise<RepositoryResult<SecurityEvent | null>> {
    try {
      const { data, error } = await this.client
        .from(DatabaseTable.SECURITY_EVENTS)
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
   * Find security events for a user.
   */
  async findByUserId(
    userId: string,
    limit = 100
  ): Promise<RepositoryResult<SecurityEvent[]>> {
    try {
      const { data, error } = await this.client
        .from(DatabaseTable.SECURITY_EVENTS)
        .select('*')
        .eq('internal_user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: new RepositoryError({ message: 'findByUserId failed: ' + error.message, operation: 'findByUserId', cause: error }) };
      }

      return { success: true, data: data.map((row) => this.mapToEntity(row)) };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: 'findByUserId failed: ' + (err as Error).message, operation: 'findByUserId', cause: err as Error }) };
    }
  }

  /**
   * Find security events by type.
   */
  async findByType(
    eventType: SecurityEventType,
    limit = 100
  ): Promise<RepositoryResult<SecurityEvent[]>> {
    try {
      const { data, error } = await this.client
        .from(DatabaseTable.SECURITY_EVENTS)
        .select('*')
        .eq('event_type', eventType)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: new RepositoryError({ message: 'findByType failed: ' + error.message, operation: 'findByType', cause: error }) };
      }

      return { success: true, data: data.map((row) => this.mapToEntity(row)) };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: 'findByType failed: ' + (err as Error).message, operation: 'findByType', cause: err as Error }) };
    }
  }

  /**
   * Find security events within a time range.
   */
  async findByTimeRange(
    startDate: Date,
    endDate: Date,
    limit = 1000
  ): Promise<RepositoryResult<SecurityEvent[]>> {
    try {
      const { data, error } = await this.client
        .from(DatabaseTable.SECURITY_EVENTS)
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: new RepositoryError({ message: 'findByTimeRange failed: ' + error.message, operation: 'findByTimeRange', cause: error }) };
      }

      return { success: true, data: data.map((row) => this.mapToEntity(row)) };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: 'findByTimeRange failed: ' + (err as Error).message, operation: 'findByTimeRange', cause: err as Error }) };
    }
  }

  /**
   * Create a security event.
   */
  async create(event: Partial<SecurityEvent>): Promise<RepositoryResult<SecurityEvent>> {
    try {
      const dbEvent = this.mapToDb(event);
      const { data, error } = await (this.client
        .from(DatabaseTable.SECURITY_EVENTS) as any)
        .insert(dbEvent)
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
   * Count security events by type in a time window.
   */
  async countByTypeAndTimeWindow(
    eventType: SecurityEventType,
    timeWindowMs: number
  ): Promise<RepositoryResult<number>> {
    try {
      const startDate = new Date(Date.now() - timeWindowMs);
      const { error, count } = await this.client
        .from(DatabaseTable.SECURITY_EVENTS)
        .select('*', { count: 'exact', head: true })
        .eq('event_type', eventType)
        .gte('created_at', startDate.toISOString());

      if (error) {
        return { success: false, error: new RepositoryError({ message: 'countByTypeAndTimeWindow failed: ' + error.message, operation: 'countByTypeAndTimeWindow', cause: error }) };
      }

      return { success: true, data: count ?? 0 };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: 'countByTypeAndTimeWindow failed: ' + (err as Error).message, operation: 'countByTypeAndTimeWindow', cause: err as Error }) };
    }
  }

  /**
   * Delete security events older than the specified date.
   */
  async deleteOld(olderThan: Date): Promise<RepositoryResult<number>> {
    try {
      const { error, count } = await this.client
        .from(DatabaseTable.SECURITY_EVENTS)
        .delete()
        .lt('created_at', olderThan.toISOString());

      if (error) {
        return { success: false, error: new RepositoryError({ message: 'deleteOld failed: ' + error.message, operation: 'deleteOld', cause: error }) };
      }

      return { success: true, data: count ?? 0 };
    } catch (err) {
      return { success: false, error: new RepositoryError({ message: 'deleteOld failed: ' + (err as Error).message, operation: 'deleteOld', cause: err as Error }) };
    }
  }

  /**
   * Map database row to SecurityEvent entity.
   */
  private mapToEntity(row: Record<string, unknown>): SecurityEvent {
    const now = new Date();
    return {
      id: row.id as string,
      eventType: row.event_type as SecurityEventType,
      internalUserId: row.internal_user_id as string | null,
      telegramId: row.telegram_id as number | null,
      ipAddress: row.ip_address as string | null,
      userAgent: row.user_agent as string | null,
      details: (row.details as Record<string, unknown>) ?? {},
      severity: row.severity as SecurityEvent['severity'],
      createdAt: new Date(row.created_at as string),
      updatedAt: row.updated_at ? new Date(row.updated_at as string) : now,
    };
  }

  /**
   * Map SecurityEvent entity to database row.
   */
  private mapToDb(event: Partial<SecurityEvent>): Record<string, unknown> {
    return {
      id: event.id ?? `secevt_${randomBytes(16).toString('hex')}`,
      event_type: event.eventType,
      internal_user_id: event.internalUserId,
      telegram_id: event.telegramId,
      ip_address: event.ipAddress,
      user_agent: event.userAgent,
      details: JSON.stringify(event.details ?? {}),
      severity: event.severity,
      created_at: event.createdAt?.toISOString() ?? new Date().toISOString(),
      updated_at: event.updatedAt?.toISOString(),
    };
  }
}
