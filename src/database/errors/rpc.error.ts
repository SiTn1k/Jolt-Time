/**
 * RPC Error
 *
 * Error class for RPC-related errors.
 */

import { DatabaseError, DatabaseErrorCodes } from './database.error';

/**
 * RPC error class.
 */
export class RpcError extends DatabaseError {
  public readonly functionName: string;
  public readonly parameters?: Record<string, unknown>;

  constructor(params: {
    message: string;
    functionName: string;
    parameters?: Record<string, unknown>;
    code?: string;
    details?: Record<string, unknown>;
    context?: Record<string, unknown>;
    cause?: Error;
  }) {
    super({
      message: params.message,
      code: params.code || DatabaseErrorCodes.RPC_FAILED,
      operation: params.functionName,
      details: params.details,
      context: params.context,
      cause: params.cause,
    });

    this.name = 'RpcError';
    this.functionName = params.functionName;
    this.parameters = params.parameters;
  }

  /**
   * Create an RPC call failed error.
   */
  static callFailed(functionName: string, cause?: Error): RpcError {
    return new RpcError({
      message: `RPC call failed: ${functionName}`,
      functionName,
      cause,
    });
  }

  /**
   * Create an RPC timeout error.
   */
  static timeout(functionName: string, timeoutMs: number): RpcError {
    return new RpcError({
      message: `RPC call timed out: ${functionName}`,
      functionName,
      code: DatabaseErrorCodes.RPC_TIMEOUT,
      details: { timeoutMs },
    });
  }

  /**
   * Create an RPC invalid response error.
   */
  static invalidResponse(functionName: string, reason: string): RpcError {
    return new RpcError({
      message: `Invalid RPC response from ${functionName}: ${reason}`,
      functionName,
      details: { reason },
    });
  }

  /**
   * Create an RPC function not found error.
   */
  static functionNotFound(functionName: string): RpcError {
    return new RpcError({
      message: `RPC function not found: ${functionName}`,
      functionName,
      code: DatabaseErrorCodes.NOT_FOUND,
    });
  }
}

/**
 * Check if value is an RpcError.
 */
export function isRpcError(value: unknown): value is RpcError {
  return value instanceof RpcError;
}