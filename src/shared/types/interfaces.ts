/**
 * Shared Interfaces
 *
 * Interface definitions for core services and repositories.
 */

import type { JoltError, ServiceResult, RepositoryResult } from './error.types';
import type { PaginationParams, PaginatedResult, CursorPagination, CursorPaginatedResult } from './base.types';

/**
 * Logger interface for application-wide logging.
 */
export interface ILogger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: Error, context?: Record<string, unknown>): void;
  fatal(message: string, error?: Error, context?: Record<string, unknown>): void;
}

/**
 * Configuration provider interface.
 */
export interface IConfigProvider {
  get<T>(key: string, defaultValue?: T): T;
  getString(key: string, defaultValue?: string): string;
  getNumber(key: string, defaultValue?: number): number;
  getBoolean(key: string, defaultValue?: boolean): boolean;
  has(key: string): boolean;
  getAll(): Record<string, unknown>;
}

/**
 * Base repository interface.
 */
export interface IRepository<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>> {
  findById(id: string): Promise<RepositoryResult<T | null>>;
  findAll(params?: PaginationParams): Promise<RepositoryResult<PaginatedResult<T>>>;
  findByCursor(params: CursorPagination): Promise<RepositoryResult<CursorPaginatedResult<T>>>;
  create(data: CreateDTO): Promise<RepositoryResult<T>>;
  update(id: string, data: UpdateDTO): Promise<RepositoryResult<T>>;
  delete(id: string): Promise<RepositoryResult<boolean>>;
  exists(id: string): Promise<boolean>;
  count(): Promise<RepositoryResult<number>>;
}

/**
 * Base service interface.
 */
export interface IService<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>> {
  getById(id: string): Promise<ServiceResult<T | null>>;
  getAll(params?: PaginationParams): Promise<ServiceResult<PaginatedResult<T>>>;
  create(data: CreateDTO): Promise<ServiceResult<T>>;
  update(id: string, data: UpdateDTO): Promise<ServiceResult<T>>;
  delete(id: string): Promise<ServiceResult<boolean>>;
}

/**
 * Event emitter interface.
 */
export interface IEventEmitter {
  on<T = unknown>(event: string, handler: (data: T) => void): () => void;
  off(event: string, handler: (data: unknown) => void): void;
  emit<T = unknown>(event: string, data: T): void;
  once<T = unknown>(event: string, handler: (data: T) => void): () => void;
}

/**
 * Cache interface.
 */
export interface ICache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlMs?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
}

/**
 * Validator interface.
 */
export interface IValidator<T = unknown> {
  validate(data: unknown): Promise<boolean>;
  validateSync(data: unknown): boolean;
  getErrors(): string[];
}

/**
 * Factory interface for creating instances.
 */
export interface IFactory<T, Args extends unknown[] = unknown[]> {
  create(...args: Args): T;
}

/**
 * Disposable interface for cleanup.
 */
export interface IDisposable {
  dispose(): void | Promise<void>;
}

/**
 * Initializable interface.
 */
export interface IInitializable {
  initialize(): void | Promise<void>;
  isInitialized(): boolean;
}
