/**
 * Currency Operation Type
 *
 * Defines high-level operations that can be performed on currency.
 */

/**
 * High-level currency operation types.
 */
export enum CurrencyOperationType {
  /** Add currency to wallet */
  ADD = 'add',
  /** Remove currency from wallet */
  REMOVE = 'remove',
  /** Transfer currency between wallets */
  TRANSFER = 'transfer',
  /** Reserve currency for pending transaction */
  RESERVE = 'reserve',
  /** Release reserved currency */
  RELEASE = 'release',
  /** Confirm reserved currency transaction */
  CONFIRM = 'confirm',
  /** Rollback a transaction */
  ROLLBACK = 'rollback',
  /** Convert currency to another type */
  CONVERT = 'convert',
  /** Grant initial currency to new player */
  INITIALIZE = 'initialize',
  /** Admin adjustment */
  ADJUST = 'adjust',
}

/**
 * Operation result status.
 */
export enum OperationStatus {
  /** Operation completed successfully */
  SUCCESS = 'success',
  /** Operation failed */
  FAILED = 'failed',
  /** Operation is pending */
  PENDING = 'pending',
  /** Operation was rolled back */
  ROLLED_BACK = 'rolled_back',
}

/**
 * Operation context for tracking.
 */
export interface OperationContext {
  /** Operation type */
  operationType: CurrencyOperationType;

  /** Player profile ID */
  playerProfileId: string;

  /** Reason for operation */
  reason?: string;

  /** Source of operation (e.g., 'quest', 'purchase') */
  source?: string;

  /** Reference ID (e.g., quest ID, transaction ID) */
  referenceId?: string;

  /** Additional metadata */
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Operation result.
 */
export interface OperationResult<T = void> {
  /** Operation status */
  status: OperationStatus;

  /** Result data if successful */
  data?: T;

  /** Error message if failed */
  error?: string;

  /** Operation timestamp */
  timestamp: Date;
}
