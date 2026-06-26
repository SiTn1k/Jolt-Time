/**
 * RPC Provider
 *
 * Provider for RPC calls to Supabase with error handling and typed responses.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../supabase-types';
import { RpcError } from '../errors';

/**
 * RPC call options.
 */
export interface RpcOptions {
  /** Timeout in milliseconds */
  timeoutMs?: number;
  /** Whether to use the admin client */
  useAdmin?: boolean;
}

/**
 * RPC response wrapper.
 */
export interface RpcResponse<T> {
  data: T | null;
  error: RpcError | null;
}

/**
 * RPC provider for executing remote procedure calls.
 */
export class RpcProvider {
  private client: SupabaseClient<Database>;
  private defaultTimeoutMs = 30000;

  constructor(client: SupabaseClient<Database>) {
    this.client = client;
  }

  /**
   * Set the default timeout for RPC calls.
   */
  setDefaultTimeout(timeoutMs: number): void {
    this.defaultTimeoutMs = timeoutMs;
  }

  /**
   * Call an RPC function.
   */
  async call<T = unknown>(
    functionName: string,
    params?: Record<string, unknown>,
    options?: RpcOptions
  ): Promise<RpcResponse<T>> {
    const timeoutMs = options?.timeoutMs || this.defaultTimeoutMs;

    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`RPC call timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      });

      const rpcPromise = this.client.rpc(functionName, params as never);

      const { data, error } = await Promise.race([rpcPromise, timeoutPromise]);

      if (error) {
        return {
          data: null,
          error: RpcError.callFailed(functionName, error),
        };
      }

      return {
        data: data as T,
        error: null,
      };
    } catch (err) {
      if (err instanceof Error && err.message.includes('timed out')) {
        return {
          data: null,
          error: RpcError.timeout(functionName, timeoutMs),
        };
      }

      return {
        data: null,
        error: RpcError.callFailed(functionName, err as Error),
      };
    }
  }

  /**
   * Call an RPC function and return the data or throw.
   */
  async callOrThrow<T = unknown>(
    functionName: string,
    params?: Record<string, unknown>,
    options?: RpcOptions
  ): Promise<T> {
    const response = await this.call<T>(functionName, params, options);

    if (response.error) {
      throw response.error;
    }

    if (response.data === null) {
      throw RpcError.invalidResponse(functionName, 'No data returned');
    }

    return response.data;
  }

  /**
   * Call an RPC function that returns a single object.
   */
  async callSingle<T extends Record<string, unknown>>(
    functionName: string,
    params?: Record<string, unknown>,
    options?: RpcOptions
  ): Promise<RpcResponse<T | null>> {
    const response = await this.call<T[]>(functionName, params, options);

    if (response.error) {
      return { data: null, error: response.error };
    }

    if (!response.data || response.data.length === 0) {
      return { data: null, error: null };
    }

    if (response.data.length > 1) {
      return {
        data: null,
        error: RpcError.invalidResponse(functionName, 'Multiple rows returned'),
      };
    }

    return { data: response.data[0] as T, error: null };
  }

  /**
   * Call an RPC function that returns a boolean.
   */
  async callBoolean(
    functionName: string,
    params?: Record<string, unknown>,
    options?: RpcOptions
  ): Promise<RpcResponse<boolean>> {
    const response = await this.call<boolean | null>(functionName, params, options);

    return {
      data: response.data ?? false,
      error: response.error,
    };
  }

  /**
   * Check if an RPC function exists.
   */
  async functionExists(functionName: string): Promise<boolean> {
    const response = await this.call(functionName, { __check_exists: true });
    return response.error === null;
  }
}

/**
 * Create a new RPC provider.
 */
export function createRpcProvider(client: SupabaseClient<Database>): RpcProvider {
  return new RpcProvider(client);
}