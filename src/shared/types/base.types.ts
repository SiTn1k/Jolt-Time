/**
 * Base Types
 *
 * Core type definitions used throughout the application.
 */

import { LogLevel, ErrorCategory, ErrorSeverity, OperationStatus, EntityStatus, SortOrder } from '../constants';

/**
 * Base entity interface that all domain entities should extend.
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Timestamped entity with creation and update timestamps.
 */
export interface TimestampedEntity {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Soft-deletable entity interface.
 */
export interface SoftDeletableEntity extends TimestampedEntity {
  deletedAt?: Date;
  isDeleted: boolean;
}

/**
 * Generic result type for operations that can succeed or fail.
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Option type for nullable values.
 */
export type Option<T> = Some<T> | None;

export interface Some<T> {
  isSome: true;
  isNone: false;
  value: T;
}

export interface None {
  isSome: false;
  isNone: true;
}

/**
 * Creates a Some option.
 */
export function some<T>(value: T): Some<T> {
  return { isSome: true, isNone: false, value };
}

/**
 * Creates a None option.
 */
export function none<T>(): None {
  return { isSome: false, isNone: true };
}

/**
 * Nullable type helper.
 */
export type Nullable<T> = T | null;

/**
 * Required but can be undefined type helper.
 */
export type Optional<T> = T | undefined;

/**
 * Async result type for operations.
 */
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

/**
 * Pagination parameters for list queries.
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

/**
 * Default pagination params.
 */
export const DEFAULT_PAGINATION: PaginationParams = {
  page: 1,
  pageSize: 20,
  sortOrder: SortOrder.DESC,
};

/**
 * Paginated result wrapper.
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Cursor-based pagination params.
 */
export interface CursorPagination {
  cursor?: string;
  limit: number;
}

/**
 * Cursor paginated result.
 */
export interface CursorPaginatedResult<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
}

/**
 * Sortable field definition.
 */
export interface SortableField<T> {
  field: keyof T;
  order: SortOrder;
}

/**
 * Multi-sort definition.
 */
export interface MultiSort<T> {
  sorts: SortableField<T>[];
}

/**
 * Key-value pair for metadata.
 */
export interface KeyValuePair {
  key: string;
  value: unknown;
}

/**
 * Entity metadata for tracking.
 */
export interface EntityMetadata {
  createdBy: string;
  updatedBy: string;
  version: number;
}

/**
 * Status transition record.
 */
export interface StatusTransition<T extends string> {
  from: T;
  to: T;
  timestamp: Date;
  reason?: string;
}

/**
 * Status history for entities.
 */
export interface StatusHistory<T extends string> {
  current: T;
  transitions: StatusTransition<T>[];
}

/**
 * Generic ID type.
 */
export type EntityId = string;

/**
 * Timestamp type.
 */
export type Timestamp = number;

/**
 * Date string in ISO format.
 */
export type DateString = string;

/**
 * UUID type for entities.
 */
export type UUID = string;
