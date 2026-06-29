/**
 * Analytics Response DTO
 *
 * Data Transfer Object for analytics aggregated responses.
 */

import type { AnalyticsEventResponseDto } from './AnalyticsEvent.dto';
import type { AnalyticsSessionResponseDto } from './AnalyticsSession.dto';
import type { AnalyticsMetricResponseDto } from './AnalyticsMetric.dto';
import type { AnalyticsStatistics } from '../types/AnalyticsStatistics';

/**
 * DTO for analytics response with statistics.
 */
export interface AnalyticsResponseDto {
  /** Recent events */
  events: AnalyticsEventResponseDto[];

  /** Active sessions */
  sessions: AnalyticsSessionResponseDto[];

  /** Recent metrics */
  metrics: AnalyticsMetricResponseDto[];

  /** Aggregated statistics */
  statistics: AnalyticsStatistics;
}

/**
 * DTO for analytics event list response.
 */
export interface AnalyticsEventListResponseDto {
  /** List of events */
  events: AnalyticsEventResponseDto[];

  /** Total count */
  total: number;

  /** Page number */
  page: number;

  /** Page size */
  pageSize: number;
}

/**
 * DTO for analytics session list response.
 */
export interface AnalyticsSessionListResponseDto {
  /** List of sessions */
  sessions: AnalyticsSessionResponseDto[];

  /** Total count */
  total: number;

  /** Page number */
  page: number;

  /** Page size */
  pageSize: number;
}

/**
 * DTO for analytics metric list response.
 */
export interface AnalyticsMetricListResponseDto {
  /** List of metrics */
  metrics: AnalyticsMetricResponseDto[];

  /** Total count */
  total: number;

  /** Page number */
  page: number;

  /** Page size */
  pageSize: number;
}
