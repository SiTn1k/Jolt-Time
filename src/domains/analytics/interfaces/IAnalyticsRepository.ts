/**
 * Analytics Repository Interface
 *
 * Interface defining the contract for Analytics persistence.
 * All analytics repository implementations must adhere to this interface.
 */

import type { AnalyticsEventId } from '../value-objects/AnalyticsEventId';
import type { SessionId } from '../value-objects/SessionId';
import type { MetricId } from '../value-objects/MetricId';
import type { AnalyticsEvent } from '../entities/AnalyticsEvent';
import type { AnalyticsSession } from '../entities/AnalyticsSession';
import type { AnalyticsMetric } from '../entities/AnalyticsMetric';
import type { AnalyticsEventType } from '../types/AnalyticsEventType';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying analytics events.
 */
export interface AnalyticsEventFilterParams {
  /** Filter by event type */
  eventType?: AnalyticsEventType;

  /** Filter by player profile ID */
  playerProfileId?: string;

  /** Filter by session ID */
  sessionId?: string;

  /** Filter by source module */
  sourceModule?: string;

  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;
}

/**
 * Filter parameters for querying analytics sessions.
 */
export interface AnalyticsSessionFilterParams {
  /** Filter by player profile ID */
  playerProfileId?: string;

  /** Filter by device */
  device?: string;

  /** Filter by platform */
  platform?: string;

  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;
}

/**
 * Filter parameters for querying analytics metrics.
 */
export interface AnalyticsMetricFilterParams {
  /** Filter by metric name */
  metricName?: string;

  /** Filter by recording date after */
  recordedAfter?: Date;

  /** Filter by recording date before */
  recordedBefore?: Date;
}

/**
 * Analytics repository interface.
 * Defines all data access operations for analytics entities.
 */
export interface IAnalyticsRepository {
  // ============ Event Operations ============

  /**
   * Records a new analytics event.
   * @param event The event to record
   * @returns The recorded event
   */
  recordEvent(event: AnalyticsEvent): Promise<AnalyticsEvent>;

  /**
   * Finds an event by its ID.
   * @param id The event ID to find
   * @returns The event if found, null otherwise
   */
  findEventById(id: AnalyticsEventId): Promise<AnalyticsEvent | null>;

  /**
   * Lists events with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of events
   */
  listEvents(
    params: PaginationParams,
    filters?: AnalyticsEventFilterParams
  ): Promise<PaginatedResult<AnalyticsEvent>>;

  /**
   * Counts events with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching events
   */
  countEvents(filters?: AnalyticsEventFilterParams): Promise<number>;

  // ============ Session Operations ============

  /**
   * Creates a new analytics session.
   * @param session The session to create
   * @returns The created session
   */
  createSession(session: AnalyticsSession): Promise<AnalyticsSession>;

  /**
   * Finds a session by its ID.
   * @param id The session ID to find
   * @returns The session if found, null otherwise
   */
  findSessionById(id: SessionId): Promise<AnalyticsSession | null>;

  /**
   * Updates an existing session.
   * @param session The session to update
   * @returns The updated session
   */
  updateSession(session: AnalyticsSession): Promise<AnalyticsSession>;

  /**
   * Lists sessions with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of sessions
   */
  listSessions(
    params: PaginationParams,
    filters?: AnalyticsSessionFilterParams
  ): Promise<PaginatedResult<AnalyticsSession>>;

  /**
   * Counts sessions with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching sessions
   */
  countSessions(filters?: AnalyticsSessionFilterParams): Promise<number>;

  // ============ Metric Operations ============

  /**
   * Records a new analytics metric.
   * @param metric The metric to record
   * @returns The recorded metric
   */
  recordMetric(metric: AnalyticsMetric): Promise<AnalyticsMetric>;

  /**
   * Finds a metric by its ID.
   * @param id The metric ID to find
   * @returns The metric if found, null otherwise
   */
  findMetricById(id: MetricId): Promise<AnalyticsMetric | null>;

  /**
   * Lists metrics with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of metrics
   */
  listMetrics(
    params: PaginationParams,
    filters?: AnalyticsMetricFilterParams
  ): Promise<PaginatedResult<AnalyticsMetric>>;

  /**
   * Counts metrics with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching metrics
   */
  countMetrics(filters?: AnalyticsMetricFilterParams): Promise<number>;
}
