/**
 * Supabase Analytics Repository
 *
 * Production Supabase implementation of the Analytics repository.
 * Handles all persistence operations for analytics entities.
 * Uses ONLY SupabaseProvider, Logger, and RepositoryError.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import {
  IAnalyticsRepository,
  AnalyticsEventFilterParams,
  AnalyticsSessionFilterParams,
  AnalyticsMetricFilterParams,
} from '../interfaces/IAnalyticsRepository';
import { AnalyticsEvent, AnalyticsEventRecord } from '../entities/AnalyticsEvent';
import { AnalyticsSession, AnalyticsSessionRecord } from '../entities/AnalyticsSession';
import { AnalyticsMetric, AnalyticsMetricRecord } from '../entities/AnalyticsMetric';
import { AnalyticsEventId } from '../value-objects/AnalyticsEventId';
import { SessionId } from '../value-objects/SessionId';
import { MetricId } from '../value-objects/MetricId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { SortOrder } from '../../../shared/constants';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { RepositoryError } from '../../../database/errors/repository.error';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('AnalyticsRepository');

/**
 * Supabase implementation of the Analytics Repository.
 * Implements IAnalyticsRepository for analytics entity persistence.
 * Never exposes raw Supabase rows - always returns domain entities.
 */
export class SupabaseAnalyticsRepository implements IAnalyticsRepository {
  private readonly eventsTableName = 'analytics_events';
  private readonly sessionsTableName = 'analytics_sessions';
  private readonly metricsTableName = 'analytics_metrics';
  private readonly _client: SupabaseClient;

  /**
   * Creates a new SupabaseAnalyticsRepository instance.
   * @param client Optional Supabase client (uses default provider if not provided)
   */
  constructor(client?: SupabaseClient) {
    this._client = client ?? getSupabaseClient();
  }

  // ============ Event Operations ============

  /**
   * Records a new analytics event.
   */
  async recordEvent(event: AnalyticsEvent): Promise<AnalyticsEvent> {
    try {
      logger.debug('Recording analytics event', { eventId: event.eventId.value, eventType: event.eventType });

      const record: Omit<AnalyticsEventRecord, never> = {
        event_id: event.eventId.value,
        event_type: event.eventType,
        player_profile_id: event.playerProfileId,
        session_id: event.sessionId.value,
        source_module: event.sourceModule,
        payload: event.payload,
        created_at: event.createdAt.toISOString(),
        metadata: event.metadata,
      };

      const { data, error } = await this._client
        .from(this.eventsTableName)
        .insert(record)
        .select()
        .single();

      if (error) {
        logger.error('Failed to record analytics event', error);
        throw RepositoryError.createFailed('AnalyticsEvent', error);
      }

      return AnalyticsEvent.fromDatabase(data as AnalyticsEventRecord);
    } catch (err) {
      logger.error('Error recording analytics event', err instanceof Error ? err : new Error(String(err)));
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.createFailed('AnalyticsEvent', err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Finds an event by its ID.
   */
  async findEventById(id: AnalyticsEventId): Promise<AnalyticsEvent | null> {
    try {
      logger.debug('Finding analytics event by ID', { eventId: id.value });

      const { data, error } = await this._client
        .from(this.eventsTableName)
        .select('*')
        .eq('event_id', id.value)
        .single();

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find analytics event', error);
        throw RepositoryError.queryFailed('findEventById', error);
      }

      return AnalyticsEvent.fromDatabase(data as AnalyticsEventRecord);
    } catch (err) {
      logger.error('Error finding analytics event', err instanceof Error ? err : new Error(String(err)));
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('findEventById', err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Lists events with pagination and filtering.
   */
  async listEvents(
    params: PaginationParams,
    filters?: AnalyticsEventFilterParams
  ): Promise<PaginatedResult<AnalyticsEvent>> {
    try {
      logger.debug('Listing analytics events', { params, filters });

      const { page, pageSize, sortBy = 'created_at', sortOrder = SortOrder.DESC } = params;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = this._client.from(this.eventsTableName).select('*', { count: 'exact' });

      if (filters) {
        if (filters.eventType) {
          query = query.eq('event_type', filters.eventType);
        }
        if (filters.playerProfileId) {
          query = query.eq('player_profile_id', filters.playerProfileId);
        }
        if (filters.sessionId) {
          query = query.eq('session_id', filters.sessionId);
        }
        if (filters.sourceModule) {
          query = query.eq('source_module', filters.sourceModule);
        }
        if (filters.createdAfter) {
          query = query.gte('created_at', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('created_at', filters.createdBefore.toISOString());
        }
      }

      const orderDirection = sortOrder === SortOrder.ASC ? 'asc' : 'desc';
      query = query.order(sortBy, { ascending: orderDirection === 'asc' });
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        logger.error('Failed to list analytics events', error);
        throw RepositoryError.queryFailed('listEvents', error);
      }

      const items = (data || []).map((row) => AnalyticsEvent.fromDatabase(row as AnalyticsEventRecord));
      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      logger.error('Error listing analytics events', err instanceof Error ? err : new Error(String(err)));
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('listEvents', err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Counts events with optional filtering.
   */
  async countEvents(filters?: AnalyticsEventFilterParams): Promise<number> {
    try {
      logger.debug('Counting analytics events', { filters });

      let query = this._client.from(this.eventsTableName).select('*', { count: 'exact', head: true });

      if (filters) {
        if (filters.eventType) {
          query = query.eq('event_type', filters.eventType);
        }
        if (filters.playerProfileId) {
          query = query.eq('player_profile_id', filters.playerProfileId);
        }
        if (filters.sessionId) {
          query = query.eq('session_id', filters.sessionId);
        }
        if (filters.sourceModule) {
          query = query.eq('source_module', filters.sourceModule);
        }
        if (filters.createdAfter) {
          query = query.gte('created_at', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('created_at', filters.createdBefore.toISOString());
        }
      }

      const { count, error } = await query;

      if (error) {
        logger.error('Failed to count analytics events', error);
        throw RepositoryError.queryFailed('countEvents', error);
      }

      return count || 0;
    } catch (err) {
      logger.error('Error counting analytics events', err instanceof Error ? err : new Error(String(err)));
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('countEvents', err instanceof Error ? err : new Error(String(err)));
    }
  }

  // ============ Session Operations ============

  /**
   * Creates a new analytics session.
   */
  async createSession(session: AnalyticsSession): Promise<AnalyticsSession> {
    try {
      logger.debug('Creating analytics session', { sessionId: session.sessionId.value });

      const record: Omit<AnalyticsSessionRecord, never> = {
        session_id: session.sessionId.value,
        player_profile_id: session.playerProfileId,
        started_at: session.startedAt.toISOString(),
        ended_at: session.endedAt?.toISOString() ?? null,
        duration: session.duration,
        device: session.device,
        platform: session.platform,
        metadata: session.metadata,
      };

      const { data, error } = await this._client
        .from(this.sessionsTableName)
        .insert(record)
        .select()
        .single();

      if (error) {
        logger.error('Failed to create analytics session', error);
        throw RepositoryError.createFailed('AnalyticsSession', error);
      }

      return AnalyticsSession.fromDatabase(data as AnalyticsSessionRecord);
    } catch (err) {
      logger.error('Error creating analytics session', err instanceof Error ? err : new Error(String(err)));
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.createFailed('AnalyticsSession', err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Finds a session by its ID.
   */
  async findSessionById(id: SessionId): Promise<AnalyticsSession | null> {
    try {
      logger.debug('Finding analytics session by ID', { sessionId: id.value });

      const { data, error } = await this._client
        .from(this.sessionsTableName)
        .select('*')
        .eq('session_id', id.value)
        .single();

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find analytics session', error);
        throw RepositoryError.queryFailed('findSessionById', error);
      }

      return AnalyticsSession.fromDatabase(data as AnalyticsSessionRecord);
    } catch (err) {
      logger.error('Error finding analytics session', err instanceof Error ? err : new Error(String(err)));
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('findSessionById', err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Updates an existing session.
   */
  async updateSession(session: AnalyticsSession): Promise<AnalyticsSession> {
    try {
      logger.debug('Updating analytics session', { sessionId: session.sessionId.value });

      const record: Omit<AnalyticsSessionRecord, never> = {
        session_id: session.sessionId.value,
        player_profile_id: session.playerProfileId,
        started_at: session.startedAt.toISOString(),
        ended_at: session.endedAt?.toISOString() ?? null,
        duration: session.duration,
        device: session.device,
        platform: session.platform,
        metadata: session.metadata,
      };

      const { data, error } = await this._client
        .from(this.sessionsTableName)
        .update(record)
        .eq('session_id', session.sessionId.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update analytics session', error);
        throw RepositoryError.updateFailed('AnalyticsSession', session.sessionId.value, error);
      }

      return AnalyticsSession.fromDatabase(data as AnalyticsSessionRecord);
    } catch (err) {
      logger.error('Error updating analytics session', err instanceof Error ? err : new Error(String(err)));
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.updateFailed('AnalyticsSession', session.sessionId.value, err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Lists sessions with pagination and filtering.
   */
  async listSessions(
    params: PaginationParams,
    filters?: AnalyticsSessionFilterParams
  ): Promise<PaginatedResult<AnalyticsSession>> {
    try {
      logger.debug('Listing analytics sessions', { params, filters });

      const { page, pageSize, sortBy = 'started_at', sortOrder = SortOrder.DESC } = params;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = this._client.from(this.sessionsTableName).select('*', { count: 'exact' });

      if (filters) {
        if (filters.playerProfileId) {
          query = query.eq('player_profile_id', filters.playerProfileId);
        }
        if (filters.device) {
          query = query.eq('device', filters.device);
        }
        if (filters.platform) {
          query = query.eq('platform', filters.platform);
        }
        if (filters.createdAfter) {
          query = query.gte('started_at', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('started_at', filters.createdBefore.toISOString());
        }
      }

      const orderDirection = sortOrder === SortOrder.ASC ? 'asc' : 'desc';
      query = query.order(sortBy, { ascending: orderDirection === 'asc' });
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        logger.error('Failed to list analytics sessions', error);
        throw RepositoryError.queryFailed('listSessions', error);
      }

      const items = (data || []).map((row) => AnalyticsSession.fromDatabase(row as AnalyticsSessionRecord));
      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      logger.error('Error listing analytics sessions', err instanceof Error ? err : new Error(String(err)));
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('listSessions', err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Counts sessions with optional filtering.
   */
  async countSessions(filters?: AnalyticsSessionFilterParams): Promise<number> {
    try {
      logger.debug('Counting analytics sessions', { filters });

      let query = this._client.from(this.sessionsTableName).select('*', { count: 'exact', head: true });

      if (filters) {
        if (filters.playerProfileId) {
          query = query.eq('player_profile_id', filters.playerProfileId);
        }
        if (filters.device) {
          query = query.eq('device', filters.device);
        }
        if (filters.platform) {
          query = query.eq('platform', filters.platform);
        }
        if (filters.createdAfter) {
          query = query.gte('started_at', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('started_at', filters.createdBefore.toISOString());
        }
      }

      const { count, error } = await query;

      if (error) {
        logger.error('Failed to count analytics sessions', error);
        throw RepositoryError.queryFailed('countSessions', error);
      }

      return count || 0;
    } catch (err) {
      logger.error('Error counting analytics sessions', err instanceof Error ? err : new Error(String(err)));
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('countSessions', err instanceof Error ? err : new Error(String(err)));
    }
  }

  // ============ Metric Operations ============

  /**
   * Records a new analytics metric.
   */
  async recordMetric(metric: AnalyticsMetric): Promise<AnalyticsMetric> {
    try {
      logger.debug('Recording analytics metric', { metricId: metric.metricId.value, metricName: metric.metricName });

      const record: Omit<AnalyticsMetricRecord, never> = {
        metric_id: metric.metricId.value,
        metric_name: metric.metricName,
        metric_value: metric.metricValue,
        metric_type: metric.metricType,
        metric_unit: metric.metricUnit,
        recorded_at: metric.recordedAt.toISOString(),
        metadata: metric.metadata,
      };

      const { data, error } = await this._client
        .from(this.metricsTableName)
        .insert(record)
        .select()
        .single();

      if (error) {
        logger.error('Failed to record analytics metric', error);
        throw RepositoryError.createFailed('AnalyticsMetric', error);
      }

      return AnalyticsMetric.fromDatabase(data as AnalyticsMetricRecord);
    } catch (err) {
      logger.error('Error recording analytics metric', err instanceof Error ? err : new Error(String(err)));
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.createFailed('AnalyticsMetric', err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Finds a metric by its ID.
   */
  async findMetricById(id: MetricId): Promise<AnalyticsMetric | null> {
    try {
      logger.debug('Finding analytics metric by ID', { metricId: id.value });

      const { data, error } = await this._client
        .from(this.metricsTableName)
        .select('*')
        .eq('metric_id', id.value)
        .single();

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find analytics metric', error);
        throw RepositoryError.queryFailed('findMetricById', error);
      }

      return AnalyticsMetric.fromDatabase(data as AnalyticsMetricRecord);
    } catch (err) {
      logger.error('Error finding analytics metric', err instanceof Error ? err : new Error(String(err)));
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('findMetricById', err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Lists metrics with pagination and filtering.
   */
  async listMetrics(
    params: PaginationParams,
    filters?: AnalyticsMetricFilterParams
  ): Promise<PaginatedResult<AnalyticsMetric>> {
    try {
      logger.debug('Listing analytics metrics', { params, filters });

      const { page, pageSize, sortBy = 'recorded_at', sortOrder = SortOrder.DESC } = params;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = this._client.from(this.metricsTableName).select('*', { count: 'exact' });

      if (filters) {
        if (filters.metricName) {
          query = query.eq('metric_name', filters.metricName);
        }
        if (filters.recordedAfter) {
          query = query.gte('recorded_at', filters.recordedAfter.toISOString());
        }
        if (filters.recordedBefore) {
          query = query.lte('recorded_at', filters.recordedBefore.toISOString());
        }
      }

      const orderDirection = sortOrder === SortOrder.ASC ? 'asc' : 'desc';
      query = query.order(sortBy, { ascending: orderDirection === 'asc' });
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        logger.error('Failed to list analytics metrics', error);
        throw RepositoryError.queryFailed('listMetrics', error);
      }

      const items = (data || []).map((row) => AnalyticsMetric.fromDatabase(row as AnalyticsMetricRecord));
      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      logger.error('Error listing analytics metrics', err instanceof Error ? err : new Error(String(err)));
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('listMetrics', err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Counts metrics with optional filtering.
   */
  async countMetrics(filters?: AnalyticsMetricFilterParams): Promise<number> {
    try {
      logger.debug('Counting analytics metrics', { filters });

      let query = this._client.from(this.metricsTableName).select('*', { count: 'exact', head: true });

      if (filters) {
        if (filters.metricName) {
          query = query.eq('metric_name', filters.metricName);
        }
        if (filters.recordedAfter) {
          query = query.gte('recorded_at', filters.recordedAfter.toISOString());
        }
        if (filters.recordedBefore) {
          query = query.lte('recorded_at', filters.recordedBefore.toISOString());
        }
      }

      const { count, error } = await query;

      if (error) {
        logger.error('Failed to count analytics metrics', error);
        throw RepositoryError.queryFailed('countMetrics', error);
      }

      return count || 0;
    } catch (err) {
      logger.error('Error counting analytics metrics', err instanceof Error ? err : new Error(String(err)));
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('countMetrics', err instanceof Error ? err : new Error(String(err)));
    }
  }
}
