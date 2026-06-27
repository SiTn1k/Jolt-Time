/**
 * Supabase Provider
 *
 * Singleton provider for Supabase client with typed access and health monitoring.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../supabase-types';
import type { HealthCheckResult, HealthStatus } from '../types';
import { DatabaseError } from '../errors';

/**
 * Environment variable names for Supabase configuration.
 */
const SUPABASE_URL_ENV = 'SUPABASE_URL';
const SUPABASE_ANON_KEY_ENV = 'SUPABASE_ANON_KEY';
const SUPABASE_SERVICE_ROLE_KEY_ENV = 'SUPABASE_SERVICE_ROLE_KEY';

/**
 * Environment access helper for both browser and Node.js.
 */
function getEnv(key: string): string | undefined {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
}

/**
 * Supabase client options for production.
 */
const DEFAULT_CLIENT_OPTIONS = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
};

/**
 * Supabase provider for managing client instances.
 */
export class SupabaseProvider {
  private static instance: SupabaseProvider | null = null;
  private client: SupabaseClient<Database> | null = null;
  private adminClient: SupabaseClient<Database> | null = null;
  private url: string | null = null;
  private anonKey: string | null = null;
  private serviceRoleKey: string | null = null;
  private isInitialized = false;

  /**
   * Private constructor for singleton pattern.
   */
  private constructor() {
    // Private to enforce singleton
  }

  /**
   * Get the singleton instance.
   */
  static getInstance(): SupabaseProvider {
    if (!SupabaseProvider.instance) {
      SupabaseProvider.instance = new SupabaseProvider();
    }
    return SupabaseProvider.instance;
  }

  /**
   * Initialize the provider with configuration.
   */
  initialize(config?: {
    url?: string;
    anonKey?: string;
    serviceRoleKey?: string;
  }): void {
    if (this.isInitialized) {
      return;
    }

    this.url = config?.url ?? getEnv(SUPABASE_URL_ENV) ?? null;
    this.anonKey = config?.anonKey ?? getEnv(SUPABASE_ANON_KEY_ENV) ?? null;
    this.serviceRoleKey = config?.serviceRoleKey ?? getEnv(SUPABASE_SERVICE_ROLE_KEY_ENV) ?? null;

    if (!this.url) {
      throw DatabaseError.connectionFailed(new Error(`Missing required environment variable: ${SUPABASE_URL_ENV}`));
    }

    if (!this.anonKey) {
      throw DatabaseError.connectionFailed(new Error(`Missing required environment variable: ${SUPABASE_ANON_KEY_ENV}`));
    }

    this.client = createClient<Database>(this.url, this.anonKey, DEFAULT_CLIENT_OPTIONS);

    if (this.serviceRoleKey) {
      this.adminClient = createClient<Database>(this.url, this.serviceRoleKey, DEFAULT_CLIENT_OPTIONS);
    }

    this.isInitialized = true;
  }

  /**
   * Check if provider is initialized.
   */
  isReady(): boolean {
    return this.isInitialized && this.client !== null;
  }

  /**
   * Get the public client (uses anon key).
   */
  getClient(): SupabaseClient<Database> {
    this.ensureInitialized();
    return this.client!;
  }

  /**
   * Get the admin client (uses service role key).
   * Throws if service role key is not configured.
   */
  getAdminClient(): SupabaseClient<Database> {
    this.ensureInitialized();
    if (!this.adminClient) {
      throw DatabaseError.permissionDenied('getAdminClient', new Error('Service role key not configured'));
    }
    return this.adminClient;
  }

  /**
   * Check if admin client is available.
   */
  hasAdminClient(): boolean {
    return this.adminClient !== null;
  }

  /**
   * Get the Supabase URL.
   */
  getUrl(): string {
    this.ensureInitialized();
    return this.url!;
  }

  /**
   * Perform health check on the database connection.
   */
  async healthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      this.ensureInitialized();

      const { error } = await this.client!
        .from('users')
        .select('id')
        .limit(1);

      const latencyMs = Date.now() - startTime;

      if (error) {
        return {
          status: 'unhealthy',
          latencyMs,
          timestamp: new Date(),
          error: error.message,
        };
      }

      const status: HealthStatus = latencyMs > 1000 ? 'degraded' : 'healthy';

      return {
        status,
        latencyMs,
        timestamp: new Date(),
      };
    } catch (err) {
      return {
        status: 'unhealthy',
        latencyMs: Date.now() - startTime,
        timestamp: new Date(),
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  /**
   * Get connection latency in milliseconds.
   */
  async getLatency(): Promise<number> {
    const result = await this.healthCheck();
    return result.latencyMs;
  }

  /**
   * Reset the provider (for testing).
   */
  reset(): void {
    this.client = null;
    this.adminClient = null;
    this.url = null;
    this.anonKey = null;
    this.serviceRoleKey = null;
    this.isInitialized = false;
    SupabaseProvider.instance = null;
  }

  /**
   * Ensure the provider is initialized.
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw DatabaseError.connectionFailed(new Error('SupabaseProvider not initialized. Call initialize() first.'));
    }
    if (!this.client) {
      throw DatabaseError.connectionFailed(new Error('Supabase client not created'));
    }
  }
}

/**
 * Get the global Supabase provider instance.
 */
export function getSupabaseProvider(): SupabaseProvider {
  return SupabaseProvider.getInstance();
}

/**
 * Get the global Supabase client.
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  return getSupabaseProvider().getClient();
}

/**
 * Get the global admin Supabase client.
 */
export function getSupabaseAdminClient(): SupabaseClient<Database> {
  return getSupabaseProvider().getAdminClient();
}