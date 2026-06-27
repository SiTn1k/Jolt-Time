/**
 * Auth State Repository
 *
 * Repository for managing cached authentication state.
 * Uses an in-memory cache with TTL support.
 */

import type { UserIdentity } from '../types';
import type { IAuthStateRepository } from '../repositories';
import type { RepositoryResult } from '../../database/repositories';
import { RepositoryError } from '../../database/errors';

/**
 * Auth state entry with expiration.
 */
interface AuthStateEntry {
  identity: UserIdentity;
  expiresAt: number;
}

/**
 * Auth state repository using in-memory cache.
 * For production, this should be replaced with Redis or similar.
 */
export class AuthStateRepository implements IAuthStateRepository {
  private readonly cache = new Map<string, AuthStateEntry>();
  private readonly defaultTtlSeconds: number;

  constructor(defaultTtlSeconds = 3600) {
    this.defaultTtlSeconds = defaultTtlSeconds;
  }

  /**
   * Get stored authentication state.
   */
  async getState(sessionToken: string): Promise<RepositoryResult<UserIdentity | null>> {
    try {
      const entry = this.cache.get(sessionToken);

      if (!entry) {
        return { success: true, data: null };
      }

      // Check if expired
      if (Date.now() > entry.expiresAt) {
        this.cache.delete(sessionToken);
        return { success: true, data: null };
      }

      return { success: true, data: entry.identity };
    } catch (err) {
      return { success: false, error: new RepositoryError({ 
        message: 'getState failed: ' + (err as Error).message, 
        operation: 'getState', 
        cause: err as Error 
      }) };
    }
  }

  /**
   * Store authentication state.
   */
  async setState(
    sessionToken: string,
    identity: UserIdentity,
    ttlSeconds?: number
  ): Promise<RepositoryResult<void>> {
    try {
      const ttl = ttlSeconds ?? this.defaultTtlSeconds;
      this.cache.set(sessionToken, {
        identity,
        expiresAt: Date.now() + ttl * 1000,
      });
      return { success: true, data: undefined };
    } catch (err) {
      return { success: false, error: new RepositoryError({ 
        message: 'setState failed: ' + (err as Error).message, 
        operation: 'setState', 
        cause: err as Error 
      }) };
    }
  }

  /**
   * Delete authentication state.
   */
  async deleteState(sessionToken: string): Promise<RepositoryResult<void>> {
    try {
      this.cache.delete(sessionToken);
      return { success: true, data: undefined };
    } catch (err) {
      return { success: false, error: new RepositoryError({ 
        message: 'deleteState failed: ' + (err as Error).message, 
        operation: 'deleteState', 
        cause: err as Error 
      }) };
    }
  }

  /**
   * Refresh state TTL.
   */
  async refreshState(sessionToken: string, ttlSeconds?: number): Promise<RepositoryResult<void>> {
    try {
      const entry = this.cache.get(sessionToken);
      if (!entry) {
        return { success: false, error: new RepositoryError({ 
          message: 'State not found', 
          operation: 'refreshState' 
        }) };
      }

      const ttl = ttlSeconds ?? this.defaultTtlSeconds;
      entry.expiresAt = Date.now() + ttl * 1000;
      return { success: true, data: undefined };
    } catch (err) {
      return { success: false, error: new RepositoryError({ 
        message: 'refreshState failed: ' + (err as Error).message, 
        operation: 'refreshState', 
        cause: err as Error 
      }) };
    }
  }

  /**
   * Clear all cached states (for testing or logout all).
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get the count of cached states.
   */
  getCount(): number {
    return this.cache.size;
  }

  /**
   * Remove expired entries.
   */
  cleanup(): number {
    const now = Date.now();
    let removed = 0;
    for (const [key, entry] of this.cache) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        removed++;
      }
    }
    return removed;
  }
}
