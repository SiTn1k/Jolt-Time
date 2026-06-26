/**
 * Database Types
 *
 * Type definitions for database layer.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../supabase-types';

/**
 * Database client type.
 */
export type DatabaseClient = SupabaseClient<Database>;

/**
 * Database table names.
 */
export const DatabaseTable = {
  USERS: 'users',
  PROFILES: 'profiles',
  ARTIFACTS: 'artifacts',
  USER_ARTIFACTS: 'user_artifacts',
  MUSEUM_EXHIBITS: 'museum_exhibits',
  USER_MUSEUM_PROGRESS: 'user_museum_progress',
  INVENTORY: 'inventory',
  CURRENCY_BALANCES: 'currency_balances',
  CURRENCY_TRANSACTIONS: 'currency_transactions',
  PROGRESS: 'progress',
  SEASONS: 'seasons',
  SEASON_PARTICIPATION: 'season_participation',
  GUILDS: 'guilds',
  GUILD_MEMBERS: 'guild_members',
  EVENTS: 'events',
  EVENT_PARTICIPATION: 'event_participation',
  NOTIFICATIONS: 'notifications_queue',
  NOTIFICATION_PREFERENCES: 'notification_preferences',
  NOTIFICATION_COOLDOWNS: 'notification_cooldowns',
  ANALYTICS_EVENTS: 'analytics_events',
  ADS_VIEWS: 'ads_views',
  ADS_STATISTICS: 'ads_statistics',
  USER_AD_SETTINGS: 'user_ad_settings',
  DAILY_REWARDS: 'daily_rewards',
  USER_DAILY_REWARDS: 'user_daily_rewards',
  DAILY_REWARD_HISTORY: 'daily_reward_history',
  ENERGY_BOOSTERS: 'energy_boosters',
  USER_ENERGY_BOOSTERS: 'user_energy_boosters',
  ENERGY_HISTORY: 'energy_history',
} as const;

/**
 * Database view names.
 */
export const DatabaseView = {
  USER_SUMMARY: 'user_summary_view',
  MUSEUM_PROGRESS_SUMMARY: 'museum_progress_summary_view',
  LEADERBOARD: 'leaderboard_view',
} as const;

/**
 * Database RPC function names.
 */
export const DatabaseRpc = {
  RECORD_ENERGY_USAGE: 'record_energy_usage',
  RECORD_CURRENCY_TRANSACTION: 'record_currency_transaction',
  CLAIM_DAILY_REWARD: 'claim_daily_reward',
  UPDATE_USER_PROGRESS: 'update_user_progress',
  SYNC_USER_STATS: 'sync_user_stats',
  CALCULATE_RANKINGS: 'calculate_rankings',
  MIGRATE_USER_DATA: 'migrate_user_data',
} as const;

/**
 * Filter operator types for query building.
 */
export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'ilike'
  | 'in'
  | 'notIn'
  | 'isNull'
  | 'isNotNull'
  | 'contains'
  | 'containedBy'
  | 'overlaps';

/**
 * Query filter definition.
 */
export interface QueryFilter {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

/**
 * Query sort definition.
 */
export interface QuerySort {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * Pagination options.
 */
export interface QueryPagination {
  page?: number;
  pageSize?: number;
  limit?: number;
  offset?: number;
}

/**
 * Full query options combining all query parameters.
 */
export interface QueryOptions {
  filters?: QueryFilter[];
  sorts?: QuerySort[];
  pagination?: QueryPagination;
  search?: {
    term: string;
    fields: string[];
  };
  select?: string[];
}

/**
 * Database health status.
 */
export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

/**
 * Health check result.
 */
export interface HealthCheckResult {
  status: HealthStatus;
  latencyMs: number;
  timestamp: Date;
  error?: string;
}

/**
 * Query timing result.
 */
export interface QueryTiming {
  query: string;
  durationMs: number;
  timestamp: Date;
  success: boolean;
}

/**
 * Transaction options.
 */
export interface TransactionOptions {
  isolationLevel?: 'read-committed' | 'repeatable-read' | 'serializable';
  readOnly?: boolean;
}

/**
 * Generic database entity with timestamps.
 */
export interface TimestampEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Soft-deletable entity.
 */
export interface SoftDeletableEntity extends TimestampEntity {
  deletedAt?: Date;
  isDeleted: boolean;
}